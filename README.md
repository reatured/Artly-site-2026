# Artly Shopify Theme

This repository contains the Shopify theme for the Artly site.

Use Shopify CLI local preview before committing changes to GitHub. A commit pushed to the connected GitHub branch automatically updates the Shopify store through Shopify's GitHub integration, so preview first and commit only when the change is ready.

## Preview Before Commit

Run all commands from the repository root.

If this is the first time working with the store, authenticate with Shopify:

```bash
shopify auth login
```

Start the local Shopify theme preview:

```bash
shopify theme dev --path . --environment default --port 9292 --open
```

The preview opens at:

```text
http://127.0.0.1:9292/
```

Keep `shopify theme dev` running while editing. It syncs local theme files to a development preview theme and hot-reloads changes in the browser.

## Commit And Store Update

After the change has been checked in the local preview:

```bash
git status --short
git add .
git commit -m "Describe the change"
git push origin main
```

Pushing the commit updates the connected Shopify store automatically. There is no separate manual Shopify deploy step for normal theme changes.

## Initiating The Workflow

To start the project workflow in a new agent chat, use one of these start phrases:

```text
load as current site audit agent
load as research agent
load as planning agent
load as worker agent
load as review agent
```

The full workflow instructions live in `AGENTS.md`.
