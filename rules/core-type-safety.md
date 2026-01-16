---
title: Type Safety and Generics
impact: HIGH
impactDescription: Hono's key strength - typed routes and env
tags: typescript, types, generics
---

## Type Safety and Generics

Hono uses generics for full type safety. Define `Env` for bindings and variables.

**Typed environment:**

```typescript
type Env = {
  Bindings: {
    DATABASE_URL: string
    API_KEY: string
  }
  Variables: {
    user: { id: string; name: string }
  }
}

const app = new Hono<Env>()

app.get('/profile', (c) => {
  const dbUrl = c.env.DATABASE_URL  // Typed!
  const user = c.get('user')         // Typed!
  return c.json(user)
})
```

**Setting variables in middleware:**

```typescript
app.use('*', async (c, next) => {
  const user = await getUser(c.req.header('Authorization'))
  c.set('user', user)  // Type-safe
  await next()
})
```

**Typed client (RPC mode):**

```typescript
// Server
const routes = app
  .get('/users', (c) => c.json([{ id: '1', name: 'John' }]))
  .post('/users', async (c) => {
    const body = await c.req.json()
    return c.json({ created: body })
  })

export type AppType = typeof routes

// Client
import { hc } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('http://localhost:3000')

const users = await client.users.$get()
const result = await users.json()  // Fully typed!
```

**Validation with Zod:**

```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
})

app.post('/users', zValidator('json', schema), (c) => {
  const data = c.req.valid('json')  // Typed as { name: string, email: string }
  return c.json(data)
})
```

Reference: [RPC](https://hono.dev/docs/guides/rpc)
