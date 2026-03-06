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

Run `:GripExplain` or press `gx` to explain the current query. The output translates
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

Supported operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`, `IS NOT NULL`.

Save the current filter combination as a named preset with `gP`. Load presets with `gp`.

## Export

Press `gE` to export the current result set to the clipboard in one of six formats:
CSV, TSV, JSON, SQL INSERT, Markdown pipe table, or Grip Table (box-drawing borders).

Press `gX` or run `:GripExport` to write to a file. Choose CSV, JSON, or SQL INSERT.
The file goes to the current working directory by default.

## Sort and pagination

| Key | Effect |
|-----|--------|
| `s` | Toggle sort on the current column (ASC, DESC, off) |
| `S` | Add secondary sort (indicators show stack order: 1, 2, 3) |
| `H` / `L` | Previous / next page |
| `[P` / `]P` | First / last page |
| `X` | Reset all sorts, filters, and page to defaults |

Sort stacking lets you sort by multiple columns simultaneously. Each column shows its
sort direction and its position in the sort stack.
