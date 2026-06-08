# Conversion Queue

The conversion queue tracks markdown deliverables that should be turned into readable HTML. Producer agents should finish markdown first, then add a queue row for the Converter Agent.

## Queue Rules

- Keep source markdown as the canonical editable file.
- Convert only finished or review-ready markdown.
- Put HTML next to the source file unless a different output folder is specified.
- Preserve useful source links and metadata.
- Mark conversion complete only after opening or otherwise validating the HTML output.

## Queue

| Status | Priority | Source Markdown | Target HTML | Requested By | Notes |
| --- | --- | --- | --- | --- | --- |
| Complete | Normal | `00 Command Center/Team Overview.md` | `00 Command Center/Team Overview.html` | Codex setup worker | Created during initial TEAM-WORK setup. |
| Complete | Normal | `00 Command Center/Agent Roster.md` | `00 Command Center/Agent Roster.html` | Codex setup worker | Created during initial TEAM-WORK setup. |
| Open | Normal | `04 Project Deliverables/*.md` | Same folder as source | Leader Agent | Existing project deliverables can be queued one by one when Richard wants readable HTML versions refreshed. |

