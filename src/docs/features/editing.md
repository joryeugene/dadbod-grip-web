---
title: Editing and Mutations
description: Edit database rows inline, stage changes, preview SQL, and apply in a single transaction.
---

# Editing and Mutations

Every change in dadbod-grip goes through a staging layer before it touches the database.
Stage one change or fifty, preview the full SQL, then apply in a single transaction with
a single keystroke.

## Row color legend

Staged changes are color-coded so you can see what will happen before `a` commits anything:

| Color | Meaning |
|-------|---------|
| Teal | Row has staged updates |
| Red | Row is staged for deletion |
| Green | New row staged for insertion |

Nothing has touched the database yet. Press `u` to unstage individual edits or `U` to reset all.

## Edit a cell

Move the cursor to any cell and press `i` or `<CR>`. A popup editor opens with the current
value. Edit and press `<CR>` to stage, or `<Esc>` to cancel.

The row turns teal in the grid. Press `gl` to toggle the live SQL float: it shows the exact
DML statement that will run, updating as you stage more changes.

## NULL values

Press `x` to set a cell to NULL. The cell displays `NULL` in red. The generated SQL uses
`= NULL` correctly (not an empty string).

## Delete a row

Press `d` to toggle delete on the row under the cursor. The row turns red. Press `d` again
to unstage the deletion.

## Insert a new row

Press `o` to insert a new row after the cursor. A blank row opens in the popup editor.
Fill in each column in sequence. The row turns green when staged.

## Clone a row

Press `c` to duplicate the current row. Primary key columns are cleared so you can fill
in a new PK without a conflict. All other columns copy their current values.

## Batch editing

Enter visual mode with `v` or `V`, select multiple rows, then:

- `e` to set all selected cells in the current column to the same value
- `d` to toggle delete on all selected rows
- `x` to NULL all selected cells

## Row view (transpose)

Press `K` to view the current row as a vertical key-value layout. Each column appears as
a labeled row in a floating window, showing the full untruncated value. This is useful for
wide tables where horizontal scrolling hides columns.

In visual mode, select multiple rows and press `K` to stack them in a single float for
side-by-side comparison.

## Conditional formatting

The grid applies automatic formatting based on cell values:

| Value type | Display |
|-----------|---------|
| Negative numbers | Red text |
| Boolean true | Green text |
| Boolean false | Red text |
| Past dates | Dimmed text |
| URLs (http/https/ftp) | Underlined, openable with `gx` |

Conditional formatting is automatic and not configurable. It applies to all grids
regardless of database backend.

## Mutation preview

Press `<C-CR>` from the query pad to preview a mutation before executing. The affected
rows appear color-coded in the grid. Press `a` to execute, `u` to cancel.

## Navigate staged rows

Press `{` to jump to the previous modified row and `}` to jump to the next. Useful when
you have staged edits scattered across a large table and want to review them before applying.

## Apply changes

Press `a` to apply all staged changes. The full mutation runs in a single `BEGIN`/`COMMIT`
transaction. If any statement fails, the entire batch rolls back and the staging layer
stays intact.

## Undo

| Key | Behavior |
|-----|----------|
| `u` | Undo the last staged edit (50-deep) |
| `<C-r>` | Redo |
| `U` | Undo all staged changes (reset to original) |

After applying to the database, press `u` again to open the **transaction undo** layer.
This generates a compensating SQL statement (`UPDATE` with original values, or `INSERT`
for deleted rows) and applies it in a new transaction with confirmation.

## Saved queries

```vim
:GripSave   -- save current query pad contents
:GripLoad   -- load a saved query
```

Queries persist in `.grip/queries/` relative to the current working directory. They
appear in the `gq` picker.

## GripToggle

Run `:GripToggle` to close all grip windows (sidebar, query pad, grid) at once. Run it
again to reopen them in their previous state. This is useful for temporarily reclaiming
screen space without losing your session context.

## Watch mode

Watch mode re-runs the current query on a timer and updates the grid automatically.
Useful for monitoring changing data or log tables.

```vim
:Grip file.csv --watch     -- default 5-second interval
:Grip file.csv --watch=10s -- custom interval
```

Toggle watch mode on any open grid with `gW`. An active watch mode shows as a blue
badge in the grid winbar.

## Write mode

Write mode applies edits back to the file on disk instead of running DML against a database.
Supported for Parquet, CSV, JSON, NDJSON, TSV, and Arrow files opened through DuckDB.

```vim
:Grip data.parquet --write
```

Toggle on any open grid with `g!`. A red badge appears in the grid winbar.
