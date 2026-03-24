---
title: Power Moves
description: Ten non-obvious dadbod-grip patterns that change how you work, with links to full docs.
---

# Power Moves

The keymaps reference lists every available key. This page covers the ten that change how you think about the plugin. Read this after getting started with your first real database connection.

## G: promote a connection to global

When you save a connection in one project, it stays in that project's `.grip/connections.json`. To make it available everywhere, open the connection picker and press `G`. The connection copies to `~/.grip/connections.json` and appears in every project from that point forward. Do this once per database and you will never type that connection string again.

See: [Connections](/docs/features/connections)

## `{` and `}`: navigate staged rows

When you have staged edits scattered across a large table, `{` jumps to the previous modified row and `}` jumps to the next. This lets you review every pending change before pressing `a` to apply. Without these, you are scrolling and hoping you caught everything.

See: [Editing and Mutations](/docs/features/editing)

## gd: visual row diff

Select exactly two rows in visual mode and press `gd`. Cells that differ between the two rows highlight in amber. Matching cells are unchanged. This is faster than reading both rows side-by-side and spotting differences manually, especially in wide tables with many columns.

`gd` differs from `K` (which stacks rows as key-value floats for reading) and from `gD` (which diffs two entire tables by primary key across databases).

See: [Analysis](/docs/features/analysis)

## GripFill N: AI-generated test data

Run `:GripFill 10` to stage ten AI-generated rows. The AI reads the table schema including column types, NOT NULL constraints, and foreign key relationships, then produces varied, plausible values that satisfy all constraints. This is faster than writing INSERT statements for test data and produces more realistic values than `generate_series`.

See: [AI SQL Generation](/docs/features/ai)

## ai = false: turn off all AI features

If you are in an environment without API key access, or you simply do not want AI features, set `ai = false` in your setup call:

```lua
require('dadbod-grip').setup({ ai = false })
```

Schema pre-warm is skipped, `A` and `gA` are not registered, and `:GripFill` is unavailable. SQL completion still works because it reads local schema data.

See: [AI SQL Generation](/docs/features/ai)

## connections_path: shared team config

Point an entire team at one connections file:

```lua
require('dadbod-grip').setup({
  connections_path = '/path/to/team/connections.json',
})
```

Check that file into your dotfiles or infrastructure repository. Every teammate gets the same named connections with no per-machine setup.

See: [Connections](/docs/features/connections)

## gQ: query doctor

Press `gQ` on any open grid to explain the current query. The output translates the raw EXPLAIN plan into plain-English health checks with cost bars and index suggestions. Look for sequential scans on large tables: they are the most common source of slow queries and each one is a missing index candidate.

See: [Analysis](/docs/features/analysis)

## K: multi-row reading view

Press `K` in visual mode after selecting several rows to stack them as a labeled key-value float. Each column appears as a labeled row for each selected record. This is the right tool for reading wide rows that horizontal scrolling hides, or for comparing a small number of records by eye.

For exact cell-level diffing between two rows, use `gd` instead.

See: [Editing and Mutations](/docs/features/editing)

## Ctrl-p: command palette

Press `<C-p>` from any surface to open a searchable list of every available action. This is faster than remembering a keymap you use once a week. Type a few letters of what you want to do: "export", "explain", "history", "notebook." The palette filters as you type and shows the bound key next to each action.

See: [Picker Integration](/docs/features/picker)

## gW: watch mode

Press `gW` to toggle watch mode on the current grid. The query re-runs every five seconds and updates the grid automatically. A blue badge in the grid winbar shows watch mode is active. Use this to monitor a queue table, a log table, or any dataset that changes while you work.

See: [Watch Mode](/docs/features/watch)
