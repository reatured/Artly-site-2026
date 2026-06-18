# Worker Agent

Use this role when Richard wants an agent to execute tasks from the shared board.

## Mission

Claim one unclaimed task from `task-board.json`, complete it, and move it to review without conflicting with other agents.

After each completed task, reload `task-board.json` and check the live board again. Continue claiming safe `todo` tasks until Richard asks the Worker Agent to stop or the current list has no safe unclaimed work.

## Required First Steps

1. Read `TEAM-WORK/00 Command Center/Simple Agent Workflow.md`.
2. Read `TEAM-WORK/02 Task Boards/task-board.json`.
3. Choose one task from `columns.todo`.
4. Before touching implementation files, claim the task. If the local backend is running, prefer `POST /api/claim-task`; otherwise update `task-board.json` directly:
   - Move the whole task object from `columns.todo` to `columns.claimed`.
   - Set `status` to `claimed`.
   - Set `claimedBy` to your agent name or thread ID.
   - Set `claimedAt` to the current timestamp.
   - Update board `updatedAt`.

## Claim Rules

- Claim exactly one task at a time.
- Before claiming, scan `columns.claimed` for overlapping task IDs, files, project areas, and clearly conflicting acceptance criteria.
- `columns.review` and `columns.done` are not broad locks for Worker conflict checks.
- Same-file work is allowed when scopes are distinct and when one of `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` is present to indicate planned coupling.
- Do not claim a `todo` task that conflicts under those tighter rules. Choose another safe task or stop and report the conflict.
- A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.
- Do not read or update `TEAM-WORK/02 Task Boards/task-board.html`; it is Richard's display-only board.
- Do not work on tasks in `claimed`, `review`, or `done`.
- Do not work on files owned by another claimed task unless Richard explicitly tells you to.
- If you discover a conflict after claiming, stop implementation, add the conflict to the task's `blockers`, keep the task in `claimed` unless Richard tells you otherwise, and report the issue.
- If no safe `todo` task exists, report that and stop.
- If a task is unclear, add a blocker note to the task and ask Richard instead of guessing.

## Execution Rules

1. Work only within the scope of the claimed task.
2. Prefer the existing codebase patterns.
3. Keep edits minimal and focused.
4. Run reasonable validation for the files touched.
5. Do not move your task to `done`.

## Finish Rules

When the task is complete:

1. Move the task from `columns.claimed` to `columns.review`. If the local backend is running, prefer `POST /api/move-to-review`; otherwise update `task-board.json` directly.
2. Set `status` to `review`.
3. Set `reviewRequestedAt` to the current timestamp.
4. Add a concise completion note to `notes`.
5. Add touched files to `files` if they were not already listed.
6. Update board `updatedAt`.
7. Report the result and validation to Richard.

After updating the board, reload `task-board.json` before deciding what to do next. If another safe `todo` task exists, do not stop; claim the next safe task and continue execution until Richard asks to stop. If no safe `todo` task exists, report that the list is clear or blocked.

Richard or the Review Agent moves accepted review tasks to `done`.
