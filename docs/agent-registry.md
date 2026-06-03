# Agent Registry

### Progress Tracker Builder (Worker)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260602-001 |
| Tool agent ID | Codex worker session for this assignment |
| Nickname | Progress Tracker Builder |
| Role/type | Worker |
| Spawned by | Leader Agent in current thread |
| Date spawned | 2026-06-02 |
| Mission | Create an HTML progress tracker for the Shopify frontend component build list, and record worker traceability. |
| Skills/knowledge provided | Structured progress tracking, standalone HTML/CSS, UI state tracking, registry record formatting. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for future component build tracking templates; include visual review on any customer-facing HTML artifacts. |
| Notes/lessons | Use `<select>` per row for rapid manual status updates and add script-driven counts to keep the top summary accurate. |

### Design Foundation Worker (Task 1)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260602-002 |
| Tool agent ID | Codex worker session for this assignment |
| Nickname | Design Foundation Worker |
| Role/type | Worker |
| Spawned by | Leader Agent in current thread |
| Date spawned | 2026-06-02 |
| Mission | Implement the first component group from the Shopify frontend component tracker: Design System Foundation (colors, typography, spacing, buttons, form fields, icon affordances, badges/labels). |
| Skills/knowledge provided | Shopify theme architecture, base stylesheet tokens, component snippet conventions. |
| Files or domains touched | `assets/base.css`; `snippets/product-badges-styles.liquid`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `assets/base.css`; `snippets/product-badges-styles.liquid`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this foundation pattern for subsequent component group work; keep new utility classes under explicit foundation group in base.css before component-specific tweaks. |
| Notes/lessons | Task marked complete after conservative updates only to shared style layers; no page structure changes or behavior logic edits. |

### Aquinas (Worker)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260602-006 |
| Tool agent ID | 019e8b24-7988-7f02-9bb3-d163b72b64d2 |
| Nickname | Aquinas |
| Role/type | Worker - visual/design critique |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-02 |
| Mission | Critique the first static homepage mockup after Richard said it looked bad and produce concrete redesign instructions. |
| Skills/knowledge provided | Visual/design critique, homepage narrative review, frontend mockup direction, robotics/deep-tech positioning. |
| Files or domains touched | Read-only review of docs mockup and planning docs. |
| Status | Complete |
| Outputs | Critique identifying planning-language leakage, weak hero, card density, flat rhythm, washed-out palette, and concrete rebuild brief. |
| Quality score | 4/5 |
| Reuse recommendation | Reuse for fast visual critique before frontend rebuilds. |
| Notes/lessons | The critique correctly identified that the first mockup looked like a planning artifact rather than a homepage. |

### Herschel (Worker)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260602-007 |
| Tool agent ID | 019e8b24-7988-7f02-9bb3-d1837a6cbff5 |
| Nickname | Herschel |
| Role/type | Worker - static frontend mockup redesign |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-02 |
| Mission | Rebuild `docs/artly-homepage-quick-mockup.html` into a stronger Artly homepage concept using the critique and design principles. |
| Skills/knowledge provided | Static HTML/CSS redesign, robotics homepage narrative, responsive mockup production, print CSS, source-level QA. |
| Files or domains touched | `docs/artly-homepage-quick-mockup.html`; `docs/artly-homepage-design-principles-and-plan.md`; `docs/artly-homepage-design-principles-and-plan.html`. |
| Status | Complete |
| Outputs | Rewritten static homepage mockup with stronger hero, robotics workcell media panel, routing strip, Barista Bot section, learning loop, qualitative evidence, audience pathways, resources, platform pathways, and non-commerce footer. |
| Quality score | 3/5 |
| Reuse recommendation | Reuse for quick static rebuilds, but require actual browser/visual QA and real approved media before production translation. |
| Notes/lessons | Stronger than the first pass and removed visible planning/meta language; score held at 3 because local-file browser visual review was blocked and real imagery/assets are still missing. |

### Global Header Worker (Task 2)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260602-003 |
| Tool agent ID | Codex worker session for this assignment |
| Nickname | Global Header Worker |
| Role/type | Worker |
| Spawned by | Leader Agent in current thread |
| Date spawned | 2026-06-02 |
| Mission | Implement Task 2 from the Shopify frontend tracker: improve Global Header usability (logo, navigation, search affordance, cart icon, account link, mobile menu trigger/drawer affordance, focus/hover states, spacing, touch targets, responsive behavior) using existing theme patterns. |
| Skills/knowledge provided | Shopify theme architecture, header/menu/snippet conventions, accessibility and responsive interaction tuning, CSS/LCM. |
| Files or domains touched | `sections/header.liquid`; `blocks/_header-logo.liquid`; `snippets/header-actions.liquid`; `snippets/search.liquid`; `snippets/header-drawer.liquid`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `sections/header.liquid`; `blocks/_header-logo.liquid`; `snippets/header-actions.liquid`; `snippets/search.liquid`; `snippets/header-drawer.liquid`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse these patterns for any future header/menu touch-target refinements; keep to focused style adjustments before behavior edits. |
| Notes/lessons | Maintained existing navigation and menu logic while adding conservative accessibility and responsive interaction polish (focus/hover affordance, 44px targets, spacing/hit-area adjustments). |

### Announcement Bar Worker (Task 3)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-001 |
| Tool agent ID | Codex worker session for this assignment |
| Nickname | Announcement Bar Worker |
| Role/type | Worker |
| Spawned by | Leader Agent in current thread |
| Date spawned | 2026-06-03 |
| Mission | Implement the new/enhanced announcement bar feature in Shopify section/block editor controls: announcement text handling, optional countdown timer (date/time controls), and optional button controls. |
| Skills/knowledge provided | Shopify Liquid section/block schema, vanilla JS for countdown timers, scoped section CSS, header section architecture. |
| Files or domains touched | `blocks/_announcement.liquid`; `sections/header-announcements.liquid`; `assets/announcement-bar-countdown.js`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `blocks/_announcement.liquid`; `sections/header-announcements.liquid`; `assets/announcement-bar-countdown.js`; `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this pattern for any per-slide timed promotional content where countdown and CTA controls are needed in header/announcement contexts. |
| Notes/lessons | Timer is scoped to announcement blocks and updates per-instance with graceful no-op on blank/invalid settings; button/link now render independently of the legacy full-slide link. |

### Announcement Schema Hotfix Worker

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-002 |
| Tool agent ID | Codex worker session for this assignment |
| Nickname | Announcement Schema Hotfix Worker |
| Role/type | Worker |
| Spawned by | Leader Agent in current thread |
| Date spawned | 2026-06-03 |
| Mission | Fix Shopify schema upload failure by removing the blank default from `countdown_end_date` in the announcement block schema. |
| Skills/knowledge provided | Shopify section/block schema constraints and lightweight hotfix validation. |
| Files or domains touched | `blocks/_announcement.liquid`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `blocks/_announcement.liquid`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Omit empty defaults on text settings in block schemas when upload validation rejects blank values; keep label/info unchanged. |
| Notes/lessons | Kept announcement timer behavior intact and did not modify non-schema feature logic. |

### Workflow Loader (Worker)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-001 |
| Tool agent ID | 019e8f7a-183f-77a3-b3c6-f229ea58269d |
| Nickname | Workflow Loader |
| Role/type | Worker / workflow intake specialist |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Load the vault workflow for `C:\Artly\Artly-site-2026` without destructive changes. |
| Skills/knowledge provided | Targeted workflow file discovery, agent registry review, vault operating-procedure synthesis. |
| Files or domains touched | `AGENTS.md`; `docs/agent-registry.md`; targeted search for Command Center, roster, registry, workflow, and operating-procedure files. |
| Status | Complete |
| Outputs | Workflow summary returned to Leader; appended registry traceability record. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for future vault workflow intake, but assign a unique unused Vault ID before spawn. |
| Notes/lessons | Requested Vault ID already existed for Announcement Bar Worker; preserved that completed record and added this entry with an explicit collision risk for Leader review. |

### Shopify Plan Reviewer

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-003 |
| Tool agent ID | 019e8f7d-b429-7131-8c02-911c4ed271d2 |
| Nickname | Shopify Plan Reviewer |
| Role/type | Worker / plan review specialist |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Inspect `docs/shopify-frontend-component-progress.html` and produce a concise feasibility/coordination report without implementing Shopify/frontend tasks. |
| Skills/knowledge provided | Shopify frontend planning review, delegated team structuring, dependency/risk identification, acceptance-criteria synthesis. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | Feasibility/coordination report returned to Leader; appended registry traceability record. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for frontend implementation planning reviews and delegated Shopify theme work sequencing. |
| Notes/lessons | Requested Vault ID `PV-W-20260603-002` was already occupied by Announcement Schema Hotfix Worker, so this trace used next available ID `PV-W-20260603-003` and preserved the existing record. |

### Commerce Scope Cleanup

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-004 |
| Tool agent ID | 019e8f85-70ae-7222-8660-d9fb7aa58e20 |
| Nickname | Commerce Scope Cleanup |
| Role/type | Worker / plan editor |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Update the Shopify frontend component progress plan so it no longer includes selling-stage commerce components or purchase-oriented dependency language. |
| Skills/knowledge provided | Narrow HTML plan editing, component scope cleanup, non-commerce reframing, registry traceability. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | Removed commerce-only tracker rows, revised remaining component language to fit a non-selling site stage, and appended this registry trace. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for scope-cleanup passes where implementation trackers need to be narrowed before assigning build workers. |
| Notes/lessons | Preserved editorial/gallery, content search, testimonial, newsletter, footer, content, utility, and mobile work while removing purchase-flow tasks from the active plan. |

### Search Deferral Editor

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-005 |
| Tool agent ID | 019e8f89-c54d-7db2-9431-daf2c8cf1bfe |
| Nickname | Search Deferral Editor |
| Role/type | Worker / plan editor |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Update the frontend component progress plan to postpone Search Experience without removing it from the tracker. |
| Skills/knowledge provided | Narrow HTML plan editing, tracker status/count consistency, registry traceability. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | Search Experience marked Postponed, summary count added for postponed work, active not-started count reduced, and registry trace appended. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for narrow tracker status updates and component sequencing cleanup. |
| Notes/lessons | Treat postponed scope as distinct from active not-started work so Richard can keep it visible without assigning it to near-term implementation. |

### Wireframe Plan Mapper (Task)

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-006 |
| Tool agent ID | 019e8f8c-85c0-73e1-a075-f1fd505c3e21 |
| Nickname | Wireframe Plan Mapper |
| Role/type | Worker / visual-plan comparison analyst |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Compare the homepage wireframe image to the current frontend component plan and produce a section-by-section inventory, match list, and trace gaps. |
| Skills/knowledge provided | Wireframe interpretation, static artifact comparison, plan audit, registry traceability. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md`; `C:/Users/IWM1/Downloads/Homepage Wireframe.png` (read-only analysis) |
| Status | Complete |
| Outputs | Wireframe-to-plan section comparison report and registry trace entry. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this method for quick plan-wireframe alignment checks before adding implementation tasks. |
| Notes/lessons | Current frontend tracker already reflects non-commerce scope cleanup and Search Experience as Postponed; comparisons should treat commerce-only behavior as intentionally deferred. |

### Callout Bar Plan Editor

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-007 |
| Tool agent ID | 019e8f92-e6bc-7300-8b07-0a54e54d3346 |
| Nickname | Callout Bar Plan Editor |
| Role/type | Worker / plan editor |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Add a distinct homepage callout-band task to the frontend component progress plan while preserving the existing completed global Announcement Bar as a separate component. |
| Skills/knowledge provided | Plan editing, status/number consistency updates, scope separation tracking, registry documentation. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | Added "Homepage Callout Bar" as a new non-started active component row, preserved Announcement Bar completion and Search Experience postponement, and updated component totals/counts. |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this record style for narrow tracker modifications that add new scoped frontend tasks while keeping prior completed components intact. |
| Notes/lessons | Callout Bar and Announcement Bar are intentionally separate: header-level announcement behavior remains completed; below-hero callout remains active and non-commerce. |

### Wireframe Tracker Rebuilder

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-008 |
| Tool agent ID | 019e8f95-0a76-7e31-a9c6-fff2d041022f |
| Nickname | Wireframe Tracker Rebuilder |
| Role/type | Worker / progress HTML editor |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Rewrite `docs/shopify-frontend-component-progress.html` main tracker rows to match the homepage wireframe section order top-to-bottom, remove commerce and non-wireframe active items, and keep non-commerce scope.
| Skills/knowledge provided | HTML plan editing, tracker math/data-attribute maintenance, scope narrowing, wireframe-to-list alignment verification. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this template for wireframe-derived homepage tracker rewrites where the active list must follow visual section order. |
| Notes/lessons | Keep announcement/search out-of-scope items in short notes only when preserving separate implementation context is still useful. |

### Wireframe-Only Scope Cleaner

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-009 |
| Tool agent ID | 019e8f97-9d66-73d2-ab87-8805f377d36d |
| Nickname | Wireframe-Only Scope Cleaner |
| Role/type | Worker / progress HTML editor |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Make the homepage progress tracker strictly wireframe-only by removing out-of-wireframe tasks, notes, and references from active tracker output and preserving a 12-section wireframe sequence. |
| Skills/knowledge provided | Scope reconciliation against wireframe, HTML tracker minimization, status normalization, registry traceability. |
| Files or domains touched | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/shopify-frontend-component-progress.html`; `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this compact tracker format when wireframe alignment requires strict scope enforcement. |
| Notes/lessons | Keep component status static unless interactive editing is explicitly requested; remove deferred/out-of-scope explanatory text to avoid mixed scope signals. |

### Status Label Implementer

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-010 |
| Tool agent ID | 019e8f9a-14fa-7ea2-bbf2-40c3bfc01da0 |
| Nickname | Status Label Implementer |
| Role/type | Worker / status-label implementer |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Implement the status-label fix for tracker components and ensure labels are consistent with task states in the progress artifacts. |
| Skills/knowledge provided | Frontend tracker status mapping, label normalization, plan artifact consistency checks, registry recordkeeping. |
| Files or domains touched | `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this mapping-pattern check for future tracker status label adjustments. |
| Notes/lessons | Requested Vault ID was available and used directly. |

### Legend Mapping QA

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-011 |
| Tool agent ID | 019e8f9a-28cf-71f3-9b9a-b9bd37be2e32 |
| Nickname | Legend Mapping QA |
| Role/type | Worker / QA |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Validate that status labels and legend entries are aligned after the status-label fix and report any mismatches. |
| Skills/knowledge provided | Status/legend consistency QA, artifact review, traceability logging. |
| Files or domains touched | `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this QA pass when tracker legend text and status chips are changed together. |
| Notes/lessons | Requested Vault ID was available and used directly. |

### Wireframe Scope QA

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-012 |
| Tool agent ID | 019e8f9a-3cbd-7ba2-a6df-2e2397ccfaf4 |
| Nickname | Wireframe Scope QA |
| Role/type | Worker / QA |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Check whether the status-label fix preserved wireframe-only scope boundaries in the tracker references and related documentation records. |
| Skills/knowledge provided | Scope consistency QA, wireframe-alignment verification, status artifact review, registry traceability. |
| Files or domains touched | `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse this scope-safety check for rapid tracker edits tied to UI wireframe constraints. |
| Notes/lessons | Requested Vault ID was available and used directly. |

### Batch Registry Recorder

| Property | Value |
| --- | --- |
| Vault ID | PV-W-20260603-013 |
| Tool agent ID | 019e8f9a-50b2-7bd0-969b-088cab687c77 |
| Nickname | Batch Registry Recorder |
| Role/type | Worker / registry recorder |
| Spawned by | Leader Agent |
| Date spawned | 2026-06-03 |
| Mission | Record the four-agent batch for the status-label fix in the agent registry and preserve existing trace conventions. |
| Skills/knowledge provided | Registry formatting, trace record consistency, subagent metadata capture, collision-aware append-only maintenance. |
| Files or domains touched | `docs/agent-registry.md` |
| Status | Complete |
| Outputs | `docs/agent-registry.md` |
| Quality score | Pending Leader review |
| Reuse recommendation | Reuse for append-only registry capture of batch-style assignments. |
| Notes/lessons | Requested Vault ID was available and used directly. |
