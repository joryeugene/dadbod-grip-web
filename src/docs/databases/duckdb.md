---
title: DuckDB
description: Dadbod Grip uses DuckDB as an analytical engine and a federation hub for databases and files.
---

# DuckDB

DuckDB handles local analytical queries and provides the federation layer for PostgreSQL,
MySQL, SQLite, MotherDuck, and remote files.

## Connect

```
duckdb:path/to/file.duckdb
duckdb::memory:
```

Use `duckdb::memory:` for a session-scoped scratch space. Tables do not persist between queries.

## Engine timing

Engine timing is opt-in and defaults to `false`:

```lua
require("dadbod-grip").setup({
  engine_timing = true,
})
```

For an eligible single statement, Dadbod Grip reads DuckDB's JSON-profile `LATENCY`
from that execution. The footer shows a separate value such as
`Engine: 12.3ms DuckDB profiler latency`. It includes the adapter's conversion of
nested SELECT values, but excludes attachment setup, client startup, and Lua result
parsing. It measures elapsed query latency, not cumulative operator CPU time or the
execution time of a remote attached database. The Query client duration retains its
own meaning.

Eligible database writes can also collect a profile. After a successful reload,
`Write engine` belongs to the write, while `Engine` belongs to the refreshed SELECT.
Profiling uses the original execution; it does not run `EXPLAIN ANALYZE` or retry the
statement. Collection adds profiling overhead and requires a DuckDB client with JSON
profiling and `ALL` coverage. The first eligible call probes that support once per
client executable with a separate in-memory query; its time is part of that first
client duration.

Batches, transaction wrappers, session/profiling commands, and conservatively
unsupported syntax keep the normal execution path and report unsupported timing.
This includes the `BEGIN`/`COMMIT` batches used by staged apply. PostgreSQL,
MySQL/MariaDB, SQL Server, and SQLite also report unsupported engine timing. Missing,
malformed, or mismatched profiles report unavailable timing. Neither status becomes
a numeric zero, and client timings remain available.

Set `show_result_time = false` to hide both client and engine durations while
collection continues. `show_running_time` and `show_hints` remain independent. See
[timing display](../getting-started#timing-display) for those settings and
[applying changes](../features/editing#apply-changes) for interrupted-write behavior.

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

Run `:GripConnect` or press `gC`, choose `+ New connection`, paste the file path or URL, and give it a name. The sidebar and welcome screen also offer `gc`; in the grid, `gc` copies staged SQL.
Named connections appear in the picker every time.

### File formats

Dadbod Grip routes Parquet, CSV, TSV, JSON, NDJSON, JSONL, XLSX, ORC, Arrow, and IPC files through DuckDB. Remote `https://` URLs use the `httpfs` extension, which installs automatically on first use.

## Cross-database federation

Attach external databases to a DuckDB connection with `:GripAttach`. Each attachment
gets a schema alias. Use that alias as a SQL prefix to query across databases.

```vim
:GripAttach postgres:dbname=sales host=localhost user=me  pg
:GripAttach mysql:database=sales host=localhost user=me  mysql_sales
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
- `mysql:` installs `mysql_scanner`
- `sqlite:` installs `sqlite_scanner`
- `md:` connects to MotherDuck (requires a MotherDuck token in your environment)

## Process and credential safety

Dadbod Grip sends every DuckDB query, DML statement, schema request, and attachment declaration through standard input. SQL, URLs, and passwords do not appear in the DuckDB process arguments.

Credentialed PostgreSQL and MySQL attachments use invocation-scoped DuckDB `TEMP SECRET` objects and attach by secret name. Dadbod Grip does not create persistent DuckDB secrets because DuckDB stores them unencrypted. Prefer `${VAR}` placeholders in persisted attachment URLs so credentials also stay out of `connections.json`.

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
Parquet, CSV, TSV, JSON, NDJSON, JSONL, Arrow, and IPC support round-trip writes.

**Watch mode** (`--watch` or `gW`): re-runs the query on a timer and updates the
grid automatically. Useful for monitoring changing files.

## MotherDuck

Attach MotherDuck to an active DuckDB connection:

```vim
:GripConnect duckdb::memory:
:GripAttach md:my_database cloud
```

Set `MOTHERDUCK_TOKEN` in your shell environment before attaching. Query the attached
database through the `cloud` alias. A bare `md:` URL is not a supported primary
connection in Dadbod Grip.
