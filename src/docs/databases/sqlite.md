---
title: SQLite
description: Dadbod Grip connects to SQLite databases for editable grids and schema browsing.
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
stage multiple changes, preview the generated SQL, and send them as one `BEGIN`/`COMMIT` batch.
If the client reports an apply error, inspect the database before retrying because an earlier
statement may already have committed.

Run `:GripStart` to open the bundled demo. Dadbod Grip uses SQLite when the `duckdb`
client is unavailable.

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

## Refreshing a SQLite grid

Press `gW` to re-run the current SQLite query on a timer. The `--write` flag belongs to
DuckDB-backed data files such as CSV and Parquet; ordinary SQLite edits use the SQLite adapter.
