# Shopify Theme

This repository contains a Shopify theme project.

Use Shopify CLI local preview before committing changes to GitHub. When this repository is connected to a Shopify store through Shopify's GitHub integration, pushing a commit to the connected branch automatically updates the store, so preview first and commit only when the change is ready.

## Preview Before Commit

Run all commands from the repository root.

If this is the first time working with the store, authenticate with Shopify:

```bash
shopify auth login
```

Start the local Shopify theme preview:

```bash
shopify theme dev --environment default --open
```

Shopify CLI opens the preview in the browser and prints the preview link in the terminal. Keep `shopify theme dev` running while editing. It syncs local theme files to a development preview theme and hot-reloads changes in the browser.

## Commit And Store Update

After the change has been checked in the local preview:

```bash
git status --short
git add .
git commit -m "Describe the change"
git push
```

Pushing the commit updates the connected Shopify store automatically when the branch is connected in Shopify. There is no separate manual Shopify deploy step for normal theme changes.

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
