---
name: hono
description: "Hono web framework patterns: Context-based API (not Express req/res), async middleware, Cloudflare/Bun/Node adapters, typed routes. Use when working with Hono projects."
proactive: match
match:
  - "hono"
  - "from 'hono'"
  - "c.json"
  - "c.text"
  - "c.env"
---

# Hono Web Framework Skill

> Lightweight, multi-runtime web framework. Key patterns that differ from Express.

## Quick Reference

### Minimal App
```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

### Key Differences from Express
| Express | Hono |
|---------|------|
| `req.params.id` | `c.req.param('id')` |
| `res.json(data)` | `return c.json(data)` |
| `next()` callback | `await next()` async |
| `process.env` | `c.env` (Workers) |

## Context Object (NOT req/res)

```typescript
app.get('/users/:id', (c) => {
  const id = c.req.param('id')        // NOT req.params.id
  const page = c.req.query('page')    // NOT req.query.page
  const auth = c.req.header('Authorization')

  return c.json({ id, page })         // MUST return
})
```

**Must return response:**
```typescript
// ❌ Wrong - missing return
app.get('/', (c) => { c.json({ ok: true }) })

// ✅ Correct
app.get('/', (c) => { return c.json({ ok: true }) })
```

## Async Middleware

```typescript
// ❌ Wrong - callback style
app.use('*', (c, next) => { next() })

// ✅ Correct - async/await
app.use('*', async (c, next) => {
  console.log('before')
  await next()
  console.log('after')
})
```

## Built-in Middleware

```typescript
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { jwt } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'

app.use('*', logger())
app.use('/api/*', cors())
```

## Error Handling

```typescript
import { HTTPException } from 'hono/http-exception'

app.get('/protected', (c) => {
  throw new HTTPException(401, { message: 'Unauthorized' })
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  return c.json({ error: 'Server error' }, 500)
})
```

## Cloudflare Workers

```typescript
type Bindings = {
  MY_KV: KVNamespace
  API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  const key = c.env.API_KEY  // NOT process.env
  return c.json({ key })
})

export default app
```

## Node.js Setup

```typescript
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()
app.get('/', (c) => c.text('Hello Node!'))

serve({ fetch: app.fetch, port: 3000 })
```

## Streaming/SSE

```typescript
import { streamSSE } from 'hono/streaming'

app.get('/sse', (c) => {
  return streamSSE(c, async (s) => {
    await s.writeSSE({ data: 'hello', event: 'message' })
  })
})
```

## v3 → v4 Migration

| v3 | v4 |
|----|-----|
| `c.jsonT()` | `c.json()` |
| `c.stream()` | `import { stream } from 'hono/streaming'` |
| `hono/nextjs` | `hono/vercel` |

## tRPC Integration

```typescript
import { trpcServer } from '@hono/trpc-server'

app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext: (_opts, c) => createContext({ context: c }),
}))
```

## Anti-patterns

```typescript
// ❌ Don't use global env singleton
export const env = (globalThis as any).env
import { env } from './env'  // Breaks request isolation

// ✅ Always use c.env in handlers
app.get('/', (c) => c.json({ key: c.env.API_KEY }))
```

Reference: [Hono Docs](https://hono.dev)
