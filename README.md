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

Documentation pages live in `src/docs`, and the homepage lives in `src/routes/+page.svelte`. The keymap Explorer and reference share the released plugin catalog vendored at `src/lib/keymaps.json`.

Refresh that catalog only after a plugin release, using its full release commit:

```sh
npm run keymaps:sync -- <full-release-commit>
```

`npm run check` downloads the catalog from the pinned immutable commit and rejects local drift.

Keep website documentation evergreen. GitHub Releases owns version history, so update the relevant guide instead of adding a versioned documentation page.

## Scan for secrets

CI scans the complete Git history with Gitleaks 8.30.1. Run the same redacted scan locally with the version pinned by Mise:

```sh
mise install
mise exec -- gitleaks git --redact --verbose
```

Enable the optional staged hook for a checkout with:

```sh
git config core.hooksPath .githooks
```

Report suspected vulnerabilities through the private channel in [SECURITY.md](SECURITY.md), not through a public issue.

## Publishing

Merging a pull request into `main` triggers the GitHub Pages workflow. Review the generated site and coordinate Dadbod Grip release timing before merging documentation for an unreleased version.
