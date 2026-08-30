---
title: Commands
description: Dadbod Grip's public commands connect, query, inspect, edit, export, and manage the workspace.
---

# Commands

The plugin's Lazy spec registers every public command, so a lazy.nvim configuration does not need a copied `cmd` list.

| Command | What it does |
|---------|--------------|
| `:Grip` | It accepts a table, SQL, file, or URL. File arguments also accept `--write`, `--watch`, or `--watch=Ns`. |
| `:GripSchema` | It toggles the schema sidebar. |
| `:GripTables` | It opens the table picker with a column preview. |
| `:GripQuery` | It opens the query pad and inserts an optional SQL argument. |
| `:GripSave` | It saves the query pad under `.grip/queries/` with an optional name. |
| `:GripLoad` | It loads an optional saved-query name or opens the picker. |
| `:GripHistory` | It opens query history with timestamps and SQL previews. |
| `:GripConnect` | It connects to an optional URL or opens the connection picker. |
| `:GripExplain` | It explains an optional SQL argument and shows heuristic warnings. |
| `:GripProfile` | It profiles an optional table's column distributions. |
| `:GripAsk` | It asks the configured AI provider to generate SQL from a question. |
| `:GripProperties` | It shows columns, indexes, row estimates, and table size for an optional table. |
| `:GripRename` | It accepts old and new names, then previews and renames the column. |
| `:GripCreate` | It opens the interactive table designer. |
| `:GripDiff` | It accepts two tables and compares them by primary key. |
| `:GripDrop` | It previews and drops an optional table after typed confirmation. |
| `:GripExport` | It exports the current page or all filtered and sorted rows to a file. |
| `:GripAttach` | It accepts a DSN and alias, then attaches PostgreSQL, MySQL, SQLite, or MotherDuck to DuckDB. |
| `:GripDetach` | It detaches an optional DuckDB alias. |
| `:GripOpen` | It opens a local, HTTPS, or S3 path without saving a connection. |
| `:GripFill` | It asks the configured AI provider for an optional row count and stages the returned values. |
| `:GripStart` | It recreates and opens the bundled demo database. |
| `:GripHome` | It returns to the welcome screen. |
| `:GripToggle` | It closes all Dadbod Grip windows or restores them when they are closed. |

Press `<C-p>` from the Grid, Query Pad, or Sidebar to search the actions available there. The [keymap explorer](../keymaps) shows the default bindings by surface and mode.
