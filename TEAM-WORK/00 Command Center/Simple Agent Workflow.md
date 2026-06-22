# Simple Agent Workflow

This is the active workflow for coordinating multiple agents on the Artly site.

## Source of Truth

The task board JSON is the source of truth:

- `TEAM-WORK/02 Task Boards/task-board.json`

The visual board is a read-only display of that JSON for Richard:

- `TEAM-WORK/02 Task Boards/task-board.html`

Agents do not need to read, parse, or update the HTML board during normal workflow. They coordinate by updating `task-board.json`.

When the local task-board backend is running, agents should use its task board API for card creation, edits, and status changes:

- `TEAM-WORK/00 Command Center/Task Board API Guide.md`

Every agent must choose a stable `agentName` at the start of the chat and include it in every API payload. Keep the same name for the whole chat so Richard can see exactly which agent made each board change. The backend records `agentName` in `lastApiActor`, each task's `apiHistory`, and the board-level `apiAuditLog`.

The backend also writes an append-only API audit log at `TEAM-WORK/02 Task Boards/task-board-api.log`. Each line is JSON with the request time, method, endpoint, task ID, agent name, status, and any error message. This log is for troubleshooting and accountability; the task board source of truth remains `task-board.json`.

Every task must have a real, nonblank title. `Untitled`, `Untitled task`, and blank titles are invalid; the API rejects them and the viewer hides malformed records instead of rendering placeholder cards.

When a task depends on an image or screenshot, the Planning Agent or Review Agent must save that visual reference under `TEAM-WORK/05 Visual QA/Reference Images/` and record it in the task's `referenceImages` array. Worker Agents should inspect those paths before implementing the task.

Use this task data shape for image references:

```json
{
  "referenceImages": [
    {
      "path": "TEAM-WORK/05 Visual QA/Reference Images/TASK-YYYYMMDD-###-short-description.png",
      "description": "What the Worker Agent should inspect in this image.",
      "source": "Richard screenshot | Review Agent screenshot"
    }
  ]
}
```

| Endpoint | Purpose |
| --- | --- |
| `GET /api/board` | Read the full board and log the read with `agentName`. |
| `GET /api/task?taskId=TASK-YYYYMMDD-###` | Read one task and its current column. |
| `POST /api/add-task` | Create one new task in `todo`. |
| `POST /api/update-task` | Update allowed task fields without changing the task ID or status. |
| `POST /api/claim-task` | Move one task from `todo` to `claimed`. |
| `POST /api/move-to-review` | Move one task from `claimed` to `review`. |
| `POST /api/claim-review` | Move one task from `review` to `reviewing`. |
| `POST /api/approve-review` | Move one task from `reviewing` to `done`. |
| `POST /api/request-changes` | Close one failed task from `reviewing` into the top of `done` as replaced, then create/update a follow-up `todo`. |
| `POST /api/return-to-review` | Move one `done` task back to `review` with Richard feedback. |
| `POST /api/archive` | Move one `done` task to `archived`. |
| `POST /api/delete-task` | Remove duplicate or test tasks during cleanup; do not use for normal workflow. |

## Roles

Use one of three role files when starting a new agent:

- `TEAM-WORK/00 Command Center/Planning Agent.md`
- `TEAM-WORK/00 Command Center/Worker Agent.md`
- `TEAM-WORK/00 Command Center/Review Agent.md`

## Hard Role Separation

Planning Agent, Worker Agent, and Review Agent are separate agents. Agents do not switch roles inside the same chat.

If Richard gives requirements to a Planning Agent, the Planning Agent records those requirements in `task-board.json` and does not continue into implementation or review. It does not claim tasks, edit product code, run implementation, or make code changes.

Worker work starts only in a separate Worker Agent chat or when Richard explicitly starts an agent with the Worker Agent role.

Review work starts only in a separate Review Agent chat or when Richard explicitly starts an agent with the Review Agent role. The Review Agent uses the browser for visual review, but does not plan general work or implement fixes.

The Review Agent may update only `TEAM-WORK/02 Task Boards/task-board.json`, plus screenshots/reference images under `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded on a follow-up task. It must not modify code, CSS, Liquid, templates, scripts, tests, markdown docs, `AGENTS.md`, `TEAM-WORK/README.md`, or `task-board.html`.

## Columns

Tasks move through six columns:

| Column | Meaning | Who moves tasks here |
| --- | --- | --- |
| `todo` | Planned, unclaimed work. | Planning Agent |
| `claimed` | A Worker Agent has claimed the task and is actively working on it. | Worker Agent |
| `reviewing` | A Review Agent has claimed the task and is actively reviewing it. | Review Agent |
| `review` | Worker Agent finished the task and it is waiting for visual/product review. | Worker Agent |
| `done` | Accepted work, or failed reviewed work closed as replaced by a follow-up task. | Review Agent or Richard |
| `archived` | Accepted work hidden from the main board. | Richard or cleanup API |

## Operating Rules

1. Each agent chooses a stable `agentName` before making any board API call and sends that name in every API payload.
2. The Planning Agent records Richard's requirements and decomposes them into tasks. Before creating or materially changing a task, it must reload the board and check `todo`, `claimed`, `review`, `reviewing`, `done`, and `archived` for duplicate or overlapping work by title, scope, files, acceptance criteria, `relatedTaskIds`, `dependsOn`, and `sourceReviewTaskId`. Prefer `POST /api/add-task` and `POST /api/update-task` when the backend is running.
3. The Planning Agent only edits `task-board.json` and workflow planning docs when asked.
4. The Planning Agent does not write product code, theme code, scripts, tests, or implementation files.
5. The Planning Agent never switches into Worker Agent or Review Agent behavior after recording requirements.
6. Worker Agents read `task-board.json` before doing any work.
7. A Worker Agent claims exactly one `todo` task by moving it to `claimed` and setting `claimedBy` and `claimedAt`. Prefer `POST /api/claim-task` when the backend is running.
8. A Worker Agent claims work based on `columns.claimed` conflicts only, not as a broad lock from `review`/`done`.
9. When a Worker Agent finishes, it records the result and moves the task to `review`. Prefer `POST /api/move-to-review` when the backend is running.
10. When moving a task to `review`, a Worker Agent must add `inspectionTargets` describing where Richard and the Review Agent should inspect the change, including URL/path, viewport, state, and notes when useful.
11. A Worker Agent must reload `task-board.json` after finishing each task and check the current `todo` list again. If another safe `todo` task exists, it should claim the next one and continue unless Richard asked to stop. This keeps the board list clear.
12. Review Agent may claim one specific task from `columns.review` visually in the browser when Richard asks, then moves it to `reviewing` before reviewing. Prefer `POST /api/claim-review` when the backend is running.
13. Review Agent should use `inspectionTargets` as the primary places to inspect when a task provides them.
14. If approved, Review Agent moves the reviewed task from `reviewing` to `done`. Prefer `POST /api/approve-review` when the backend is running.
15. If not approved, Review Agent closes the reviewed task from `reviewing` into the top of `done` as replaced, records feedback on the failed task, and creates or updates a follow-up task in `todo`. Before creating a follow-up, it must reload the board and check every column for an existing duplicate, especially a task with the same `sourceReviewTaskId`, overlapping title, overlapping files, or matching acceptance criteria. The failed original task must record which follow-up task replaces it through `replacedByTaskId` or `latestFollowUpTaskId` plus a clear note. Prefer `POST /api/request-changes` when the backend is running.
16. Richard may return a `done` task to `review` from the HTML board by adding feedback. Review Agent must treat `richardFeedback`, `returnedToReviewAt`, and `Richard feedback for re-review` notes as Richard's active review question and use them when creating or updating follow-up `todo` tasks.
17. Review Agent must not claim, review, move, or duplicate work for a task already in `columns.reviewing`; that task is actively claimed by the Review Agent named in `reviewClaimedBy`.
18. Review Agent must reload `task-board.json` after every approval or changes-requested decision and check the current `review` list again. If another unclaimed `review` task is available, claim the next one into `reviewing` and continue unless Richard asked to stop. This keeps the review list clear.
19. Review Agent writes only to `task-board.json`, except for saved screenshots/reference images under `TEAM-WORK/05 Visual QA/Reference Images/` when those paths are recorded in task data. It never edits implementation files or workflow docs.
20. Planning Agent and Review Agent may save screenshots or reference images under `TEAM-WORK/05 Visual QA/Reference Images/` only when the saved image is recorded in a task's `referenceImages` array for Worker Agent handoff.
21. Richard may also review `review` tasks and move accepted tasks to `done`.
22. Agents should ignore `task-board.html` unless Richard explicitly asks to change the board viewer itself.

## Conflict Rule

`task-board.json` is the coordination lock. A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.

Before claiming work, Worker Agents should treat `claimed` tasks as blocking only if:

- the task IDs indicate the same scope, or
- acceptance criteria are clearly overlapping/conflicting and target the same implementation scope.

Before claiming, shared files/scripts alone are not blockers. Same-file work can proceed when scope differs or when tasks explicitly record `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` links.

If two agents want the same task, the task already in `claimed` wins. The later agent must choose another `todo` task or stop and report that no safe task is available.

If two Review Agents want the same task, the task already in `reviewing` wins. The later Review Agent must choose another task from `columns.review` or report that no unclaimed review task is available.

Planning Agent and Review Agent must avoid creating duplicate or conflicting `todo` tasks. Before either role creates a task, it must check all board columns for existing matching work by title, scope, files, acceptance criteria, `relatedTaskIds`, `dependsOn`, and `sourceReviewTaskId`. If Richard gives a requirement that overlaps claimed work, the Planning Agent records it as a separate blocked/dependent `todo` task or asks Richard how to merge it; it must not rewrite a claimed task's scope unless Richard explicitly asks. If Review Agent feedback overlaps an existing follow-up, the Review Agent updates that follow-up instead of creating another task.

Tasks in `review` or `done` are closed to Worker Agents unless Richard explicitly reopens or assigns follow-up work.
