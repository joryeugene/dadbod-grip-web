---
title: Keymaps Reference
description: This reference lists configurable Dadbod Grip mappings for Welcome, Grid, Query Pad, Sidebar, and Cell Editor.
---

<script lang="ts">
  import KeymapReference from '$lib/components/KeymapReference.svelte';
</script>

# Keymaps Reference

Press `?` from Welcome, the Grid, Query Pad, or Sidebar to open contextual help. The help also covers short-lived floats, pickers, trees, and diagrams that do not belong in the configurable primary-surface catalog.

Cataloged actions can be remapped or disabled through `setup()` without changing the default keys:

```lua
require('dadbod-grip').setup({
  keymaps = {
    palette = '<F1>',
    sidebar_close = '<C-c>',
    grid_live_sql = false,
  },
})
```

Setting one cataloged action to `false` disables that mapping. `completion = false` removes the completion-specific Query Pad mappings. `ai = false` keeps `A` and `gA` available so they can explain that AI is disabled, while `:GripFill` remains unavailable.

## Contextual navigation

Default digits retain their pane-specific actions. Welcome uses `1` for schema, `2`
for SQL, and `3` for the table picker. From schema or results, `2` opens SQL; inside
SQL, `2` opens history. In schema, `1` opens connections. Use `?` to inspect effective
keys after remapping rather than assuming that a digit always has one destination.

`gz` zooms the current main pane and restores its split layout on the next press.
Native `<C-w>` window controls remain available. Result hints occupy two rows that
fit the window width and stay fixed during horizontal table scrolling.

Welcome's action selection and activation keys are configurable too:

```lua
require('dadbod-grip').setup({
  keymaps = {
    welcome_next = '<F2>',
    welcome_activate = '<F3>',
  },
})
```

Welcome keeps command fallbacks visible when actions are disabled. Its default
Tab/Shift-Tab selection also works with native `j`/`k` movement.

<KeymapReference />
