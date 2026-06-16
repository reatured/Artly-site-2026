from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BOARD_PATH = ROOT / "task-board.json"


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


class TaskBoardHandler(SimpleHTTPRequestHandler):
    def _send_json_error(self, message: str, status: int) -> None:
        self.send_json({"error": message}, status=status)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self) -> None:
        if self.path.rstrip("/") != "/api/archive":
            self.send_error(404, "Unknown endpoint")
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            payload_raw = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(payload_raw or "{}")
        except json.JSONDecodeError:
            self._send_json_error("Invalid JSON request body", status=400)
            return
        except Exception:
            self._send_json_error("Unable to read request body", status=400)
            return

        task_id = str(payload.get("taskId", "")).strip()
        if not task_id:
            self._send_json_error("Missing taskId", status=400)
            return

        try:
            board = json.loads(BOARD_PATH.read_text(encoding="utf-8-sig"))
        except FileNotFoundError:
            self._send_json_error("Board file not found", status=500)
            return
        except json.JSONDecodeError:
            self._send_json_error("Board file is not valid JSON", status=500)
            return

        columns = board.get("columns")
        if not isinstance(columns, dict):
            self._send_json_error("Board is missing `columns` object", status=500)
            return

        done = columns.get("done")
        if not isinstance(done, list):
            self._send_json_error("Task must be archived from columns.done", status=400)
            return

        task_index = next((index for index, task in enumerate(done) if task.get("id") == task_id), None)
        if task_index is None:
            self._send_json_error(f"Task {task_id} was not found in columns.done", status=404)
            return

        archived = columns.get("archived")
        if archived is None:
            archived = []
            columns["archived"] = archived
        elif not isinstance(archived, list):
            self._send_json_error("columns.archived is not a task list", status=500)
            return

        task = done.pop(task_index)
        timestamp = now_iso()
        task["status"] = "archived"
        task["archivedAt"] = timestamp
        task["archivedBy"] = payload.get("archivedBy") or "Task board viewer"
        board["updatedAt"] = timestamp
        archived.insert(0, task)

        try:
            temp_path = BOARD_PATH.with_suffix(".json.tmp")
            temp_path.write_text(json.dumps(board, indent=2) + "\n", encoding="utf-8")
            os.replace(temp_path, BOARD_PATH)
        except Exception as error:
            self._send_json_error(f"Unable to persist board: {error}", status=500)
            return

        self.send_json(board)

    def send_json(self, payload: object, status: int = 200) -> None:
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 4177), TaskBoardHandler)
    print("Serving task board at http://127.0.0.1:4177/task-board.html")
    server.serve_forever()


if __name__ == "__main__":
    main()
