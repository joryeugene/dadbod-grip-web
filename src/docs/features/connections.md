---
title: Connections
description: Manage project and global connections, promote connections across projects, and configure shared team access.
---

# Connections

dadbod-grip stores connections in two files that merge automatically. Project connections live in `.grip/connections.json` relative to the current working directory. Global connections live in `~/.grip/connections.json` and appear in every project. You never need to configure the merge: opening the connection picker shows both.

## Project connections

When you save a connection via `:GripConnect`, it writes to `.grip/connections.json` in the current working directory. These connections are scoped to that project. If you open a different project, project connections from the first directory do not appear.

```
.grip/
  connections.json    project-specific connections
  queries/            saved queries
  filter_presets.json saved filter presets
```

Check `.grip/connections.json` into version control if you want teammates to share a baseline set of named connections without configuring `connections_path`.

## Global connections

`~/.grip/connections.json` stores connections that appear in every project, regardless of working directory. When at least one global connection exists, the picker groups all connections under labelled sections:

```
global
  prod-postgres      * postgresql://...
  analytics-duckdb   * duckdb://...

project
  local-sqlite       * sqlite:./data.db
```

Add connections to the global file by promoting them from the picker (see below), or edit the file directly.

## Promoting a connection

Press `G` on any project connection in the picker to copy it to `~/.grip/connections.json`. The connection remains in the project file and gains the "global" label. It will appear in every other project from that point forward.

This is the fastest way to build up your global connection list: connect to a database once per project, then promote the connections you use most.

## Health indicators

Each connection shows a health indicator next to its name:

| Indicator | Meaning |
|-----------|---------|
| `*` | Last query succeeded |
| `x` | Last query failed |
| (blank) | Not yet tested this session |

Press `T` on any connection in the picker to run a test query and update the indicator immediately. File-based connections (CSV, Parquet, SQLite) retest by checking that the file exists and is readable.

## File-based connections

CSV, Parquet, JSON, XLSX, and other DuckDB-readable file formats appear automatically in a "Local Files" section of the picker when files matching those extensions exist in the current working directory. You do not need to add them manually.

Press `s` on any local file entry to save it as a named connection. The name defaults to the filename. Saved file connections persist across sessions and appear alongside database connections.

```
local files
  sales_2025.csv         (cwd)
  analytics.parquet      (cwd)
```

Remote files accessible via DuckDB httpfs (https://host/data.parquet) must be added manually as named connections.

## Shared team config

Set `connections_path` to point the entire team at one shared file:

```lua
require('dadbod-grip').setup({
  connections_path = '/path/to/team/connections.json',
})
```

When `connections_path` is set, grip reads and writes to that file only. The project and global file merge is disabled. Use this for a centralized connections file checked into a shared dotfiles or infrastructure repository.

## Backward compatibility

If you use `g:dbs` (vim-dadbod-ui format), dadbod-grip reads those entries automatically and persists them to the global file on first save. Existing vim-dadbod-ui configurations work without changes.

```lua
-- existing vim-dadbod-ui config: works as-is
vim.g.dbs = {
  { name = 'prod', url = 'postgresql://...' },
}
```
