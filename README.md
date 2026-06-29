# Artly Shopify Theme

This repo contains the local Shopify theme for the Artly site. It is based on Shopify Horizon, but this project is now Artly-specific: the homepage and custom sections position Artly as a commercial physical-AI robotics company with Barista Bot as the concrete specialty-coffee proof point.

The current site work is primarily brand, inquiry, demo, resource, and deployment storytelling. Commerce templates and Shopify product/cart infrastructure still exist in the theme for future use, but visible homepage work should stay focused on Artly, Barista Bot, resources, and contact/demo paths unless Richard approves a commerce launch.

## Local Shopify Preview

Run commands from the repo root:

```powershell
cd C:\Artly\Artly-site-2026
```

Authenticate if needed:

```powershell
shopify auth login
```

Check the configured theme environment:

```powershell
shopify theme info --path . --environment default
```

Start the local development preview:

```powershell
shopify theme dev --path . --environment default --port 9292 --open
```

Local preview URL:

```text
http://127.0.0.1:9292/
```

## Team Work Task Board Server

Start the local Team Work task board backend from the repo root:

```powershell
cd C:\Artly\Artly-site-2026
py ".\TEAM-WORK\02 Task Boards\task-board-server.py"
```

Task board URL:

```text
http://127.0.0.1:4177/task-board.html
```

Open the current development theme or editor after a dev theme exists:

```powershell
shopify theme open --development --path .
shopify theme open --development --editor --path .
```

## Useful Theme Commands

Validate Liquid, schema, and theme rules:

```powershell
shopify theme check --path .
```

List remote themes connected to the configured store:

```powershell
shopify theme list --path . --environment default
```

Conservative manual upload to the development theme:

```powershell
shopify theme push --development --path . --nodelete
```

Use `git status --short` before and after theme work. `shopify theme dev` uploads the local folder to a remote development theme and hot-reloads local changes while it is running. Avoid `--publish`, `--live`, `--allow-live`, destructive theme commands, and token/password flags unless Richard explicitly approves the action.

Do not commit Admin API tokens, Theme Access passwords, private preview links, customer data, or Shopify account credentials.

## Art Direction Reference

Primary source: [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md). Supporting homepage planning: [docs/artly-homepage-design-principles-and-plan.md](docs/artly-homepage-design-principles-and-plan.md).

Artly's direction is **Precision Hospitality**: advanced robotics made warm, useful, and commercially credible. The site should feel like a real service business powered by robotics, not a generic AI startup, consumer gadget page, or dark sci-fi robot brand.

Use real-world deployment credibility, specialty coffee robotics, clean commercial UI, product-first headlines, restrained motion, and proof near major claims. Favor warm hospitality neutrals, coffee tones, stainless steel gray, soft black, and one precise technology accent. Avoid purple AI gradients, beige-heavy lifestyle styling, decorative blobs/orbs, generic SaaS blue, unsupported "revolutionary" claims, and overly futuristic visuals.

Typography standard: Work Sans is the body/UI font; Space Grotesk is the heading, display, and accent font. The Shopify theme should express this through theme font settings rather than local hardcoded CSS where possible.

Header visual reference: use a soft-metal or translucent glass header shell with a compact logo capsule, rounded pill navigation, and a right-side utility/action capsule. Navigation and utility labels use Work Sans; Artly brand/display moments use Space Grotesk.

Key homepage files to inspect when matching the current direction:

- `templates/index.json`
- `sections/platform-overview.liquid`
- `sections/barista-bot-feature.liquid`
- `sections/capability-proof-tiles.liquid`
- `sections/overview-media.liquid`
- `sections/featured-content-resources.liquid`
- `sections/news-and-press.liquid`
- `sections/closing-audience-resource-tiles.liquid`
