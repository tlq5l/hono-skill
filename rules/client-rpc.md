---
title: RPC Client
impact: HIGH
impactDescription: End-to-end type safety; reduces integration bugs by >90%
tags: client, rpc, hc, types
---

## RPC Client (hc)

Hono provides a built-in RPC client `hc` that shares types between server and client.

**Server:**

```typescript
import { Hono } from 'hono'

const app = new Hono()

const route = app.get('/hello', (c) => {
  return c.json({
    message: 'Hello!',
  })
})

export type AppType = typeof route
```

**Client:**

```typescript
import { hc } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('http://localhost:8787')

const res = await client.hello.$get()
const data = await res.json()
console.log(data.message)
```

**When NOT to use this pattern:**
- When the client is written in a language other than TypeScript/JavaScript.
- When the API needs to be consumed by third-party developers without access to your source code types.
- For very simple APIs where the setup overhead outweighs the benefits.

Reference: [RPC](https://hono.dev/docs/guides/rpc)
