---
title: SQL Completion
description: Dadbod Grip completes table names, columns, aliases, and federation schemas in the query pad.
---

# SQL Completion

The query pad completes table names, column names, aliases, SQL keywords, and
federation schema prefixes. Built-in completion is enabled by default and opens
in supported SQL contexts as you type.

## Built-in completion

The query pad installs an omnifunc and its completion mappings. In Insert mode,
press `<C-Space>` or the native `<C-x><C-o>` to request candidates. While the menu
is open, `Tab` and `<Down>` move forward, `<S-Tab>` and `<Up>` move backward, and
`<CR>` accepts the selected item.

## Using blink.cmp

Set `completion = false` so blink owns the popup and its bindings. Define the
provider module as well as adding its source name to your existing blink setup:

```lua
require('dadbod-grip').setup({ completion = false })

require('blink.cmp').setup({
  sources = {
    default = { 'lsp', 'path', 'buffer', 'dadbod_grip' },
    providers = {
      dadbod_grip = {
        name = 'Grip SQL',
        module = 'dadbod-grip.completion.blink',
      },
    },
  },
})
```

The provider is active when the buffer has a database connection. Dadbod Grip does
not automatically add this provider definition to blink's configuration.

## Using nvim-cmp

With `completion = false`, explicitly register Dadbod Grip's source after nvim-cmp
is available, then add it to your existing source list:

```lua
require('dadbod-grip').setup({ completion = false })

local cmp = require('cmp')
require('dadbod-grip.completion').register_cmp_source()
cmp.setup({
  sources = cmp.config.sources({
    { name = 'dadbod_grip' },
  }),
})
```

Keep your other configured sources when merging this example. Use nvim-cmp's own
trigger, navigation, and acceptance bindings.

## What gets completed

| Context | Candidates |
|---------|-----------|
| After `FROM` / `JOIN` | Table names, including available schema prefixes. |
| After `table.` | Column names for that table. |
| After alias `.` | Column names for the aliased table. |
| Federation session | Qualified table and column names from registered attachments. |
| Outside a recognized table or column context | Matching SQL keywords. |

In a DuckDB federation session, type `prod.` to see tables from the `prod`
attachment, or `prod.customers.` to see columns.

Setting `completion = false` removes Dadbod Grip's completion mappings and skips
installing its omnifunc and automatic popup. Your configured engine owns completion
in that buffer; the built-in `<C-Space>` and `<C-x><C-o>` instructions above apply
when Dadbod Grip's completion is enabled.
