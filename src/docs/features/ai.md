---
title: AI SQL Generation
description: Generate SQL from natural language using Anthropic, OpenAI, Gemini, or Ollama.
---

# AI SQL Generation

Press `A` from the grid or `gA` from the query pad to open the AI prompt. Describe
what you want in plain English and the AI generates a SQL query against your current schema.

## Setup

Configure your provider in the `setup()` call:

```lua
require('dadbod-grip').setup({
  ai = {
    provider = 'anthropic',           -- 'anthropic' | 'openai' | 'gemini' | 'ollama'
    model = 'claude-sonnet-4-6',      -- model name for the chosen provider
  }
})
```

Set your API key in your shell environment:

```bash
export ANTHROPIC_API_KEY=...   -- for Anthropic
export OPENAI_API_KEY=...      -- for OpenAI
export GEMINI_API_KEY=...      -- for Gemini
```

Ollama runs locally with no API key needed. Make sure Ollama is running before connecting.

## How the context works

The AI receives:
- Your current schema (table names, column names, types, PK/FK relationships)
- Any existing SQL in the query pad (so you can ask it to modify a query rather than generate from scratch)
- The current table name (when invoked from the grid)

Schema context is cached per connection so repeat invocations do not re-fetch the schema.

## Example prompts

**From a clean query pad:**
> Show me all orders placed in the last 30 days with their customer name and total amount

**To modify an existing query:**
> Add a filter to exclude cancelled orders

**From the grid:**
> Find all rows where this column is above the average

**Cross-database (federation session):**
> Join the Postgres customers table to the SQLite orders table and show me revenue by region

## Supported providers

| Provider | Models | Key env var |
|----------|--------|-------------|
| Anthropic | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001 | `ANTHROPIC_API_KEY` |
| OpenAI | gpt-4.1, gpt-4.1-mini, gpt-4o, o3, o4-mini | `OPENAI_API_KEY` |
| Gemini | gemini-2.5-pro, gemini-2.5-flash | `GEMINI_API_KEY` |
| Ollama | any local model | (none, uses localhost:11434) |

## Modify an existing query

When the query pad already has SQL, the AI uses it as context. You can ask it to
refine rather than generate from scratch:

1. Run a query and get results you want to extend
2. Press `gA` from the query pad (or `A` from the grid to jump to the pad with context)
3. Describe the change: "add a filter for the last 7 days" or "group by status"

The AI rewrites the existing SQL rather than replacing it wholesale.

## The generated SQL goes into the query pad

After generation, the SQL appears in the query pad for review. Press `<C-CR>` to
execute, or edit it first. Nothing runs automatically.

## Both surfaces trigger AI

- `A` from the **grid**: opens or focuses the query pad, pre-fills context for the current table
- `gA` from the **query pad**: generates or modifies SQL in place

Both use the same model and schema context.
