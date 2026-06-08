# Header Navigation Redesign Plan

Vault ID: PV-W-20260608-003
Task: Rebuild Header and Navigation Chrome
Date: 2026-06-08
Owner: Header Navigation Worker

## Goal

Rebuild the Artly header so it reads as a commercial robotics site, not a default Shopify storefront. The header should support the Precision Hospitality direction: clear Artly brand presence, practical buyer navigation, restrained chrome, and direct demo/contact paths.

This is a plan/spec pass only. No theme implementation files were changed.

Style direction to carry into implementation: use a glassy, soft-metal header bar with rounded pill navigation controls, a small logo capsule on the left, and a compact right-side icon/action capsule. Navigation text should use Work Sans. The Artly wordmark, brand display text, and short product/display accents can use Space Grotesk.

## Current Observations

- The visible header still shows the stock announcement text `Welcome to our store`.
- The visual inspection screenshot shows generic storefront navigation: `Robot`, `Models`, `Event`, `About`.
- The header shows account and cart icons even though the project README says visible homepage work should focus on Artly, Barista Bot, resources, and contact/demo paths unless commerce is approved.
- The brand currently reads as `Artly Barista Bot` in the header. That makes Barista Bot feel like the whole company and can duplicate brand/product naming when the hero also carries Artly or Barista Bot language.
- `sections/header-group.json` enables the announcement bar, configures the primary header as sticky `always`, has search off, and has country/language settings on.
- The active Horizon header architecture captures logo, menu, localization, search, drawer search, and actions in `sections/header.liquid`, lays them out through `snippets/header-row.liquid`, renders menu/drawer variants through `blocks/_header-menu.liquid`, and renders account/cart through `snippets/header-actions.liquid`.

## What To Remove

- Remove the `Welcome to our store` announcement bar from the launch header. Do not replace it with another generic announcement.
- Remove account affordances unless Richard explicitly approves customer account workflows for this redesign.
- Remove cart affordances unless Richard explicitly approves visible commerce for this redesign.
- Remove duplicate brand rendering. Use one primary Artly brand mark in the header. Treat Barista Bot as a product or solution label in navigation or page content, not as a second competing brand mark.
- Replace generic menu labels like `Robot`, `Models`, `Event`, and `About` with buyer-oriented labels that map to Artly's actual story and next actions.
- Keep search hidden unless a resource library or sizable content index is ready.
- Hide language/country selectors for this launch unless localization is intentionally supported.

## Proposed Header Structure

Desktop, 750px and wider:

- Single sticky header row, 64-72px tall, presented as a rounded translucent or soft-metal pill bar rather than a default rectangular store header.
- Left: Artly logo or wordmark linking to the home page, held in a small logo capsule.
- Center/right main nav:
  - `Barista Bot`
  - `How It Works`
  - `Use Cases`
  - `Resources`
  - `Company`
- Far right CTA group:
  - Primary CTA: `Book a Demo`
  - Optional secondary text link: `Contact`
- Far-right utility/action treatment: compact icon or CTA capsule only. Do not reintroduce cart/account/search icons unless approved.

Preferred desktop order:

```text
Artly | Barista Bot | How It Works | Use Cases | Resources | Company | Contact | Book a Demo
```

The primary CTA should visually read as the one decisive action. `Contact` can be a quieter text link if there is room. If the header feels crowded at intermediate widths, keep `Book a Demo` and move `Contact` into the mobile drawer or overflow.

Mobile, below 750px:

- Left: menu button.
- Center or left after menu: Artly logo. Prefer left-aligned logo if the row remains balanced; center only if the existing Horizon drawer structure makes that more robust.
- Right: `Book a Demo` CTA if it fits without crowding. If not, place the CTA as the first prominent action inside the drawer.
- Drawer content order:
  - `Book a Demo` as the first high-emphasis action.
  - `Barista Bot`
  - `How It Works`
  - `Use Cases`
  - `Resources`
  - `Company`
  - `Contact`
- Drawer should be full-height or near full-height, clean, and practical. Avoid ecommerce utility links unless approved.

## Navigation Labels And Intent

- Typography: set nav labels, drawer links, and CTA text in Work Sans for operational clarity. Use Space Grotesk only for the Artly wordmark, product/display labels, or very short accent text.
- Nav item treatment: use rounded pill controls with soft borders and a restrained active/focus state. Keep them compact enough to avoid a marketing-heavy or oversized pill bar.
- `Barista Bot`: product proof point and specialty coffee robotics page or anchored section.
- `How It Works`: system explanation: configure, deploy, serve, monitor/support.
- `Use Cases`: commercial buyers such as corporate campuses, hospitality, retail, events, universities, and transit.
- `Resources`: press, articles, deployment proof, or buyer education.
- `Company`: company story, operational credibility, team, and broader physical AI positioning.
- `Book a Demo`: primary conversion path.
- `Contact`: secondary inquiry path for partnerships, press, or general questions.

Avoid `Models` unless there are multiple current product model pages. Avoid `Event` unless it is specifically an events solution page, in which case use `Events` under `Use Cases` or as a child item.

## Sticky Behavior

- Keep sticky behavior, but prefer a calm business header over a disappearing header.
- Recommended setting: sticky `always`.
- Desktop sticky state should use a subtle solid or translucent background with a light border or shadow only after scroll.
- Mobile sticky state should remain visible while scrolling because the primary task is demo/contact navigation.
- Do not add aggressive hide-on-scroll behavior unless visual QA shows the header blocks key hero content.

Existing support:

- `sections/header.liquid` maps `enable_sticky_header` to the `sticky` attribute.
- `assets/header.js` manages `data-sticky-state` and scroll direction for `header-component`.
- Implementation should reuse this existing behavior where possible.

## Transparency And Background Rules

- Default header background: warm white or light neutral, solid enough to keep nav legible.
- Preferred material: translucent glass over brushed alloy/porcelain, with subtle blur, soft border, and no heavy shadow.
- Homepage hero option: transparent at top only if the hero media supports strong contrast. On hover, focus, drawer open, menu open, or sticky active state, the header must become solid.
- If the hero remains image-heavy or dark, a transparent home header can work with the inverse logo. If the hero is light or mixed contrast, keep the header solid.
- Non-home pages should use a solid background by default.
- Use a restrained bottom border or hairline divider instead of heavy shadows.
- Avoid purple/blue AI gradients, decorative effects, and oversized or novelty pill treatments.

Recommended launch default:

- `enable_transparent_header_home`: false until the final home hero mockup is confirmed.
- `enable_sticky_header`: `always`.
- One color scheme for the header top row.
- No second navigation-bar row unless a future mobile horizontal nav is intentionally designed.

## Shopify Files Likely Involved Next

- `sections/header-group.json`: remove or disable the announcement bar; update header settings for sticky, transparency, localization, search, and action placement.
- `sections/header.liquid`: add or expose a clean CTA slot if the current actions system cannot represent `Book a Demo` without cart/account output.
- `snippets/header-row.liquid`: likely keep as-is unless layout order needs a dedicated CTA column.
- `blocks/_header-logo.liquid`: ensure only one Artly brand mark renders, with inverse logo support if transparent header is used.
- `blocks/_header-menu.liquid`: keep for desktop menu and mobile drawer variants; adjust styling only if needed for Artly nav density and active states.
- `snippets/header-drawer.liquid`: remove ecommerce utility links if present and add drawer CTA treatment if the CTA is not handled by the menu itself.
- `snippets/header-actions.liquid`: suppress account/cart outputs behind explicit theme settings or replace with approved Artly CTA rendering. This is the main risk area because account/cart can render based on shop settings, not just visual header settings.
- `assets/header.js`: likely reuse. Only touch if sticky/transparent state behavior needs adjustment after visual QA.
- `assets/header-menu.js` and `assets/header-drawer.js`: likely reuse. Only touch for interaction bugs or drawer behavior changes.
- Navigation setup in Shopify admin or menu data: update `main-menu` items to the proposed labels and URLs/anchors.

## Implementation Checklist For Next Worker

1. Confirm final destination URLs or anchors for `Barista Bot`, `How It Works`, `Use Cases`, `Resources`, `Company`, `Contact`, and `Book a Demo`.
2. Remove the announcement section or replace it only with an approved Artly-specific announcement.
3. Update the main menu labels away from generic storefront terms.
4. Ensure the header renders exactly one Artly logo/brand mark.
5. Hide account, cart, search, country, and language affordances unless explicitly approved.
6. Add or configure the `Book a Demo` CTA in desktop and mobile header states.
7. Keep sticky `always`; use solid background on sticky active state.
8. Decide whether transparent home header is allowed after reviewing the final hero mockup.
9. Run `shopify theme check --path .` after Liquid changes.
10. Run visual QA at desktop, tablet, and mobile widths, including top of page, scrolled state, drawer open state, keyboard focus, and reduced motion.

## Open Decisions

- Final URL targets for `Book a Demo`, `Contact`, and each main nav label.
- Whether `Resources` is live enough to show in primary nav now.
- Whether the launch should ever show account/cart affordances before commerce is approved.
- Whether the final hero media supports a transparent homepage header.
