# Dadbod Grip website

This repository builds the documentation site for [dadbod-grip.nvim](https://github.com/joryeugene/dadbod-grip.nvim). The published site lives at [jorypestorious.com/dadbod-grip-web](https://jorypestorious.com/dadbod-grip-web/).

## Local development

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

## Publishing

Pushing `main` triggers the GitHub Pages workflow. Review the generated site and coordinate Dadbod Grip release timing before pushing documentation for an unreleased version.
