from __future__ import annotations

import json
import os
import re
import threading
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit


ROOT = Path(__file__).resolve().parent
BOARD_PATH = ROOT / "task-board.json"
API_LOG_PATH = ROOT / "task-board-api.log"
API_LOG_LOCK = threading.Lock()
GET_ACTIONS = {
    "/api/board": "get_board",
    "/api/task": "get_task",
}
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

    def do_GET(self) -> None:
        parsed_url = urlsplit(self.path)
        path = parsed_url.path.rstrip("/") or "/"
        action = GET_ACTIONS.get(path)
        if not action:
            if path.startswith("/api/"):
                request_at = now_iso()
                self.append_api_log({
                    "at": request_at,
                    "method": "GET",
                    "path": path,
                    "action": "",
                    "status": "error",
                    "httpStatus": 404,
                    "agentName": self.agent_name(self.query_payload(parsed_url.query), "Unknown API caller"),
                    "taskIds": self.payload_task_ids(self.query_payload(parsed_url.query)),
                    "error": "Unknown endpoint",
                })
                self.send_error(404, "Unknown endpoint")
                return
            super().do_GET()
            return

        request_at = now_iso()
        payload = self.query_payload(parsed_url.query)
        try:
            board = self.load_board()
            result = getattr(self, action)(board, payload) or {}
            self.log_api_success(request_at, path, action, payload, result, method="GET")
            self.send_json(result)
        except FileNotFoundError:
            self.log_api_error(request_at, path, action, payload, "Board file not found", 500, method="GET")
            self._send_json_error("Board file not found", status=500)
        except json.JSONDecodeError:
            self.log_api_error(request_at, path, action, payload, "Board file is not valid JSON", 500, method="GET")
            self._send_json_error("Board file is not valid JSON", status=500)
        except ValueError as error:
            self.log_api_error(request_at, path, action, payload, str(error), 400, method="GET")
            self._send_json_error(str(error), status=400)
        except LookupError as error:
            self.log_api_error(request_at, path, action, payload, str(error), 404, method="GET")
            self._send_json_error(str(error), status=404)
        except Exception as error:
            self.log_api_error(request_at, path, action, payload, str(error), 500, method="GET")
            self._send_json_error(str(error), status=500)

    def do_POST(self) -> None:
        parsed_url = urlsplit(self.path)
        path = parsed_url.path.rstrip("/") or "/"
        action = POST_ACTIONS.get(path)
        request_at = now_iso()
        if not action:
            self.append_api_log({
                "at": request_at,
                "method": "POST",
                "path": path,
                "action": "",
                "status": "error",
                "httpStatus": 404,
                "agentName": "Unknown API caller",
                "taskIds": [],
                "error": "Unknown endpoint",
            })
            self.send_error(404, "Unknown endpoint")
            return

        payload = {}
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            payload_raw = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(payload_raw or "{}")
        except json.JSONDecodeError:
            self.log_api_error(request_at, path, action, payload, "Invalid JSON request body", 400)
            self._send_json_error("Invalid JSON request body", status=400)
            return
        except Exception:
            self.log_api_error(request_at, path, action, payload, "Unable to read request body", 400)
            self._send_json_error("Unable to read request body", status=400)
            return
        if not isinstance(payload, dict):
            self.log_api_error(request_at, path, action, {}, "JSON request body must be an object", 400)
            self._send_json_error("JSON request body must be an object", status=400)
            return

        try:
            board = self.load_board()
            columns = self.get_columns(board)
            result = getattr(self, action)(board, columns, payload) or {}
            self.log_api_success(request_at, path, action, payload, result)
        except FileNotFoundError:
            self.log_api_error(request_at, path, action, payload, "Board file not found", 500)
            self._send_json_error("Board file not found", status=500)
        except json.JSONDecodeError:
            self.log_api_error(request_at, path, action, payload, "Board file is not valid JSON", 500)
            self._send_json_error("Board file is not valid JSON", status=500)
        except ValueError as error:
            self.log_api_error(request_at, path, action, payload, str(error), 400)
            self._send_json_error(str(error), status=400)
        except LookupError as error:
            self.log_api_error(request_at, path, action, payload, str(error), 404)
            self._send_json_error(str(error), status=404)
        except Exception as error:
            self.log_api_error(request_at, path, action, payload, str(error), 500)
            self._send_json_error(str(error), status=500)

    def query_payload(self, query: str) -> dict:
        parsed = parse_qs(query, keep_blank_values=True)
        payload = {}
        for key, values in parsed.items():
            if not values:
                payload[key] = ""
            elif len(values) == 1:
                payload[key] = values[0]
            else:
                payload[key] = values
        return payload

    def get_board(self, board: dict, payload: dict) -> dict:
        return board

    def get_task(self, board: dict, payload: dict) -> dict:
        task_id = self.require_task_id(payload)
        column_name, _, _, task = self.find_task_location(self.get_columns(board), task_id)
        return {
            "column": column_name,
            "task": task,
            "taskIds": [task_id],
        }

    def load_board(self) -> dict:
        board = json.loads(BOARD_PATH.read_text(encoding="utf-8-sig"))
        self.normalize_board_columns(board)
        return board

    def normalize_board_columns(self, board: dict) -> None:
        columns = board.get("columns")
        task_lookup = board.get("tasks")
        if not isinstance(columns, dict):
            return
        if not isinstance(task_lookup, dict):
            task_lookup = {}

        for column_name, column in list(columns.items()):
            if isinstance(column, list):
                column_items = column
            elif column is None:
                column_items = []
            else:
                column_items = [column]
            normalized = []
            for item in column_items:
                if isinstance(item, dict):
                    if self.is_valid_task(item):
                        normalized.append(item)
                    continue
                if isinstance(item, str):
                    task = task_lookup.get(item)
                    if isinstance(task, dict) and self.is_valid_task(task):
                        normalized.append(task)
            columns[column_name] = normalized

    def clean_title(self, value: object) -> str:
        return str(value or "").strip()

    def is_valid_task(self, task: dict) -> bool:
        if not isinstance(task, dict):
            return False
        task_id = str(task.get("id", "") or "").strip()
        title = self.clean_title(task.get("title"))
        return bool(task_id and title and not title.lower().startswith("untitled"))

    def get_columns(self, board: dict) -> dict:
        columns = board.get("columns")
        if not isinstance(columns, dict):
            raise ValueError("Board is missing `columns` object")
        return columns

    def require_task_id(self, payload: dict) -> str:
        task_id = str(payload.get("taskId") or payload.get("id") or "").strip()
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
        task_index = next(
            (
                index
                for index, task in enumerate(column)
                if isinstance(task, dict) and task.get("id") == task_id
            ),
            None,
        )
        if task_index is None:
            raise LookupError(f"Task {task_id} was not found in columns.{column_name}")
        return column.pop(task_index)

    def append_note(self, task: dict, note: str) -> None:
        note = note.strip()
        if not note:
            return
        task["notes"] = f"{task.get('notes', '').rstrip()}\n\n{note}".strip()

    def agent_name(self, payload: dict, default: str) -> str:
        if not isinstance(payload, dict):
            return default
        for field in (
            "agentName",
            "agent",
            "claimedBy",
            "completedBy",
            "reviewClaimedBy",
            "reviewedBy",
            "createdBy",
            "updatedBy",
            "returnedBy",
            "archivedBy",
            "deletedBy",
        ):
            value = str(payload.get(field, "") or "").strip()
            if value:
                return value
        return default

    def add_task_id(self, task_ids: list[str], value: object) -> None:
        task_id = str(value or "").strip()
        if task_id and task_id not in task_ids:
            task_ids.append(task_id)

    def payload_task_ids(self, payload: dict) -> list[str]:
        task_ids: list[str] = []
        if not isinstance(payload, dict):
            return task_ids
        for field in ("taskId", "id", "sourceReviewTaskId"):
            self.add_task_id(task_ids, payload.get(field))
        follow_up = payload.get("followUpTask")
        if isinstance(follow_up, dict):
            self.add_task_id(task_ids, follow_up.get("id"))
        return task_ids

    def result_task_ids(self, result: object) -> list[str]:
        task_ids: list[str] = []
        if not isinstance(result, dict):
            return task_ids
        task_id_list = result.get("taskIds")
        if isinstance(task_id_list, list):
            for task_id in task_id_list:
                self.add_task_id(task_ids, task_id)
        for field in ("taskId", "relatedTaskId", "followUpTaskId"):
            self.add_task_id(task_ids, result.get(field))
        return task_ids

    def append_api_log(self, entry: dict) -> None:
        try:
            task_ids = entry.get("taskIds")
            if not isinstance(task_ids, list):
                task_ids = []
                entry["taskIds"] = task_ids
            entry["taskId"] = task_ids[0] if len(task_ids) == 1 else ""
            entry["clientAddress"] = self.client_address[0] if self.client_address else ""
            with API_LOG_LOCK:
                with API_LOG_PATH.open("a", encoding="utf-8") as log_file:
                    log_file.write(json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + "\n")
        except Exception as error:
            self.log_error("Unable to append API log: %s", error)

    def log_api_success(self, at: str, path: str, action: str, payload: dict, result: object, method: str = "POST") -> None:
        task_ids = self.result_task_ids(result) or self.payload_task_ids(payload)
        self.append_api_log({
            "at": at,
            "method": method,
            "path": path,
            "action": action,
            "status": "success",
            "httpStatus": 200,
            "agentName": self.agent_name(payload, "Unknown API caller"),
            "taskIds": task_ids,
            "error": "",
        })

    def log_api_error(self, at: str, path: str, action: str, payload: dict, message: str, http_status: int, method: str = "POST") -> None:
        self.append_api_log({
            "at": at,
            "method": method,
            "path": path,
            "action": action,
            "status": "error",
            "httpStatus": http_status,
            "agentName": self.agent_name(payload, "Unknown API caller"),
            "taskIds": self.payload_task_ids(payload),
            "error": message,
        })

    def record_task_api_action(self, task: dict, action: str, agent_name: str, timestamp: str) -> None:
        task["lastApiAction"] = action
        task["lastApiActor"] = agent_name
        task["lastApiAt"] = timestamp
        history = task.get("apiHistory")
        if not isinstance(history, list):
            history = []
        history.append({
            "action": action,
            "agentName": agent_name,
            "at": timestamp,
        })
        task["apiHistory"] = history[-30:]

    def record_board_api_action(self, board: dict, action: str, agent_name: str, timestamp: str, task_id: str) -> None:
        audit_log = board.get("apiAuditLog")
        if not isinstance(audit_log, list):
            audit_log = []
        audit_log.append({
            "action": action,
            "agentName": agent_name,
            "taskId": task_id,
            "at": timestamp,
        })
        board["apiAuditLog"] = audit_log[-200:]

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
                if not isinstance(task, dict):
                    continue
                match = pattern.match(str(task.get("id", "")))
                if match:
                    max_number = max(max_number, int(match.group(1)))
        return f"TASK-{today}-{max_number + 1:03d}"

    def build_new_task(self, board: dict, columns: dict, payload: dict, timestamp: str) -> dict:
        agent_name = self.agent_name(payload, "Planning Agent")
        task_id = str(payload.get("taskId") or payload.get("id") or "").strip() or self.next_task_id(board)
        title = self.clean_title(payload.get("title"))
        if not title:
            raise ValueError("Missing title")
        if title.lower().startswith("untitled"):
            raise ValueError("Task title cannot be Untitled")
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
            "createdBy": payload.get("createdBy") or agent_name,
            "createdAt": payload.get("createdAt") or timestamp,
            "agentName": agent_name,
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
            "referenceImages": self.normalize_list(payload.get("referenceImages"), "referenceImages"),
            "inspectionTargets": self.normalize_list(payload.get("inspectionTargets"), "inspectionTargets"),
            "blockers": self.normalize_list(payload.get("blockers"), "blockers"),
            "sourceReviewTaskId": payload.get("sourceReviewTaskId", ""),
            "notes": payload.get("notes", ""),
        }

    def build_follow_up_task(self, board: dict, reviewed_task: dict, payload: dict, timestamp: str) -> dict:
        follow_up = payload.get("followUpTask")
        if not isinstance(follow_up, dict):
            follow_up = {}

        agent_name = self.agent_name(payload, "Review Agent")
        review_notes = str(payload.get("reviewNotes", "")).strip()
        follow_up_title = self.clean_title(follow_up.get("title"))
        if not follow_up_title or follow_up_title.lower().startswith("untitled"):
            follow_up_title = f"Fix review feedback for {reviewed_task.get('id', 'task')}"
        return {
            "id": str(follow_up.get("id") or "").strip() or self.next_task_id(board),
            "title": follow_up_title,
            "project": follow_up.get("project") or reviewed_task.get("project", ""),
            "priority": follow_up.get("priority") or reviewed_task.get("priority", "normal"),
            "type": follow_up.get("type") or "implementation",
            "status": "todo",
            "requestedBy": follow_up.get("requestedBy") or "Review Agent",
            "createdBy": follow_up.get("createdBy") or agent_name,
            "createdAt": follow_up.get("createdAt") or timestamp,
            "agentName": agent_name,
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
            "referenceImages": follow_up.get("referenceImages")
            if isinstance(follow_up.get("referenceImages"), list)
            else reviewed_task.get("referenceImages", []),
            "inspectionTargets": follow_up.get("inspectionTargets")
            if isinstance(follow_up.get("inspectionTargets"), list)
            else reviewed_task.get("inspectionTargets", []),
            "blockers": follow_up.get("blockers") if isinstance(follow_up.get("blockers"), list) else [],
            "notes": follow_up.get("notes") or review_notes,
        }

    def upsert_follow_up_task(self, board: dict, columns: dict, reviewed_task: dict, payload: dict, timestamp: str) -> dict:
        todo = self.ensure_column(columns, "todo")
        source_id = reviewed_task.get("id", "")
        existing = next(
            (
                task
                for task in todo
                if isinstance(task, dict) and task.get("sourceReviewTaskId") == source_id
            ),
            None,
        )
        follow_up = self.build_follow_up_task(board, reviewed_task, payload, timestamp)

        if existing:
            agent_name = self.agent_name(payload, "Review Agent")
            existing["redoCount"] = int(existing.get("redoCount") or 0) + 1
            existing["status"] = "todo"
            existing["priority"] = follow_up["priority"]
            existing["summary"] = follow_up["summary"]
            existing["requirements"] = follow_up["requirements"]
            existing["acceptanceCriteria"] = follow_up["acceptanceCriteria"]
            existing["files"] = follow_up["files"]
            existing["referenceImages"] = follow_up["referenceImages"]
            existing["inspectionTargets"] = follow_up["inspectionTargets"]
            existing["blockers"] = follow_up["blockers"]
            self.append_note(existing, f"Review feedback update ({timestamp}): {follow_up['notes']}")
            self.record_task_api_action(existing, "request-changes-follow-up-update", agent_name, timestamp)
            return existing

        self.record_task_api_action(follow_up, "request-changes-follow-up-create", self.agent_name(payload, "Review Agent"), timestamp)
        todo.insert(0, follow_up)
        return follow_up

    def add_task(self, board: dict, columns: dict, payload: dict) -> None:
        todo = self.ensure_column(columns, "todo")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Planning Agent")
        task = self.build_new_task(board, columns, payload, timestamp)
        self.record_task_api_action(task, "add-task", agent_name, timestamp)
        self.record_board_api_action(board, "add-task", agent_name, timestamp, task.get("id", ""))
        self.update_board_timestamp(board, timestamp)
        todo.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task.get("id", "")]}

    def update_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        _, _, _, task = self.find_task_location(columns, task_id)
        updates = payload.get("updates")
        if updates is None:
            updates = {
                key: value
                for key, value in payload.items()
                if key not in {"taskId", "agent", "agentName", "updatedBy", "notesAppend"}
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
            "referenceImages",
            "inspectionTargets",
            "blockers",
            "sourceReviewTaskId",
            "notes",
            "redoCount",
        }
        list_fields = {
            "requirements",
            "acceptanceCriteria",
            "dependsOn",
            "relatedTaskIds",
            "files",
            "referenceImages",
            "inspectionTargets",
            "blockers",
        }

        for field, value in updates.items():
            if field in {"id", "status"}:
                raise ValueError(f"{field} cannot be changed through /api/update-task")
            if field not in allowed_fields:
                raise ValueError(f"{field} is not an allowed task update field")
            if field in list_fields:
                task[field] = self.normalize_list(value, field)
            elif field == "redoCount":
                task[field] = self.normalize_int(value, int(task.get("redoCount") or 0), "redoCount")
            elif field == "title":
                title = self.clean_title(value)
                if not title:
                    raise ValueError("Task title cannot be blank")
                if title.lower().startswith("untitled"):
                    raise ValueError("Task title cannot be Untitled")
                task[field] = title
            else:
                task[field] = value

        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Task board API")
        self.append_note(task, str(payload.get("notesAppend", "") or ""))
        task["lastEditedBy"] = payload.get("updatedBy") or agent_name
        task["lastEditedAt"] = timestamp
        self.record_task_api_action(task, "update-task", agent_name, timestamp)
        self.record_board_api_action(board, "update-task", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def delete_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        agent_name = self.agent_name(payload, "Task board API")
        requested_column = str(payload.get("column", "")).strip()
        if requested_column:
            self.pop_task(columns, requested_column, task_id)
        else:
            _, column, task_index, _ = self.find_task_location(columns, task_id)
            column.pop(task_index)

        timestamp = now_iso()
        self.record_board_api_action(board, "delete-task", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def archive_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "done", task_id)
        archived = self.ensure_column(columns, "archived")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Task board viewer")
        task["status"] = "archived"
        task["archivedAt"] = timestamp
        task["archivedBy"] = payload.get("archivedBy") or agent_name
        self.record_task_api_action(task, "archive", agent_name, timestamp)
        self.record_board_api_action(board, "archive", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        archived.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def return_task_to_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        feedback = str(payload.get("feedback", "")).strip()
        if not feedback:
            raise ValueError("Missing feedback")

        task = self.pop_task(columns, "done", task_id)
        review = self.ensure_column(columns, "review")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Task board viewer")
        feedback_entry = {
            "feedback": feedback,
            "returnedBy": payload.get("returnedBy") or agent_name,
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
        self.record_task_api_action(task, "return-to-review", agent_name, timestamp)
        self.record_board_api_action(board, "return-to-review", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        review.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def claim_task(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "todo", task_id)
        claimed = self.ensure_column(columns, "claimed")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Worker Agent")
        task["status"] = "claimed"
        task["claimedBy"] = payload.get("claimedBy") or agent_name
        task["claimedAt"] = timestamp
        self.append_note(task, str(payload.get("notes", "") or ""))
        self.record_task_api_action(task, "claim-task", agent_name, timestamp)
        self.record_board_api_action(board, "claim-task", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        claimed.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def move_to_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "claimed", task_id)
        review = self.ensure_column(columns, "review")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Worker Agent")
        task["status"] = "review"
        task["reviewRequestedAt"] = timestamp
        task["completedBy"] = payload.get("completedBy") or agent_name or task.get("claimedBy", "")
        self.append_unique_files(task, payload.get("files"))
        if "inspectionTargets" in payload:
            task["inspectionTargets"] = self.normalize_list(payload.get("inspectionTargets"), "inspectionTargets")
        self.append_note(task, str(payload.get("notes", "") or ""))
        self.record_task_api_action(task, "move-to-review", agent_name, timestamp)
        self.record_board_api_action(board, "move-to-review", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        review.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def claim_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "review", task_id)
        reviewing = self.ensure_column(columns, "reviewing")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Review Agent")
        task["status"] = "reviewing"
        task["reviewClaimedBy"] = payload.get("reviewClaimedBy") or agent_name
        task["reviewClaimedAt"] = timestamp
        self.record_task_api_action(task, "claim-review", agent_name, timestamp)
        self.record_board_api_action(board, "claim-review", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        reviewing.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def approve_review(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        task = self.pop_task(columns, "reviewing", task_id)
        done = self.ensure_column(columns, "done")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Review Agent")
        task["status"] = "done"
        task["doneAt"] = timestamp
        task["reviewedBy"] = payload.get("reviewedBy") or agent_name or task.get("reviewClaimedBy", "")
        task["reviewedAt"] = timestamp
        task["reviewDecision"] = "approved"
        review_notes = str(payload.get("reviewNotes", "") or payload.get("notes", "") or "").strip()
        if review_notes:
            task["reviewNotes"] = review_notes
            self.append_note(task, f"Review approved ({timestamp}): {review_notes}")
        self.record_task_api_action(task, "approve-review", agent_name, timestamp)
        self.record_board_api_action(board, "approve-review", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        done.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id]}

    def request_changes(self, board: dict, columns: dict, payload: dict) -> None:
        task_id = self.require_task_id(payload)
        review_notes = str(payload.get("reviewNotes", "") or payload.get("notes", "") or "").strip()
        if not review_notes:
            raise ValueError("Missing reviewNotes")

        task = self.pop_task(columns, "reviewing", task_id)
        done = self.ensure_column(columns, "done")
        timestamp = now_iso()
        agent_name = self.agent_name(payload, "Review Agent")
        task["status"] = "done"
        task["reviewedBy"] = payload.get("reviewedBy") or agent_name or task.get("reviewClaimedBy", "")
        task["reviewedAt"] = timestamp
        task["reviewDecision"] = "changes_requested"
        task["doneAt"] = timestamp
        task["closedAs"] = "replaced_by_follow_up"
        task["reviewClaimedBy"] = ""
        task["reviewClaimedAt"] = ""
        task["reviewNotes"] = review_notes
        task["redoCount"] = int(task.get("redoCount") or 0) + 1
        self.append_note(task, f"Changes requested ({timestamp}): {review_notes}")

        follow_up = self.upsert_follow_up_task(board, columns, task, payload, timestamp)
        follow_up_id = follow_up.get("id", "")
        task["latestFollowUpTaskId"] = follow_up_id
        task["replacedByTaskId"] = follow_up_id
        self.append_note(task, f"Closed as replaced ({timestamp}): follow-up task {follow_up_id} replaces this failed review task.")
        self.record_task_api_action(task, "request-changes", agent_name, timestamp)
        self.record_board_api_action(board, "request-changes", agent_name, timestamp, task_id)
        self.update_board_timestamp(board, timestamp)
        done.insert(0, task)
        self.persist_board(board)
        return {"taskIds": [task_id, follow_up_id], "followUpTaskId": follow_up_id}

    def persist_board(self, board: dict) -> None:
        try:
            self.normalize_board_columns(board)
            temp_path = BOARD_PATH.with_suffix(".json.tmp")
            temp_path.write_text(json.dumps(board, indent=2) + "\n", encoding="utf-8")
            os.replace(temp_path, BOARD_PATH)
        except Exception as error:
            raise RuntimeError(f"Unable to persist board: {error}") from error

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
