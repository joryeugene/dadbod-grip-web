---
title: Keymaps Reference
description: This reference lists every configurable Dadbod Grip mapping for the Grid, Query Pad, Sidebar, and Cell Editor.
---

<script lang="ts">
  import KeymapReference from '$lib/components/KeymapReference.svelte';
</script>

# Keymaps Reference

Press `?` from the Grid, Query Pad, or Sidebar to open contextual help. The help also covers short-lived floats, pickers, trees, and diagrams that do not belong in the configurable primary-surface catalog.

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

<KeymapReference />
