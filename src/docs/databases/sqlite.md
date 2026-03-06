---
title: SQLite
description: Connect dadbod-grip.nvim to SQLite databases for editable grids and schema browsing.
---

# SQLite

## Connect

```
sqlite:path/to/file.db
sqlite:./relative/path.db
sqlite:/absolute/path.db
```

## Features

SQLite support includes the full editing suite. Write to any column with a popup editor,
stage multiple changes, preview the generated SQL, and apply in one transaction.

The demo database ships as SQLite. Run `:GripStart` to open it.

## Attach to DuckDB

Attach a SQLite database to a DuckDB session to JOIN it against Postgres or Parquet files:

```vim
:GripAttach sqlite:legacy.db  legacy
```

The `sqlite_scanner` extension installs automatically. All tables become accessible
under the `legacy.` prefix (or whatever alias you choose).

## Requirements

`sqlite3` must be on your `PATH`.

```bash
which sqlite3
```

On macOS: included by default. On Debian/Ubuntu: `sudo apt install sqlite3`.

## File modes

SQLite connections support write mode and watch mode. Use `--write` to apply edits
back through DuckDB's `COPY TO` (requires an active DuckDB connection). Use `--watch`
to auto-refresh the grid when the file changes on disk.
