---
title: tRPC Integration
impact: HIGH
impactDescription: Full stack type-safety; shares types without code generation
tags: trpc, integration, typescript
---

## tRPC Integration

Hono integrates with tRPC via `@hono/trpc-server` for type-safe APIs.

**Install:**

```bash
npm install @hono/trpc-server @trpc/server
```

**Setup:**

```typescript
import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import { initTRPC } from '@trpc/server'

// Define tRPC router
const t = initTRPC.create()
const appRouter = t.router({
  hello: t.procedure.query(() => 'Hello from tRPC!')
})

export type AppRouter = typeof appRouter

// Mount on Hono
const app = new Hono()

app.use('/trpc/*', trpcServer({
  router: appRouter,
}))

export default app
```

**With context (auth, db):**

```typescript
import type { Context as HonoContext } from 'hono'

type CreateContextOptions = { context: HonoContext }

async function createContext({ context }: CreateContextOptions) {
  const headers = context.req.raw.headers
  const session = await getSession(headers)
  return { session }
}

app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext: (_opts, context) => createContext({ context }),
}))
```

**Client usage:**

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './server'

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '/trpc' })]
})

const result = await client.hello.query()
```

Reference: [@hono/trpc-server](https://github.com/honojs/middleware/tree/main/packages/trpc-server)
