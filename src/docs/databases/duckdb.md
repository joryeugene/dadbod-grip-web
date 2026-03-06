---
title: DuckDB
description: Use DuckDB as a standalone analytical engine or as a federation hub for Postgres, MySQL, SQLite, and remote files.
---

# DuckDB

DuckDB is the most capable engine in the dadbod-grip toolkit. Use it standalone for
analytical workloads, or use it as a hub to JOIN across Postgres, MySQL, SQLite,
and remote files in a single query.

## Connect

```
duckdb:path/to/file.duckdb
duckdb::memory:
```

Use `duckdb::memory:` for a session-scoped scratch space. Tables do not persist between queries.

## Open files directly

When your active connection is DuckDB, any file DuckDB can read opens as a live table.
No `CREATE TABLE` or import step needed.

### One-shot access (not saved to connections)

```vim
:GripOpen ~/data/report.parquet
:GripOpen https://example.com/dataset.parquet
:GripOpen s3://my-bucket/data.parquet
```

### Save as a named connection

Press `gc`, choose `+ New connection`, paste the file path or URL, and give it a name.
Named connections appear in the picker every time.

### File formats

DuckDB can read Parquet, CSV, TSV, JSON, NDJSON, Arrow, and Excel (`.xlsx`) files.
Remote `https://` URLs use the httpfs extension, which installs automatically on first use.

## Cross-database federation

Attach external databases to a DuckDB connection with `:GripAttach`. Each attachment
gets a schema alias. Use that alias as a SQL prefix to query across databases.

```vim
:GripAttach postgres:dbname=sales host=localhost user=me  pg
:GripAttach sqlite:legacy.db  legacy
:GripAttach md:cloud_analytics  cloud
```

```sql
SELECT
  pg.customers.name,
  legacy.orders.total,
  cloud.metrics.value
FROM pg.customers
JOIN legacy.orders ON pg.customers.id = legacy.orders.customer_id
JOIN cloud.metrics ON cloud.metrics.customer_id = pg.customers.id
```

Attachments persist in `.grip/connections.json` and restore automatically on reconnect.

### Required extensions

Extensions install automatically when you attach:

- `postgres:` installs `postgres_scanner`
- `sqlite:` installs `sqlite_scanner`
- `md:` connects to MotherDuck (requires a MotherDuck token in your environment)

## S3 access

Set credentials in your environment before connecting:

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
```

Public S3 buckets work without credentials. The httpfs extension installs on first use.

## Watch and write modes

DuckDB file connections support two extra modes:

**Write mode** (`--write` or `g!`): applies edits back to disk using `COPY TO`.
Parquet, CSV, JSON, NDJSON, TSV, and Arrow are all supported for round-trip writes.

**Watch mode** (`--watch` or `gW`): re-runs the query on a timer and updates the
grid automatically. Useful for monitoring changing files.

## MotherDuck

Connect to MotherDuck cloud with a `md:` prefix:

```
md:my_database
```

Set your MotherDuck token:

```bash
export MOTHERDUCK_TOKEN=...
```

MotherDuck connections work as both primary connections and as federation attachments
to a local DuckDB session.
