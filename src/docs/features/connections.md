---
title: Connections
description: Dadbod Grip manages project, global, and shared connection files.
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

Check `.grip/connections.json` into version control only when every URL is credential-free or uses a `${VAR}` placeholder. Keep literal passwords out of both project and global files.

Connection entries accept these optional fields in addition to `name` and `url`:

| Field | Purpose |
|-------|---------|
| `id` | Opaque saved-query binding that Dadbod Grip assigns lazily and preserves through edits. |
| `type` | Explicit adapter or file type when the URL does not provide enough information. |
| `env_file` | A `.env` file that supplies `${VAR}` values used by the URL. |
| `mode` | `"ro"` requests the database client's read-only mode. |
| `color` | A named or hexadecimal accent color for the connection. |
| `attachments` | DuckDB federation attachments that restore on reconnect. |

Existing connection files remain readable without these fields.

## Global connections

`~/.grip/connections.json` stores connections that appear in every project, regardless of working directory. When at least one global connection exists, the picker groups all connections under labelled sections:

```
global
  prod-postgres      * postgresql://...
  analytics-duckdb   * duckdb:path/to/analytics.duckdb

project
  local-sqlite       * sqlite:./data.db
```

Add connections to the global file by promoting them from the picker (see below), or edit the file directly.

## Promoting a connection

Press `G` on any project connection in the picker to copy it to `~/.grip/connections.json`. The project entry remains in place. In other projects, the copied entry appears in the global section; in the original project, URL deduplication continues to prefer the project entry.

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

Parquet, CSV, TSV, JSON, NDJSON, JSONL, XLSX, ORC, Arrow, and IPC files appear automatically in a "Local Files" section when matching files exist in the current working directory. You do not need to add them manually.

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

## Keep credentials out of connection files

Use a `${VAR}` placeholder in the URL and optionally point the entry at an `env_file`:

```json
{
  "name": "dev",
  "url": "postgresql://api:${DEV_DB_PASSWORD}@dev.internal:5432/app",
  "env_file": "~/work/api/.env"
}
```

Dadbod Grip resolves the placeholder only while dispatching a database command. The expanded URL is not written back to a connection or saved-query file. An unset or empty variable stops the connection instead of falling through to another credential source.

## Saved-query connection binding

New query files store an opaque connection ID:

```sql
-- grip:connection=conn_0123456789abcdef01234567
SELECT * FROM orders;
```

The ID resolves across project, global, or custom connection sources. Renaming, promoting, deduplicating, or editing a persisted connection preserves its ID. If the active connection is not persisted, `:GripSave` saves the SQL without a binding and asks you to save the connection first.

Legacy query files containing `-- grip:url=` remain readable when the URL is templated or credential-free. Dadbod Grip never auto-connects a credential-bearing legacy URL. It removes that metadata from the editor and warns without displaying the secret. The next explicit save converts a resolvable legacy binding to an ID.

## Backward compatibility

If you use `g:dbs` (vim-dadbod-ui format), dadbod-grip reads those entries automatically and persists them to the global file on first save. Existing vim-dadbod-ui configurations work without changes.

If a `g:dbs` URL contains a literal password, that migration will persist the literal password. Replace it with a `${VAR}` placeholder before the first save.

```lua
-- existing vim-dadbod-ui config: works as-is
vim.g.dbs = {
  { name = 'prod', url = 'postgresql://...' },
}
```
