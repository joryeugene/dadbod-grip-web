---
title: Getting Started
description: This guide explains how to install Dadbod Grip and connect to your first database.
---

# Getting Started

Dadbod Grip turns database tables into editable Vim buffers. It stages each change, shows the SQL it will run, and sends the batch between `BEGIN` and `COMMIT`.

## Requirements

- Neovim 0.10 or newer.
- The CLI for each adapter you use: `psql`, `mysql`, `sqlite3`, `duckdb`, or `sqlcmd`.
- No other Neovim plugin is required. Picker and completion integrations are optional.

Run `:checkhealth dadbod-grip` after installation to see which database clients and optional AI providers are available.

## Installation

### lazy.nvim (recommended)

The plugin ships a Lazy spec that registers its commands. You do not need to copy a `cmd` list into your configuration.

```lua
{
  "joryeugene/dadbod-grip.nvim",
  opts = {},
}
```

To dogfood a local checkout while keeping the plugin identity stable:

```lua
{
  "joryeugene/dadbod-grip.nvim",
  dir = "~/Documents/github/dadbod-grip.nvim",
  opts = {},
}
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

Run `:GripConnect`, then select a known connection or paste one of these forms:

```text
postgresql://user:${DB_PASSWORD}@host:5432/dbname
mysql://user:${DB_PASSWORD}@host:3306/dbname
mariadb://user:${DB_PASSWORD}@host:3306/dbname
sqlite:path/to/file.db
duckdb:path/to/file.duckdb
sqlserver://user:${DB_PASSWORD}@host:1433/dbname
mssql://user:${DB_PASSWORD}@host:1433/dbname

/path/to/file.csv
https://host/data.parquet
duckdb::memory:
```

Dadbod Grip recognizes Parquet, CSV, TSV, JSON, NDJSON, JSONL, XLSX, ORC, Arrow, and IPC files. Remote HTTPS and S3 sources run through DuckDB.

Connections saved from the picker go to `.grip/connections.json`. Global connections live in `~/.grip/connections.json`. See [Connections](features/connections) for scopes, opaque saved-query bindings, and secret placeholders.

## Your first edit

1. Run `:GripConnect` and connect to a database.
2. Navigate the schema sidebar with `j` and `k`, then press `<CR>` to open a table.
3. Move to a cell and press `i` or `<CR>` to edit it.
4. Press `gl` to inspect the staged DML.
5. Press `a` to send the staged statements as one `BEGIN`/`COMMIT` batch. If the database client reports an error, inspect the database before retrying.

## Try the built-in demo

Run `:GripStart` to recreate and open the Softrear Inc. SQLite demo. Each run reseeds the database, so edits from an earlier demo session are discarded. The [walkthrough](demo) explains the investigation.

## Configuration

Every option is optional. These are the current defaults:

```lua
require("dadbod-grip").setup({
  limit = 100,
  max_col_width = 40,
  timeout = 10000,
  completion = true,
  connections_path = nil,
  picker = "builtin",       -- "builtin", "telescope", or "snacks"
  pinned_max = nil,
  border = "rounded",
  cell_split = "horizontal",
  sticky_header = true,
  open_sidebar = true,
})
```

Set `open_sidebar = false` to connect directly into the welcome screen and query pad. The schema sidebar remains available through `:GripSchema` or `gb`.

`timeout` applies to database CLI calls. DuckDB work that may download an extension or read a remote URL receives a 60-second minimum for that network step, while connection health checks use five seconds.

## What opens automatically

With `open_sidebar = true`, a connection opens three surfaces:

- The schema sidebar shows tables, columns, primary keys, foreign keys, and DDL actions.
- The query pad provides a persistent SQL buffer.
- The main workspace displays welcome content and result grids.

Press `1`, `2`, or `3` to move among the primary surfaces. Keys `4` through `9` open the ER diagram, column statistics, columns, foreign keys, indexes, and constraints. Press `<C-p>` for the command palette or `?` for the contextual keymap.
