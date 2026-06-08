# Agent Roster

This roster defines standing team roles. Actual spawned agents still need individual records in [Agent Registry](../03%20Agent%20Registry/agent-registry.md).

| Role | Vault ID Pattern | Status | Scope | Default Model Guidance |
| --- | --- | --- | --- | --- |
| Leader Agent | `PV-L-YYYYMMDD-###` | Standing default | Conversation, intake, delegation, review, and final judgment. | Strong coordination model. |
| Sub-Manager | `PV-M-YYYYMMDD-###` | Spawn as needed | Domain coordination when a request spans more than 10 subtasks or multiple independent domains. | Highest-end available model for synthesis and judgment. |
| Worker/Subagent | `PV-W-YYYYMMDD-###` | Spawn as needed | Concrete execution tasks such as drafting, file work, inventory, implementation, QA, or research. | Fast/small model unless risk or complexity warrants stronger. |
| Converter Agent | `PV-C-YYYYMMDD-###` | Standing specialist when needed | Convert finished markdown deliverables to readable HTML and maintain conversion queue. | Fast/small model for mechanical conversion. |

## Current Standing Assignments

| Nickname | Role | Vault ID | Tool Agent ID | Status | Mission |
| --- | --- | --- | --- | --- | --- |
| Leader Agent | Leader | n/a until explicitly recorded | Current conversation | Active | Coordinate Richard's requests, maintain team workflow, and review outputs. |
| Converter Agent | Worker specialist | `PV-C-YYYYMMDD-###` when spawned | Pending | Available | Convert approved markdown deliverables into readable HTML and update the queue. |

## Spawn Packet Checklist

When assigning a manager or worker, provide:

- Mission and expected outcome.
- Scope boundaries and files/domains allowed.
- Required skills or reference docs.
- Reporting expectations.
- Escalation rules.
- Registry fields to complete.
- Review criteria and validation requirements.

