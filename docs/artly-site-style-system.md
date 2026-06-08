# Artly Site Style System

Design direction for the RC Shopify redesign sprint.

## Purpose

Artly should feel like Precision Hospitality: premium commercial robotics made useful, warm, and operationally credible. The site must show a real robotic coffee service that can be deployed, supported, and trusted in commercial spaces.

This is not a generic AI startup, consumer gadget brand, dark sci-fi robotics site, or stock Shopify storefront. The visual system should make Artly feel like a service business with serious robotics behind it.

## Positioning

Primary message:

> Real robotic coffee service for commercial spaces.

Support the message with three proof themes:

- Real robot operation: coffee preparation, calibration, pickup, customer interaction, and deployed workcells.
- Commercial credibility: installation, footprint, uptime, support, monitoring, maintenance, and repeatable operations.
- Warm hospitality: quality drinks, approachable service moments, and environments where people actually use the system.

Use "physical AI" and platform language only after the visitor understands that Artly is a deployed robotic coffee system. Barista Bot should be the concrete proof anchor for broader robotics and learning-platform claims.

## Current Visual Findings To Correct

The current inspected homepage still reads too much like starter Shopify blocks:

- The hero uses a generic landscape illustration instead of real Artly robot coffee service.
- Header and top bar still expose store noise, including "Welcome to our store", account, and cart affordances.
- Trusted logos are placeholders (`Trusted Brand 1`, etc.), which reduces credibility.
- Resource thumbnails are tiny placeholder images and make the content grid feel unfinished.
- Repeated white sections and stock card grids feel disconnected rather than like one deliberate commercial narrative.
- Some claims and resource modules need proof, approved assets, and clearer operational context nearby.

Use the visual inspection screenshots in `docs/visual-inspection-home-*.png` as the baseline problem state.

## Layout Rules

- Lead with real robot media, then proof, then the system story. Do not lead with abstract platform language alone.
- Build pages as a sequence of full-width bands with constrained inner content. Avoid floating page-section cards.
- Use fewer, stronger sections. Each section needs one job: orient, prove, explain, route, or capture lead intent.
- Keep commercial credibility close to claims. If a section says "reliable", "commercial scale", "30-minute setup", or "1.2M+ actions", place substantiation, caveats, or source-ready proof nearby.
- Use alternating rhythms: full-bleed media, split media/text, compact proof row, operational detail, lead-capture band.
- Prefer 12-column desktop composition with strong alignment. Use two-column split sections for system explanation and three/four-column grids only for repeated proof or resource items.
- On mobile, stack media before supporting copy when the media proves the claim. Keep CTAs visible without crowding the first viewport.
- Let the next section peek below the hero on common desktop and mobile viewports so the homepage does not feel like a single isolated poster.

## Typography Direction

- Font pairing rule: Artly uses Work Sans and Space Grotesk.
- Work Sans is the body, UI, navigation, button, form, metadata, and dense operational copy font.
- Space Grotesk is the display font for H1-H4, strong labels, hero/product titles, major section titles, and short accent text.
- Do not introduce other body or display fonts unless Richard explicitly approves the change.
- Shopify theme settings should map body and subheading typography to Work Sans, and heading and accent typography to Space Grotesk.
- Headlines should be direct, large, and product-first: "Robotic coffee, built for real service" is better than broad mission language.
- Keep typography crisp rather than futuristic. Avoid sci-fi fonts, exaggerated tracking, and novelty display faces.
- Use normal letter spacing. Technical labels can be small, bold, and uppercase only when they function as wayfinding, not decoration.
- Body copy should be calm and specific. Write in operational language: deploy, support, serve, monitor, maintain, calibrate, scale.
- Avoid generic AI phrasing such as "revolutionary", "unlock the future", "next-gen experiences", or "powered by innovation" unless paired with concrete proof.

Suggested type scale:

| Role | Direction |
| --- | --- |
| H1 | 56-72 desktop, 40-48 mobile, tight but readable line height |
| H2 | 36-48 desktop, 30-36 mobile |
| H3/card title | 20-28 depending on density |
| Body | 16-18 with comfortable line height |
| Metadata/labels | 12-14, bold or medium, normal letter spacing |

## Color And Material Palette

The palette should be warm but not beige-heavy. Use hospitality warmth as an accent against clean robotics materials.

| Token | Hex | Use |
| --- | --- | --- |
| Clean off-white | `#F7FAFB` | Main page background and quiet section bands |
| Porcelain | `#FFFFFF` | Cards, forms, clean content surfaces |
| Soft black | `#111313` | Primary text, dark footer, high-contrast CTA |
| Graphite | `#2F363C` | Secondary dark surfaces, captions, rules |
| Steel neutral | `#6A7680` | Muted copy, borders, metadata |
| Brushed alloy | `#D8DEE2` | Dividers, technical surfaces, media frames |
| Robotics blue | `#B9DCE5` | Light technical panels and proof highlights |
| Signal cyan | `#00A8B5` | Precise accent for status, links, small diagrams |
| Coffee crema | `#B8875A` | Hospitality accent, drink/coffee details |
| Espresso | `#493022` | Small grounding accent, never dominant |

Material rules:

- Use hairline borders, subtle shadows, and brushed-metal neutrals to suggest precision.
- Use dark sections selectively for media, footer, or high-confidence proof. Do not make the whole site dark.
- Do not use purple AI gradients, decorative blobs, generic SaaS blue washes, or beige/tan as the dominant environment.
- Keep color contrast accessible. Signal cyan should not carry critical text on white unless contrast is verified.

## Media Rules

- Hero media must show Artly robot coffee service in a real or believable commercial context.
- Prioritize approved robot video, deployment photos, close-ups of drinks being made, customer handoff, maintenance, and operational dashboards.
- Avoid generic illustrations, abstract AI artwork, fake robot renderings, dark blurred footage, and placeholder thumbnails.
- Use poster frames that are useful even before video plays. A visitor should be able to identify robot, coffee, and service environment from the still image.
- Keep media crops inspectable. Do not crop the robot or drink process so tightly that the service context disappears.
- Resource and press cards need real thumbnails or intentionally text-only editorial treatment. Do not use tiny placeholder images floating in empty boxes.
- Logos must be approved and real. If approvals are missing, replace the logo strip with a different proof module rather than showing placeholder brand names.
- Include descriptive alt text for all media and captions/transcripts for important video.

## Component Rules

### Header

- Header should feel like a commercial robotics site, not a store.
- Preferred visual direction: a rounded translucent or soft-metal navigation bar with a compact logo capsule on the left, rounded pill navigation controls, and a compact right-side action/icon capsule.
- Use Work Sans for navigation and button text; reserve Space Grotesk for the Artly wordmark, brand display moments, and short header accent labels where appropriate.
- Remove or hide visible cart, account, product, collection, and "Welcome to our store" entry points for the current launch.
- Use focused navigation: Robot, Platform, Deployments, Resources, Company, Contact or Demo.
- Keep the primary CTA visible as "Book a Demo" or "Talk to an Expert".
- Avoid mega-menu product-card treatments unless they route to real solution content.

### Hero

- Use real robot coffee media as the first-viewport signal.
- Headline should identify the offer quickly: robotic coffee for real service, commercial spaces, or deployable coffee automation.
- Keep supporting copy short and operational. Mention deployment, support, consistency, or commercial environments before abstract AI.
- Primary CTA: `Book a Demo`.
- Secondary CTA: `Explore the Platform`, `See Barista Bot`, or `How It Works`.
- Avoid generic scenic illustrations, mission-only headlines, and hero copy that could belong to any AI company.

### CTAs And Buttons

- Primary CTA: soft black background, white text, confident rectangular shape with modest radius.
- Secondary CTA: outline or text link, not another equally loud button.
- Button labels should be action-specific: `Book a Demo`, `Talk to an Expert`, `See Barista Bot`, `View Resources`.
- Avoid commerce CTAs such as `Shop all`, `Add to cart`, `Buy now`, or generic `Learn More` when a more specific route exists.

### Proof Modules

- Use proof rows, deployment notes, metrics, partner/customer validation, press links, and operational checklists.
- Every metric must be substantiated before launch. If not confirmed, use qualitative proof until source records are approved.
- Proof modules should not look like generic feature cards. Add context: where the proof came from, what it means for operators, and why it lowers deployment risk.

### Cards And Modules

- Cards are for repeated items: proof tiles, resource articles, use cases, press items, or audience pathways.
- Keep card radius modest, generally 4-8px.
- Do not put cards inside cards.
- Avoid long rows of identical white cards without visual hierarchy.
- Resource cards need consistent image ratios, real media, real dates/sources when relevant, and clear click targets.
- Use icons sparingly. Prefer operational icons, line weight consistency, and labels that clarify the icon.

### Forms And Lead Capture

- Lead capture should feel like a deployment inquiry, not ecommerce newsletter signup.
- Good language: "Get deployment updates", "Talk to Artly", "Plan a deployment", "Request a demo".
- Avoid "exclusive deals", "early access to products", "shop updates", or discount language.
- Forms should ask for the least information needed at that point. Email-only is fine for updates; demo forms can ask for company, role, location type, and timeline.

## Footer Direction

- Footer can use a dark graphite or soft-black band to create a confident close.
- Lead capture should focus on practical Artly updates, deployments, operations, and resources.
- Footer nav should route by user intent: Company, Solutions, Resources, Contact/Demo, Investors if approved.
- Include legal links and only official social links. Remove generic placeholder social destinations before launch.
- Do not show payment icons, cart links, product menus, gift cards, or account/order paths for this launch.

## Do / Don't

Do:

- Show the robot in a coffee-service context immediately.
- Make operational trust visible: support, deployment, maintenance, monitoring, consistency.
- Use warm coffee cues as accents against clean steel, white, graphite, and robotics blue.
- Put proof close to claims.
- Use plain commercial language that a facilities, hospitality, retail, or campus operator can understand.
- Replace placeholders with approved assets or choose a module that does not require missing assets.

Don't:

- Use generic landscape illustrations, abstract AI visuals, decorative blobs, or purple gradients.
- Let Shopify commerce UI frame the site as a store before commerce is part of the launch.
- Use placeholder logos, placeholder thumbnails, or fake proof.
- Overload pages with identical cards.
- Make beige, brown, or coffee tones the whole brand environment.
- Claim "proven", "commercial scale", specific setup times, or large action counts without approved substantiation.
- Sound like a consumer gadget, investor teaser, or developer-only robotics platform.

## Implementation Notes

- Work through existing Shopify theme settings where possible: color schemes, type presets, button radius, card radius, header settings, footer groups, and section settings.
- Keep commerce capability in the theme, but hide visible product/cart/account/payment/gift-card surfaces for the current frontend launch.
- Replace `templates/index.json` hero and media references with approved robot coffee service assets when available.
- Replace text-placeholder logo and resource modules with approved logos/media or convert them into text-led proof modules.
- Audit `sections/header-group.json` and live Shopify menus for store/account/cart language before launch.
- Audit `sections/footer-group.json` and live footer menus for payment, product, account, and generic social placeholders.
- Add reduced-motion support for autoplay or scroll effects.
- Verify responsive layout on desktop and mobile screenshots. Watch for oversized card headings, empty thumbnail boxes, cropped robot media, and CTAs that crowd content.
- Maintain a source record for approved claims, logos, media rights, investor copy, and press/resource dates.

## Acceptance Standard

A first-time visitor should understand within five seconds:

> Artly provides a real robotic coffee system for commercial spaces, backed by credible robotics operations and deployable service support.

If the page could be mistaken for a starter Shopify store, a generic AI/SaaS company, or a lifestyle coffee brand with robotics language added later, it does not meet the style system.
