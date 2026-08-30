---
title: Cross-Database Federation
description: Dadbod Grip uses DuckDB to join PostgreSQL, MySQL, SQLite, remote files, and S3 sources.
---

# Cross-Database Federation

dadbod-grip uses DuckDB as a federation hub. Attach any combination of PostgreSQL, MySQL,
SQLite, and MotherDuck databases alongside local files, remote URLs, and S3 paths.
Query all of them in a single SQL statement.

Every DuckDB statement is sent through standard input, so SQL, DSNs, attachment declarations, and secret bodies stay out of process arguments. Credentialed PostgreSQL and MySQL attachments use temporary, invocation-scoped DuckDB secrets. Dadbod Grip never creates persistent DuckDB secrets.

## How it works

Start with a DuckDB connection (file or memory), then attach external sources:

```vim
:GripAttach postgres:dbname=production host=db.internal user=app  prod
:GripAttach mysql:database=warehouse host=mysql.internal user=app  warehouse
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

Execute from the query pad with `<C-CR>`. Results open in a grid. Joined result sets remain read-only because they do not map back to one editable table.

## Required extensions

DuckDB installs the necessary scanner extension automatically when you attach:

| Attachment prefix | Extension installed |
|-------------------|---------------------|
| `postgres:` | `postgres_scanner` |
| `mysql:` | `mysql_scanner` |
| `sqlite:` | `sqlite_scanner` |
| `md:` | MotherDuck cloud client |

You do not need to run `INSTALL` or `LOAD` manually.

Use `${VAR}` placeholders for credentials in persisted attachment URLs. Dadbod Grip resolves them only when the command is dispatched.

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

## Sidebar keymaps for federation

From the schema sidebar, two keymaps manage attachments without leaving the buffer:

| Key | Action |
|-----|--------|
| `ga` | Attach an external database (prompts for URL and alias) |
| `gd` | Detach an attached database (picker) |

The sidebar shows each attached database as a separate section with its own table list
and PK/FK markers.

## Detach

```vim
:GripDetach
```

Select the attachment to remove from a picker. Or press `gd` in the schema sidebar.

## Auto-restore on reconnect

Attachments persist in `.grip/connections.json`. When you reconnect to the same DuckDB
file in a future session, all previous attachments restore automatically. You do not
need to re-run `:GripAttach` each time.

## MotherDuck

MotherDuck is a cloud DuckDB service. Attach it the same way as any other source:

```vim
:GripAttach md:my_database  cloud
```

Set `MOTHERDUCK_TOKEN` in your shell environment. The `md:` prefix tells DuckDB to use
the MotherDuck client extension, which installs automatically on first use.
