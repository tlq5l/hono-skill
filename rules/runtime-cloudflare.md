---
title: Cloudflare Workers Setup
impact: CRITICAL
impactDescription: Zero-cold-start deployment; native integration with Workers platform bindings
tags: runtime, cloudflare, workers, setup
---

## Cloudflare Workers Setup

Hono is designed for Cloudflare Workers. Use `c.env` for bindings.

**Basic setup:**

```typescript
// src/index.ts
import { Hono } from 'hono'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
  MY_VAR: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hello from Workers!')
})

export default app
```

**Accessing bindings:**

```typescript
app.get('/data', async (c) => {
  // KV
  const value = await c.env.MY_KV.get('key')

  // D1
  const { results } = await c.env.DB.prepare('SELECT * FROM users').all()

  // Environment variable
  const myVar = c.env.MY_VAR

  return c.json({ value, results, myVar })
})
```

**wrangler.toml:**

```toml
name = "my-app"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
MY_VAR = "hello"

[[kv_namespaces]]
binding = "MY_KV"
id = "xxx"

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxx"
```

**Incorrect (using process.env):**

```typescript
// ❌ Wrong - Workers don't have process.env
const apiKey = process.env.API_KEY
```

**Incorrect (global env singleton):**

```typescript
// ❌ Wrong - breaks request isolation, testing issues
// src/env.ts
export const env = (globalThis as unknown as { env: Env }).env

// src/routes.ts
import { env } from './env'  // Anti-pattern!
const key = env.API_KEY
```

**Correct (using c.env):**

```typescript
// ✅ Correct - use c.env for bindings
app.get('/', (c) => {
  const apiKey = c.env.API_KEY
  return c.json({ apiKey })
})
```

**Why c.env matters:**

- Request-scoped: each request gets correct bindings
- Testable: easy to mock in tests
- Future-proof: follows Cloudflare's execution model

Reference: [Cloudflare Workers](https://hono.dev/docs/getting-started/cloudflare-workers)
