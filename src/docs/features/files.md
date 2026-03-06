---
title: Files and Remote Sources
description: Open Parquet, CSV, JSON, S3 paths, HTTPS URLs, and MotherDuck databases as live editable grids.
---

# Files and Remote Sources

dadbod-grip opens any DuckDB-readable source as a live editable grid. You do not need an active
database connection. DuckDB reads the file directly.

## GripOpen

`:GripOpen` is the entry point for file-based sources.

```vim
:GripOpen                      " picker: choose from recent files + connections
:GripOpen data.parquet         " open local Parquet file
:GripOpen logs.csv             " open local CSV
:GripOpen results.json         " open local JSON / NDJSON
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
| `.arrow` | yes | no |

DuckDB auto-detects schema from the file. No setup required.

## Remote HTTPS

Open any publicly accessible Parquet or CSV file directly from a URL:

```vim
:GripOpen https://raw.githubusercontent.com/some-repo/main/data.parquet
:GripOpen https://example.com/exports/report.csv
```

DuckDB streams the file. Large remote files open quickly because DuckDB reads metadata
and fetches only the pages it needs for your current query and page size.

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
CREATE SECRET (
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

Write mode is useful for data cleaning workflows: open a CSV, fix values, apply, done.
No intermediate format conversion. No database needed.

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
