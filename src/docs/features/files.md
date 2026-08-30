---
title: Files and Remote Sources
description: Dadbod Grip opens local files, remote object paths, and MotherDuck databases as live grids.
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

Credentials come from the standard AWS chain: `~/.aws/credentials`, `AWS_ACCESS_KEY_ID` /
`AWS_SECRET_ACCESS_KEY` env vars, or IAM instance role.

For other S3-compatible stores (Cloudflare R2, MinIO, Backblaze B2):

```sql
-- run in the query pad first to configure the endpoint
CREATE TEMP SECRET (
  TYPE s3,
  ENDPOINT 'your-endpoint.example.com',
  KEY_ID 'your-key',
  SECRET 'your-secret'
);
```

## MotherDuck

```vim
:GripOpen md:my_database           " open a MotherDuck cloud database
:GripOpen md:                      " pick from available MotherDuck databases
```

Set `MOTHERDUCK_TOKEN` in your shell environment before connecting.

## Write mode

Write mode makes edits persist back to the source file on disk instead of running DML
against a database. Supported for Parquet, CSV, JSON, NDJSON, and TSV.

```vim
:Grip data.parquet --write         " open in write mode from the start
```

Or toggle write mode on any open grid:

```vim
g!                                 " toggle write mode
```

A red **WRITE** badge appears in the grid winbar when write mode is active. Press `a`
to apply staged edits back to the file. The original file is overwritten.

Write mode supports Parquet, CSV, TSV, JSON, NDJSON, JSONL, Arrow, and IPC. XLSX and ORC remain read-only. Dadbod Grip asks before overwriting a local file; remote URLs are always read-only.

## Combining files in federation

Use `:GripAttach` to bring a file into a DuckDB federation session alongside databases:

```vim
:GripAttach /path/to/enrichment.parquet  enrichment
```

Then JOIN in the query pad:

```sql
SELECT prod.customers.email, enrichment.segment
FROM prod.customers
JOIN enrichment.data ON enrichment.customer_id = prod.customers.id
```

See the Federation docs in the sidebar for the full picture.
