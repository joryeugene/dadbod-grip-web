---
title: Analysis
description: Profile tables, explain query plans, export data, and filter with a visual builder.
---

# Analysis

## Table profile

Press `gR` or run `:GripProfile` to open a column distribution view. Each column shows
a sparkline histogram, completeness percentage, cardinality estimate, and the top five
most frequent values.

Use this to spot anomalies before writing queries: bimodal distributions, unexpectedly
high NULL rates, or columns with a single value dominating the dataset.

## Column statistics

Press `gS` to open a popup with detailed statistics for the column under the cursor:

- Total count and distinct count
- NULL count and null percentage
- Minimum and maximum values
- Top 10 most frequent values with counts

## Aggregate on selection

Enter visual mode with `V`, select rows in a column, and press `ga`. A popup shows
count, sum, average, minimum, and maximum for the selected cells.

Press `ga` without a selection to aggregate the entire current column across all pages.

## Query Doctor

Run `:GripExplain` or press `gQ` to explain the current query. The output translates
the raw EXPLAIN plan into plain-English health checks with cost bars and index suggestions.

Look for:
- Sequential scans on large tables (missing index)
- Nested loop joins on high-cardinality columns
- Sort steps without an index to satisfy the ORDER BY

## Data diff

Press `gD` or run `:GripDiff` to compare two tables by primary key. The grid shows
rows that differ between the two tables, color-coded by the type of change.

The diff works across databases when running through a DuckDB federation session.

## Filter builder

Press `gF` to open an interactive filter builder. Choose a column, select an operator,
and enter a value. Multiple filters stack with AND.

| Operator | Use for |
|----------|---------|
| `=` / `!=` | Exact match / exclusion |
| `>` / `<` / `>=` / `<=` | Numeric and date ranges |
| `LIKE` | Pattern matching (`%text%` for contains, `text%` for prefix) |
| `IN` | Multiple values: `red,green,blue` |
| `BETWEEN` | Range: `100,500` |
| `IS NULL` / `IS NOT NULL` | Presence checks |

Press `f` for a faster shortcut: it filters the current column to the exact value under
the cursor in one keystroke. Press `F` to clear all active filters.

## Saved filter presets

Save the current filter combination as a named preset with `gP`. A prompt asks for a
preset name. The preset captures all active filters, including column, operator, and value
for each one.

Load a saved preset with `gp`. The picker shows all presets for the current table with
a preview of the filter conditions. Selecting a preset replaces the current filters entirely.

Presets persist in `.grip/filter_presets.json` relative to the current working directory.
They are scoped to the table name, so presets saved on the `orders` table only appear
when viewing `orders`.

## Data diff across databases

`gD` compares two tables by primary key. In a DuckDB federation session, you can diff
a Postgres table against an archive SQLite table:

1. Open a federation session with both databases attached
2. Open the Postgres table in a grid
3. Press `gD` and select the SQLite table as the comparison target

Rows that differ appear color-coded by change type. Useful for migration validation
and schema drift detection.

## Export

Press `gE` to export the current result set to the clipboard in one of six formats:
CSV, TSV, JSON, SQL INSERT, Markdown pipe table, or Grip Table (box-drawing borders).

Press `gX` or run `:GripExport` to write to a file. Choose CSV, JSON, or SQL INSERT.
The file goes to the current working directory by default.

## Sort stacking

Press `s` to toggle sort on the current column (ASC then DESC then off). Press `S` to
add a secondary sort without replacing the first. Columns show their direction and
stack position:

```
 id  ▲1  name  ▼2  created_at
```

This grid is sorted by `id` ascending first, then by `name` descending within ties.
Stack up to as many columns as needed. Press `X` to clear all sorts, filters, and
pagination in one keystroke.
