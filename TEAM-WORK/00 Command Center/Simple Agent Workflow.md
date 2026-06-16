# Simple Agent Workflow

This is the active workflow for coordinating multiple agents on the Artly site.

## Source of Truth

The task board JSON is the source of truth:

- `TEAM-WORK/02 Task Boards/task-board.json`

The visual board is a read-only display of that JSON for Richard:

- `TEAM-WORK/02 Task Boards/task-board.html`

Agents do not need to read, parse, or update the HTML board during normal workflow. They coordinate by updating `task-board.json`.

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

The Review Agent may update only `TEAM-WORK/02 Task Boards/task-board.json`. It must not modify code, CSS, Liquid, templates, scripts, tests, markdown docs, `AGENTS.md`, `TEAM-WORK/README.md`, or `task-board.html`.

## Columns

Tasks move through five columns:

| Column | Meaning | Who moves tasks here |
| --- | --- | --- |
| `todo` | Planned, unclaimed work. | Planning Agent |
| `claimed` | A Worker Agent has claimed the task and is actively working on it. | Worker Agent |
| `reviewing` | A Review Agent has claimed the task and is actively reviewing it. | Review Agent |
| `review` | Worker Agent finished the task and it is waiting for visual/product review. | Worker Agent |
| `done` | Review Agent or Richard reviewed and accepted the task. | Review Agent or Richard |

## Operating Rules

1. The Planning Agent records Richard's requirements and decomposes them into tasks.
2. The Planning Agent only edits `task-board.json` and workflow planning docs when asked.
3. The Planning Agent does not write product code, theme code, scripts, tests, or implementation files.
4. The Planning Agent never switches into Worker Agent or Review Agent behavior after recording requirements.
5. Worker Agents read `task-board.json` before doing any work.
6. A Worker Agent claims exactly one `todo` task by moving it to `claimed` and setting `claimedBy` and `claimedAt`.
7. A Worker Agent claims work based on `columns.claimed` conflicts only, not as a broad lock from `review`/`done`.
8. When a Worker Agent finishes, it records the result and moves the task to `review`.
9. A Worker Agent must reload `task-board.json` after finishing each task and check the current `todo` list again. If another safe `todo` task exists, it should claim the next one and continue unless Richard asked to stop. This keeps the board list clear.
10. Review Agent may claim one specific task from `columns.review` visually in the browser when Richard asks, then moves it to `reviewing` before reviewing.
11. If approved, Review Agent moves the reviewed task from `reviewing` to `done`.
12. If not approved, Review Agent moves the reviewed task from `reviewing` back to `review`, records feedback, and creates a follow-up task in `todo`.
13. Review Agent must not claim, review, move, or duplicate work for a task already in `columns.reviewing`; that task is actively claimed by the Review Agent named in `reviewClaimedBy`.
14. Review Agent must reload `task-board.json` after every approval or changes-requested decision and check the current `review` list again. If another unclaimed `review` task is available, claim the next one into `reviewing` and continue unless Richard asked to stop. This keeps the review list clear.
15. Review Agent writes only to `task-board.json`; it never edits implementation files or workflow docs.
16. Richard may also review `review` tasks and move accepted tasks to `done`.
17. Agents should ignore `task-board.html` unless Richard explicitly asks to change the board viewer itself.

## Conflict Rule

`task-board.json` is the coordination lock. A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.

Before claiming work, Worker Agents should treat `claimed` tasks as blocking only if:

- the task IDs indicate the same scope, or
- acceptance criteria are clearly overlapping/conflicting and target the same implementation scope.

Before claiming, shared files/scripts alone are not blockers. Same-file work can proceed when scope differs or when tasks explicitly record `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` links.

If two agents want the same task, the task already in `claimed` wins. The later agent must choose another `todo` task or stop and report that no safe task is available.

If two Review Agents want the same task, the task already in `reviewing` wins. The later Review Agent must choose another task from `columns.review` or report that no unclaimed review task is available.

Planning Agent must avoid creating duplicate or conflicting `todo` tasks. If Richard gives a requirement that overlaps claimed work, the Planning Agent records it as a separate blocked/dependent `todo` task or asks Richard how to merge it; it must not rewrite a claimed task's scope unless Richard explicitly asks.

Tasks in `review` or `done` are closed to Worker Agents unless Richard explicitly reopens or assigns follow-up work.
