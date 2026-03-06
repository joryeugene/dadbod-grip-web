---
title: PostgreSQL
description: Connect dadbod-grip.nvim to PostgreSQL for editable grids, schema browsing, and DDL operations.
---

# PostgreSQL

## Connect

```
postgresql://user:pass@host:5432/dbname
postgresql://user@localhost/mydb
postgresql://localhost/mydb?sslmode=disable
```

You can also use a `postgres://` prefix; both work identically.

## Features

All core grip features work against PostgreSQL:

- Inline cell editing with full type awareness (boolean, integer, numeric, text, jsonb, timestamps)
- Batch edits across visual-mode selections
- Mutation preview before apply
- Transaction undo: reverse committed changes
- Schema sidebar with all schemas visible (not just `public`)
- FK navigation across schemas
- DDL: create tables, rename and add/drop columns, drop with CASCADE

## Multi-schema support

The schema sidebar shows all schemas in the database. Tables from non-public schemas appear
as `schema.table` in the sidebar and are fully editable.

## JSON and JSONB columns

JSON and JSONB columns display inline and open in a dedicated JSON viewer when you press
`K` (row view) or `e` (edit). The editor renders the JSON with syntax highlighting
and writes back valid JSON on apply.

## Federation via DuckDB

Attach a PostgreSQL database to a DuckDB session to JOIN it against SQLite, Parquet files,
or other sources:

```vim
:GripAttach postgres:dbname=mydb host=localhost user=me  pg
```

The `postgres_scanner` extension installs automatically. All tables become accessible
under the `pg.` prefix.

## Requirements

`psql` must be on your `PATH`. The grip adapter calls `psql` to execute queries.

```bash
which psql   -- must return a path
```

On macOS with Homebrew: `brew install postgresql`. On Debian/Ubuntu: `sudo apt install postgresql-client`.
