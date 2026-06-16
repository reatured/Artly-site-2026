# Artly Agent Instructions

The active workflow is a simple JSON-backed task board with three separate agent roles.

## Start Here

- Workflow overview: `TEAM-WORK/00 Command Center/Simple Agent Workflow.md`
- Planning Agent role: `TEAM-WORK/00 Command Center/Planning Agent.md`
- Worker Agent role: `TEAM-WORK/00 Command Center/Worker Agent.md`
- Review Agent role: `TEAM-WORK/00 Command Center/Review Agent.md`
- Task board source of truth: `TEAM-WORK/02 Task Boards/task-board.json`

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

A Review Agent may update only `TEAM-WORK/02 Task Boards/task-board.json`. It must not modify code, CSS, Liquid, templates, scripts, tests, markdown docs, `AGENTS.md`, `TEAM-WORK/README.md`, or `task-board.html`.

## Planning Agent Rule

The Planning Agent records requirements and updates tasks. It may edit `task-board.json` and workflow planning docs when asked. It does not write product code and does not review completed work.

## Worker Agent Rule

A Worker Agent must read `task-board.json`, claim one `todo` task by moving it to `claimed`, complete only that task, then move it to `review`. A Worker Agent never moves its own task to `done`.

After moving a task to `review`, a Worker Agent must reload `task-board.json` and check the current `todo` list again. If another safe unclaimed task exists and Richard has not asked the agent to stop, the Worker Agent should claim the next task and continue; otherwise it reports that the list is clear or no safe task is available.

Worker Agents coordinate only through `task-board.json`; the HTML board is not an agent input.

## Review Agent Rule

A Review Agent must read `task-board.json`, claim only a task currently in `columns.review` by moving it to `columns.reviewing`, use the browser to answer Richard's specific review question, then move it to `done` (approved) or back to `review` with feedback.
A Review Agent never implements fixes or plans unrelated work.

A task already in `columns.reviewing` is claimed by another Review Agent. Do not claim it, review it, move it, or duplicate its review work unless Richard explicitly reassigns it.

After finishing a review decision, a Review Agent must reload `task-board.json` and check the current `review` list again. If another unclaimed review task exists and Richard has not asked the agent to stop, the Review Agent should claim the next task into `columns.reviewing` and continue; otherwise it reports that the review list is clear.

All Review Agent writes must be limited to `task-board.json`.

## Board Columns

- `todo`: planned, unclaimed work.
- `claimed`: a Worker Agent has claimed the task and is working on it.
- `review`: work is complete and waiting for review.
- `reviewing`: currently claimed by a Review Agent for active review.
- `done`: Review Agent or Richard accepted the work.

## Conflict Rule

`task-board.json` is the coordination lock. A task in `claimed` reserves its listed files, project area, and direct scope for the claiming Worker Agent.

Only `columns.claimed` creates active work reservations for Worker Agents. Review and done tasks do not act as broad locks.

Before claiming work, Worker Agents should block only when a `claimed` task has:
- the same task ID/scope intent, or
- clearly conflicting acceptance criteria plus direct overlap on both target files/scripts and implementation scope.

Shared files/scripts between tasks do not block by themselves. Same-file work may proceed in parallel when scopes are distinct or when either task explicitly records `relatedTaskIds`, `dependsOn`, or `sourceReviewTaskId` to show ownership intent.

Planning Agent must avoid creating duplicate or conflicting `todo` tasks. If Richard gives a requirement that overlaps claimed work, the Planning Agent records it as a separate blocked/dependent `todo` task or asks Richard how to merge it; it must not rewrite a claimed task's scope unless Richard explicitly asks.

Tasks in `review` or `done` are closed to Worker Agents unless Richard explicitly reopens or assigns follow-up work.
