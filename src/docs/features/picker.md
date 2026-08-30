---
title: Picker Integration
description: Dadbod Grip uses its built-in picker or delegates supported lists to telescope.nvim and snacks.nvim.
---

# Picker Integration

dadbod-grip ships a built-in picker, so selection surfaces do not require another Neovim plugin.
You can delegate supported surfaces to telescope.nvim or snacks.nvim when you prefer either interface.

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

Set `picker = "telescope"` to delegate supported simple pickers to telescope.nvim. Telescope
must be installed and loadable. If telescope is not available at runtime, dadbod-grip falls
back to the built-in picker silently.

```lua
{
  "joryeugene/dadbod-grip.nvim",
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
  dependencies = { "folke/snacks.nvim" },
  opts = { picker = "snacks" },
}
```

## Picker ownership

The configured backend handles simple list selection. Pickers with Dadbod Grip-specific actions stay built-in because telescope.nvim and snacks.nvim do not expose those actions.

| Keymap | Surface | What it picks | Interface |
|--------|---------|---------------|-----------|
| `gT` / `gt` | Grid, Sidebar, Query Pad | A table with a column preview. | Configured backend. |
| `gh` | All surfaces | Query history with SQL previews. | Configured backend. |
| `<C-p>` | All surfaces | The command palette. | Configured backend. |
| `gm` | Grid | A referencing table when more than one table points at the row. | Configured backend. |
| `gC` / `<C-g>` | All surfaces | A database connection and its management actions. | Built-in. |
| `gn` | Grid, Sidebar, Query Pad | A notebook file. | Built-in. |
| `gq` | All surfaces | A saved query and its management actions. | Built-in. |
| `gp` | Grid | A saved filter preset. | Built-in. |

Exports use Neovim's selection and input prompts. Column visibility uses its own multi-select float, so neither surface changes with `picker`.

## Fallback behavior

If the configured picker plugin is not installed or fails to load, dadbod-grip reverts
to the built-in picker for that invocation. No error is shown. This means you can set
`picker = "telescope"` in a shared config and still use dadbod-grip on machines where
telescope is not installed.
