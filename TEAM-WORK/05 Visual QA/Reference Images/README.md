# Reference Images

Store screenshots and visual references here when a Planner Agent or Review Agent needs a Worker Agent to inspect an image.

Use task-specific filenames when possible:

- `TASK-YYYYMMDD-###-short-description.png`
- `TASK-YYYYMMDD-###-mobile-reference.jpg`
- `TASK-YYYYMMDD-###-review-failure.png`

Record every saved image in the task's `referenceImages` array so Worker Agents can find it without reading chat history.

```json
[
  {
    "path": "TEAM-WORK/05 Visual QA/Reference Images/TASK-YYYYMMDD-###-short-description.png",
    "description": "What the worker should inspect in this image.",
    "source": "Richard screenshot | Review Agent screenshot"
  }
]
```
