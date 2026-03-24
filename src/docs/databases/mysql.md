---
title: MySQL / MariaDB
description: Connect dadbod-grip.nvim to MySQL or MariaDB for editable grids and schema browsing.
---

# MySQL / MariaDB

## Connect

```
mysql://user:pass@host:3306/dbname
mysql://user@localhost/mydb
```

MariaDB uses the same connection format. dadbod-grip auto-detects MariaDB via `mysql --version` and switches to `--batch` output mode automatically. No extra configuration is needed.

## Features

MySQL support covers the core editing workflow: inline cell editing, batch edits,
mutation preview, and schema browsing with PK/FK markers.

## Backslash safety

MySQL sessions set `NO_BACKSLASH_ESCAPES` automatically. Values like `C:\path\to\file`
round-trip correctly. Backslashes in cell values are treated as literals, not escape characters.

## Requirements

`mysql` (the CLI client) must be on your `PATH`.

```bash
which mysql
```

On macOS with Homebrew: `brew install mysql-client`. On Debian/Ubuntu: `sudo apt install mysql-client`.

## Known differences from Postgres

MySQL does not support `RETURNING` clauses on `INSERT`/`UPDATE`/`DELETE`. The grip adapter
handles this internally; the mutation preview and undo stack work correctly.
