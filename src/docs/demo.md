---
title: Demo Walkthrough
description: This walkthrough investigates the Softrear Inc. demo database included with Dadbod Grip.
---

# Demo Walkthrough

Run `:GripStart` to open the Softrear Inc. Analyst Portal. The demo database ships
with seventeen base tables and fictional narrative data about a consumer goods company
with some unusual patterns in the incident records.

The demo opens as a SQL notebook in the query pad. Place your cursor inside any
`sql` block and press `<C-CR>` to run it. Results appear in the grid below. Press
`gn` to open a notebook file picker for `.md` and `.sql` files in your project.

## Setup

```vim
:GripStart
```

This creates a local DuckDB database when the `duckdb` client is available and
falls back to SQLite through `sqlite3`. The main notebook requires either client,
and its supplier federation section requires both. Dadbod Grip opens the Softrear
Inc. notebook automatically, with seventeen base tables and an incident summary
view available in the sidebar.
The cursor starts in the first SQL block; opening the demo does not execute it.

## Daily practice

Search the notebook for `Daily practice` to try this short loop with disposable data:

```text
find -> inspect -> filter -> edit -> review SQL -> undo / apply
```

### Find, inspect, and export a view

Press `gb` to focus schema, then `H` to collapse it. Press `/`, enter
`incident_summary`, and confirm. Search reveals matching objects inside closed
groups. Enter opens the view. To clear the sidebar search, press `gb`, then `F` to restore
the previous folds. Press `3` from schema to return to the result.
Both demo engines provide this aggregate view. Browse and export it rather than
editing it.

In the result, move to `max_severity` and press `s` to sort. Press `K` to inspect a
row vertically and `q` to close the float. Press `gX` to export, then choose the
current page or all matching rows. Shortcut hints fit in two rows and remain visible
when the table scrolls horizontally; `?` shows the remaining keys.

### Stage one reversible edit

Run `:Grip consumer_incidents`. Press `<C-f>`, enter `id = 1`, and confirm. Move to
`severity`, press `i`, replace `10` with `9`, and press Enter. This stages the edit;
the database still contains `10`.

Press `gs` to inspect the `UPDATE`, close the preview with `q`, and press `u` to undo.
To try a write, repeat the edit, review it with `gs`, and close the preview with `q`.
Then press `a` and confirm the write.
Press `r` to refresh. Running `:GripStart` again restores the original demo data.

The notebook's **Stage a new lead from a pipe** section also demonstrates
`:GripImport !command`: preview stdout as rows, stage the batch, review its `INSERT`
statements with `gs`, and undo the whole batch with one `u` or apply it with `a`.
The pipe command runs only when you explicitly provide it.

### Keep useful SQL and results

From results, press `2` to return to SQL. Press `gz` to zoom it and again to restore
the splits. Inside SQL, `2` opens history; `gh` also opens history from the main
panes. Pin a result with `gL` and use `gJ` to switch retained results.

To save one query, use `:GripQuery` and replace the pad with just that SQL, then press
`<C-s>` and name it. Saving captures the entire pad, so do not save the investigation
when you intend to keep a single query. `gq` loads saved queries. Named queries and
history persist across restarts; unsaved pad contents and the active result layout
do not automatically restore.

### Explore engine-specific objects

| Local clients | Available practice |
| --- | --- |
| `sqlite3` | The 35-roll investigation, shared summary view, and daily grid tasks. |
| `duckdb` | The 505-roll investigation, summary view, reporting schema, and SQL macro. |
| Both clients | DuckDB practice plus the attached supplier database and cross-database joins. |

SQLite's object list is flat. With DuckDB, expand `reporting` using `l` and open
`reporting.monthly_incidents` under Views. To fold it afterward, press `gb`, move
to `reporting`, and press `h`. Press `2` from schema to return to SQL and run these
statements separately:

```sql
SELECT month, incident_count, highest_priority
FROM reporting.monthly_incidents
ORDER BY month
```

```sql
SELECT reporting.severity_label(4) AS low_priority,
       reporting.severity_label(8) AS high_priority
```

DuckDB macros are callable in SQL; Dadbod Grip does not list them as PostgreSQL
functions. DuckDB file partitions are not PostgreSQL child-table partitions.

For an optional local PostgreSQL lab, follow the
[plugin's demo guide](https://github.com/joryeugene/dadbod-grip.nvim/blob/main/demo/README.md#postgresql-schema-lab).
It requires a local server and `psql`, plus a new disposable database. The lab creates
a fresh `grip_demo` schema and rejects an existing one. It exercises nested partition
discovery, the `open_incidents` view, and function-source inspection. Enter on a
function opens its definition without executing it; call the function explicitly
from SQL when you want a result.

## The investigation

Three questions:

1. Is there a product quality problem, and where does it originate?
2. Who knows what, and what has been done about it?
3. What decisions drove the company here, and how were they made?

### 1. Product catalog

DuckDB loads 505 rolls; the compact SQLite fallback has 35. Both include the
named evidence used here. Sort by softness score ascending to see the edges:

```sql
SELECT sku, ply, softness_score, tensile_strength, discontinued
FROM rolls
ORDER BY softness_score ASC
LIMIT 20
```

`ULTRA_BUDGET_XTRM` surfaces at the top: softness_score = 0.0, discontinued = false.
A product with a zero softness score exists in the catalog and it ships.

### 2. Consumer incidents

How bad are the incidents, and does a pattern emerge in the worst ones?

```sql
SELECT incident_type, severity, roll_sku, notes
FROM consumer_incidents
ORDER BY severity DESC
LIMIT 30
```

Every row with `severity = 10` has `incident_type = 'airplane'`, without exception.
Airline bathrooms are a structural failure mode for this product category.

### 3. The supply chain in one query

Follow the foreign key chain from a consumer incident all the way to the supplier
without leaving the query pad:

```sql
SELECT
  ci.roll_sku,
  ci.severity,
  pb.quality_score,
  pb.recall,
  f.name          AS facility_name,
  f.vibe_score,
  bc.alias        AS supplier_alias,
  bc.our_relationship
FROM consumer_incidents ci
JOIN rolls r               ON r.sku = ci.roll_sku
JOIN production_batches pb ON pb.id = r.batch_id
JOIN facilities f          ON f.id = pb.facility_id
JOIN bamboo_cartel_members bc ON bc.id = f.bamboo_supplier_id
WHERE ci.roll_sku = 'ULTRA_BUDGET_XTRM'
ORDER BY ci.severity DESC
```

The chain: recalled batch, Shanghai Liaison Office, supplier currently under embargo.
The root cause is four foreign keys deep and visible in a single result set.

### 4. What they told themselves

```sql
SELECT directive, publicly_acknowledged, issued_by
FROM leadership_directives
ORDER BY publicly_acknowledged ASC
```

Three directives were never publicly acknowledged, and each one describes how to rename
the problem in customer communications. The only acknowledged directive states: "Greg is
authorized to self-certify all SKUs. This is intentional."

## What you just used

- **Query pad with notebook mode**: `<C-CR>` runs the SQL block under the cursor
- **Notebook picker**: `gn` opens `.md` and `.sql` files as notebooks
- **FK trail**: a single JOIN query traverses four hops instead of four separate `gf` presses
- **Grid**: each `<C-CR>` result opens as a sortable and filterable grid below. Press `gO` when a simple single-table result can be reopened for editing.

The same controls apply to your own database, subject to its adapter and permissions.

## Go deeper

The full notebook lives at `demo/softrear-internal.md` inside the plugin directory.
It includes the supplier intelligence cross-database join,
the BambooKnows investigation, and the pricing arrangement that created the incentive
to mislabel incoming shipments.

From a checkout of the plugin, `gn` finds it under `demo/`. In another project,
`:GripStart` loads the bundled copy directly and recreates the disposable data.
