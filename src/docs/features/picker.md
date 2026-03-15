---
title: Picker Integration
description: Use telescope.nvim, snacks.nvim, or the built-in picker for table selection, command palette, and more.
---

# Picker Integration

dadbod-grip ships a zero-dependency built-in picker for all selection surfaces. You can
optionally delegate to telescope.nvim or snacks.nvim for a more feature-rich experience.

## Configuration

```lua
require('dadbod-grip').setup({
  picker = 'builtin',
})
```

Set `picker` to `"builtin"` (default), `"telescope"`, or `"snacks"`.

## Built-in picker

The default. No extra plugins needed. The built-in picker renders a floating window with
fuzzy matching, preview panes for table columns, and keyboard navigation.

## Telescope

Set `picker = "telescope"` to delegate all picker surfaces to telescope.nvim. Telescope
must be installed and loadable. If telescope is not available at runtime, dadbod-grip falls
back to the built-in picker silently.

```lua
{
  "joryeugene/dadbod-grip.nvim",
  version = "*",
  dependencies = { "nvim-telescope/telescope.nvim" },
  opts = { picker = "telescope" },
}
```

## Snacks.nvim

Set `picker = "snacks"` to use the snacks.nvim picker backend. Same fallback behavior
as telescope: if snacks.nvim is not available, the built-in picker takes over.

```lua
{
  "joryeugene/dadbod-grip.nvim",
  version = "*",
  dependencies = { "folke/snacks.nvim" },
  opts = { picker = "snacks" },
}
```

## Surfaces that use the picker

All of these surfaces respect your `picker` setting:

| Keymap | Surface | What it picks |
|--------|---------|---------------|
| `gT` / `gt` | Grid, Sidebar, Query Pad | Table (with column preview) |
| `gC` / `<C-g>` | All surfaces | Database connection |
| `gh` | All surfaces | Query history (timestamp + SQL preview) |
| `gn` | Grid, Sidebar, Query Pad | Notebook file (.md / .sql) |
| `gq` | All surfaces | Saved query |
| `gp` | Grid | Saved filter preset |
| `gE` | Grid | Export format |
| `gH` | Grid | Column visibility |
| `<C-p>` | All surfaces | Command palette (searchable action list) |

## Fallback behavior

If the configured picker plugin is not installed or fails to load, dadbod-grip reverts
to the built-in picker for that invocation. No error is shown. This means you can set
`picker = "telescope"` in a shared config and still use dadbod-grip on machines where
telescope is not installed.
