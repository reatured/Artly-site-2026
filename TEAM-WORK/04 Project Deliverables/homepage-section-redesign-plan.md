# Homepage Section Redesign Plan

Worker: PV-W-20260608-005 - Section Language Worker
Date: 2026-06-08
Scope: Design and implementation planning only. No theme implementation files are edited in this pass.

## Purpose

The current homepage has the right ingredients, but the sections still read as separate Shopify blocks. The redesign should make the page feel like one premium robotics/service story:

1. Artly is a real commercial robotic coffee/service system.
2. The platform turns expert teaching and field data into dependable deployment.
3. Barista Bot is the concrete proof point.
4. Trust, resources, news, and the footer should support the same conversion path instead of starting new visual systems.

The design language should follow `DESIGN_PRINCIPLES.md`: Precision Hospitality, real robot/service media, warm commercial credibility, grounded proof, restrained motion, no generic AI gradients, no decorative blobs, and no commerce-forward UI.

## Current Page-Level Problems

- Real service evidence is not carrying the page. Several sections use placeholder illustration or placeholder card media, so the site feels closer to a theme mockup than a robotics/service business.
- Repeated two-column media sections do not have distinct jobs. Platform overview, overview media, and Barista Bot all use similar scale and spacing, which weakens the narrative.
- Card systems are disconnected. Capability proof, resources, news, and closing tiles all become bordered grids with different copy density but similar behavior.
- Trust logos are isolated and still use placeholder brand text, so the trust section creates skepticism instead of reducing risk.
- The lower page has too much visual weight from large headings and repeated 4-column grids. Resources and news compete with each other instead of forming one editorial/newsroom system.
- The closing tiles do not bridge into the footer. The dark footer starts abruptly and feels like a separate site module.

## Unified Section Language

Use one homepage system across sections:

- **Evidence-first content:** Every major claim should sit near a proof cue: media, metric, customer/partner/logo, press item, or concrete operating detail.
- **Consistent section bands:** Alternate between clean light, quiet tinted, and selective dark/media bands. Do not use a new surface treatment for every section.
- **One card grammar:** Cards use 8px radius max, restrained borders, consistent padding, and clear hierarchy. Avoid nested cards and overly decorative shadows.
- **Real media as the hero element:** Replace repeated placeholder illustration with approved robot, coffee, operator, and deployment assets. If an asset is not approved, keep a clear content requirement rather than styling around the placeholder.
- **CTA hierarchy:** Use `Book a Demo` for high-intent conversion moments. Use `Explore the Platform`, `Learn More`, or article-specific links for lower-intent paths. Avoid multiple primary buttons in adjacent sections.
- **Typography rhythm:** Use Work Sans for body/UI/nav/buttons/forms and Space Grotesk for H1-H4, product/display titles, strong labels, and short accent text. H2 headings should be shorter, more concrete, and visually scaled to the section. Lower-page headings should not compete with the hero.
- **Footer bridge:** The final closing section should prepare visitors for footer routes and newsletter signup, not repeat proof-grid styling.

## Recommended Page Flow

Keep the existing order for now, but redesign the language so each section has a distinct role:

1. Hero and callout bar: initial positioning and conversion prompt.
2. Platform overview: what Artly is and how the platform works.
3. Capability proof: compact operational evidence.
4. Overview media: proof reel or deployment walkthrough.
5. Barista Bot: concrete product/service proof.
6. Trust logos: quiet credibility support.
7. Resources and news/press: combined learning and validation area.
8. Closing tiles: route visitors by intent.
9. Footer: utility, newsletter, and persistent routing.

## Section Plans

### Platform Overview

Current visual problem:
- `sections/platform-overview.liquid` renders a large two-column block, but the current media is placeholder-style illustration and repeats the hero visual language.
- Copy is long, abstract, and mission-heavy. It says "physical AI platform" but does not quickly explain the service workflow.
- The proof microcopy reads as a notes row rather than an integrated evidence cue.
- CTAs are present but the section does not visually connect into the proof cards below.

Target redesign behavior:
- Reframe as "How Artly works" or "The platform behind dependable service." Use concrete steps: teach, configure, deploy, monitor, improve.
- Use real robot/service media or a high-quality still from the approved proof reel. If media is unavailable, hold a clear launch blocker rather than styling the placeholder as final.
- Add a compact evidence rail below the body or beside the copy: `Expert-taught tasks`, `Field deployment feedback`, `Hardware-ready execution`.
- Keep primary CTA lower pressure unless the hero/callout already used `Book a Demo`; recommended pair is `Explore the Platform` plus `Talk to an Expert`.
- Visually hand off to proof cards by sharing section spacing, accent rules, and proof terminology.

Files likely involved in future build:
- `sections/platform-overview.liquid`
- `templates/index.json`
- Optional shared CSS variables in `assets/base.css` if the same homepage section tokens are centralized

Acceptance checks:
- [ ] The section explains what Artly does in plain operational language within the heading and first paragraph.
- [ ] Media shows real Artly robot/service/deployment context, not generic illustration.
- [ ] Body copy is reduced to 1-2 short paragraphs with max readable width.
- [ ] Evidence cues are styled as part of the section, not as a raw notes sentence.
- [ ] Desktop reads as media plus content; mobile stacks without CTA overflow.
- [ ] No unsupported numeric claim appears unless source and approval are documented.

### Capability Proof Cards

Current visual problem:
- `sections/capability-proof-tiles.liquid` and `blocks/capability-proof-tile.liquid` create a basic four-card grid with generic icons and long paragraphs.
- The current cards look like independent feature cards rather than proof tied to the preceding overview.
- The note "Update numbers and links as proof assets are approved" is still visible as production-like copy.
- Stats such as `30 minute setup` and `1.2M+ logged actions` need substantiation before final publication.

Target redesign behavior:
- Treat this section as a compact evidence strip, not a second intro section.
- Use short proof labels and tightly edited support copy. Suggested card structure: label, one-line claim, proof value, source/context link where available.
- Reduce icon emphasis. If icons remain, keep them small and consistent; prioritize numbers, source labels, and operating details.
- Remove production-visible internal notes. If claims are pending, use conservative non-numeric wording until approved.
- Consider a 2x2 desktop grid or four horizontal evidence modules depending on final content length. The goal is scan speed.

Files likely involved in future build:
- `sections/capability-proof-tiles.liquid`
- `blocks/capability-proof-tile.liquid`
- `templates/index.json`

Acceptance checks:
- [ ] Four cards are scannable in under 10 seconds.
- [ ] No internal approval note renders to visitors.
- [ ] All numeric claims have approved source/context or are replaced with non-numeric claims.
- [ ] Card heights align without large empty gaps.
- [ ] Mobile layout avoids long vertical walls of text.
- [ ] Visual treatment matches the same card grammar later used for closing tiles, while still feeling like proof rather than navigation.

### Overview Media

Current visual problem:
- `sections/overview-media.liquid` is intended to prove deployment with media, but the current screenshot shows a large repeated illustration with dark overlay and floating CTAs.
- The section competes with the hero and platform overview instead of adding new evidence.
- The video/poster state is not credible if the asset is missing; hidden or low-contrast content can make the section feel broken.

Target redesign behavior:
- Turn this into a proof reel or deployment walkthrough band.
- Use one strong approved video/poster showing real work: setup, calibration, order/service flow, pickup, or support monitoring.
- Add a visible caption panel or lower caption row with 2-3 concrete observations from the clip. Do not rely on floating buttons alone.
- If autoplay is used, keep it muted, slow, and respectful of reduced motion. Prefer visible controls for proof media.
- Keep the band visually distinct from the hero: less cinematic, more documentary and operational.

Files likely involved in future build:
- `sections/overview-media.liquid`
- `templates/index.json`
- Optional media handling/shared video styles in `assets/base.css`

Acceptance checks:
- [ ] Media asset is real, approved, and not a repeat of the hero placeholder.
- [ ] Poster image appears before playback and is not blank.
- [ ] Caption or adjacent copy explains what the viewer is seeing.
- [ ] Controls, alt/metadata, captions/transcript path, and reduced-motion behavior are accounted for.
- [ ] Mobile preserves a stable aspect ratio and does not hide the caption.
- [ ] CTA count is restrained; proof viewing should not fight with `Book a Demo`.

### Barista Bot Feature

Current visual problem:
- `sections/barista-bot-feature.liquid` is structurally close to `platform-overview.liquid`, so Barista Bot does not yet feel like the concrete proof anchor.
- Current media can repeat the same placeholder illustration, which weakens the product/service reality.
- The section lists useful details in paragraph form but does not surface the buyer-relevant proof points: footprint, autonomous operation, cleaning, calibration, support, and service consistency.

Target redesign behavior:
- Make Barista Bot the product/service proof moment: warmer, closer, and more tangible than the platform sections.
- Use real robot/coffee/customer media. Product detail should be visible, not abstract.
- Add a small specs or operating-details module: `4x5 footprint`, `Self-cleaning components`, `Automatic calibration`, `Commercial service support` if approved.
- Use hospitality cues without becoming lifestyle-heavy: coffee preparation, pickup, staff/customer interaction, clean counter environment.
- CTA hierarchy: `Book a Demo` primary, `Explore Barista Bot` or `Learn More` secondary.

Files likely involved in future build:
- `sections/barista-bot-feature.liquid`
- `templates/index.json`
- Possible schema addition for feature chips/spec rows

Acceptance checks:
- [ ] Section is visually distinct from platform overview and overview media.
- [ ] Real Barista Bot media is present and correctly cropped on desktop and mobile.
- [ ] Buyer-relevant details are surfaced as structured specs or chips, not buried in a long paragraph.
- [ ] `Book a Demo` is the only primary CTA in this section.
- [ ] Copy avoids unsupported superlatives unless approved.
- [ ] Mobile order keeps media, headline, specs, and CTA understandable without excessive scroll.

### Trust Logos

Current visual problem:
- `sections/trusted-by-logo-strip.liquid` currently renders placeholder labels like `Trusted Brand 1`.
- The `Trusted By` heading is oversized relative to the credibility value of the content.
- The logo strip feels disconnected between Barista Bot and resources.

Target redesign behavior:
- Make this a quiet credibility band, not a loud section.
- Use approved customer, partner, press, or venue logos only. If approvals are not ready, hide the logo strip or replace with a conservative proof statement.
- Reduce heading scale and use specific language such as `Trusted by teams deploying service robotics` only if accurate.
- Keep logos monochrome or visually normalized for premium consistency.
- Place near Barista Bot as supporting proof, or merge with press/resources if logo inventory is thin.

Files likely involved in future build:
- `sections/trusted-by-logo-strip.liquid`
- `blocks/trusted-by-logo.liquid`
- `templates/index.json`

Acceptance checks:
- [ ] No placeholder brand names render.
- [ ] Every logo has permission, alt text, and correct link behavior.
- [ ] Desktop alignment is balanced without over-large heading treatment.
- [ ] Mobile scroll is smooth, accessible, and does not trap focus.
- [ ] If fewer than 3 approved logos exist, the section is hidden or reframed.
- [ ] Logo styling does not introduce a new palette or card style.

### Featured Resources

Current visual problem:
- `sections/featured-content-resources.liquid` renders a four-column grid with placeholder images and large card titles.
- It looks like a generic blog grid and repeats the visual behavior of News & Press.
- The section headline is large compared with the value of the content, and thumbnails do not communicate robotics/service credibility.

Target redesign behavior:
- Convert into a curated learning section for early-stage visitors: "Learn how Artly deploys service robotics" or similar.
- Use one featured resource plus 2-3 supporting links if possible, instead of four equal cards.
- Use real thumbnails or clean editorial stills tied to the article topic. Do not ship placeholder images.
- Keep card titles tight and practical. Make the resource type clear: guide, field note, explainer, deployment note.
- On mobile, prefer a vertical list or carousel only if card width and controls are polished.

Files likely involved in future build:
- `sections/featured-content-resources.liquid`
- `snippets/resource-list.liquid`
- `snippets/resource-card.liquid` if shared behavior is needed
- `templates/index.json`

Acceptance checks:
- [ ] No placeholder media renders in final homepage state.
- [ ] Each resource has a valid link, image alt text, and useful CTA label.
- [ ] Section heading scale is lower than core platform/product sections.
- [ ] Cards use the unified card grammar and do not feel like a separate blog template.
- [ ] Mobile layout has no horizontal clipping or awkward carousel controls.
- [ ] Content supports Artly's deployment/service story, not generic AI thought leadership.

### News & Press

Current visual problem:
- `sections/news-and-press.liquid` repeats the resource grid pattern, which makes the lower page feel redundant.
- Card metadata wraps awkwardly with pipe separators and takes too much vertical space.
- Some cards have no visible media or link context, so the section reads like filler rather than external validation.

Target redesign behavior:
- Recast as a compact validation rail or newsroom module paired with resources.
- Make external validation clear: source, category, date, and link should be concise and credible.
- Use smaller cards than resources, or make one lead story with a list of three updates.
- Replace pipe-heavy metadata with badges or a clean inline meta line.
- If items are internal updates rather than third-party press, label them honestly as field notes or announcements.

Files likely involved in future build:
- `sections/news-and-press.liquid`
- `templates/index.json`
- Optional shared card/meta CSS if resources/news use a combined editorial system

Acceptance checks:
- [ ] Four items have approved title, source, date, excerpt, and destination.
- [ ] Third-party press is not implied for internal updates.
- [ ] Metadata wraps cleanly on mobile and desktop.
- [ ] Section visually complements resources instead of duplicating it.
- [ ] `More Resources` or equivalent CTA appears once and has a valid link.
- [ ] News cards remain readable without relying on placeholder media.

### Closing Audience Resource Tiles

Current visual problem:
- `sections/closing-audience-resource-tiles.liquid` and `blocks/closing-audience-resource-tile.liquid` create another bordered grid similar to proof cards.
- The heading is strong, but the tiles do not feel like a final decision point.
- The `Invest` tile contains sensitive positioning that should be reviewed before publication.
- The section ends into a dark footer without enough visual transition.

Target redesign behavior:
- Make this the visitor-routing close: `Explore the platform`, `See Barista Bot`, `Connect with Artly` or another approved route set.
- Differentiate from proof cards with route-oriented layout: larger hit areas, clear CTA labels, and concise audience-specific copy.
- Consider a tinted or dark bridge band that visually prepares for the footer while keeping content legible.
- Treat investor language as approval-required. If not approved, use neutral `Investor relations` or `Company updates` wording.
- Keep exactly three primary routes unless content strategy changes; do not turn this into another resource grid.

Files likely involved in future build:
- `sections/closing-audience-resource-tiles.liquid`
- `blocks/closing-audience-resource-tile.liquid`
- `templates/index.json`

Acceptance checks:
- [ ] Tiles are clearly routes, not proof claims.
- [ ] Each tile has one destination and one clear CTA label.
- [ ] Investment-related copy and destination are approved before launch.
- [ ] Visual style bridges into the footer and does not repeat the proof-card look unchanged.
- [ ] Cards are keyboard-accessible and have visible focus states.
- [ ] Mobile layout keeps all route labels and CTA text readable.

### Footer Relationship

Current visual problem:
- `sections/footer-group.json` uses a strong dark footer with newsletter and menu columns, but the transition from closing tiles is abrupt.
- The footer brand says `Artly Barista Bot`, while upper-page messaging sometimes says broader Artly platform. The relationship needs to be intentional.
- Footer menus may depend on Shopify Admin menu contents, so the visual plan cannot assume final link labels are complete.
- Header/footer commerce artifacts still need awareness even if this task does not edit them.

Target redesign behavior:
- Treat the closing section and footer as one final conversion area: route visitors first, then offer newsletter and utility links.
- Decide whether the footer brand should be `Artly`, `Artly Barista Bot`, or a paired lockup depending on final site positioning.
- Keep newsletter copy aligned with deployment/service updates, not generic ecommerce promotions.
- Footer menus should support Company, Solutions, Resources, Contact, Investor/Press where approved.
- Ensure the dark footer uses the same precision hospitality palette and does not feel like a default theme footer.

Files likely involved in future build:
- `sections/footer-group.json`
- `sections/footer.liquid`
- `sections/footer-utilities.liquid`
- `blocks/menu.liquid`
- `blocks/email-signup.liquid`
- Possible header/menu checks outside this task if commerce UI remains visible

Acceptance checks:
- [ ] Closing section and footer have a deliberate visual transition.
- [ ] Footer brand naming matches final site strategy.
- [ ] Newsletter copy is Artly-specific and non-commerce.
- [ ] Footer menus contain real, useful links and no placeholder/default Shopify copy.
- [ ] Social links are real or hidden until real destinations are approved.
- [ ] Desktop and mobile footer layouts preserve contrast, spacing, and readable form controls.

## Implementation Notes For Build Workers

- Keep future implementation changes section-scoped. This plan is not approval to rewrite unrelated theme architecture.
- Do not delete Shopify commerce capability. Preserve commerce templates/components unless Richard explicitly approves removal.
- Use real assets before visual polish. If approved media, logos, or article images are missing, mark the section blocked or hide it rather than shipping placeholders.
- Centralize reusable visual decisions only when duplication becomes real across at least two sections: card padding, section band spacing, eyebrow treatment, CTA row behavior, and media radius.
- Validate `templates/index.json` after any schema changes because several current sections are custom and editor-populated.

## Visual QA Checklist

Run after implementation:

- [ ] Desktop homepage: hero through footer reads as one premium robotics/service page.
- [ ] Mobile homepage: no section creates horizontal overflow or hidden CTA text.
- [ ] Placeholder illustrations, placeholder logo labels, and placeholder article images are gone or intentionally hidden.
- [ ] The page passes the five-second test from `DESIGN_PRINCIPLES.md`: Artly is a real robotic coffee system for commercial spaces, deployable, supported, and trusted.
- [ ] Major claims have nearby proof or are softened.
- [ ] CTA hierarchy is consistent and not over-primary.
- [ ] Footer transition is deliberate, not abrupt.
