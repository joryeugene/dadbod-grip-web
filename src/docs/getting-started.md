---
title: Getting Started
description: Install dadbod-grip.nvim and connect to your first database.
---

# Getting Started

dadbod-grip.nvim adds editable database grids to Neovim. Connect to any supported database
and edit rows like Vim buffers. Every change is staged, previewed, and applied in a single
transaction.

## Requirements

- Neovim 0.10+
- The CLI for each database you want to use: `psql`, `mysql`, `sqlite3`, or `duckdb`
- No other external dependencies

## Installation

### lazy.nvim (recommended)

```lua
-- always latest stable release
{ "joryeugene/dadbod-grip.nvim", version = "*" }
```

```lua
-- or pin to a specific version
{ "joryeugene/dadbod-grip.nvim", tag = "v1.0.0" }
```

### packer.nvim

```lua
use { "joryeugene/dadbod-grip.nvim", tag = "v*" }
```

### vim-plug

```vim
Plug 'joryeugene/dadbod-grip.nvim', { 'tag': 'v*' }
```

## Connect to a database

Run `:GripConnect` and pick or paste a connection string. The schema sidebar and
query pad open automatically.

### Connection string formats

```
postgresql://user:pass@host:5432/dbname
mysql://user:pass@host:3306/dbname
sqlite:path/to/file.db
duckdb:path/to/file.duckdb

/path/to/file.csv          -- direct file (also .parquet .json .xlsx)
https://host/data.parquet  -- remote file via DuckDB httpfs

duckdb::memory:            -- in-memory scratch, tables reset per query
```

Connections persist automatically across sessions. See [Connections](features/connections) for how the project and global connection files work, including sharing connections across projects.

## Your first edit

1. Run `:GripConnect` and connect to a database
2. Navigate the schema sidebar with `j`/`k` and press `<CR>` to open a table
3. Move to any cell and press `i` or `<CR>` to edit it
4. Your change appears teal (staged). Press `gl` to toggle the live SQL float showing the DML.
5. Press `a` to apply all staged changes in one transaction

## Try the built-in demo

Run `:GripStart` to open the Softrear Inc. demo database. Seventeen tables,
realistic data, and something in the consumer incidents that does not add up.
The [walkthrough](/docs/demo) explains the full investigation.

## Configuration

All options are optional. The plugin works with no configuration at all.

```lua
require('dadbod-grip').setup({
  limit = 200,              -- rows per page (default: 200)
  max_col_width = 60,       -- truncate long cell values in the grid
  timeout = 30000,          -- query timeout in milliseconds

  picker = 'builtin',       -- 'builtin' | 'telescope' | 'snacks'
  completion = true,        -- false to use blink.cmp or nvim-cmp instead
  connections_path = nil,   -- absolute path to shared connections.json

  ai = {
    provider = 'anthropic', -- 'anthropic' | 'openai' | 'gemini' | 'ollama'
    model = 'claude-sonnet-4-6',
    api_key = nil,          -- nil reads from env var; or 'env:VAR', 'cmd:...', direct string
    base_url = nil,         -- override for Ollama or proxy endpoints
  },

  open_key = '<leader>db',  -- key to open the grip workspace
})
```

## What opens automatically

When you connect, grip opens three surfaces:

- **Schema sidebar** on the left: tables, columns, PK/FK markers, DDL access
- **Query pad** in the center: a scratch SQL buffer that pipes results into grids
- **Grid** at the bottom: the editable table view

Press `1`, `2`, or `3` to jump between surfaces. Keys `4` through `9` open depth views:
ER diagram (`4`), column stats (`5`), columns (`6`), foreign keys (`7`), indexes (`8`),
and constraints (`9`).

Press `<C-p>` on any surface to open the command palette, a searchable list of every
available action. Press `?` for the full keymap reference.
