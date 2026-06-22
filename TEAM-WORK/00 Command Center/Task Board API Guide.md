# Task Board API Guide

Use this guide when the local task-board backend is running:

- Backend: `TEAM-WORK/02 Task Boards/task-board-server.py`
- Base URL: `http://127.0.0.1:4177`
- Board data: `TEAM-WORK/02 Task Boards/task-board.json`
- API audit log: `TEAM-WORK/02 Task Boards/task-board-api.log`

The API is the preferred way to create, claim, move, review, approve, return, archive, update, or delete tasks. Direct JSON edits are the fallback only when the backend is not running.

## Required Rules

1. Pick one stable `agentName` at the start of the chat, such as `Planning Agent - Artly 01`, `Worker Agent - Artly 02`, or `Review Agent - Artly 03`.
2. Include that exact `agentName` in every API payload.
3. Send JSON objects only, with `Content-Type: application/json`.
4. Reload the board through `GET /api/board` after every successful status change before choosing more work.
5. Do not use the HTML board as an agent input. It is Richard's reader view.
6. Do not use `/api/delete-task` for normal workflow. Use it only for duplicate or test-task cleanup.
7. Treat `task-board-api.log` as audit history only. The source of truth remains `task-board.json`.

## Monitor API Calls

From the project root:

```powershell
Get-Content ".\TEAM-WORK\02 Task Boards\task-board-api.log" -Tail 20 -Wait
```

Each log line is JSON with:

- `at`: request timestamp.
- `method`: `GET` or `POST`.
- `path`: API endpoint.
- `action`: backend action name.
- `status`: `success` or `error`.
- `httpStatus`: response code.
- `agentName`: caller identity.
- `taskId` / `taskIds`: related task IDs.
- `error`: error message when the call failed.

## Read APIs

Use `/api/board` to read the full board. Include `agentName` as a query parameter so the read is visible in `task-board-api.log`.

```powershell
$base = "http://127.0.0.1:4177"
$agentName = [uri]::EscapeDataString("Worker Agent - Artly 02")
$board = Invoke-RestMethod -Uri "$base/api/board?agentName=$agentName"
```

Use `/api/task` to read one task and its current column.

```powershell
$base = "http://127.0.0.1:4177"
$agentName = [uri]::EscapeDataString("Review Agent - Artly 03")
$taskId = [uri]::EscapeDataString("TASK-YYYYMMDD-###")
$taskResponse = Invoke-RestMethod -Uri "$base/api/task?taskId=$taskId&agentName=$agentName"
```

`/api/task` returns:

```json
{
  "column": "todo | claimed | review | reviewing | done | archived",
  "task": {},
  "taskIds": ["TASK-YYYYMMDD-###"]
}
```

## Planner APIs

Use `/api/add-task` to create a `todo` task.

```powershell
$body = @{
  agentName = "Planning Agent - Artly 01"
  title = "Short action title"
  project = "Project area"
  priority = "high"
  type = "implementation"
  summary = "One or two sentences describing the work."
  requirements = @(
    "Concrete requirement."
  )
  acceptanceCriteria = @(
    "Specific pass condition."
  )
  files = @(
    "path/to/relevant-file"
  )
  referenceImages = @()
  inspectionTargets = @()
  notes = "Planning context."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/add-task" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/update-task` for allowed field edits without changing status.

```powershell
$body = @{
  agentName = "Planning Agent - Artly 01"
  taskId = "TASK-YYYYMMDD-###"
  updates = @{
    priority = "normal"
    requirements = @("Updated requirement.")
    acceptanceCriteria = @("Updated pass condition.")
    inspectionTargets = @(
      @{
        label = "Where Richard should inspect"
        url = "http://127.0.0.1:9292/pages/example"
        path = "templates/page.example.json"
        viewport = "desktop and mobile"
        state = "Open the page normally"
        notes = "Check the changed section or interaction."
      }
    )
    referenceImages = @(
      @{
        path = "TEAM-WORK/05 Visual QA/Reference Images/TASK-YYYYMMDD-###-reference.png"
        description = "What the Worker Agent should inspect."
        source = "Richard screenshot"
      }
    )
  }
  notesAppend = "Reason for the update."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/update-task" -Method Post -ContentType "application/json" -Body $body
```

## Worker APIs

Use `/api/claim-task` before implementation.

```powershell
$body = @{
  agentName = "Worker Agent - Artly 02"
  taskId = "TASK-YYYYMMDD-###"
  notes = "Claiming this task."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/claim-task" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/move-to-review` after implementation.

```powershell
$body = @{
  agentName = "Worker Agent - Artly 02"
  taskId = "TASK-YYYYMMDD-###"
  notes = "Completed implementation. Include validation summary here."
  files = @(
    "path/to/touched-file"
  )
  inspectionTargets = @(
    @{
      label = "Where Richard should inspect"
      url = "http://127.0.0.1:9292/pages/example"
      path = "templates/page.example.json"
      viewport = "desktop and mobile"
      state = "Open the page normally"
      notes = "Check the specific changed section or interaction."
    }
  )
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/move-to-review" -Method Post -ContentType "application/json" -Body $body
```

## Review APIs

Use `/api/claim-review` before visual review.

```powershell
$body = @{
  agentName = "Review Agent - Artly 03"
  taskId = "TASK-YYYYMMDD-###"
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/claim-review" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/approve-review` when the work passes review.

```powershell
$body = @{
  agentName = "Review Agent - Artly 03"
  taskId = "TASK-YYYYMMDD-###"
  reviewNotes = "Approved after checking desktop/mobile and acceptance criteria."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/approve-review" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/request-changes` when the work fails review. This closes the reviewed task into the top of `done` as replaced, records which follow-up task replaces it, and creates or updates a follow-up `todo` task.

```powershell
$body = @{
  agentName = "Review Agent - Artly 03"
  taskId = "TASK-YYYYMMDD-###"
  reviewNotes = "What failed and why."
  followUpTask = @{
    title = "Fix specific reviewed issue"
    project = "Project area"
    priority = "high"
    type = "implementation"
    summary = "What needs to be corrected."
    requirements = @(
      "Concrete fix requirement."
    )
    acceptanceCriteria = @(
      "Specific pass condition for the follow-up."
    )
    files = @(
      "path/to/relevant-file"
    )
    referenceImages = @(
      @{
        path = "TEAM-WORK/05 Visual QA/Reference Images/TASK-YYYYMMDD-###-review-failure.png"
        description = "What the Worker Agent should inspect."
        source = "Review Agent screenshot"
      }
    )
    inspectionTargets = @(
      @{
        label = "Where Richard should re-check the fix"
        url = "http://127.0.0.1:9292/pages/example"
        path = "templates/page.example.json"
        viewport = "desktop and mobile"
        state = "Open the page normally"
        notes = "Review this location after the follow-up fix."
      }
    )
  }
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/request-changes" -Method Post -ContentType "application/json" -Body $body
```

## Richard / Board Viewer APIs

Use `/api/return-to-review` when a `done` task needs another review pass because Richard added feedback.

```powershell
$body = @{
  agentName = "Richard via task board viewer"
  taskId = "TASK-YYYYMMDD-###"
  feedback = "Richard's feedback to consider during re-review."
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/return-to-review" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/archive` only for accepted `done` tasks.

```powershell
$body = @{
  agentName = "Richard via task board viewer"
  taskId = "TASK-YYYYMMDD-###"
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/archive" -Method Post -ContentType "application/json" -Body $body
```

Use `/api/delete-task` only for duplicate or test-task cleanup.

```powershell
$body = @{
  agentName = "Cleanup Agent"
  taskId = "TASK-YYYYMMDD-###"
} | ConvertTo-Json -Depth 10
Invoke-RestMethod -Uri "$base/api/delete-task" -Method Post -ContentType "application/json" -Body $body
```

## Error Handling

- `400` means the payload is invalid or the requested transition is not allowed.
- `404` means the task ID was not found in the expected column.
- If a claim call fails, reload the board with `GET /api/board`; another agent may have claimed the task first.
- Do not edit around failed claims by manually moving tasks unless Richard explicitly asks.
- If the backend is unavailable, fall back to direct `task-board.json` edits using the same role rules.
