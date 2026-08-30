---
title: MySQL / MariaDB
description: Dadbod Grip connects to MySQL and MariaDB for editable grids and schema browsing.
---

# MySQL / MariaDB

## Connect

```
mysql://user:${DB_PASSWORD}@host:3306/dbname
mysql://user@localhost/mydb
mariadb://user:${DB_PASSWORD}@host:3306/dbname
```

Use `mariadb://` when you want the connection to identify itself explicitly as MariaDB. Both schemes use the compatible `mysql --batch` client protocol, so Dadbod Grip does not need a separate MariaDB executable or a version-detection step.

## Features

MySQL support covers the core editing workflow: inline cell editing, batch edits,
mutation preview, and schema browsing with PK/FK markers.

MariaDB integer display widths are normalized in schema views. For example, `bigint(20) unsigned` appears as `bigint unsigned`; the meaningful `unsigned` modifier remains intact.

## Backslash safety

MySQL sessions set `NO_BACKSLASH_ESCAPES` automatically. Values like `C:\path\to\file`
round-trip correctly. Backslashes in cell values are treated as literals, not escape characters.

## Requirements

`mysql` (the CLI client) must be on your `PATH`.

Dadbod Grip sends session setup and SQL through `mysql` standard input. The host, port, user, and database remain ordinary client arguments, while the password travels through the process environment. Complete connection URLs and SQL do not appear in process arguments.

```bash
which mysql
```

On macOS with Homebrew: `brew install mysql-client`. On Debian/Ubuntu: `sudo apt install mysql-client`.

## Known differences from Postgres

MySQL does not support `RETURNING` clauses on `INSERT`/`UPDATE`/`DELETE`. The grip adapter
handles this internally; the mutation preview and undo stack work correctly.
