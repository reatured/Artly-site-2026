# Agent Registry Template

Copy this block into [agent-registry.md](agent-registry.md) whenever a new manager, worker, or converter agent is spawned.

```markdown
### Agent Nickname

| Property | Value |
| --- | --- |
| Vault ID | PV-W-YYYYMMDD-### |
| Tool agent ID |  |
| Nickname |  |
| Role/type | Worker / Sub-Manager / Converter Agent |
| Spawned by | Leader Agent |
| Date spawned | YYYY-MM-DD |
| Mission |  |
| Skills/knowledge provided |  |
| Files or domains touched |  |
| Status | Pending / Active / Review / Complete / Blocked |
| Outputs |  |
| Quality score | Pending Leader review |
| Reuse recommendation |  |
| Notes/lessons |  |
```

## ID Rules

- `PV-L-YYYYMMDD-###` for Leader-level records if ever needed.
- `PV-M-YYYYMMDD-###` for Sub-Managers.
- `PV-W-YYYYMMDD-###` for Workers and specialist agents.
- `PV-C-YYYYMMDD-###` for Converter Agent assignments if tracked separately.

