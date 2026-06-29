# Artly Agent Instructions

The active workflow is a simple JSON-backed task board with five separate agent roles. Current Site Audit Agent and Reference Research Agent create handoffs, Planning Agent turns selected handoffs and requirements into tasks, Worker Agents implement tasks, and Review Agents visually review completed work.

## Start Here

- Workflow overview: `TEAM-WORK/00 Command Center/Simple Agent Workflow.md`
- Current Site Audit Agent role: `TEAM-WORK/00 Command Center/Current Site Audit Agent.md`
- Reference Research Agent role: `TEAM-WORK/00 Command Center/Reference Research Agent.md`
- Planning Agent role: `TEAM-WORK/00 Command Center/Planning Agent.md`
- Worker Agent role: `TEAM-WORK/00 Command Center/Worker Agent.md`
- Review Agent role: `TEAM-WORK/00 Command Center/Review Agent.md`
- Research handoff folder: `TEAM-WORK/07 Research Handoffs/`
- Task board API guide: `TEAM-WORK/00 Command Center/Task Board API Guide.md`
- Task board source of truth: `TEAM-WORK/02 Task Boards/task-board.json`
- Task board dispatch settings: `TEAM-WORK/02 Task Boards/agent-dispatch-settings.json`

## Agent Start Phrases

Use these phrases at the start of a new chat to load the intended role:

| Start phrase | Role file |
| --- | --- |
| `load as current site audit agent` | `TEAM-WORK/00 Command Center/Current Site Audit Agent.md` |
| `load as research agent` | `TEAM-WORK/00 Command Center/Reference Research Agent.md` |
| `load as planning agent` | `TEAM-WORK/00 Command Center/Planning Agent.md` |
| `load as worker agent` | `TEAM-WORK/00 Command Center/Worker Agent.md` |
| `load as review agent` | `TEAM-WORK/00 Command Center/Review Agent.md` |

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

Tail the desktop viewer log:

```powershell
Get-Content ".\TEAM-WORK\02 Task Boards\task-board-viewer.log" -Tail 50 -Wait
```

Tail spawned non-interactive agent output:

```powershell
Get-Content ".\TEAM-WORK\02 Task Boards\spawned-agent-logs\*.log" -Tail 50 -Wait
```

When `TEAM-WORK/02 Task Boards/task-board-server.py` is running, use its task board API instead of manually editing or moving tasks in JSON:

- `GET /api/board`
- `GET /api/worker-board`
- `GET /api/review-board`
- `GET /api/task-detail?taskId=TASK-YYYYMMDD-###`
- `GET /api/task?taskId=TASK-YYYYMMDD-###` legacy alias for task detail
- `GET /api/duplicate-scan`
- `GET /api/agents`
- `POST /api/register-agent`
- `POST /api/heartbeat-agent`
- `POST /api/unregister-agent`
- `POST /api/terminate-agent` owner/viewer recovery only; not a normal agent action
- `POST /api/add-task`
- `POST /api/update-task`
- `POST /api/claim-task`
- `POST /api/unclaim-task`
- `POST /api/move-to-review`
- `POST /api/claim-review`
- `POST /api/unclaim-review`
- `POST /api/approve-review`
- `POST /api/request-changes`
- `POST /api/return-to-review`
- `POST /api/archive`
- `POST /api/delete-task` cleanup only for duplicate/test tasks, not normal workflow

For payload shapes, examples, and error handling, read `TEAM-WORK/00 Command Center/Task Board API Guide.md`.

Every agent must register at the start of its chat by calling `POST /api/register-agent` with `personalName`, `model` (`claude` or `codex`), and `role`. The server returns an `agentId` (for example `agt_a1b2c3`). Use that `agentId` in every later task board API payload. `personalName` is a short lowercase token like `alex`, `kai`, `north`; the Spawn button on the task board picks one for you from `TEAM-WORK/02 Task Boards/agent-color-schema.json#personalNamePool`, or use the name Richard gives you. The backend records the resolved display name in `lastApiActor`, `apiHistory`, and `apiAuditLog`, and the HTML board renders each agent as a chip with the model determining its background color and the role determining its border color.

The backend appends agent API requests under `/api/...`, including `GET` reads, to `TEAM-WORK/02 Task Boards/task-board-api.log` as JSON Lines with timestamp, method, endpoint, task ID, agent name, status, and error details. The desktop HTML viewer uses separate `/viewer/...` endpoints and writes to `TEAM-WORK/02 Task Boards/task-board-viewer.log`, so viewer polling does not mix with agent activity. These logs are audit history only; agents still coordinate through `task-board.json`.

`GET /api/worker-board` and `GET /api/review-board` are compact queue views. They return only the role's active columns as task summaries and intentionally omit `done`, `archived`, the top-level `tasks` index, `apiAuditLog`, and workflow policy text. After choosing or claiming a task from a compact queue, use `GET /api/task-detail?taskId=...&agentId=...` to load full details for that single task. Use `GET /api/duplicate-scan?taskId=...&agentId=...&includeArchived=true` for targeted duplicate checks instead of loading the whole board.

The desktop viewer Spawn buttons start Worker and Review agents as hidden non-interactive CLI processes, not new terminal tabs. Spawned output is written under `TEAM-WORK/02 Task Boards/spawned-agent-logs/`; the spawn response reports the process ID and log path. Spawned Codex, Claude, and Qwen logs are formatted into readable text and end with `Token usage summary` when the CLI reports usage; if the CLI exits before reporting usage, the log says token usage is unavailable. Each displayed agent tab has a Terminate button for Richard. Terminate writes a timestamped note to the spawned-agent log when one is known, stops the trusted spawned process PID when available, removes matching pending spawn state, and marks matching active presence as terminated.

The desktop viewer can also auto-dispatch Worker and Review agents. Each role has a selected model (`codex` or `claude`), a maximum active agent count, and an Auto toggle stored in `TEAM-WORK/02 Task Boards/agent-dispatch-settings.json`. When Auto is on, the backend checks the board periodically: if `todo` has work and active/pending Worker agents are below the Worker max, it spawns a hidden Worker agent; if `review` has work and active/pending Review agents are below the Review max, it spawns a hidden Review agent.

Worker Agents and Review Agents must register active presence with `/api/register-agent` at chat start, heartbeat with `/api/heartbeat-agent` after claiming or moving a task, and deregister with `/api/unregister-agent` before ending for any reason. The board viewer uses `/api/agents` to show active Worker Agents in the To Do header and active Review Agents in the Review header.

Every task must have a real, nonblank title. Do not create or update tasks with `Untitled`, `Untitled task`, or a blank title; the API rejects those titles and the viewer hides malformed records.

When a Planning Agent or Review Agent needs a Worker Agent to refer to an image or screenshot, save that image under `TEAM-WORK/05 Visual QA/Reference Images/` and record it in the task's `referenceImages` array with `path`, `description`, and `source`. Worker Agents must inspect listed `referenceImages` paths before implementing that task.

The HTML board at `TEAM-WORK/02 Task Boards/task-board.html` is for Richard to read. Agents do not need to read it, parse it, or update it during normal work.

## Roles

Use the Current Site Audit Agent role when Richard wants the current website or a specific page/flow inspected for design, UX, content, interaction, animation, and conversion opportunities. It writes a handoff file only.

Use the Reference Research Agent role when Richard gives a market/category and wants an agent to research 30 to 50 external company websites, select the strongest references, summarize design and motion patterns, and write a handoff file.

Use the Planning Agent role when Richard wants requirements captured, task cards created, priorities changed, or the board organized.

Use the Worker Agent role when Richard wants implementation, code edits, QA, cleanup, or any task execution.

Use the Review Agent role when Richard wants completed work in `review` visually checked in BrowserOS and either approved into `done` or sent back as a follow-up `todo` task.

## Hard Role Separation

Current Site Audit Agent, Reference Research Agent, Planning Agent, Worker Agent, and Review Agent are separate agents. Agents do not switch roles inside the same chat.

A Current Site Audit Agent never switches into Planning Agent, Worker Agent, or Review Agent behavior. It writes current-site audit handoff files in `TEAM-WORK/07 Research Handoffs/` only, with optional screenshots linked from `TEAM-WORK/05 Visual QA/Reference Images/`.

A Reference Research Agent never switches into Planning Agent, Worker Agent, or Review Agent behavior. It researches external websites in Richard's assigned category and writes reference handoff files in `TEAM-WORK/07 Research Handoffs/` only, with optional screenshots linked from `TEAM-WORK/05 Visual QA/Reference Images/`.

Current Site Audit Agent and Reference Research Agent must not create or update task-board tickets, claim tasks, move task statuses, review tasks, edit product code, or call task-board mutation APIs. Their output is a handoff for Planning Agent.

A Planning Agent never switches into Worker Agent or Review Agent behavior. If Richard gives implementation or review requests to a Planning Agent, the Planning Agent records task requirements in `task-board.json` only and stops after reporting the board update.

A Review Agent never switches into Planning Agent or Worker Agent behavior. It reviews only `review` tasks and may create follow-up `todo` tasks only when reviewed work is not approved.

A Planning Agent must not claim tasks, edit product code, run implementation, or make code changes.

A Review Agent may update only `TEAM-WORK/02 Task Boards/task-board.json`, plus screenshots/reference images under `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded on a follow-up task. It must not modify code, CSS, Liquid, templates, scripts, tests, markdown docs, `AGENTS.md`, `TEAM-WORK/README.md`, or `task-board.html`.

## Planning Agent Rule

The Planning Agent records requirements and updates tasks. It may edit `task-board.json` and workflow planning docs when asked. It does not write product code and does not review completed work.

When Richard gives the Planning Agent one or more handoff files from `TEAM-WORK/07 Research Handoffs/`, the Planning Agent reads the handoff, compares it against the current site and existing task board, checks every column for duplicate or overlapping work, and creates or updates only the useful actionable `todo` tasks. It should record the handoff path in `sourceHandoffs` or task notes.

Before creating any new task or materially changing task scope, the Planning Agent must reload the board and check all columns for duplicate or overlapping work, including `todo`, `claimed`, `review`, `reviewing`, `done`, and `archived`. Check title, scope, files, acceptance criteria, `relatedTaskIds`, `dependsOn`, `sourceHandoffs`, and `sourceReviewTaskId`. The Planning Agent may edit an existing task only when that task is still in `columns.todo`, still has `status: "todo"`, and has not been claimed, moved to review, reviewed, completed, or archived. If a matching task is already in `claimed`, `review`, `reviewing`, `done`, or `archived`, do not rewrite it; in most cases create a new related `todo` ticket with `relatedTaskIds`, `dependsOn`, `sourceReviewTaskId`, or a clear note pointing back to the existing task. If the overlap is unclear, ask Richard whether to merge, replace, or create a dependent follow-up.

If the local task-board backend is running, Planning Agents should create and edit cards through `/api/add-task` and `/api/update-task`, always including their `agentName`. Use `/api/delete-task` only to remove duplicate or test tasks when Richard asks for cleanup. If the backend is not running, update `task-board.json` directly using the same planning rules.

## Worker Agent Rule

A Worker Agent must read the worker board view (`todo` and `claimed` only), claim one `todo` task by moving it to `claimed`, complete only that task, then move it to `review`. A Worker Agent never moves its own task to `done`.

If the local task-board backend is running, Worker Agents should read compact summaries through `/api/worker-board`, then claim and move tasks through `/api/claim-task` and `/api/move-to-review`, always including their `agentId`, so the transition is atomic. After claiming, they must load full details for only that task through `/api/task-detail?taskId=...&agentId=...`. If the backend is not running, update `task-board.json` directly using the same status rules while reading only `columns.todo` and `columns.claimed` unless Richard explicitly asks for broader context.

After moving a task to `review`, a Worker Agent must reload `task-board.json` and check the current `todo` list again. If another safe unclaimed task exists and Richard has not asked the agent to stop, the Worker Agent should claim the next task and continue; otherwise it reports that the list is clear or no safe task is available.

When moving a task to `review`, a Worker Agent must add `inspectionTargets` to the task so Richard and the Review Agent know where to inspect the change. Include the URL or path, viewport, state, and short notes when useful.

Worker Agents coordinate only through `task-board.json`; the HTML board is not an agent input.

When the backend is running, Worker Agents must register with `role: "worker"` before reading the board, heartbeat with `currentTaskId` after claim and after moving work to review, and unregister before ending the chat whether the list is clear, blocked, or Richard asked them to stop.

## Review Agent Rule

A Review Agent must read the review board view (`review` and `reviewing` only), claim only a task currently in `columns.review` by moving it to `columns.reviewing`, use BrowserOS to visually answer Richard's specific review question, then move it to `done` as approved or close it into `done` as replaced by a follow-up `todo` task.
A Review Agent never implements fixes or plans unrelated work.

If the local task-board backend is running, Review Agents should read compact summaries through `/api/review-board`, then use `/api/claim-review`, `/api/approve-review`, and `/api/request-changes`, always including their `agentId`, so review ownership and follow-up creation are atomic. After claiming, they must load full details for only that task through `/api/task-detail?taskId=...&agentId=...`. If the backend is not running, update `task-board.json` directly using the same status rules while reading only `columns.review` and `columns.reviewing` unless a targeted duplicate scan is required.

If a reviewed task contains `richardFeedback`, `returnedToReviewAt`, or notes beginning with `Richard feedback for re-review`, the Review Agent must treat that feedback as Richard's active review question. Use it when deciding whether to create or update follow-up `todo` tasks for Worker Agents.

If a reviewed task includes `inspectionTargets`, the Review Agent should use those targets as the primary inspection locations before approving or requesting changes.

A Review Agent must use BrowserOS to inspect the actual changed page, section, viewport, and interaction state before approving. It must not approve from code inspection, task text, screenshots alone, or assumptions. The review must judge whether the result is visually appealing and works correctly in practice, including layout, hierarchy, spacing, responsive behavior, motion/transition quality, interaction states, obvious accessibility basics, and nearby regressions. If BrowserOS or the inspection target is unavailable, the Review Agent must not approve; it should report the blocker or request changes only when visible evidence clearly supports a failure.

A task already in `columns.reviewing` is claimed by another Review Agent. Do not claim it, review it, move it, or duplicate its review work unless Richard explicitly reassigns it.

Before creating any follow-up `todo` task, the Review Agent must use `/api/duplicate-scan?taskId=...&agentId=...&includeArchived=true` when the backend is running, or otherwise reload the board directly, to check all columns for an existing duplicate or matching follow-up, especially tasks with the same `sourceReviewTaskId`, overlapping title, overlapping files, or matching acceptance criteria. If a matching follow-up already exists, update that task and increment its redo context instead of creating a duplicate. When the Review Agent creates or updates a follow-up for failed work, it must add `failureExpected`, `failureActual`, and `failureDecision` to the failed original task so the Done card starts with what should be true, what actually happened, and why the review failed. It must also add `replacedByTaskId` or `latestFollowUpTaskId` context to the failed original task, append a note saying which task replaces it, and close the failed original task at the top of `columns.done`.

When approving work into `done`, the Review Agent must include `reviewNotes` written for Richard in common language. The note must explain what changed, where it was visually inspected, what Richard should expect to see when reviewing it, and any caveats. Avoid raw implementation jargon unless it directly helps Richard inspect the result.

After finishing a review decision, a Review Agent must reload `task-board.json` and check the current `review` list again. If another unclaimed review task exists and Richard has not asked the agent to stop, the Review Agent should claim the next task into `columns.reviewing` and continue; otherwise it reports that the review list is clear.

All Review Agent writes must be limited to `task-board.json`, except for saving screenshots or reference images to `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded on a follow-up task for Worker Agent handoff.

When the backend is running, Review Agents must register with `role: "review"` before reading the board, heartbeat with `currentTaskId` after claim and after approval or request-changes, and unregister before ending the chat whether the review list is clear, blocked, or Richard asked them to stop.

## Board Columns

- `todo`: planned, unclaimed work.
- `claimed`: a Worker Agent has claimed the task and is working on it.
- `review`: work is complete and waiting for review.
- `reviewing`: currently claimed by a Review Agent for active review.
- `done`: Review Agent or Richard accepted the work, or Review Agent closed a failed task as replaced by a follow-up.
- `archived`: completed work hidden from the main board.

The HTML board keeps those six columns in JSON for coordination but displays the main interface as three visual columns: To Do combines `claimed` above `todo`, Review combines `reviewing` above `review`, and Done shows `done`. Claimed and Reviewing cards are highlighted inside those combined columns.

Richard can use the HTML board's expanded claimed-card `Unclaim task` button when a Worker Agent was killed or abandoned the task. This calls `/viewer/unclaim-task`, moves the task from `claimed` back to the top of `todo`, clears `claimedBy` and `claimedAt`, and clears matching active worker presence for that task.

Richard can use the HTML board's expanded reviewing-card `Unclaim review` button when a Review Agent was killed or abandoned the review. This calls `/viewer/unclaim-review`, moves the task from `reviewing` back to the top of `review`, clears `reviewClaimedBy` and `reviewClaimedAt`, and clears matching active review presence for that task.

## Conflict Rule

`task-board.json` is the coordination lock. A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.

Only `columns.claimed` creates active work reservations for Worker Agents. Review and done tasks do not act as broad locks.

Before claiming work, Worker Agents should block only when a `claimed` task has:
- the same task ID/scope intent, or
- clearly conflicting acceptance criteria plus direct overlap on both target files/scripts and implementation scope.

Shared files/scripts between tasks do not block by themselves. Same-file work may proceed in parallel when scopes are distinct or when either task explicitly records `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` to show ownership intent.

Planning Agent and Review Agent must avoid creating duplicate or conflicting `todo` tasks. Before either role creates a task, it must check all board columns for existing matching work by title, scope, files, acceptance criteria, `relatedTaskIds`, `dependsOn`, `sourceHandoffs`, and `sourceReviewTaskId`. Planning Agent edits are allowed only for matching tickets that are still untouched in `columns.todo`; if the matching ticket has moved to `claimed`, `review`, `reviewing`, `done`, or `archived`, Planning Agent should usually create a new related `todo` ticket instead of editing the moved ticket. If Richard gives a requirement that overlaps claimed work, the Planning Agent records it as a separate blocked/dependent `todo` task or asks Richard how to merge it; it must not rewrite a claimed task's scope unless Richard explicitly asks. If Review Agent feedback overlaps an existing follow-up, the Review Agent updates that follow-up instead of creating another task.

Tasks in `review` or `done` are closed to Worker Agents unless Richard explicitly reopens or assigns follow-up work.
