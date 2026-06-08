# RC Shopify Taskboard

- Visual board: [agent-task-board.html](agent-task-board.html)
- Local storefront command: `shopify theme dev --path . --environment default --port 9292 --open`
- Last updated: 2026-06-08
- Board type: Static local board, not connected to Trello or any external service.
- Primary use: Track delegated sub-agent work across To Do, Pending / Claimed, Review, Done, and Blocked lanes.
- Related historical tracker: [homepage-layout-delivery-whiteboard.md](homepage-layout-delivery-whiteboard.md)

## Workflow

1. New tasks start in `To Do` with a readable title, compact description, files/domains, acceptance criteria, and latest update.
2. A delegated sub-agent claims a card by adding a simple owner/agent line, then moves the card to `Pending / Claimed`.
3. The sub-agent keeps the latest update current while work is active.
4. When execution is complete, the sub-agent moves the card to `Review` and lists concise outputs plus verification performed.
5. The Leader moves the card to `Done` only after review.
6. Cards move to `Blocked` when missing approvals, missing information, runtime failures, or sensitive/irreversible decisions stop progress.

## How Agents Update This Board

- Claim from `To Do` only when assigned or clearly authorized by the Leader.
- Move claimed work to `Pending / Claimed` and include a real owner/agent line plus files/domains.
- Move completed work to `Review`; do not self-approve into `Done`.
- Leader moves reviewed work to `Done`.
- Use `Blocked` for missing approval, missing source material, failed preview/runtime gates, or scope conflict.
- Keep card details compact. Store full registry-only details in `../03 Agent Registry/agent-registry.md`, not on the visible board cards.
- Keep `../03 Agent Registry/agent-registry.md` aligned with any new worker record.

## Current Cards

These cards track the current Shopify storefront redesign direction from the 2026-06-08 live visual inspection.

### To Do

#### Redesign Homepage First View

- Description: Rebuild the first viewport around strong robot/coffee/service media, clear product-first headline, and premium commercial credibility.
- Files/domains: `templates/index.json`, hero/header sections, approved media assets
- Acceptance criteria: First viewport passes the five-second test: visitors understand Artly is a real robotic coffee system for commercial spaces.
- Latest update: Current hero uses generic illustration art and does not immediately prove a real robotic coffee system.

#### Replace Placeholder Illustration With Real Artly Media

- Description: Swap generic illustrated scenery and tiny placeholder thumbnails for approved robot, coffee, deployment, or product media.
- Files/domains: Shopify files/media, `templates/index.json`, homepage media settings
- Acceptance criteria: Each major section uses real Artly media or a documented approved placeholder; no generic AI art, scenic filler, or empty thumbnail boxes remain.
- Latest update: Browser inspection found no real image elements and multiple placeholder/illustration treatments carrying the page.

#### Redesign Capability Proof Cards

- Description: Rework the proof tiles into a credible robotics proof system instead of generic outlined cards with mismatched icons and unsupported stats.
- Files/domains: `sections/capability-proof-tiles.liquid`, `blocks/capability-proof-tile.liquid`, proof copy/assets
- Acceptance criteria: Proof cards show concrete deployment evidence, consistent icon/media language, substantiated metrics, and polished responsive spacing.
- Latest update: Live inspection shows generic card boxes, weak icon language, and stats that need evidence/context.

#### Redesign Trust, Resources, and Press Modules

- Description: Replace placeholder logos and generic article cards with a designed credibility system.
- Files/domains: `sections/trusted-by-logo-strip.liquid`, `sections/featured-content-resources.liquid`, `sections/news-and-press.liquid`, related blocks/assets
- Acceptance criteria: Trust, resource, and press sections use approved logos, real thumbnails or intentional editorial layout, consistent card sizing, and credible source/date treatment.
- Latest update: Current view shows "Trusted Brand" placeholders, faint thumbnail boxes, and oversized text cards.

#### Redesign Footer and Lead Capture

- Description: Bring the footer into the new Artly style and make the newsletter/contact area feel intentional.
- Files/domains: `sections/footer-group.json`, footer sections/snippets, newsletter form settings
- Acceptance criteria: Footer supports Company, Solutions, Resources, contact/demo paths, clean newsletter styling, and no leftover starter-theme or commerce language.
- Latest update: Current footer is closer than the body but still reads like a large starter-theme block with weak navigation detail.

### Pending / Claimed

No cards currently claimed.

### Review

#### Define New Artly Site Style System

- Owner/agent: Artly Style System Worker
- Description: Create a complete visual direction for the site instead of patching the current weak styling.
- Files/domains: `docs/artly-site-style-system.md`, `DESIGN_PRINCIPLES.md`, `docs/artly-homepage-design-principles-and-plan.md`, homepage theme sections
- Acceptance criteria: A concise design direction doc defines layout, color, typography, media style, component rules, and examples for the new Artly Shopify site.
- Latest update: Completed style system doc; ready for Leader/Richard review.

#### Create High-Fidelity Homepage Mockup

- Owner/agent: Homepage Mockup Worker
- Description: Produce a visual mockup before touching theme sections so the new site has an approved design target.
- Files/domains: `docs/artly-homepage-redesign-mockup.html`, homepage screenshots, `DESIGN_PRINCIPLES.md`
- Acceptance criteria: Mockup shows desktop and mobile first view, section rhythm, header, CTAs, media treatment, trust/resources, and footer direction.
- Latest update: Completed standalone high-fidelity homepage mockup; ready for Leader/Richard review.

#### Rebuild Header and Navigation Chrome

- Owner/agent: Header Navigation Worker
- Description: Replace starter-theme chrome with a premium Artly header that supports the redesign and removes commerce/store noise.
- Files/domains: `docs/header-navigation-redesign-plan.md`, `sections/header-group.json`, header snippets/sections
- Acceptance criteria: Header removes "Welcome to our store", cart/account affordances unless approved, duplicate brand rendering, and generic nav labels; final nav matches Artly buyer paths.
- Latest update: Completed header/navigation redesign plan; ready for Leader/Richard review.

#### Collect Real Artly Visual Assets

- Owner/agent: Visual Asset Audit Worker
- Description: Identify approved robot, coffee, deployment, logo, press, and resource imagery needed to make the redesign real.
- Files/domains: `docs/artly-visual-asset-inventory.md`, asset folders, Shopify files/media, homepage section settings
- Acceptance criteria: Each major section has an approved visual asset or a documented placeholder plan; no generic AI imagery or decorative filler.
- Latest update: Completed visual asset inventory and request list; ready for Leader/Richard review.

#### Rebuild Homepage Section Design Language

- Owner/agent: Section Language Worker
- Description: Redesign the rest of the homepage sections so they feel like one coherent premium robotics/service site, not disconnected Shopify blocks.
- Files/domains: `docs/homepage-section-redesign-plan.md`, `sections/platform-overview.liquid`, `sections/capability-proof-tiles.liquid`, `sections/barista-bot-feature.liquid`, `sections/featured-content-resources.liquid`, `sections/news-and-press.liquid`, `sections/closing-audience-resource-tiles.liquid`
- Acceptance criteria: Sections share a unified spacing system, visual rhythm, media treatment, CTA style, and responsive behavior.
- Latest update: Completed section-by-section redesign plan; ready for Leader/Richard review.

### Done

#### Create Trello-Style Local RC Shopify Taskboard

- Owner/agent: Task Board Visualizer Worker
- Description: Built the static local board and simplified the visible cards for Richard's day-to-day use.
- Files/domains: `docs/agent-task-board.md`, `docs/agent-task-board.html`, `docs/agent-registry.md`
- Acceptance criteria: Static local HTML board includes five kanban lanes, lane counts, clean cards, compact file/domain references, latest updates, responsive layout, and no external dependencies.
- Latest update: Leader reviewed the local Trello-style board; static validation passed and the board is ready for use.

#### README Store Docs Worker

- Owner/agent: README Store Docs Worker
- Description: Reworked the README into practical store/theme operator notes.
- Files/domains: `README.md`, `docs/agent-registry.md`
- Acceptance criteria: README contains practical local Shopify theme commands and concise Artly design references.
- Latest update: Completed; pending Leader quality score in registry.

#### Recover Shopify Local Preview

- Description: Local storefront visual inspection is unblocked after connecting the project to the working Shopify store.
- Files/domains: `shopify.theme.toml`, `README.md`, `http://127.0.0.1:9292/`
- Acceptance criteria: `shopify theme dev --path . --environment default --port 9292 --open` starts successfully, connects to `kpdtdw-1m.myshopify.com`, and `http://127.0.0.1:9292/` returns HTTP 200 with a usable storefront page.
- Latest update: 2026-06-08: Connected project to kpdtdw-1m.myshopify.com; local preview is running at http://127.0.0.1:9292/ and returns HTTP 200.

### Blocked

No cards currently blocked.
