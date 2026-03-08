---
title: SQL Notebooks
description: Open Markdown and SQL files as runnable notebooks. Execute individual SQL blocks with C-CR.
---

# SQL Notebooks

The query pad understands SQL fence blocks inside Markdown and plain SQL files.
Place your cursor inside any block and press `C-CR` to run only that block. The
result appears in the grid below without touching anything else in the file.

## Opening a notebook

Press `gn` from the grid, query pad, or schema sidebar to open the notebook picker.
It scans for `.md` and `.sql` files in your project directory and shows a preview
of each file's contents.

Selecting a file loads it into the query pad. The file content appears as-is,
with the query pad in a read-friendly layout and SQL blocks highlighted normally.

## Running a block

In a Markdown file, blocks are delimited with triple-backtick SQL fences:

````markdown
Some narrative text explaining what we are about to ask.

```sql
SELECT sku, product_name, softness_score
FROM rolls
ORDER BY softness_score ASC
LIMIT 10
```

What to notice in the result.
````

Press `C-CR` with the cursor on any line inside the block (or on the opening fence
line). That block's SQL executes. The surrounding narrative is untouched.

## Block vs buffer execution

The same `C-CR` key does two different things depending on context:

| Context | `C-CR` behavior |
|---------|----------------|
| Cursor inside a ` ```sql ``` ` block | Runs that block only |
| Cursor outside any block | Runs the full buffer as SQL |
| Visual selection active | Runs the selected text |

This lets you use the same key whether you are working with a notebook or a plain
SQL buffer. The block-aware path takes priority when a block is detected.

## Writing notebooks

Any Markdown file with ` ```sql ` blocks works as a notebook. There is no special
file format or frontmatter required. A notebook typically looks like:

- A brief introduction stating the question
- One or more SQL blocks, each preceded by a sentence explaining what it asks
- A sentence after the result describing what to look for

The SQL blocks should be self-contained. Each one should run independently against
the current connection without depending on side effects from previous blocks.

## The demo notebook

`:GripStart` loads the Softrear Inc. demo notebook automatically. It covers sixteen
sections of a data quality investigation: product catalog anomalies, consumer
incidents, a four-hop supply chain JOIN, intelligence analysis, and a cross-database
join against an attached supplier database.

The notebook lives at `demo/softrear-internal.md` inside the plugin directory.
Open it with `gn` from any session to reload it.

## Plain SQL files

`.sql` files also load into the query pad via `gn`. A plain SQL file has no Markdown
fences, so `C-CR` always runs the full buffer unless you use a visual selection. Use
`gq` (load saved query) for the query history workflow; use `gn` for named SQL files
you want to keep on disk as part of a project.

## Saving the current pad content

Press `C-s` in the query pad to save the current content as a named query in
`.grip/saved_queries.json`. Use `gq` to load saved queries back.

To save a notebook as a file on disk, use a normal `:w` write:

```vim
:w notebooks/my-analysis.md
```

The file is plain Markdown. It opens again with `gn` from any session.
