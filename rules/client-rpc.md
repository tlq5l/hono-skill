---
title: RPC Client
impact: HIGH
impactDescription: Type-safe RPC with hc
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

**Features:**
- Full type safety for paths, methods, request data, and response data
- No code generation required
- Works in any fetch-compatible environment
