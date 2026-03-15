---
title: Troubleshooting
description: Common setup failures and how to fix them.
---

# Troubleshooting

Most first-run failures fall into five categories. Work through the one that matches your symptom.

---

## CLI tool not found

dadbod-grip shells out to the database's own CLI tool to run queries. Each adapter requires one:

| Database | Required CLI | Verify |
|----------|-------------|--------|
| PostgreSQL | `psql` | `which psql` |
| MySQL / MariaDB | `mysql` | `which mysql` |
| SQLite | `sqlite3` | `which sqlite3` |
| DuckDB | `duckdb` | `which duckdb` |

The plugin checks on startup. If a tool is missing you will see:

```
Grip: psql not found. Install postgresql-client.
```

**Install by platform:**

PostgreSQL client on macOS:
```sh
brew install libpq
brew link --force libpq
```

PostgreSQL client on Debian/Ubuntu:
```sh
apt install postgresql-client
```

MySQL client on macOS:
```sh
brew install mysql-client
echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
```

DuckDB CLI on all platforms:
```sh
brew install duckdb
```

Or download the binary from [duckdb.org/docs/installation](https://duckdb.org/docs/installation) and place it anywhere on your `$PATH`.

Run `:GripHealth` from inside Neovim to see a checklist of what is installed.

---

## Connection string rejected

The format varies by database. The most common mistakes:

**PostgreSQL** uses a connection URI, not a DSN keyword string:

```
postgresql://user:password@host:5432/dbname
```

Not `host=localhost dbname=mydb`. Test the string directly:

```sh
psql "postgresql://user:password@host:5432/dbname" -c "SELECT 1"
```

**MySQL** uses `mysql://` as the scheme:

```
mysql://user:password@host:3306/dbname
```

If the server requires SSL, append `?ssl-mode=REQUIRED`:

```
mysql://user:password@host:3306/dbname?ssl-mode=REQUIRED
```

**SQLite** takes a file path, absolute or `~`-expanded:

```
sqlite:///Users/you/data.db
sqlite:~/.local/share/myapp.db
```

**DuckDB** in-memory:

```
duckdb://
```

Persistent file:

```
duckdb:///path/to/file.db
```

**Store connections** in `connections.json` so you don't retype them. Run `:GripConnect`, then press `<C-e>` to open the file for editing.

---

## DuckDB extension auto-install fails

DuckDB auto-installs extensions (`httpfs`, `postgres_scanner`, `mysql_scanner`, `sqlite_scanner`) the first time you use a feature that needs them. In network-restricted or offline environments this silently fails.

**Check what is installed:**

```sql
SELECT * FROM duckdb_extensions() WHERE installed = true;
```

Run this in the query pad (`q` to open, `<C-CR>` to execute).

**Pre-install extensions manually** from a machine with internet access:

```sh
duckdb -c "INSTALL httpfs; INSTALL postgres_scanner; INSTALL sqlite_scanner;"
```

The extension files land in `~/.duckdb/extensions/`. Copy that directory to the offline machine.

**Force a specific extension directory** in your grip setup:

```lua
require("dadbod-grip").setup({
  duckdb_extensions_dir = "/path/to/offline/extensions"
})
```

---

## Keymaps not responding

**Check for conflicts first.** Run `:verbose nmap gl` from the buffer where grip is open. If another plugin owns `gl`, its mapping will show at the top.

**Remap any conflicting key** via `setup()`. The example below moves the live SQL preview from `gl` to `gL` and binds apply to `<leader>a`:

```lua
require("dadbod-grip").setup({
  keymaps = {
    grid = {
      live_sql = "gL",
      apply    = "<leader>a",
    }
  }
})
```

All surfaces accept a `keymaps` override table. See `:help dadbod-grip-keymaps` for the full key name list.

**Disable a keymap entirely** by setting its value to `false`:

```lua
require("dadbod-grip").setup({
  keymaps = {
    grid = { live_sql = false }
  }
})
```

**Verify the keymap registered** after setup by running `:nmap gl` in the grip buffer. The output should list `dadbod-grip` as the owner.

---

## Picker not opening

If `<C-p>` (command palette), `gT` (table picker), or `gh` (query history) do nothing, the picker backend may not have loaded.

**What grip tries in order:**

1. `snacks.nvim` (if installed and loaded)
2. `telescope.nvim` (if installed and loaded)
3. Built-in floating picker (always available, no dependencies)

If neither third-party picker is available, grip falls back to the built-in automatically. If you see a blank float or nothing at all, force the built-in explicitly:

```lua
require("dadbod-grip").setup({
  picker = "builtin"
})
```

**Telescope not loading?** Make sure it is in your plugin spec and `require("telescope").setup({})` runs before grip tries to use it. Lazy-loading telescope without the right event trigger is the most common cause.

**Snacks not loading?** Check that `snacks.nvim` is not lazy-loaded on `VeryLazy` while grip loads on `BufEnter`. A load-order mismatch makes snacks unavailable when grip first checks for it. Set `priority = 1000` on the snacks spec or add it as a dependency.
