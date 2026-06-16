# TEAM-WORK

This folder is the local command center for Artly site agent work. The active workflow is intentionally simple: one Planning Agent records tasks in JSON, Worker Agents claim tasks from that JSON, finished work moves to review, and Review Agents or Richard move accepted work to done.

## Start Here

- [Root agent instructions](../AGENTS.md)
- [Simple Agent Workflow](00%20Command%20Center/Simple%20Agent%20Workflow.md)
- [Planning Agent](00%20Command%20Center/Planning%20Agent.md)
- [Worker Agent](00%20Command%20Center/Worker%20Agent.md)
- [Review Agent](00%20Command%20Center/Review%20Agent.md)
- [JSON Task Board](02%20Task%20Boards/task-board.json)
- [Trello-style Board Viewer](02%20Task%20Boards/task-board.html) for Richard's read-only view

## Folder Map

| Folder | Purpose |
| --- | --- |
| `00 Command Center` | Active workflow overview and role files for Planning Agents, Worker Agents, and Review Agents. |
| `01 Work Logs` | Legacy chronological logs for earlier team activity. |
| `02 Task Boards` | Active JSON task board, Richard's HTML board viewer, and legacy boards. |
| `03 Agent Registry` | Legacy traceability records from the previous multi-layer workflow. |
| `04 Project Deliverables` | Existing planning docs, design packets, audits, and approved outputs. |
| `05 Visual QA` | Screenshots and visual inspection evidence. |
| `06 Conversion Queue` | Markdown-to-HTML conversion queue and conversion status. |
| `90 Temporary` | Temporary runtime files, diagnostic output, and throwaway screenshots kept for review. |
| `99 Archive` | Retired or superseded material that should be preserved but not used day to day. |

## Operating Loop

1. Planning Agent records Richard's requirements in `02 Task Boards/task-board.json`.
2. Worker Agent reads the board, claims exactly one `todo` task, and moves it to `claimed`.
3. Worker Agent completes the claimed task without touching conflicting claimed work.
4. Worker Agent moves completed work to `review`, then continues to the next safe `todo` task if available.
5. Review Agent claims one `review` task into `reviewing`, then moves to `done` (approved) or back to `review` with follow-up `todo` tasks when needed.
6. Review Agents use `reviewing` so only one review owner works each task at a time.
7. Richard may also review `review` tasks and move accepted work to `done`.

Agents update `task-board.json` only for task coordination. The HTML board is settled as Richard's display layer.

Planning Agent, Worker Agent, and Review Agent are separate agents. A Planning Agent never switches into Worker Agent or Review Agent behavior, never claims tasks, and never makes code changes. A Review Agent never switches into Planning Agent or Worker Agent behavior and never implements fixes.
