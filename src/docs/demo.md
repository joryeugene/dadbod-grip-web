---
title: Demo Walkthrough
description: Investigate the Softrear Inc. demo database included with dadbod-grip.nvim.
---

# Demo Walkthrough

Run `:GripStart` to open the Softrear Inc. Analyst Portal. The demo database ships
with seventeen tables and realistic narrative data about a consumer goods company
with some unusual patterns in the incident records.

This walkthrough traces a data quality investigation using about forty keystrokes.

## Setup

```vim
:GripStart
```

This seeds a local SQLite database (at `~/.local/share/nvim/dadbod-grip/softrear.db`)
and connects automatically. The schema sidebar opens on the left.

## Step 1: Browse the schema

Use `j`/`k` to navigate the sidebar. The tables in play are:

- `products` - the product catalog
- `suppliers` - supplier records with region and tier
- `incidents` - consumer-reported problems
- `incident_line_items` - individual products cited in each incident

Press `<CR>` on `incidents` to open the grid.

## Step 2: Profile the data

Press `gR` to open the table profile. Look at the `severity_score` column. The distribution
is bimodal: most incidents cluster at low severity, but there is a secondary peak at the
maximum value with no smooth gradient between them.

Close the profile with `q`.

## Step 3: Filter by high severity

Press `gF` to open the filter builder. Select the `severity_score` column, choose `>`, and
enter `90`. Press `<CR>` to apply.

The grid now shows only the high-severity incidents. Look at the `supplier_id` column.
The same three suppliers appear in almost every row.

## Step 4: Follow the foreign key

Move the cursor to any `supplier_id` cell. Press `gf` to follow the foreign key to the
`suppliers` table. The referenced row opens in a new grid. Note the `tier` and `region`
fields on these suppliers.

Press `<C-o>` to go back to the incidents view.

## Step 5: Cross-reference incident line items

Open the query pad with `q`. Run this query:

```sql
SELECT
  s.name AS supplier,
  s.tier,
  COUNT(DISTINCT i.id) AS incident_count,
  AVG(i.severity_score) AS avg_severity,
  COUNT(DISTINCT ili.product_id) AS affected_products
FROM incidents i
JOIN incident_line_items ili ON ili.incident_id = i.id
JOIN products p ON p.id = ili.product_id
JOIN suppliers s ON s.id = p.supplier_id
WHERE i.severity_score > 90
GROUP BY s.name, s.tier
ORDER BY incident_count DESC;
```

Press `<C-CR>` to execute. The results name the suppliers with the highest concentration
of severe incidents.

## Step 6: Check the timeline

Add a date filter to see whether the pattern predates a specific quarter:

```sql
SELECT
  strftime('%Y-%m', i.created_at) AS month,
  COUNT(*) AS high_severity_incidents
FROM incidents i
WHERE i.severity_score > 90
GROUP BY month
ORDER BY month;
```

The spike begins in a specific month and does not taper off. The data has a sourcing problem,
not a reporting anomaly.

## What you just used

In six steps, the investigation used:

- Schema sidebar navigation (`j`/`k`, `<CR>`)
- Table profiling (`gR`)
- Filter builder (`gF`)
- FK navigation (`gf`, `<C-o>`)
- Query pad with `<C-CR>` execution
- Results rendered as editable grids

All of these work the same way against a production database.
