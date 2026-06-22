# Artly Agent Instructions

The active workflow is a simple JSON-backed task board with three separate agent roles.

## Start Here

- Workflow overview: `TEAM-WORK/00 Command Center/Simple Agent Workflow.md`
- Planning Agent role: `TEAM-WORK/00 Command Center/Planning Agent.md`
- Worker Agent role: `TEAM-WORK/00 Command Center/Worker Agent.md`
- Review Agent role: `TEAM-WORK/00 Command Center/Review Agent.md`
- Task board API guide: `TEAM-WORK/00 Command Center/Task Board API Guide.md`
- Task board source of truth: `TEAM-WORK/02 Task Boards/task-board.json`

Backend start command (Windows PowerShell):

```powershell
cd "C:\Artly\Artly-site-2026"; py ".\TEAM-WORK\02 Task Boards\task-board-server.py"
```

Run as a persistent background job (recommended while working with multiple agents):

```powershell
$backendJob = Start-Job -Name ArtlyTaskBoardBackend -ScriptBlock { Set-Location "C:\Artly\Artly-site-2026"; py ".\TEAM-WORK\02 Task Boards\task-board-server.py" }
```

Stop it when done:

```powershell
Stop-Job -Name ArtlyTaskBoardBackend; Remove-Job -Name ArtlyTaskBoardBackend
```

Tail the API log:

```powershell
Get-Content ".\TEAM-WORK\02 Task Boards\task-board-api.log" -Tail 50 -Wait
```

When `TEAM-WORK/02 Task Boards/task-board-server.py` is running, use its task board API instead of manually editing or moving tasks in JSON:

- `GET /api/board`
- `GET /api/task?taskId=TASK-YYYYMMDD-###`
- `POST /api/add-task`
- `POST /api/update-task`
- `POST /api/claim-task`
- `POST /api/move-to-review`
- `POST /api/claim-review`
- `POST /api/approve-review`
- `POST /api/request-changes`
- `POST /api/return-to-review`
- `POST /api/archive`
- `POST /api/delete-task` cleanup only for duplicate/test tasks, not normal workflow

For payload shapes, examples, and error handling, read `TEAM-WORK/00 Command Center/Task Board API Guide.md`.

Every agent must choose a stable `agentName` at the start of its chat and include that exact `agentName` in every task board API payload. Use a name that identifies the role and thread, for example `Planning Agent - Artly 01`, `Worker Agent - Artly 02`, or `Review Agent - Artly 03`. The backend records the name in `lastApiActor`, `apiHistory`, and `apiAuditLog`.

The backend also appends every API request, including `GET` reads, to `TEAM-WORK/02 Task Boards/task-board-api.log` as JSON Lines with timestamp, method, endpoint, task ID, agent name, status, and error details. This log is audit history only; agents still coordinate through `task-board.json`.

Every task must have a real, nonblank title. Do not create or update tasks with `Untitled`, `Untitled task`, or a blank title; the API rejects those titles and the viewer hides malformed records.

When a Planning Agent or Review Agent needs a Worker Agent to refer to an image or screenshot, save that image under `TEAM-WORK/05 Visual QA/Reference Images/` and record it in the task's `referenceImages` array with `path`, `description`, and `source`. Worker Agents must inspect listed `referenceImages` paths before implementing that task.

The HTML board at `TEAM-WORK/02 Task Boards/task-board.html` is for Richard to read. Agents do not need to read it, parse it, or update it during normal work.

## Roles

Use the Planning Agent role when Richard wants requirements captured, task cards created, priorities changed, or the board organized.

Use the Worker Agent role when Richard wants implementation, code edits, QA, cleanup, or any task execution.

Use the Review Agent role when Richard wants completed work in `review` visually checked in the browser and either approved into `done` or sent back as a follow-up `todo` task.

## Hard Role Separation

Planning Agent, Worker Agent, and Review Agent are separate agents. Agents do not switch roles inside the same chat.

A Planning Agent never switches into Worker Agent or Review Agent behavior. If Richard gives implementation or review requests to a Planning Agent, the Planning Agent records task requirements in `task-board.json` only and stops after reporting the board update.

A Review Agent never switches into Planning Agent or Worker Agent behavior. It reviews only `review` tasks and may create follow-up `todo` tasks only when reviewed work is not approved.

A Planning Agent must not claim tasks, edit product code, run implementation, or make code changes.

A Review Agent may update only `TEAM-WORK/02 Task Boards/task-board.json`, plus screenshots/reference images under `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded on a follow-up task. It must not modify code, CSS, Liquid, templates, scripts, tests, markdown docs, `AGENTS.md`, `TEAM-WORK/README.md`, or `task-board.html`.

## Planning Agent Rule

The Planning Agent records requirements and updates tasks. It may edit `task-board.json` and workflow planning docs when asked. It does not write product code and does not review completed work.

Before creating any new task or materially changing task scope, the Planning Agent must reload the board and check all columns for duplicate or overlapping work, including `todo`, `claimed`, `review`, `reviewing`, `done`, and `archived`. If a matching task already exists, update or reference the existing task instead of creating a duplicate; if the overlap is unclear, ask Richard whether to merge, replace, or create a dependent follow-up.

If the local task-board backend is running, Planning Agents should create and edit cards through `/api/add-task` and `/api/update-task`, always including their `agentName`. Use `/api/delete-task` only to remove duplicate or test tasks when Richard asks for cleanup. If the backend is not running, update `task-board.json` directly using the same planning rules.

## Worker Agent Rule

A Worker Agent must read `task-board.json`, claim one `todo` task by moving it to `claimed`, complete only that task, then move it to `review`. A Worker Agent never moves its own task to `done`.

If the local task-board backend is running, Worker Agents should claim and move tasks through `/api/claim-task` and `/api/move-to-review`, always including their `agentName`, so the transition is atomic. If the backend is not running, update `task-board.json` directly using the same status rules.

After moving a task to `review`, a Worker Agent must reload `task-board.json` and check the current `todo` list again. If another safe unclaimed task exists and Richard has not asked the agent to stop, the Worker Agent should claim the next task and continue; otherwise it reports that the list is clear or no safe task is available.

When moving a task to `review`, a Worker Agent must add `inspectionTargets` to the task so Richard and the Review Agent know where to inspect the change. Include the URL or path, viewport, state, and short notes when useful.

Worker Agents coordinate only through `task-board.json`; the HTML board is not an agent input.

## Review Agent Rule

A Review Agent must read `task-board.json`, claim only a task currently in `columns.review` by moving it to `columns.reviewing`, use the browser to answer Richard's specific review question, then move it to `done` as approved or close it into `done` as replaced by a follow-up `todo` task.
A Review Agent never implements fixes or plans unrelated work.

If the local task-board backend is running, Review Agents should use `/api/claim-review`, `/api/approve-review`, and `/api/request-changes`, always including their `agentName`, so review ownership and follow-up creation are atomic. If the backend is not running, update `task-board.json` directly using the same status rules.

If a reviewed task contains `richardFeedback`, `returnedToReviewAt`, or notes beginning with `Richard feedback for re-review`, the Review Agent must treat that feedback as Richard's active review question. Use it when deciding whether to create or update follow-up `todo` tasks for Worker Agents.

If a reviewed task includes `inspectionTargets`, the Review Agent should use those targets as the primary inspection locations before approving or requesting changes.

A task already in `columns.reviewing` is claimed by another Review Agent. Do not claim it, review it, move it, or duplicate its review work unless Richard explicitly reassigns it.

Before creating any follow-up `todo` task, the Review Agent must reload the board and check all columns for an existing duplicate or matching follow-up, especially tasks with the same `sourceReviewTaskId`, overlapping title, overlapping files, or matching acceptance criteria. If a matching follow-up already exists, update that task and increment its redo context instead of creating a duplicate. When the Review Agent creates or updates a follow-up for failed work, it must add `replacedByTaskId` or `latestFollowUpTaskId` context to the failed original task, append a note saying which task replaces it, and close the failed original task at the top of `columns.done`.

After finishing a review decision, a Review Agent must reload `task-board.json` and check the current `review` list again. If another unclaimed review task exists and Richard has not asked the agent to stop, the Review Agent should claim the next task into `columns.reviewing` and continue; otherwise it reports that the review list is clear.

All Review Agent writes must be limited to `task-board.json`, except for saving screenshots or reference images to `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded on a follow-up task for Worker Agent handoff.

## Board Columns

- `todo`: planned, unclaimed work.
- `claimed`: a Worker Agent has claimed the task and is working on it.
- `review`: work is complete and waiting for review.
- `reviewing`: currently claimed by a Review Agent for active review.
- `done`: Review Agent or Richard accepted the work, or Review Agent closed a failed task as replaced by a follow-up.
- `archived`: completed work hidden from the main board.

## Conflict Rule

`task-board.json` is the coordination lock. A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.

Only `columns.claimed` creates active work reservations for Worker Agents. Review and done tasks do not act as broad locks.

Before claiming work, Worker Agents should block only when a `claimed` task has:
- the same task ID/scope intent, or
- clearly conflicting acceptance criteria plus direct overlap on both target files/scripts and implementation scope.

Shared files/scripts between tasks do not block by themselves. Same-file work may proceed in parallel when scopes are distinct or when either task explicitly records `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` to show ownership intent.

Planning Agent and Review Agent must avoid creating duplicate or conflicting `todo` tasks. Before either role creates a task, it must check all board columns for existing matching work by title, scope, files, acceptance criteria, `relatedTaskIds`, `dependsOn`, and `sourceReviewTaskId`. If Richard gives a requirement that overlaps claimed work, the Planning Agent records it as a separate blocked/dependent `todo` task or asks Richard how to merge it; it must not rewrite a claimed task's scope unless Richard explicitly asks. If Review Agent feedback overlaps an existing follow-up, the Review Agent updates that follow-up instead of creating another task.

Tasks in `review` or `done` are closed to Worker Agents unless Richard explicitly reopens or assigns follow-up work.
