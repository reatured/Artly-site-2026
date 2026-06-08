# Task 3 - Homepage Callout Bar Design Packet

## Scope

- Task: Homepage callout bar (`sections/homepage-callout-bar.liquid`) positioned directly below the hero on `template index`.
- Inputs: `C:/Users/IWM1/Downloads/Homepage Wireframe.png`, `DESIGN_PRINCIPLES.md`, `docs/homepage-layout-delivery-whiteboard.md`.
- Constraint: do not edit theme implementation files in this step.

## Copy Variants

### CTA message mode (default conversion strip)

- Variant 1 - Launch message
  - Message: `Built for real deployments, not robotics demos.`
  - CTA label: `Book a Demo`
  - CTA link: `/pages/contact` (or designated sales route)
- Variant 2 - Resource-led message
  - Message: `See how Artly turns expert teaching into dependable service at scale.`
  - CTA label: `Explore the Platform`
  - CTA link: `/pages/platform`
- Variant 3 - Investor/press message
  - Message: `Follow Artly's deployment roadmap and progress updates.`
  - CTA label: `Read latest updates`
  - CTA link: `/blogs/news` (or dedicated newsroom page)

### Countdown mode

Use countdown when launch windows or event registrations are time-sensitive.

- Countdown variant A
  - Message: `Demo window opens for new pilots:`
  - Countdown label: `Ends in`
  - Date: `2026-07-15`
  - Time: `12:00`
  - CTA: `Reserve a Pilot Slot`
  - CTA link: `/pages/contact`
- Countdown variant B
  - Message: `Operator onboarding session starts in:`
  - Countdown label: `Starts in`
  - Date: `2026-07-30`
  - Time: `09:00`
  - CTA: `Join Session`
  - CTA link: `/pages/events`

### Signup mode

Use only for campaign capture (newsletter/list, event waitlist, or early-access list).

- Signup variant A
  - Message: `Get deployment updates and launch announcements from Artly.`
  - Field placeholder: `name@company.com`
  - Submit label: `Get Updates`
- Signup variant B
  - Message: `Stay in the loop for pilots, launch notes, and field updates.`
  - Field placeholder: `you@company.com`
  - Submit label: `Sign Me Up`

Recommended consent text:
- `By continuing, you agree to receive Artly communications. You can unsubscribe anytime.`

## Visual Specification

### Section role and intent

- A single, below-hero conversion strip.
- Distinct from the header announcement bar: this is page content, not global header UI.
- Keep high emphasis on message clarity and actionability while staying within homepage editorial rhythm.
- Band should be lightweight and non-transactional versus commerce/product messaging.

### Band and spacing

- Section width: `page-width`
- Max content width: theme `--page-width` container
- Default color scheme: `scheme-4` (cool blue tint) with dark body text
- Vertical spacing: `padding-block-start` 18-24, `padding-block-end` 18-24
- Horizontal spacing: `padding-inline-start: 16`, `padding-inline-end: 16` (or theme defaults)
- Divider: optional bottom border token (`--border-bottom-width: 1px`) if section separation is needed

### Desktop layout

- Grid columns: message/countdown block on left, action block on right
- Suggested proportions: `2.2fr 1fr`
- Vertical alignment: center
- CTA block right aligned
- Message should be short, typically 1-2 lines on desktop

### Mobile layout

- Stack to one column at `<= 749px`
- Recommended order:
  1. Message text
  2. Countdown module (if enabled)
  3. CTA button or signup form
- CTA button should be full width
- Signup input and submit button should be full width
- Reduce vertical spacing from desktop to ~14px

### Typography and spacing

- Message: body/h6 scale, short phrasing, no more than 2 desktop lines and 3 mobile lines
- Countdown: compact row, small unit labels (`d / h / m / s`)
- CTA: single-line primary action
- Keep letter spacing at 0; no decorative typographic effects

## Shopify Editor Field Map (marketing controls)

### Section controls

- `campaign_mode` (select): `message`, `message_with_countdown`, `signup`
- `bar_text` (inline_richtext): main strip copy
- `bar_text_alignment` (select): `left` (default), `center`
- `section_width` (select): `page-width`, `full-width`
- `color_scheme` (select): `scheme-4` recommended
- `padding-block-start` (range): 12-40
- `padding-block-end` (range): 12-40
- `show_divider` (checkbox): optional separator line

### Message + CTA controls

- `cta_text` (text): button label
- `cta_link` (url): button destination
- `cta_style` (select): `button`, `button-secondary`
- `cta_open_in_new_tab` (checkbox): for external destinations
- `cta_hidden_when_mode_signup` (checkbox): hide CTA in signup mode

### Countdown controls

- `enable_countdown` (checkbox)
- `countdown_label` (text): e.g., `Ends in`
- `countdown_end_date` (text): `YYYY-MM-DD`, required when countdown is enabled
- `countdown_end_time` (select): `00:00` to `23:00`, required when countdown is enabled
- `countdown_timezone_note` (note): capture local timezone handling
- `show_countdown_units` (checkbox): show `d h m s`
- `countdown_expired_message` (text): fallback when timer has ended

### Signup controls

- `signup_enabled` (checkbox, only in signup mode)
- `signup_subtext` (text): optional supporting sentence
- `signup_placeholder` (text)
- `signup_button_text` (text)
- `signup_button_style` (select): `button`, `button-secondary`
- `signup_success_message` (text)
- `signup_error_message` (text)
- `signup_consent_text` (text): legal/compliance statement near submit

## Acceptance Checklist

- [ ] Message strip appears below hero and is not rendered in header.
- [ ] Strip is visually distinct from `header-announcements` (no arrows, no block cycling, no header scope).
- [ ] At least one mode renders correctly with valid settings.
- [ ] In message + CTA mode, CTA link exists when CTA text is present; if missing, hide CTA and keep layout stable.
- [ ] In countdown mode, valid end date/time renders a live countdown.
- [ ] In countdown mode, invalid/blank values hide countdown and show the fallback message.
- [ ] In countdown mode, expired timer switches to fallback state without layout shift.
- [ ] In signup mode, email submit action works with clear success and error states.
- [ ] Mobile display stacks cleanly; no horizontal overflow.
- [ ] CTA and form controls are at least 44px touch target height.
- [ ] Default copy is plain-language and avoids unsupported or high-risk claims.
- [ ] Default color contrast is readable at chosen scheme.
- [ ] Visual verification at `http://127.0.0.1:9292/` confirms no clipping and no spacing collisions.

## Edge Cases

- Missing `bar_text`: hide strip if empty, unless a placeholder campaign is required.
- Partial countdown settings: hide countdown UI when either date or time is missing.
- Signup mode with invalid email: show inline validation and preserve input.
- Very long CTA labels: wrap and keep button height stable.
- Long bar text: wrap on desktop and mobile without overflow.
- Avoid using this strip as global announcement replacement for all header messaging.

## Explicit distinction from header Announcement Bar

- `header-announcements` is a header-group feature, global to header areas, and supports multiple announcement blocks with optional rotation.
- `homepage-callout-bar` is a homepage section that appears below hero for a single campaign context.
- Callout bar behavior should be content-first conversion support, with optional signup mode; it should not imitate header announcement semantics.
