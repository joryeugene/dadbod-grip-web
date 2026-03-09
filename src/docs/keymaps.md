---
title: Keymaps Reference
description: Complete keymap reference for dadbod-grip.nvim grids, query pad, and schema sidebar.
---

# Keymaps Reference

Press `?` from any surface to open the help popup inline. This page is the full reference.

## Grid

The grid buffer is non-editable (`modifiable=false`, `ft=grip`). All single-key
mappings are safe here since there is no insert mode.

### Navigation

| Key | Action |
|-----|--------|
| `j` / `k` | Move down/up rows |
| `h` / `l` | Move left/right within row |
| `w` / `b` | Next / previous column |
| `Tab` / `S-Tab` | Next / previous column |
| `e` | Next column, land at end of cell |
| `gg` | First data row (same column) |
| `G` | Last data row |
| `0` / `^` | First column |
| `$` | Last column |
| `{` / `}` | Previous / next modified row |

### Editing

| Key | Action |
|-----|--------|
| `i` / `<CR>` | Edit cell under cursor |
| `x` | Set cell to NULL |
| `p` | Paste clipboard into cell |
| `P` | Paste multi-line into consecutive rows |
| `o` | Insert new row after cursor |
| `c` | Clone row (copy values, clear PKs) |
| `d` | Toggle delete on current row |
| `u` | Undo last edit (multi-level) |
| `<C-r>` | Redo |
| `U` | Undo all (reset to original) |
| `a` | Apply all staged changes to DB |

### Batch Edit (visual mode)

| Key | Action |
|-----|--------|
| `e` | Set selected cells to same value |
| `d` | Toggle delete on selected rows |
| `x` | Set selected cells to NULL |
| `y` | Yank selected cells in column |

### Display

| Key | Action |
|-----|--------|
| `-` | Hide column under cursor |
| `g-` | Restore all hidden columns |
| `gH` | Column visibility picker |
| `=` | Cycle column width (compact to expanded to reset) |
| `T` | Toggle column type annotations |
| `K` | Row view (vertical transpose) |
| `?` | Show help popup |
| `Q` | Welcome screen (home) |

### Sort / Filter / Pagination

| Key | Action |
|-----|--------|
| `s` | Toggle sort on column (ASC, DESC, off) |
| `S` | Add secondary sort (stacked indicators) |
| `f` | Quick filter by cell value |
| `gn` | Filter: column IS NULL |
| `gF` | Filter builder (=, !=, &gt;, &lt;, &gt;=, &lt;=, LIKE, IN, BETWEEN, NULL, NOT NULL) |
| `<C-f>` | Freeform WHERE clause filter |
| `F` | Clear all active filters |
| `gp` | Load saved filter preset |
| `gP` | Save current filter as preset |
| `X` | Reset view (clear sort, filter, and page) |
| `H` / `L` | Previous / next page |
| `[p` / `]p` | Previous / next page (bracket alias) |
| `[P` / `]P` | First / last page |

### FK Navigation

| Key | Action |
|-----|--------|
| `gf` | Follow foreign key under cursor |
| `<C-o>` | Go back in FK navigation stack |

### Inspection

| Key | Action |
|-----|--------|
| `ge` | Explain cell (type, value, status) |
| `gs` | Preview staged SQL |
| `gc` | Copy staged SQL to clipboard |
| `gi` | Table info (columns, types, PKs) |
| `gI` | Table properties (full detail float) |
| `gN` | Rename column under cursor |
| `gl` | Toggle live SQL preview float |

### Analysis and Export

| Key | Action |
|-----|--------|
| `ga` | Aggregate current column (count, sum, avg, min, max) |
| `gS` | Column statistics popup (distinct, nulls%, top values) |
| `gR` | Table profile (sparkline distributions) |
| `gV` | Show CREATE TABLE DDL float |
| `gQ` | Explain current query plan |
| `gx` | Open URL in current cell (http/https/ftp) |
| `gD` | Diff against another table |
| `gE` | Export to clipboard (CSV, TSV, JSON, SQL, Markdown, Grip Table) |
| `gX` | Export to file (csv, json, or sql) |
| `y` | Yank cell value to clipboard |
| `Y` | Yank row as CSV |
| `gY` | Yank entire table as CSV |
| `gy` | Yank table as Markdown pipe table |

### Surface Navigation (1-9)

Surface jumps use a "press again for secondary" pattern:

| Key | Primary | Secondary (already on that surface) |
|-----|---------|-------------------------------------|
| `1` | Open sidebar | Connections picker |
| `2` | Open query pad | Query history |
| `3` | Grid / records | Table picker |

Table-depth views work consistently across grid, sidebar, and query pad:

| Key | View |
|-----|------|
| `4` | ER diagram float |
| `5` | Column Stats |
| `6` | Columns (schema) |
| `7` | Foreign Keys |
| `8` | Indexes |
| `9` | Constraints |

### Schema and Workflow

| Key | Action |
|-----|--------|
| `go` | Open schema browser sidebar (focus / toggle) |
| `gT` / `gt` | Pick table (floating picker) |
| `gb` | Schema browser sidebar (toggle/focus) |
| `gO` | Open as editable table (read-only to table) |
| `gG` | ER diagram float |
| `gC` / `<C-g>` | Switch database connection |
| `gW` | Toggle watch mode (auto-refresh on timer) |
| `g!` | Toggle write mode (apply overwrites file) |
| `q` | Open query pad |
| `gq` | Load saved query |
| `gh` | Query history browser |
| `r` | Refresh (re-run query) |
| `A` | AI SQL generation |

## Query Pad

The query pad is an editable SQL buffer (`ft=sql`).

| Key | Action |
|-----|--------|
| `<C-CR>` | Execute query |
| `<C-CR>` (visual) | Execute selected SQL only |
| `<C-Space>` | Manually trigger SQL completion |
| `<C-x><C-o>` | SQL completion (omnifunc / nvim-cmp source) |
| `<C-s>` | Save current query |
| `gA` | AI SQL generation |
| `gC` / `<C-g>` | Switch database connection |
| `gb` | Toggle schema browser sidebar |
| `gG` | ER diagram float |
| `gw` | Focus main grid (or welcome screen) |
| `go` / `gT` / `gt` | Pick table (floating picker) |
| `gq` | Load saved query into pad |
| `gh` | Query history |
| `Q` | Welcome screen |
| `?` | Show help |
| `q` | Close query pad |
| `1` | Open sidebar |
| `2` | Query history (secondary: already in query pad) |
| `3` | Jump to grid |
| `4` - `9` | Jump to grid in that view |

SQL completion fires automatically as you type: tables, columns, aliases, and attached federation schemas all appear as candidates.

## Schema Sidebar

| Key | Action |
|-----|--------|
| `<CR>` / `go` | Open table under cursor |
| `gT` / `gt` | Pick table (picker) |
| `gb` | Close sidebar |
| `gq` | Load saved query into query pad |
| `gh` | Query history |
| `gC` / `gc` / `<C-g>` | Switch connection |
| `ga` | Attach external DB (DuckDB federation) |
| `gd` | Detach attached database |
| `gG` | ER diagram float |
| `?` | Show help |
| `1` | Connections picker |
| `2` | Open query pad |
| `3` | Jump to grid / open table as records |
| `4` | ER diagram float |
| `5-9` | Open table under cursor in that view |

## Design Principles

| Surface | `q` | `<Esc>` | `?` | `gC` |
|---------|-----|---------|-----|------|
| Grid | Open query pad | (nothing) | Help | Connections |
| Sidebar | Open query pad | Close | Help | Connections |
| Query pad | Welcome screen | (nothing) | Help | Connections |
| Modal floats | Close | Close | (nothing) | (nothing) |

Uppercase `g` keymaps handle global/navigation actions. Lowercase `g` keymaps handle local inspection and analysis. `?` opens help everywhere.
