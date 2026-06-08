# Task 4 — Platform Overview Section Design Packet

## Scope

- Task: Platform Overview section for the homepage wireframe sequence.
- Inputs used: `C:/Users/IWM1/Downloads/Homepage Wireframe.png`, `DESIGN_PRINCIPLES.md`, current homepage planning docs.
- Constraint: No theme implementation edits in this task.

## Final Section Copy Package

### Primary copy (recommended)

- **Eyebrow:** `The platform behind your service`
- **Heading (H2):** `From expert teaching to dependable service deployment`
- **Body:**  
  `Artly turns specialist know-how into a repeatable platform for real-world robotics. Experts teach the workflow, the platform translates it into hardware-ready execution, and every deployment strengthens operations through live deployment feedback.`
- **Body (second line):**  
  `Operators get clear steps from proof of concept to rollout: configure, deploy, monitor quality, and scale with confidence.`
- **CTA 1 (primary):** `Book a Demo`
- **CTA 2 (secondary):** `Explore the Platform`

### Optional proof copy (single optional row)

- `Evidence markers: Expert-taught tasks • Real-world deployment feedback • Deployable hardware stack`

## Visual Specification (wireframe aligned + DESIGN_PRINCIPLES.md)

### Section role and layout intent

- Split layout with rich media supporting a concise copy block.
- Priority is credibility and practical clarity over motion spectacle.
- Keep tone clean, premium, and service-oriented (light / warm neutral palette); avoid cinematic “futuristic toy” styling.
- Emphasize real environment, not abstract diagrams.

### Recommended implementation pattern

- **Preferred:** reuse existing `sections/media-with-content.liquid`
- **Alt option:** create `sections/platform-overview.liquid` with equivalent `media` + `content` block model.
- Keep section behavior close to other editorial/presentation zones and avoid decorative shapes, blobs, or gradients.

### Suggested section configuration

- `section_width`: `page-width`
- `media_position`: `left`
- `media_width`: `wide`
- `media_height`: `60svh` (desktop), `50svh` (mobile)
- `color_scheme`: `scheme-1` or equivalent light neutral scheme used by nearby non-commerce editorial sections
- `extend_media`: `true` only if wireframe shows edge-to-edge media treatment
- Padding: `padding-block-start`: `32`, `padding-block-end`: `32` (tweak per final rhythm)

### Spacing and responsive behavior

- Desktop: content and media in two columns with content aligned to top-left, clear paragraph width.
- Mobile: stack media above content, preserve CTA prominence and avoid crowding.
- Button row: two CTAs inline on desktop, stacked at `max-width: 749px`.
- Reserve generous whitespace around heading/body to avoid “promo-strip” feel.

## Media Guidance

### Type recommendation

- **Primary:** Shopify-hosted video (short, no audio unless captioned).
- **Secondary fallback:** high-resolution still image (16:9) using same scene if video unavailable.

### Fallback behavior

- If `media.video` is blank, use `media.image` with same focal composition.
- If both are blank, fallback can remain placeholder but should be replaced before launch.
- Keep fallback image in commercial context: deployment station, operator interaction, and clean service hardware.

### Poster and loading behavior

- Use the same video preview frame as poster, captured from an in-context active robot motion.
- If autoplay is used, keep muted and looped; otherwise show a clear poster + play affordance.
- Prefer no-initial motion (`video_autoplay: false`) for accessibility; enable user-initiated playback.

### Alt text

- Image alt: `Artly robotic workcell demonstrating service automation on a commercial counter`
- Video alt should be stored in the Shopify media object description and match the preview context.
- If image/video is decorative for layout, set decorative alt in asset metadata and include a nearby descriptive text block.

## Shopify Editor Field Map

### Recommended block stack (`media-with-content`)

- **Section settings**
  - `media_position` = `left`
  - `media_width` = `wide`
  - `media_height` = `60svh`
  - `section_width` = `page-width`
  - `extend_media` = `false` (or `true` if wireframe wants edge bleed)
  - `color_scheme` = `scheme-1`
  - `padding-block-start` = `32`
  - `padding-block-end` = `32`

- **Media block (`_media-without-appearance`)**
  - `media_type` = `video` (recommended) or `image`
  - `video` = selected Shopify video asset
  - `video_loop` = `true`
  - `video_autoplay` = `false`
  - `video_position` = `cover`
  - `image_position` = `cover` (if using image fallback)
  - `link` = leave blank unless the media requires destination

- **Content block (`_content-without-appearance`)**
  - `horizontal_alignment_flex_direction_column` = `flex-start`
  - `vertical_alignment_flex_direction_column` = `flex-start` or `space-between`
  - `gap` = `24`

- **Child blocks inside content**
  - **Block 1: text** (`text`)  
    - `text` = `<p>Platform overview eyebrow</p>` (use plain text style)  
    - `type_preset` = `h6`  
    - `max_width` = `narrow`
  - **Block 2: text** (`text`)  
    - `text` = heading HTML or rich text (`From expert teaching to dependable service deployment`)  
    - `type_preset` = `h2`
  - **Block 3: text** (`text`)  
    - `text` = paragraph body text  
    - `type_preset` = `rte`  
    - `max_width` = `normal`
  - **Block 4: button** (`button`)  
    - `label` = `Book a Demo`  
    - `style_class` = `button`
  - **Block 5: button** (`button`)  
    - `label` = `Explore the Platform`  
    - `style_class` = `link` (or `button-secondary` if style density is too low)

## Acceptance Checklist

- [ ] Copy is plain-language, category-clear, and non-speculative.
- [ ] Eyebrow, heading, body, and both CTAs are present exactly once in this section.
- [ ] Visual media is real robot/service content (not abstract AI illustration).
- [ ] Desktop split layout shows media-to-left / content-to-right rhythm from wireframe.
- [ ] Mobile stacks media then content in a readable order.
- [ ] Primary CTA is high-commitment (`Book a Demo`) and secondary CTA is lower-commitment (`Explore the Platform`).
- [ ] Typography, spacing, and colors match `DESIGN_PRINCIPLES.md` (light premium baseline; selective accent only).
- [ ] Alt text exists on fallback image and descriptive media metadata for video.
- [ ] Poster/thumbnail is present to avoid blank or broken playback state.
- [ ] No commerce-only labels (cart/shop/product CTA language) in this section.
- [ ] Visual review at `http://127.0.0.1:9292/` confirms:
  - no clipping on heading/body
  - no clipped CTA focus states
  - no overflow in mobile padding

## Delivery note

- This is a **frontend-ready design/content packet only**. No implementation files were edited.
