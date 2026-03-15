---
title: Schema Operations
description: Rename columns, add and drop columns, create and drop tables from within Neovim.
---

# Schema Operations

dadbod-grip supports DDL operations directly from the grid and schema sidebar. Every
operation shows a DDL preview and asks for confirmation before executing.

## Rename a column

From the grid, press `gN` on the column you want to rename. A prompt opens for the
new name. The generated `ALTER TABLE ... RENAME COLUMN` statement appears for confirmation.

From the table properties float (`gI`), press `R` on a column row to rename it.

## Add a column

From the schema sidebar, navigate to a table or its column list and press `+`. A prompt
asks for the column name and type. The generated `ALTER TABLE ... ADD COLUMN` statement
appears for confirmation.

## Drop a column

From the schema sidebar, navigate to a column node and press `-`. The column name
appears in the confirmation prompt along with the `ALTER TABLE ... DROP COLUMN` statement.

## Create a table

From the schema sidebar at the root level (not inside a table), press `+`. An interactive
column designer opens where you define each column's name, type, nullable flag, and
primary key membership. The generated `CREATE TABLE` statement appears for review.

## Drop a table

From the schema sidebar, navigate to a table and press `D`. A typed confirmation prompt
requires you to type the table name to proceed. The generated `DROP TABLE` statement
includes CASCADE awareness: if other tables have foreign keys referencing this table,
the prompt warns about dependent objects.

## Command equivalents

| Keymap | Command | Operation |
|--------|---------|-----------|
| `gN` | `:GripRename old new` | Rename column |
| `+` (on table) | `:GripCreate` | Create table |
| `D` (on table) | `:GripDrop [table]` | Drop table |

## Database-specific behavior

| Database | Rename column | Add column | Drop column | Create table | Drop table |
|----------|---------------|------------|-------------|--------------|------------|
| PostgreSQL | Full support | Full support | Full support | Full support | CASCADE / RESTRICT |
| MySQL | Full support | Full support | Full support | Full support | CASCADE |
| SQLite | Limited (requires table rebuild on older versions) | Full support | Limited (requires table rebuild) | Full support | Full support |
| DuckDB | Full support | Full support | Full support | Full support | Full support |

SQLite before 3.35.0 does not support `ALTER TABLE ... RENAME COLUMN` or `DROP COLUMN`
natively. On older SQLite versions, these operations may not be available.
