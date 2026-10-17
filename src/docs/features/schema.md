---
title: Schema Operations
description: Dadbod Grip browses database objects and renames, creates, changes, or drops tables from inside Neovim.
---

# Schema Operations

Press `gb` to focus the schema sidebar. The available groups depend on the adapter:
SQLite has a flat object list, while adapters with schema support can group tables,
views, and routines. PostgreSQL also exposes partition children and function source.

## Find and inspect an object

Use `l` to expand a group or table columns and `h` to fold it or move to its parent.
`L` expands schema and partition levels without loading every table's columns;
`H` collapses the tree. Press `/`, enter an object name or routine signature, and
confirm to reveal matches inside closed groups. `F` clears the search and restores
the previous folds. Enter opens an object or toggles a group. Enter on a PostgreSQL
function opens its definition for inspection; it does not execute the function.

Table columns show their types and primary- or foreign-key markers. Open a table and
press `gI` for its properties. Views are useful for browsing and exports; use a base
table for the [staged editing workflow](editing).

## Rename a column

From the grid, press `gN` on the column you want to rename. Enter the new name, then
review and confirm the generated `ALTER TABLE ... RENAME COLUMN` statement.
This changes the database schema. From the properties float (`gI`), press `R` on a
column row for the same prompted operation.

`:GripRename old_name` also prompts for the new name and confirmation.
`:GripRename old_name new_name` executes directly without a preview or confirmation.
Both command forms require an active table grid and respect a readonly connection.

## Add or drop a column

Open the table properties float with `gI`. Press `+` to enter a column name and type,
then review the generated `ALTER TABLE ... ADD COLUMN` statement. Press `D` on a
column row to drop it after reviewing the confirmation. `T` renames the table.

These column actions belong to the properties float. In the schema sidebar, `+`
creates a table and `D` drops a table.

## Create a table

Press `+` anywhere in the schema sidebar, or run `:GripCreate`. Enter the table name,
then each column's name and type. Leave a column name blank to finish. The first
column defaults to the primary key. Review and confirm the generated `CREATE TABLE`
statement before execution.

## Drop a table

Press `D` on a table in the schema sidebar, or run `:GripDrop [table]`. The confirmation
requires the table name. Dadbod Grip checks incoming foreign-key references and
warns about dependent objects. PostgreSQL and DuckDB can offer `CASCADE`; MySQL,
SQLite, and SQL Server do not receive that clause from Dadbod Grip.

## Command equivalents

| Keymap | Command | Operation |
|--------|---------|-----------|
| `gN` | `:GripRename old_name` | It prompts for a new column name and confirms the DDL. |
| `+` in schema | `:GripCreate` | It prompts for a new table. |
| `D` on a table in schema | `:GripDrop [table]` | It drops a table after typed confirmation. |

## Database-specific behavior

DDL depends on the engine version and your connection's permissions. SQL Server
connections are read-only in Dadbod Grip. SQLite requires 3.25.0 or newer for
[`RENAME COLUMN`](https://www.sqlite.org/releaselog/3_25_0.html) and 3.35.0 or newer
for [`DROP COLUMN`](https://www.sqlite.org/releaselog/3_35_0.html). Dadbod Grip sends
native `ALTER TABLE` statements; it does not rebuild older SQLite tables as a fallback.

The [demo guide](../demo) includes shared SQLite/DuckDB practice and an optional
PostgreSQL lab for schemas, nested partitions, views, and function source.
