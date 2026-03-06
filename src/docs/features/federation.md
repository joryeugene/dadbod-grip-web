---
title: Cross-Database Federation
description: Use DuckDB as a hub to JOIN across Postgres, MySQL, SQLite, remote files, and S3.
---

# Cross-Database Federation

dadbod-grip uses DuckDB as a federation hub. Attach any combination of Postgres, MySQL,
SQLite, and MotherDuck databases alongside local files, remote URLs, and S3 paths.
Query all of them in a single SQL statement.

## How it works

Start with a DuckDB connection (file or memory), then attach external sources:

```vim
:GripAttach postgres:dbname=production host=db.internal user=app  prod
:GripAttach sqlite:archive.db  archive
:GripAttach md:analytics  cloud
```

Each attachment gets a schema alias. Use that alias as a SQL prefix:

```sql
SELECT
  prod.customers.email,
  archive.orders.amount,
  cloud.segments.label
FROM prod.customers
JOIN archive.orders ON archive.orders.customer_id = prod.customers.id
JOIN cloud.segments ON cloud.segments.customer_id = prod.customers.id
WHERE prod.customers.plan = 'enterprise'
```

Execute from the query pad with `<C-CR>`. Results open as an editable grip grid.

## Required extensions

DuckDB installs the necessary scanner extension automatically when you attach:

| Attachment prefix | Extension installed |
|-------------------|---------------------|
| `postgres:` | `postgres_scanner` |
| `sqlite:` | `sqlite_scanner` |
| `md:` | MotherDuck cloud client |

You do not need to run `INSTALL` or `LOAD` manually.

## File attachments in federation

Add remote or local files directly in your SQL without attaching them:

```sql
SELECT local.*, remote.value
FROM prod.customers local
JOIN read_parquet('s3://my-bucket/enrichment.parquet') remote
  ON remote.customer_id = local.id
```

Or open a file as a named connection to keep it persistent:

```vim
:GripOpen s3://my-bucket/data.parquet
```

## Persisted attachments

Attachments persist in `.grip/connections.json` and restore automatically when you
reconnect to the same DuckDB file. The sidebar shows each attached database as a
separate section with its own table list.

## Detach

```vim
:GripDetach
```

Select the attachment to remove from a picker. Or use `gd` in the schema sidebar.
