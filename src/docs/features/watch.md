---
title: Watch Mode
description: Auto-refresh the grid on a timer. Monitor live tables, log streams, and changing data without leaving Neovim.
---

# Watch Mode

Watch mode re-runs the current query on a configurable interval and updates the grid
in place. Use it to monitor tables that change frequently: job queues, event logs,
real-time dashboards, or any table you want to tail.

## Start with a flag

```vim
:Grip table_name --watch           " default 5-second interval
:Grip table_name --watch=10s       " 10-second interval
:Grip table_name --watch=30s       " 30-second interval
```

The interval suffix is `s` (seconds). The minimum is 1 second.

## Toggle on an open grid

Press `gW` from any open grid to toggle watch mode on or off without closing the grid.

A blue **WATCH** badge appears in the grid winbar while watch mode is active:

```
 customers  [WATCH 5s]  page 1/3
```

The badge shows the current interval. The grid refreshes silently in the background
without moving the cursor.

## Behavior

- The query re-runs from scratch on each tick. New rows appear, deleted rows disappear,
  updated rows reflect their new values.
- Sort, filter, and page state are preserved across refreshes. If you have filtered
  to `status = 'pending'` and paginated to page 2, that view stays intact.
- If the underlying table changes schema between ticks, watch mode stops and shows an
  error in the status bar.
- Watch mode stops automatically when you close the grid or switch to a different table.

## Useful patterns

**Monitor a job queue:**
```sql
SELECT id, status, payload, created_at
FROM jobs
WHERE status IN ('pending', 'running')
ORDER BY created_at DESC
```
Open with `--watch=3s`. Watch rows move from `pending` to `running` to `done` in real time.

**Tail a log table:**
```sql
SELECT timestamp, level, message
FROM application_logs
ORDER BY timestamp DESC
LIMIT 50
```
Open with `--watch=5s`. The 50 most recent log lines update every 5 seconds.

**Track a counter:**
```sql
SELECT COUNT(*) AS total, COUNT(CASE WHEN processed THEN 1 END) AS done
FROM events
```
A single-row aggregate that ticks forward as events are processed.

## Watch mode and write mode

Watch mode and write mode (`g!`) are mutually exclusive. Watch mode re-fetches from
the source on each tick. Write mode stages edits to write back to a file. Enabling one
disables the other.
