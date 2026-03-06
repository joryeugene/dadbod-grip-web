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
{ "joryeugene/dadbod-grip.nvim", tag = "v3.3.0" }
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

Connections persist to `.grip/connections.json` automatically, so you never type them twice.

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
  -- Maximum rows to fetch per page (default: 200)
  limit = 200,

  -- AI provider for natural language SQL (optional)
  ai = {
    provider = 'anthropic',  -- 'anthropic' | 'openai' | 'gemini' | 'ollama'
    model = 'claude-opus-4-6',
  },

  -- Key to open the grip workspace (default: <leader>db)
  open_key = '<leader>db',
})
```

## What opens automatically

When you connect, grip opens three surfaces:

- **Schema sidebar** on the left: tables, columns, PK/FK markers, DDL access
- **Query pad** in the center: a scratch SQL buffer that pipes results into grids
- **Grid** at the bottom: the editable table view

Press `1`, `2`, or `3` to jump between them. Press `?` on any surface for the full keymap reference.
