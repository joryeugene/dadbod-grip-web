---
title: SQL Completion
description: Auto-complete table names, columns, aliases, and federation schemas in the query pad.
---

# SQL Completion

The query pad provides SQL completion for table names, column names, aliases, SQL keywords,
and federation schema prefixes. Completion fires automatically as you type or on demand
with `<C-Space>`.

## Built-in completion

Enabled by default. The built-in completion uses Neovim's omnifunc mechanism (`<C-x><C-o>`)
and registers itself on the query pad buffer. No configuration needed.

## Using blink.cmp

If you use blink.cmp for completion across Neovim, disable the built-in completion and
register the `dadbod_grip` source:

```lua
require('dadbod-grip').setup({
  completion = false,
})
```

Then add `dadbod_grip` to your blink.cmp sources:

```lua
require('blink.cmp').setup({
  sources = {
    default = { 'lsp', 'path', 'buffer', 'dadbod_grip' },
  },
})
```

The `dadbod_grip` source name is registered automatically when the plugin loads. You only
need to add it to your blink.cmp sources list.

## Using nvim-cmp

Same pattern: disable built-in, add the source.

```lua
require('dadbod-grip').setup({
  completion = false,
})
```

Then register the source in nvim-cmp:

```lua
local cmp = require('cmp')
cmp.setup({
  sources = cmp.config.sources({
    { name = 'nvim_lsp' },
    { name = 'dadbod_grip' },
  }),
})
```

## What gets completed

| Context | Candidates |
|---------|-----------|
| Bare identifier | Table names from current schema |
| After `FROM` / `JOIN` | Table names with schema prefix |
| After `table.` | Column names for that table |
| After alias `.` | Column names for the aliased table |
| Federation session | Qualified names: `attached_db.table.column` |
| SQL keywords | SELECT, FROM, WHERE, JOIN, GROUP BY, etc. |

In a DuckDB federation session, completion includes qualified names from all attached
databases. Type `prod.` to see tables from the `prod` attachment, or `prod.customers.`
to see columns.

## Manual trigger

Press `<C-Space>` in the query pad to manually trigger completion at any time. Press
`<C-x><C-o>` for the standard Vim omnifunc trigger if you prefer.
