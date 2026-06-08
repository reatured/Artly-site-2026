# Artly Visual Asset Inventory

Worker: PV-W-20260608-004, Visual Asset Audit Worker  
Date: 2026-06-08  
Scope: Local asset inventory and homepage media plan for the RC Shopify redesign sprint.  
Write scope: `docs/artly-visual-asset-inventory.md` only.

## Executive Summary

The local repository does not contain launch-ready Artly photography, robot video, Barista Bot media, customer logos, press thumbnails, or resource thumbnails. The homepage is configured with multiple image/video picker slots, but `templates/index.json` does not bind real media assets to those slots. As rendered in the saved inspection screenshots, the page falls back to Shopify placeholder artwork, text-only logo labels, and generic theme icons.

The highest-priority gap is real product and deployment media. Without approved hero, platform, proof, and Barista Bot visuals, the redesign reads as a template rather than a credible robotics company homepage.

## Local Visual Asset Inventory

| Location | Asset type | Files found | Reusable for launch? | Notes |
| --- | --- | ---: | --- | --- |
| `assets/` | Theme SVG icons | 33 SVGs | Limited | Generic Shopify/theme UI icons only: account, cart, arrows, search, grid, play/pause, etc. No Artly logo, robot imagery, partner logos, or editorial thumbnails. |
| `assets/` | Photos/video | 0 | No | No `.png`, `.jpg`, `.webp`, `.mp4`, `.mov`, or `.webm` launch media found under `assets/`. |
| `files/` | Shopify Files export/local mirror | 0 | No | No local `files/` directory exists. |
| Repo root | Review screenshots | 2 PNGs | No | `.review-visual-landscape-844x390.png` and `.review-visual-mobile-390x844.png`; useful QA artifacts only. |
| `docs/` | Visual inspection screenshots | 6 PNGs | No | Current rendered homepage captures. Useful as evidence of placeholder state, not customer-facing assets. |

### Screenshot Artifacts

| File | Dimensions | Purpose |
| --- | ---: | --- |
| `.review-visual-landscape-844x390.png` | 844 x 390 | Prior review screenshot. |
| `.review-visual-mobile-390x844.png` | 390 x 844 | Prior mobile review screenshot. |
| `docs/visual-inspection-home-hero.png` | 1189 x 1272 | Shows hero and platform start; hero uses generic scenic apparel placeholder. |
| `docs/visual-inspection-home-top.png` | 1189 x 1272 | Top-page inspection capture. |
| `docs/visual-inspection-home-mid.png` | 1189 x 1272 | Mid-page inspection capture. |
| `docs/visual-inspection-home-lower.png` | 1189 x 1272 | Lower-page inspection capture. |
| `docs/visual-inspection-home-resources.png` | 1189 x 1272 | Shows text fallback logos and placeholder resource cards. |
| `docs/visual-inspection-home-footer.png` | 1189 x 1272 | Footer inspection capture. |

## Current Homepage Media References

Static source inspected: `templates/index.json`, homepage section renderers, related logo/resource/tile blocks, `config/settings_data.json`, header/footer group JSON, and existing docs/screenshots.

| Homepage section | Current configured media | Current fallback behavior | Launch status |
| --- | --- | --- | --- |
| Hero (`hero_jVaWmY`) | `media_type_1: image`, `media_type_2: image`; no `image_1`, `image_2`, videos, or mobile media values in `templates/index.json`. | `sections/hero.liquid` renders Shopify placeholder `hero-apparel-1`. Screenshot confirms generic scenic illustration. | Needs real Artly hero media. |
| Callout bar | No visual media slot. | N/A | No asset required unless campaign uses an icon or image later. |
| Platform overview (`platform_overview`) | `media_type: video`; no `media_video`, `media_image`, or `media_fallback_image`. Alt text says an Artly robotic workcell should be shown. | `sections/platform-overview.liquid` renders placeholder `hero-apparel-1`. | Needs real deployment video and poster/still. |
| Capability/proof tiles (`capability_proof_tiles`) | Four generic icon values: `stopwatch`, `recycle`, `truck`, `plant`; no image values. | Theme icon/image renderer uses icons. | Needs proof-specific visual system or approved icons tied to evidence. |
| Overview media (`overview_media`) | `media_type: video`; no `media_video`, `media_image`, or `media_fallback_image`. | `sections/overview-media.liquid` renders placeholder `hero-apparel-1`. | Needs proof/workflow video and poster/still. |
| Barista Bot (`barista_bot_feature`) | `media_type: video`; no `media_video`, `media_image`, or `media_fallback_image`. | `sections/barista-bot-feature.liquid` renders placeholder `hero-apparel-1`. | Needs Barista Bot video and stills. |
| Trusted logos (`trusted_by_logo_strip`) | Four blocks named `Trusted Brand 1` through `Trusted Brand 4`; no `logo_image` or `logo_url`. | `blocks/trusted-by-logo.liquid` renders text fallback in dashed boxes. | Needs approved public logo files and permission notes. |
| Blogs/resources (`featured_content_resources`) | Four manual cards with titles, excerpts, links, and alt text; no `card_image`. | `sections/featured-content-resources.liquid` renders `blog-apparel-1` placeholder art. | Needs real thumbnails and final published URLs. |
| News/press (`news_and_press`) | Four manual cards with copy/date/source; no `card_image` and no card links in `templates/index.json`. | Placeholder media appears; card CTAs hide when link remains `#`. | Needs real press/news source links and thumbnails. |
| Closing CTA/footer tiles (`closing_audience_resource_tiles`) | Three tiles use generic icons: `lightning_bolt`, `serving_dish`, `question_mark`; no tile images. | Icon-only cards. | Needs either intentional approved icons or small real images/diagrams. |
| Header/footer brand | Theme settings set logo heights but no `logo` or `logo_inverse` asset in `config/settings_data.json`. Footer uses a logo block. | Header/footer likely fall back to shop text when live admin has no logo asset. | Needs Artly logo files and social/profile URL confirmation. |

## Placeholder And Generic Asset Flags

| Flag | Where seen | Why it matters | Recommended replacement |
| --- | --- | --- | --- |
| Shopify apparel/scenic placeholder | Hero, platform overview, overview media, Barista Bot when pickers are blank. | Makes the page look like an unfinished Shopify template and contradicts the robotics positioning. | Real Artly robot/deployment video or stills. |
| Shopify blog placeholder thumbnail | Resource and press cards with missing images. | Editorial sections look unapproved and low-credibility. | Approved thumbnails matched to each resource or press item. |
| Text fallback logos | Trusted By strip. | Trust section signals missing assets instead of credibility. | Approved customer/partner/investor logos in SVG or transparent PNG. |
| Generic proof icons | Capability tiles and closing tiles. | Acceptable only as temporary UI; not enough proof for robotics claims. | Evidence-backed icons, small diagrams, or real asset crops tied to claims. |
| Generic social/profile links | Footer utilities use broad social domains. | Can route visitors away incorrectly. | Confirm Artly-owned social profile URLs or hide unavailable channels. |
| Store/header residue | Header screenshot shows `Welcome to our store`; header brand in screenshot reads `Artly Barista Bot`. | Not strictly a visual asset, but undermines launch polish and brand clarity. | Confirm final brand label/logo and announcement copy. |

## Section Gap Analysis

### Hero

Current state: Two image slots are enabled, but no real images are assigned. The visible fallback is a generic scenic illustration.

Needed real assets:

- One high-impact hero video or still showing a real Artly robot, Barista Bot, or deployment environment.
- Desktop crop: wide 16:9 or wider, safe for dark overlay and left/bottom text.
- Mobile crop: vertical or square crop that still shows the robot/product clearly.
- Poster image if video is used.
- Alt text and source/permission record.

Recommendation: Use real Artly hardware in context, not abstract AI art, lab-only b-roll, or generic coffee imagery.

### Platform Overview

Current state: Video-first section with no video or fallback image assigned.

Needed real assets:

- Short workflow video showing expert teaching, calibration, deployment setup, or robot execution.
- Matching poster frame with robot/operator context.
- Still fallback at 16:9 minimum.
- Optional simple process diagram if real video is not available immediately, but it should be clearly Artly-branded and not generic AI illustration.

Recommendation: Prioritize operational clarity over cinematic style. The page copy promises a deployable real-world platform, so the visual should show a real workcell or service environment.

### Proof

Current state: Capability proof tiles use generic icons and unverified proof claims such as `30 minute setup`, `Closed-loop learning cycle`, `1.2M+ logged actions`, and `Human-guided knowledge transfer`. Overview media also lacks the proof video it references.

Needed real assets:

- Evidence source for each numeric or operational claim.
- A proof clip or still sequence showing setup, calibration, execution, quality check, and feedback loop.
- Optional data visual or simple annotated image tied to the `1.2M+` action claim.

Recommendation: Do not rely on icon tiles alone. Pair claims with either a proof media block or a source-backed caption.

### Barista Bot

Current state: Dedicated video slot exists, but no video, image, or poster is assigned.

Needed real assets:

- Product hero still of Barista Bot in a commercial counter/workcell.
- Short video of drink preparation or autonomous operation.
- Detail stills: footprint/context, self-cleaning component, calibration, finished drink, operator/customer interaction.
- Poster frame that reads clearly before playback.

Recommendation: This is the strongest concrete proof point on the homepage. It should get the best available real media, not a generic coffee or robotics placeholder.

### Trusted Logos

Current state: Four placeholder labels: `Trusted Brand 1` through `Trusted Brand 4`.

Needed real assets:

- Approved logo files for customers, partners, investors, venues, or credible ecosystem collaborators.
- Permission notes for public display.
- Preferred format: SVG for vector logos; transparent PNG only if SVG is not available.
- Alt text and link target per logo.

Recommendation: If public logo permission is not ready, replace the logo strip with another proof format instead of shipping fake/filler logos.

### Resources / Blogs

Current state: Four manual resource cards have titles, excerpts, and local blog URL paths, but no images.

Needed real assets:

- Thumbnail for each resource card.
- Confirmed article existence and final URLs.
- Preferred visuals: real deployment stills, operator/workflow images, product diagrams, or branded editorial graphics based on actual Artly material.

Current cards needing thumbnails:

| Card | Current link | Needed thumbnail |
| --- | --- | --- |
| A practical introduction to physical AI | `/blogs/news/physical-ai` | Real robot/operator or Artly platform explainer image. |
| Deployment notes: improving reliability | `/blogs/news/deployment-reliability` | Deployment/reliability workflow image. |
| Operator workflow design for service teams | `/blogs/news/operator-workflow` | Operator dashboard, training, or handoff image. |
| Press notes: what to watch next | `/blogs/news/press-notes` | Press/newsroom or roadmap visual tied to real Artly update. |

### News / Press

Current state: Four manual cards have placeholder-like sources/dates and no card links or images. Section CTA points to `/blogs/news`.

Needed real assets:

- Real article or press source URL for each card.
- Thumbnail or publication logo treatment for each item.
- Approved source/date/byline metadata.
- Optional external publication logos if permitted.

Recommendation: Treat this section as credibility-sensitive. Avoid invented source labels like `Trade Review` unless they map to a real publication.

### Closing CTA / Footer

Current state: Closing tiles use generic icons and no images. Footer has a logo block but no local logo asset in theme settings. Social links point to broad platform homepages.

Needed real assets:

- Final Artly logo asset for header/footer: standard, inverse, favicon if available.
- Confirmed social profile URLs or decision to hide unavailable channels.
- Optional mini visuals for closing tiles:
  - Artly AI: model/data loop diagram or real training capture.
  - Barista Bot: product crop or icon derived from real hardware silhouette.
  - Invest: approved investor/press visual or keep text-only pending legal review.

Recommendation: Keep closing tiles simple unless real assets are available. The footer should not display generic social links at launch.

## Prioritized Asset Request List For Richard

| Priority | Request | Minimum viable package | Preferred package | Owner/approval needed |
| ---: | --- | --- | --- | --- |
| 1 | Hero real Artly media | 1 approved hero still with desktop/mobile crop guidance. | 10-20 second muted hero video plus poster and mobile crop. | Richard / brand / creative. |
| 2 | Barista Bot media | 1 clear product still and 1 poster frame. | Short operation video plus 3-5 product/detail stills. | Richard / product / creative. |
| 3 | Platform/proof workflow media | 1 workflow still showing real robot deployment context. | Short proof video showing setup, calibration, execution, quality check, feedback loop. | Product / operations / creative. |
| 4 | Logo permissions and files | 4 approved logos or decision to remove the strip. | 6-10 approved logos with URLs, alt text, and permission notes. | Partnerships / legal / Richard. |
| 5 | Resource thumbnails | 4 thumbnails matched to current resource cards. | Final article URLs, thumbnails, excerpts, and publish metadata. | Content / Richard. |
| 6 | News/press assets | 4 real source URLs and thumbnails/publication logo treatments. | Approved newsroom set with dates, bylines, external source labels, and image permissions. | PR / content / legal. |
| 7 | Brand utility assets | Header/footer logo and favicon. | Standard logo, inverse logo, favicon, social avatars, and usage notes. | Brand / Richard. |
| 8 | Closing tile visuals | Keep current icons intentionally or provide 3 small visuals. | Artly-specific mini diagram/icon set derived from real platform/product language. | Brand / design. |
| 9 | Social URLs | Confirm official Artly Facebook, Instagram, TikTok, X/Twitter, YouTube URLs or hide channels. | Full footer/social profile map with UTM/link policy. | Marketing / Richard. |

## Suggested Asset Specs

| Asset | Recommended spec |
| --- | --- |
| Hero still | 2400 px wide minimum, landscape crop, subject safe to right/center if text remains left/bottom. |
| Hero mobile crop | 1200 x 1600 or similar vertical crop, robot/product still visible without relying on tiny details. |
| Homepage videos | 10-30 seconds, MP4/H.264 or Shopify-compatible upload, muted-safe, captions/transcript when speech matters. |
| Video poster frames | 16:9 JPG/PNG/WebP, 1600 px wide minimum, no motion blur, shows real hardware/context. |
| Resource/news thumbnails | 16:9, 1200 x 675 preferred, consistent crop treatment. |
| Logos | SVG preferred; transparent PNG fallback at 2x display size; monochrome version helpful for strip consistency. |
| Favicon | 32 x 32 and 180 x 180 variants if available. |

## Implementation Readiness Notes

- The theme already has image/video picker fields for the main homepage sections; implementation should be mostly asset assignment once approved media exists.
- `templates/index.json` currently does not include Shopify media object references, so a local-only repo inspection cannot confirm whether assets exist in the live Shopify admin.
- If live Shopify Files already has assets, export or document their filenames/IDs before assigning them so this inventory can be updated.
- Do not ship fake customer logos, invented press sources, or generic AI/robot stock art as a substitute for real Artly proof.

## Traceability

| Item | Value |
| --- | --- |
| Vault ID | PV-W-20260608-004 |
| Nickname | Visual Asset Audit Worker |
| Mission | Claim and execute `Collect Real Artly Visual Assets` for the RC Shopify redesign sprint. |
| Files inspected | `templates/index.json`, `sections/hero.liquid`, `sections/platform-overview.liquid`, `sections/overview-media.liquid`, `sections/barista-bot-feature.liquid`, `sections/trusted-by-logo-strip.liquid`, `blocks/trusted-by-logo.liquid`, `sections/featured-content-resources.liquid`, `sections/news-and-press.liquid`, `sections/closing-audience-resource-tiles.liquid`, `blocks/closing-audience-resource-tile.liquid`, `sections/header-group.json`, `sections/footer-group.json`, `config/settings_data.json`, local image/video file inventory, existing docs/screenshots. |
| Files changed | `docs/artly-visual-asset-inventory.md` |
| Theme implementation edited | No |
| Task board edited | No |
