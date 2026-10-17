---
title: Editing and Mutations
description: Dadbod Grip edits database rows inline, stages changes, previews SQL, and sends one mutation batch.
---

# Editing and Mutations

Grid row edits go through a staging layer before they touch the database. Stage one
change or fifty, preview the full SQL, then send one `BEGIN`/`COMMIT` batch with a
single keystroke. Schema operations execute DDL separately; they are not staged row
edits. See [Schema Operations](schema) for their confirmation and execution behavior.

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
value in insert mode. Edit and press `<CR>` to stage. One `<Esc>` enters normal mode
for Vim motions; `q` or another `<Esc>` cancels there. `<C-c>` cancels directly from
insert mode.

The row turns teal in the grid. Press `gl` to toggle the live SQL float: it shows the exact
DML statement that will run, updating as you stage more changes.

## NULL values

Press `x` to set a cell to NULL. The cell displays `NULL` in red. The generated SQL uses
`= NULL` correctly (not an empty string).

## Delete a row

Press `d` to toggle delete on the row under the cursor. The row turns red. Press `d` again
to unstage the deletion.

## Insert a new row

Press `o` to stage a blank row after the cursor. The row turns green, and the cursor
moves to its first cell. Use `i` or `<CR>` to edit cells as needed.

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

Database reads used by the preview show the loading clock. Local preview staging can
pause its animation while Neovim is busy; the clock does not report progress through
the rows.

## Navigate staged rows

Press `{` to jump to the previous modified row and `}` to jump to the next. Useful when
you have staged edits scattered across a large table and want to review them before applying.

## Apply changes

Press `a` to send all staged changes in one `BEGIN`/`COMMIT` batch. A nonzero database-client
exit leaves the staging layer intact. Do not assume the database rolled back every statement;
inspect it after an apply error before retrying the unchanged batch.

The loading clock covers the database write, then finishes before the separate SELECT
reload starts. After a successful reload, the result keeps the two client durations
distinct: `Write: 1.4s client` measures the write call, including client startup and lock
waits, while `Query` measures the refreshed SELECT. These are client measurements,
not server execution time. The Write duration belongs to those refreshed rows and
does not carry into later unrelated results. Successful apply history also keeps the
write duration.

Staged apply, imported-row apply, file write-back, transaction undo, and DDL use the
write clock. Parsing and staging an import, or generating rows with AI, do not write
to the database. [Timing display settings](../getting-started#timing-display) control
the running number and retained durations independently.

If a write wait is interrupted or times out, the loading indicator closes, but the
database may still complete the write. Dadbod Grip reports that the outcome is unknown
and preserves staging. Refresh and check the database before retrying; an interrupted
wait does not prove that the write stopped or rolled back. If you navigate or edit
while the write waits, its completion preserves your newer view and staging.

## Undo

| Key | Behavior |
|-----|----------|
| `u` | Undo the last staged edit (50-deep) |
| `<C-r>` | Redo |
| `U` | Undo all staged changes (reset to original) |

After a reported success, press `u` again to open the **transaction undo** layer.
This generates best-effort compensating SQL (`UPDATE` with original values, or `INSERT`
for deleted rows) and sends it in a new batch after confirmation. Generated keys and lossy
client output can prevent an exact reversal, so review the statement before applying it.

## Saved queries

```vim
:GripSave   -- save current query pad contents
:GripLoad   -- load a saved query
```

Queries persist in `.grip/queries/` at the project root. Dadbod Grip finds the nearest
`.git` or `.grip` directory above the current directory, falling back to the current
directory. Saved queries appear in the `gq` picker; `gh` opens query history.

## GripToggle

Run `:GripToggle` to close visible Grip buffers. Running it again reconnects to the
current connection or opens the connection picker. It does not restore the previous
SQL pad, results, or split layout.

For temporary space, press `gz` or run `:GripZoom` to zoom the current pane. Repeat
the action to restore its split layout. Native `<C-w>` window navigation still works.

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
Supported for Parquet, CSV, TSV, JSON, NDJSON, JSONL, Arrow, and IPC files opened through DuckDB.

```vim
:Grip data.parquet --write
```

Toggle on any open grid with `g!`. A red badge appears in the grid winbar.
