---
title: Demo Walkthrough
description: Investigate the Softrear Inc. demo database included with dadbod-grip.nvim.
---

# Demo Walkthrough

Run `:GripStart` to open the Softrear Inc. Analyst Portal. The demo database ships
with seventeen tables and realistic narrative data about a consumer goods company
with some unusual patterns in the incident records.

The demo opens as a SQL notebook in the query pad. Place your cursor inside any
`sql` block and press `C-CR` to run it. Results appear in the grid below. Press
`gn` to open a notebook file picker for `.md` and `.sql` files in your project.

## Setup

```vim
:GripStart
```

This seeds a local SQLite database and opens the Softrear Inc. notebook in the
query pad automatically. Seventeen tables appear in the schema sidebar.

## The investigation

Three questions:

1. Is there a product quality problem, and where does it originate?
2. Who knows what, and what has been done about it?
3. What decisions drove the company here, and how were they made?

### 1. Product catalog

The catalog has 500+ SKUs. Sort by softness score ascending to see the edges:

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

Three directives were never publicly acknowledged. One was: "Greg is authorized to
self-certify all SKUs. This is intentional." The other three describe how to rename
the problem in customer communications.

## What you just used

- **Query pad with notebook mode**: `C-CR` runs the SQL block under the cursor
- **Notebook picker**: `gn` opens `.md` and `.sql` files as notebooks
- **FK trail**: a single JOIN query traverses four hops instead of four separate `gf` presses
- **Grid**: each `C-CR` result opens as an editable, sortable, filterable grid below

All of these work the same way against a production database.

## Go deeper

The full notebook lives at `demo/softrear-internal.md` inside the plugin directory.
It covers sixteen sections including the supplier intelligence cross-database join,
the BambooKnows investigation, and the pricing arrangement that created the incentive
to mislabel incoming shipments.

Open it from any session:

```vim
gn   " notebook picker: navigate to demo/softrear-internal.md
```
