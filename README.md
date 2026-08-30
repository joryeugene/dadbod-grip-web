# Dadbod Grip website

This repository builds the documentation site for [dadbod-grip.nvim](https://github.com/joryeugene/dadbod-grip.nvim). The published site lives at [jorypestorious.com/dadbod-grip-web](https://jorypestorious.com/dadbod-grip-web/).

## Local development

Node.js 24 is required. The `.node-version` file keeps compatible version managers and CI on the same release line.

```sh
npm ci
npm run dev
```

Run the same static checks used before publication:

```sh
npm run check
npm run build
```

Documentation pages live in `src/docs`, the homepage lives in `src/routes/+page.svelte`, and the keymap explorer reads `src/lib/keymaps-data.ts`.

Keep website documentation evergreen. GitHub Releases owns version history, so update the relevant guide instead of adding a versioned documentation page.

## Publishing

Merging a pull request into `main` triggers the GitHub Pages workflow. Review the generated site and coordinate Dadbod Grip release timing before merging documentation for an unreleased version.
