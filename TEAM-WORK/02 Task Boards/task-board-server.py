from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BOARD_PATH = ROOT / "task-board.json"
POST_ACTIONS = {
    "/api/add-task": "add_task",
    "/api/update-task": "update_task",
    "/api/delete-task": "delete_task",
    "/api/archive": "archive_task",
    "/api/return-to-review": "return_task_to_review",
    "/api/claim-task": "claim_task",
    "/api/move-to-review": "move_to_review",
    "/api/claim-review": "claim_review",
    "/api/approve-review": "approve_review",
    "/api/request-changes": "request_changes",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


class TaskBoardHandler(SimpleHTTPRequestHandler):
    def _send_json_error(self, message: str, status: int) -> None:
        self.send_json({"error": message}, status=status)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self) -> None:
        path = self.path.rstrip("/")
        action = POST_ACTIONS.get(path)
        if not action:
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

        try:
            board = self.load_board()
            columns = self.get_columns(board)
            getattr(self, action)(board, columns, payload)
        except FileNotFoundError:
            self._send_json_error("Board file not found", status=500)
        except json.JSONDecodeError:
            self._send_json_error("Board file is not valid JSON", status=500)
        except ValueError as error:
            self._send_json_error(str(error), status=400)
        except LookupError as error:
            self._send_json_error(str(error), status=404)

    def load_board(self) -> dict:
        return json.loads(BOARD_PATH.read_text(encoding="utf-8-sig"))

    def get_columns(self, board: dict) -> dict:
        columns = board.get("columns")
        if not isinstance(columns, dict):
            raise ValueError("Board is missing `columns` object")
        return columns

    def require_task_id(self, payload: dict) -> str:
        task_id = str(payload.get("taskId", "")).strip()
        if not task_id:
            raise ValueError("Missing taskId")
        return task_id

    def ensure_column(self, columns: dict, column_name: str) -> list:
        column = columns.get(column_name)
        if column is None:
            column = []
            columns[column_name] = column
        if not isinstance(column, list):
            raise ValueError(f"columns.{column_name} is not a task list")
        return column

    def find_task_location(self, columns: dict, task_id: str) -> tuple[str, list, int, dict]:
        for column_name, column in columns.items():
            if not isinstance(column, list):
                continue
            for task_index, task in enumerate(column):
                if isinstance(task, dict) and task.get("id") == task_id:
                    return column_name, column, task_index, task
        raise LookupError(f"Task {task_id} was not found on the board")

    def task_exists(self, columns: dict, task_id: str) -> bool:
        try:
            self.find_task_location(columns, task_id)
            return True
        except LookupError:
            return False

    def pop_task(self, columns: dict, column_name: str, task_id: str) -> dict:
        column = self.ensure_column(columns, column_name)
        task_index = next((index for index, task in enumerate(column) if task.get("id") == task_id), None)
        if task_index is None:
            raise LookupError(f"Task {task_id} was not found in columns.{column_name}")
        return column.pop(task_index)

    def append_note(self, task: dict, note: str) -> None:
        note = note.strip()
        if not note:
            return
        task["notes"] = f"{task.get('notes', '').rstrip()}\n\n{note}".strip()

    def update_board_timestamp(self, board: dict, timestamp: str) -> None:
        board["updatedAt"] = timestamp

    def append_unique_files(self, task: dict, files: object) -> None:
        if not isinstance(files, list):
            return
        existing = task.get("files")
        if not isinstance(existing, list):
            existing = []
            task["files"] = existing
        for file in files:
            file_text = str(file).strip()
            if file_text and file_text not in existing:
                existing.append(file_text)

    def normalize_list(self, value: object, field_name: str) -> list:
        if value is None or value == "":
            return []
        if isinstance(value, list):
            return value
        raise ValueError(f"{field_name} must be a list")

    def normalize_int(self, value: object, default: int, field_name: str) -> int:
        if value is None or value == "":
            return default
        try:
            return int(value)
        except (TypeError, ValueError) as error:
            raise ValueError(f"{field_name} must be an integer") from error

    def next_task_id(self, board: dict) -> str:
        today = datetime.now(timezone.utc).astimezone().strftime("%Y%m%d")
        pattern = re.compile(rf"^TASK-{today}-(\d+)$")
        max_number = 0
        for column in self.get_columns(board).values():
            if not isinstance(column, list):
                continue
            for task in column:
                match = pattern.match(str(task.get("id", "")))
                if match:
                    max_number = max(max_number, int(match.group(1)))
        return f"TASK-{today}-{max_number + 1:03d}"

    def build_new_task(self, board: dict, columns: dict, payload: dict, timestamp: str) -> dict:
        task_id = str(payload.get("taskId") or payload.get("id") or "").strip() or self.next_task_id(board)
        title = str(payload.get("title", "")).strip()
        if not title:
            raise ValueError("Missing title")
        if self.task_exists(columns, task_id):
            raise ValueError(f"Task {task_id} already exists")

        return {
            "id": task_id,
            "title": title,
            "project": payload.get("project", ""),
            "priority": payload.get("priority", "normal"),
            "type": payload.get("type", "implementation"),
            "status": "todo",
            "requestedBy": payload.get("requestedBy", "Richard"),
            "createdBy": payload.get("createdBy") or payload.get("agent") or "Planning Agent",
            "createdAt": payload.get("createdAt") or timestamp,
            "claimedBy": "",
            "claimedAt": "",
            "reviewClaimedBy": "",
            "reviewClaimedAt": "",
            "reviewRequestedAt": "",
            "doneAt": "",
            "reviewedBy": "",
            "reviewedAt": "",
            "redoCount": self.normalize_int(payload.get("redoCount"), 0, "redoCount"),
            "summary": payload.get("summary", ""),
            "requirements": self.normalize_list(payload.get("requirements"), "requirements"),
            "acceptanceCriteria": self.normalize_list(payload.get("acceptanceCriteria"), "acceptanceCriteria"),
            "dependsOn": self.normalize_list(payload.get("dependsOn"), "dependsOn"),
            "relatedTaskIds": self.normalize_list(payload.get("relatedTaskIds"), "relatedTaskIds"),
            "files": self.normalize_list(payload.get("files"), "files"),
            "blockers": self.normalize_list(payload.get("blockers"), "blockers"),
            "sourceReviewTaskId": payload.get("sourceReviewTaskId", ""),
            "notes": payload.get("notes", ""),
        }

    def build_follow_up_task(self, board: dict, reviewed_task: dict, payload: dict, timestamp: str) -> dict:
        follow_up = payload.get("followUpTask")
        if not isinstance(follow_up, dict):
            follow_up = {}

        review_notes = str(payload.get("reviewNotes", "")).strip()
        return {
            "id": str(follow_up.get("id") or "").strip() or self.next_task_id(board),
            "title": str(follow_up.get("title") or f"Fix review feedback for {reviewed_task.get('id', 'task')}"),
            "project": follow_up.get("project") or reviewed_task.get("project", ""),
            "priority": follow_up.get("priority") or reviewed_task.get("priority", "normal"),
            "type": follow_up.get("type") or "implementation",
            "status": "todo",
            "requestedBy": follow_up.get("requestedBy") or "Review Agent",
            "createdBy": follow_up.get("createdBy") or payload.get("reviewedBy") or "Review Agent",
            "createdAt": follow_up.get("createdAt") or timestamp,
            "claimedBy": "",
            "claimedAt": "",
            "reviewRequestedAt": "",
            "doneAt": "",
            "reviewedBy": "",
            "reviewedAt": "",
            "reviewClaimedBy": "",
            "reviewClaimedAt": "",
            "redoCount": int(follow_up.get("redoCount") or 1),
            "sourceReviewTaskId": reviewed_task.get("id", ""),
            "summary": follow_up.get("summary") or review_notes or "Address review feedback.",
            "requirements": follow_up.get("requirements") if isinstance(follow_up.get("requirements"), list) else [],
            "acceptanceCriteria": follow_up.get("acceptanceCriteria")
            if isinstance(follow_up.get("acceptanceCriteria"), list)
            else [],
            "files": follow_up.get("files") if isinstance(follow_up.get("files"), list) else reviewed_task.get("files", []),
            "blockers": follow_up.get("blockers") if isinstance(follow_up.get("blockers"), list) else [],
            "notes": follow_up.get("notes") or review_notes,
        }

    def upsert_follow_up_task(self, board: dict, columns: dict, reviewed_task: dict, payload: dict, timestamp: str) -> dict:
        todo = self.ensure_column(columns, "todo")
        source_id = reviewed_task.get("id", "")
        existing = next((task for task in todo if task.get("sourceReviewTaskId") == source_id), None)
        follow_up = self.build_follow_up_task(board, reviewed_task, payload, timestamp)

        if existing:
            existing["redoCount"] = int(existing.get("redoCount") or 0) + 1
            existing["status"] = "todo"
            existing["priority"] = follow_up["priority"]
            existing["summary"] = follow_up["summary"]
            existing["requirements"] = follow_up["requirements"]
            existing["acceptanceCriteria"] = follow_up["acceptanceCriteria"]
            existing["files"] = follow_up["files"]
            existing["blockers"] = follow_up["blockers"]
            self.append_note(existing, f"Review feedback update ({timestamp}): {follow_up['notes']}")
            return existing

        todo.insert(0, follow_up)
        return follow_up

    def add_task(self, board: dict, columns: dict, payload: dict) -> None:
        todo = self.ensure_column(columns, "todo")
        timestamp = now_iso()
        task = self.build_new_task(board, columns, payload, timestamp)
        self.update_board_timestamp(board, timestamp)
        todo.insert(0, task)
        self.persist_board(board)

    def update_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        _, _, _, task = self.find_task_location(columns, task_id)
        updates = payload.get("updates")
        if updates is None:
            updates = {
                key: value
                for key, value in payload.items()
                if key not in {"taskId", "agent", "updatedBy", "notesAppend"}
            }
        if not isinstance(updates, dict):
            raise ValueError("updates must be an object")

        allowed_fields = {
            "title",
            "project",
            "priority",
            "type",
            "requestedBy",
            "createdBy",
            "createdAt",
            "summary",
            "requirements",
            "acceptanceCriteria",
            "dependsOn",
            "relatedTaskIds",
            "files",
            "blockers",
            "sourceReviewTaskId",
            "notes",
            "redoCount",
        }
        list_fields = {"requirements", "acceptanceCriteria", "dependsOn", "relatedTaskIds", "files", "blockers"}

        for field, value in updates.items():
            if field in {"id", "status"}:
                raise ValueError(f"{field} cannot be changed through /api/update-task")
            if field not in allowed_fields:
                raise ValueError(f"{field} is not an allowed task update field")
            if field in list_fields:
                task[field] = self.normalize_list(value, field)
            elif field == "redoCount":
                task[field] = self.normalize_int(value, int(task.get("redoCount") or 0), "redoCount")
            else:
                task[field] = value

        timestamp = now_iso()
        self.append_note(task, str(payload.get("notesAppend", "") or ""))
        task["lastEditedBy"] = payload.get("updatedBy") or payload.get("agent") or "Task board API"
        task["lastEditedAt"] = timestamp
        self.update_board_timestamp(board, timestamp)
        self.persist_board(board)

    def delete_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        requested_column = str(payload.get("column", "")).strip()
        if requested_column:
            self.pop_task(columns, requested_column, task_id)
        else:
            _, column, task_index, _ = self.find_task_location(columns, task_id)
            column.pop(task_index)

        timestamp = now_iso()
        self.update_board_timestamp(board, timestamp)
        self.persist_board(board)

    def archive_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "done", task_id)
        archived = self.ensure_column(columns, "archived")
        timestamp = now_iso()
        task["status"] = "archived"
        task["archivedAt"] = timestamp
        task["archivedBy"] = payload.get("archivedBy") or "Task board viewer"
        self.update_board_timestamp(board, timestamp)
        archived.insert(0, task)
        self.persist_board(board)

    def return_task_to_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        feedback = str(payload.get("feedback", "")).strip()
        if not feedback:
            raise ValueError("Missing feedback")

        task = self.pop_task(columns, "done", task_id)
        review = self.ensure_column(columns, "review")
        timestamp = now_iso()
        feedback_entry = {
            "feedback": feedback,
            "returnedBy": payload.get("returnedBy") or "Task board viewer",
            "returnedAt": timestamp,
        }
        existing_feedback = task.get("richardFeedback")
        if isinstance(existing_feedback, list):
            existing_feedback.append(feedback_entry)
        else:
            task["richardFeedback"] = [feedback_entry]

        task["status"] = "review"
        task["reviewRequestedAt"] = timestamp
        task["reviewDecision"] = "feedback_requested"
        task["returnedToReviewAt"] = timestamp
        task["returnedToReviewBy"] = feedback_entry["returnedBy"]
        task["doneAt"] = ""
        task["reviewedAt"] = ""
        task["reviewedBy"] = ""
        task["reviewClaimedAt"] = ""
        task["reviewClaimedBy"] = ""
        self.append_note(task, f"Richard feedback for re-review ({timestamp}): {feedback}")
        self.update_board_timestamp(board, timestamp)
        review.insert(0, task)
        self.persist_board(board)

    def claim_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "todo", task_id)
        claimed = self.ensure_column(columns, "claimed")
        timestamp = now_iso()
        task["status"] = "claimed"
        task["claimedBy"] = payload.get("claimedBy") or payload.get("agent") or "Worker Agent"
        task["claimedAt"] = timestamp
        self.append_note(task, str(payload.get("notes", "") or ""))
        self.update_board_timestamp(board, timestamp)
        claimed.insert(0, task)
        self.persist_board(board)

    def move_to_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "claimed", task_id)
        review = self.ensure_column(columns, "review")
        timestamp = now_iso()
        task["status"] = "review"
        task["reviewRequestedAt"] = timestamp
        task["completedBy"] = payload.get("completedBy") or payload.get("agent") or task.get("claimedBy", "")
        self.append_unique_files(task, payload.get("files"))
        self.append_note(task, str(payload.get("notes", "") or ""))
        self.update_board_timestamp(board, timestamp)
        review.insert(0, task)
        self.persist_board(board)

    def claim_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "review", task_id)
        reviewing = self.ensure_column(columns, "reviewing")
        timestamp = now_iso()
        task["status"] = "reviewing"
        task["reviewClaimedBy"] = payload.get("reviewClaimedBy") or payload.get("agent") or "Review Agent"
        task["reviewClaimedAt"] = timestamp
        self.update_board_timestamp(board, timestamp)
        reviewing.insert(0, task)
        self.persist_board(board)

    def approve_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "reviewing", task_id)
        done = self.ensure_column(columns, "done")
        timestamp = now_iso()
        task["status"] = "done"
        task["doneAt"] = timestamp
        task["reviewedBy"] = payload.get("reviewedBy") or payload.get("agent") or task.get("reviewClaimedBy", "")
        task["reviewedAt"] = timestamp
        task["reviewDecision"] = "approved"
        review_notes = str(payload.get("reviewNotes", "") or payload.get("notes", "") or "").strip()
        if review_notes:
            task["reviewNotes"] = review_notes
            self.append_note(task, f"Review approved ({timestamp}): {review_notes}")
        self.update_board_timestamp(board, timestamp)
        done.insert(0, task)
        self.persist_board(board)

    def request_changes(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        review_notes = str(payload.get("reviewNotes", "") or payload.get("notes", "") or "").strip()
        if not review_notes:
            raise ValueError("Missing reviewNotes")

        task = self.pop_task(columns, "reviewing", task_id)
        review = self.ensure_column(columns, "review")
        timestamp = now_iso()
        task["status"] = "review"
        task["reviewedBy"] = payload.get("reviewedBy") or payload.get("agent") or task.get("reviewClaimedBy", "")
        task["reviewedAt"] = timestamp
        task["reviewDecision"] = "changes_requested"
        task["reviewClaimedBy"] = ""
        task["reviewClaimedAt"] = ""
        task["reviewNotes"] = review_notes
        task["redoCount"] = int(task.get("redoCount") or 0) + 1
        self.append_note(task, f"Changes requested ({timestamp}): {review_notes}")

        follow_up = self.upsert_follow_up_task(board, columns, task, payload, timestamp)
        task["latestFollowUpTaskId"] = follow_up.get("id", "")
        self.update_board_timestamp(board, timestamp)
        review.insert(0, task)
        self.persist_board(board)

    def persist_board(self, board: dict) -> None:
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
