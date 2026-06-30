# Artly Shopify Theme

This repo contains the Shopify theme for the Artly site, based on Shopify Horizon. The project is Artly-specific: the homepage and custom sections position Artly as a commercial physical-AI robotics company with Barista Bot as the concrete specialty-coffee proof point.

## Local Development Preview

Use `shopify theme dev` to preview changes locally before committing to GitHub. Run commands from the repo root:

```bash
cd C:\Artly\Artly-site-2026
```

Authenticate if needed:

```bash
shopify auth login
```

Start the local development preview:

```bash
shopify theme dev --path . --environment default --port 9292 --open
```

Local preview URL:

```text
http://127.0.0.1:9292/
```

`shopify theme dev` uploads the local folder to a remote development theme and hot-reloads local changes while it is running. Preview your changes here before committing.

## Auto-Deploy to Shopify Store

This repo is connected to the Shopify store via **Shopify's GitHub integration**. Every commit pushed to the `main` branch automatically updates the live Shopify theme — no manual deploy step required.

**Workflow:**

1. Make changes locally
2. Preview with `shopify theme dev`
3. Commit and push to `main`
4. Shopify automatically deploys the update to the live store

## Initiating the Workflow

### First-time setup

1. Clone the repo:
   ```bash
   git clone https://github.com/reatured/Artly-site-2026.git
   cd Artly-site-2026
   ```
2. Install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) if not already installed
3. Authenticate with the store:
   ```bash
   shopify auth login
   ```
4. Verify the theme environment:
   ```bash
   shopify theme info --path . --environment default
   ```

### Daily development

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```
2. Start the local preview:
   ```bash
   shopify theme dev --path . --environment default --port 9292 --open
   ```
3. Make and preview your changes locally
4. When satisfied, commit and push:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```
5. The live Shopify store updates automatically

## Useful Commands

Validate Liquid, schema, and theme rules:

```bash
shopify theme check --path .
```

List remote themes connected to the configured store:

```bash
shopify theme list --path . --environment default
```

## Important Notes

- Use `git status --short` before and after theme work
- Avoid `--publish`, `--live`, `--allow-live`, destructive theme commands, and token/password flags unless explicitly approved
- Do not commit Admin API tokens, Theme Access passwords, private preview links, customer data, or Shopify account credentials

## Art Direction Reference

Primary source: [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md). Supporting homepage planning: [docs/artly-homepage-design-principles-and-plan.md](docs/artly-homepage-design-principles-and-plan.md).

Artly's direction is **Precision Hospitality**: advanced robotics made warm, useful, and commercially credible. The site should feel like a real service business powered by robotics, not a generic AI startup, consumer gadget page, or dark sci-fi robot brand.
