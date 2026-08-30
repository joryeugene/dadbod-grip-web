---
title: SQL Server
description: Dadbod Grip connects to SQL Server through sqlcmd with certificate validation enabled by default.
---

# SQL Server

Dadbod Grip provides read-only SQL Server grids, schema browsing, filtering, sorting, pagination, and query plans through Microsoft's `sqlcmd` client.

## Connect

Both URL schemes select the same adapter:

```text
sqlserver://user:${DB_PASSWORD}@host:1433/database
mssql://user:${DB_PASSWORD}@host:1433/database
```

`sqlcmd` must be on your `PATH`. Run `:checkhealth dadbod-grip` to verify it is available.

## TLS options

Dadbod Grip validates the server certificate by default. Both URL schemes accept the same query parameters:

| Parameter | Behavior |
|-----------|----------|
| `encrypt=optional` | The client permits an unencrypted connection. |
| `encrypt=mandatory` | The client requires encryption and validates the certificate. This is the default. |
| `encrypt=strict` | The client uses strict encryption and certificate validation. |
| `trust_server_certificate=true` | The client encrypts the connection but skips certificate validation. Use this only for local development. |
| `server_certificate=<url-encoded-path>` | The client validates against the specified certificate file. |

For example:

```text
sqlserver://app@db.internal:1433/warehouse?encrypt=strict
sqlserver://app@localhost:1433/dev?encrypt=mandatory&trust_server_certificate=true
mssql://app@db.internal:1433/warehouse?encrypt=strict&server_certificate=%2Fetc%2Fssl%2Fdb.pem
```

`server_certificate` requires mandatory or strict encryption and cannot be combined with `trust_server_certificate=true`.

## Session behavior

Every command enables `QUOTED_IDENTIFIER`, and Dadbod Grip translates grid pagination into SQL Server's `OFFSET` and `FETCH` syntax. Passwords travel in the command environment instead of process arguments.

SQL Server support is read-only in this release. The query pad can run SQL, but the editable-grid mutation workflow and DDL actions are unavailable for this adapter.
