---
title: SQL Notebooks
description: Dadbod Grip loads Markdown and SQL files into the query pad and executes individual SQL blocks with Ctrl-Enter.
---

# SQL Notebooks

The query pad understands SQL fence blocks in Markdown and SQL paragraphs in plain
SQL. Place your cursor in a SQL block and press `<C-CR>` to run it. Results appear
in the grid below.

## Opening a notebook

Press `gn` from the query pad or schema sidebar. The built-in picker previews
Markdown files in `demo/` and `notebooks/`, plus Markdown and SQL files at the
project root. Discovery is not recursive, and SQL files nested under `notebooks/`
are not included.

Selecting a file copies its contents into the scratch query pad. Editing that pad
does not modify the original notebook file.

## Running a block

Write SQL between triple-backtick fences:

````markdown
Find the products with the lowest softness scores.

```sql
SELECT sku, ply, softness_score
FROM rolls
ORDER BY softness_score ASC
LIMIT 10
```

Inspect the first row before following its relationships.
````

Press `<C-CR>` inside the block or on its opening fence. The fenced SQL runs without
the surrounding narrative.

## What Ctrl-Enter runs

| Context | `<C-CR>` behavior |
|---------|----------------|
| Visual selection | It runs the selected text. |
| Cursor in a SQL fence | It runs that fenced block. |
| Cursor in plain SQL | It runs the surrounding blank-line-delimited SQL paragraph. |
| No statement found | It falls back to the full pad contents. |

Keep the cursor inside a SQL block when working in a Markdown notebook. Outside
a fence, narrative can be treated as a paragraph to execute. In plain SQL, separate
independent statements with blank lines when you want to run them individually.

## Writing and saving notebooks

Edit a Markdown notebook in a regular Neovim file buffer and write it there. Reload
it with `gn` when you want a fresh copy in the query pad. Each SQL block should work
against the current connection without relying on temporary objects from another
query invocation.

In the pad, `<C-s>`, `:GripSave`, and `:w` use the named-query save flow. They save the
entire pad as SQL under the project's `.grip/queries/`; `:w notebooks/analysis.md`
is not a way to write the scratch pad back to a Markdown notebook. Replace the pad
with just the SQL you want to reuse before saving. Use `gq` to load a named query
and `gh` for query history.

Named queries and history persist across Neovim restarts. An unsaved pad and its
active result layout do not automatically restore after exit.

## The demo notebook

`:GripStart` recreates disposable demo data and opens `demo/softrear-internal.md`
with the cursor in its first SQL block. It does not execute the block automatically.
The investigation covers product quality, consumer incidents, a four-hop supply
chain JOIN, and supplier intelligence. Its **Daily practice** section covers
finding a view, inspecting and exporting rows, staging an edit, reviewing SQL,
undoing or applying it, and saving useful SQL. See the [demo guide](../demo) for
client requirements and the optional PostgreSQL schema lab.
