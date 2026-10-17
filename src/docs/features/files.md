---
title: Files and Remote Sources
description: Dadbod Grip opens local files and remote object paths as grids and attaches MotherDuck databases through DuckDB.
---

# Files and Remote Sources

Dadbod Grip opens supported files as queryable grids without an active database connection.
DuckDB reads the file directly. Enable write mode only for a supported local format when you
intend to replace that file.

The `duckdb` client must be on your `PATH` before Dadbod Grip can open these sources.

## GripOpen

`:GripOpen` is the entry point for file-based sources.

```vim
:GripOpen                      " picker: choose from recent files + connections
:GripOpen data.parquet         " open local Parquet file
:GripOpen logs.csv             " open local CSV
:GripOpen results.json         " open local JSON / NDJSON
:GripOpen book.xlsx            " open an Excel workbook
```

`GripOpen` does not save the source to `.grip/connections.json`. It opens a read session
without polluting your connection list. Use `:GripConnect` if you want to persist it.

## Local file types

| Extension | Readable | Writable (`--write`) |
|-----------|----------|----------------------|
| `.parquet` | yes | yes |
| `.csv` | yes | yes |
| `.tsv` | yes | yes |
| `.json` | yes | yes |
| `.ndjson` | yes | yes |
| `.jsonl` | yes | yes |
| `.xlsx` | yes | no |
| `.orc` | yes | no |
| `.arrow` | yes | yes |
| `.ipc` | yes | yes |

DuckDB infers the schema from the file, so you do not need to declare it first.

## Remote HTTPS

Open any publicly accessible Parquet or CSV file directly from a URL:

```vim
:GripOpen https://raw.githubusercontent.com/some-repo/main/data.parquet
:GripOpen https://example.com/exports/report.csv
```

DuckDB reads the URL through `httpfs`. Response time depends on the file format, server,
and query; remote URLs remain read-only.

## S3 and object storage

```vim
:GripOpen s3://my-bucket/data/customers.parquet
:GripOpen s3://my-bucket/logs/2025/*.parquet   " glob: all matching files as one table
```

Authentication and any custom endpoint must be available to each DuckDB CLI
invocation. Dadbod Grip does not create an S3 credential-chain secret or replay
arbitrary setup SQL. Running `CREATE TEMP SECRET` in one query does not configure
later queries: each query uses a new DuckDB process. Configure your DuckDB client
for the storage provider before opening a private source.

## MotherDuck

Attach MotherDuck to an active DuckDB connection:

```vim
:Grip duckdb::memory:
:GripAttach md:my_database cloud
```

Set `MOTHERDUCK_TOKEN` in your shell environment before attaching. Then query tables
with the `cloud` prefix. `:GripOpen md:` does not provide a MotherDuck database picker.

## Write mode

Write mode makes edits persist back to the source file on disk instead of running DML
against a database. Supported formats are Parquet, CSV, TSV, JSON, NDJSON, JSONL,
Arrow, and IPC.

```vim
:Grip data.parquet --write         " open in write mode from the start
```

Or toggle write mode on any open grid:

```vim
g!                                 " toggle write mode
```

A red **WRITE** badge appears in the grid winbar when write mode is active. Press `a`
to apply staged edits back to the file. The original file is overwritten.

XLSX and ORC remain read-only. Dadbod Grip asks before overwriting a local file;
remote URLs are always read-only.

## Combining files in federation

Use `:GripAttach` for databases. Read a file with a DuckDB table function in the
same query as the attached tables:

```sql
SELECT prod.customers.email, enrichment.segment
FROM prod.customers
JOIN read_parquet('/path/to/enrichment.parquet') AS enrichment
  ON enrichment.customer_id = prod.customers.id
```

The same pattern accepts an accessible HTTPS or S3 Parquet URL. A file path does
not become an attached database with a `.data` table. See [Federation](federation)
for database attachment examples.
