---
title: Watch Mode
description: Watch mode refreshes a grid on a timer so you can monitor changing data inside Neovim.
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

The interval suffix is `s` (seconds). Choose a positive interval, such as `3s` or `10s`.

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
- Refresh ticks are skipped while mutations are staged. Apply or undo those edits
  before expecting another refresh. Query failures are reported by the normal
  refresh path; watch mode does not guarantee an automatic stop on schema changes.
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

Watch mode and local-file write mode (`g!`) can both be enabled. They toggle
independently: watch re-reads the source, while write mode applies staged edits back
to the file. Watch skips refreshes while those edits are pending.
