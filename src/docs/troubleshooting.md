---
title: Troubleshooting
description: This guide explains how to fix common Dadbod Grip setup failures.
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
| SQL Server | `sqlcmd` | `which sqlcmd` |

The adapter reports a missing client when it tries to run a command. For example:

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

Run `:checkhealth dadbod-grip` inside Neovim to see a checklist of installed database clients. An installed `ollama` executable also satisfies the optional AI-provider check without a cloud API key.

---

## Connection string rejected

The format varies by database. The most common mistakes:

**PostgreSQL** uses a connection URI, not a DSN keyword string:

```
postgresql://user:${DB_PASSWORD}@host:5432/dbname
```

Not `host=localhost dbname=mydb`. Test the same endpoint with the client, but keep the password out of the command arguments:

```sh
psql -h host -p 5432 -U user -d dbname -c "SELECT 1"
```

Let `psql` read the password from `.pgpass` or `PGPASSWORD`; do not paste a credential-bearing URL into `argv` or shell history.

**MySQL** uses `mysql://` as the scheme:

```
mysql://user:${DB_PASSWORD}@host:3306/dbname
```

Dadbod Grip passes the host, port, user, and database to `mysql`. Configure TLS through the
client's normal option files; the adapter does not translate URL query parameters into
`mysql` flags.

MariaDB also accepts the explicit `mariadb://` scheme while using the compatible `mysql` client:

```
mariadb://user:${DB_PASSWORD}@host:3306/dbname
```

**SQLite** takes a file path, absolute or `~`-expanded:

```
sqlite:///Users/you/data.db
sqlite:~/.local/share/myapp.db
```

**DuckDB** in-memory:

```
duckdb::memory:
```

Persistent file:

```
duckdb:/path/to/file.db
```

**SQL Server** accepts `sqlserver://` and `mssql://` URLs:

```
sqlserver://user:${DB_PASSWORD}@host:1433/dbname
```

Server-certificate validation is enabled by default. Use `encrypt=optional`, `encrypt=mandatory`, or `encrypt=strict` to select an encryption mode. `trust_server_certificate=true` is an explicit development escape hatch. Use `server_certificate=<url-encoded-path>` to pin a certificate path; it requires mandatory or strict encryption and cannot be combined with `trust_server_certificate=true`.

**Store connections** in `connections.json` so you do not retype them. Run `:GripConnect` and choose `+ New connection`; keep credentials in environment placeholders rather than literal URLs.

---

## DuckDB extension auto-install fails

DuckDB installs extensions such as `httpfs`, `postgres_scanner`, `mysql_scanner`, and `sqlite_scanner` the first time a feature needs them. A network-restricted or offline environment can prevent that download.

**Check what is installed:**

```sql
SELECT * FROM duckdb_extensions() WHERE installed = true;
```

Run this in the query pad (`q` to open, `<C-CR>` to execute).

**Pre-install extensions manually** in the DuckDB prompt from a machine with internet access:

```sql
INSTALL httpfs;
INSTALL postgres_scanner;
INSTALL mysql_scanner;
INSTALL sqlite_scanner;
```

The extension files land in `~/.duckdb/extensions/`. Copy that directory to the offline machine.

---

## Keymaps not responding

**Check for conflicts first.** Run `:verbose nmap gl` from the buffer where grip is open. If another plugin owns `gl`, its mapping will show at the top.

**Remap any conflicting key** via `setup()`. The example below moves the live SQL preview from `gl` to `<leader>ls` and binds apply to `<leader>a`:

```lua
require("dadbod-grip").setup({
  keymaps = {
    grid = {
      live_sql = "<leader>ls",
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

Dadbod Grip uses `picker = "builtin"` by default. Set it to `"telescope"` or `"snacks"` to delegate supported simple pickers. If the configured backend is unavailable, the same invocation falls back to the built-in picker. Connections, saved queries, notebooks, filter presets, and other pickers with Dadbod Grip-specific actions always use the built-in interface.

To rule out a third-party load problem, force the built-in picker explicitly:

```lua
require("dadbod-grip").setup({
  picker = "builtin"
})
```

**Telescope not loading?** Make sure it is in your plugin spec and `require("telescope").setup({})` runs before Dadbod Grip opens a delegated picker.

**Snacks not loading?** Make sure `snacks.nvim` is loadable before Dadbod Grip opens a delegated picker. Adding it as a dependency of the Dadbod Grip plugin spec gives Lazy the required ordering without a global priority override.
