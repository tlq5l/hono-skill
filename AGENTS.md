# Hono Web Framework Skill

> Hono web framework patterns for AI coding agents. Lightweight, multi-runtime (Cloudflare, Bun, Node, Deno), middleware, typed routes, and patterns that differ from Express.

**Version**: 0.1.0 | **Status**: draft | **Generated**: 2026-01-16
**Source**: [honojs/hono](https://github.com/honojs/hono) @ v4.11.4

---

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

---

## Setup & Routing

## App Creation and Basic Routing

Hono uses a Context-based API, not Express's `req/res` pattern. You **must return** the response.

**Incorrect (Express pattern):**

```typescript
import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello' })  // Side effect, no return
})
```

**Correct (Hono pattern):**

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Hello' })  // Must return!
})

export default app
```

**Path parameters:**

```typescript
app.get('/user/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

// Optional parameters
app.get('/posts/:id?', (c) => {
  const id = c.req.param('id') // string | undefined
  return c.json({ id })
})
```

**Query parameters:**

```typescript
app.get('/search', (c) => {
  const q = c.req.query('q')        // Single value
  const tags = c.req.queries('tag') // Multiple values
  return c.json({ q, tags })
})
```

Reference: [Hono Routing](https://hono.dev/docs/api/routing)

---

## Core Concepts

## Body Parsing

Hono provides distinct methods for parsing different body types.

**JSON:**
Use `c.req.json()` for JSON payloads.

```typescript
app.post('/api/data', async (c) => {
  const data = await c.req.json()
  return c.json(data)
})
```

**Form Data / Multipart:**
Use `c.req.parseBody()` for `application/x-www-form-urlencoded` or `multipart/form-data`.

```typescript
app.post('/submit', async (c) => {
  const body = await c.req.parseBody()
  const username = body['username']
  const file = body['file'] // File object if uploaded
  return c.text(`Hello ${username}`)
})
```

**Raw ArrayBuffer:**
Use `c.req.arrayBuffer()` for raw binary data.

```typescript
app.post('/upload', async (c) => {
  const buffer = await c.req.arrayBuffer()
  // process buffer
  return c.text('Uploaded')
})
```

**Note:** `parseBody` handles both urlencoded and multipart automatically.

---

## Context Object Pattern

Hono consolidates request and response into a single Context (`c`) object. This is NOT like Express.

**Incorrect (Express mental model):**

```typescript
app.get('/', (req, res) => {
  const body = req.body           // ❌ No req.body
  res.send('Hello')               // ❌ No res.send()
  res.json({ ok: true })          // ❌ No res.json()
})
```

**Correct (Hono Context):**

```typescript
app.get('/', async (c) => {
  // Request access
  const body = await c.req.json()           // Parse JSON body
  const form = await c.req.parseBody()      // Parse form data
  const text = await c.req.text()           // Raw text
  const header = c.req.header('User-Agent') // Get header

  // Response helpers
  return c.json({ ok: true })     // JSON response
  return c.text('Hello')          // Text response
  return c.html('<h1>Hi</h1>')    // HTML response
  return c.redirect('/other')     // Redirect
})
```

**Setting headers and status:**

```typescript
app.get('/custom', (c) => {
  c.status(201)
  c.header('X-Custom', 'value')
  return c.json({ created: true })
})
```

**Raw Request access (Web Standard):**

```typescript
app.get('/raw', (c) => {
  const request = c.req.raw  // Standard Request object
  return c.json({ url: request.url })
})
```

Reference: [Context](https://hono.dev/docs/api/context)

---

## Error Handling

Hono uses `HTTPException` and `app.onError()` for error handling.

**Incorrect (Express error handling):**

```typescript
// Express pattern - doesn't work in Hono
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})
```

**Correct (Hono error handling):**

```typescript
import { HTTPException } from 'hono/http-exception'

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Throwing HTTPException
app.get('/protected', (c) => {
  const token = c.req.header('Authorization')
  if (!token) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  return c.json({ ok: true })
})
```

**HTTPException with custom response:**

```typescript
throw new HTTPException(403, {
  message: 'Forbidden',
  res: new Response('Custom forbidden page', {
    status: 403,
    headers: { 'Content-Type': 'text/html' }
  })
})
```

**Not Found handler:**

```typescript
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})
```

**Try-catch in handlers:**

```typescript
app.get('/data', async (c) => {
  try {
    const data = await fetchData()
    return c.json(data)
  } catch (e) {
    throw new HTTPException(500, { message: 'Failed to fetch' })
  }
})
```

Reference: [Error Handling](https://hono.dev/docs/api/exception)

---

## Middleware Pattern

Hono middleware uses async/await with `await next()`. This is NOT like Express's callback-based `next()`.

**Incorrect (Express middleware pattern):**

```typescript
// Express - callback style
app.use((req, res, next) => {
  console.log('Before')
  next()  // Callback, no await
  console.log('After')  // Runs immediately, not after handler
})
```

**Correct (Hono middleware pattern):**

```typescript
// Hono - async/await onion style
app.use('*', async (c, next) => {
  console.log('Before')
  await next()  // Wait for downstream handlers
  console.log('After')  // Runs AFTER handler completes
})
```

**Timing middleware example:**

```typescript
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
})
```

**Path-specific middleware:**

```typescript
// Only for /api/* routes
app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})
```

**Middleware must NOT return if it wants to continue:**

```typescript
// ❌ Wrong - returning stops the chain
app.use('*', async (c, next) => {
  console.log('logging')
  return c.text('oops')  // This stops execution!
})

// ✅ Correct - call next() to continue
app.use('*', async (c, next) => {
  console.log('logging')
  await next()  // Continue to handler
})
```

Reference: [Middleware](https://hono.dev/docs/guides/middleware)

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

---

## Middleware

## Built-in Middleware

Hono includes many built-in middleware. Import from `hono/<middleware-name>`.

**CORS:**

```typescript
import { cors } from 'hono/cors'

app.use('/api/*', cors())
app.use('/api/*', cors({
  origin: 'https://example.com',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
```

**Logger:**

```typescript
import { logger } from 'hono/logger'

app.use('*', logger())
```

**JWT:**

```typescript
import { jwt } from 'hono/jwt'

app.use('/api/*', jwt({ secret: 'your-secret' }))

app.get('/api/protected', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload)
})
```

**Bearer Auth:**

```typescript
import { bearerAuth } from 'hono/bearer-auth'

app.use('/api/*', bearerAuth({ token: 'my-token' }))
```

**Basic Auth:**

```typescript
import { basicAuth } from 'hono/basic-auth'

app.use('/admin/*', basicAuth({
  username: 'admin',
  password: 'secret',
}))
```

**Secure Headers:**

```typescript
import { secureHeaders } from 'hono/secure-headers'

app.use('*', secureHeaders())
```

**Available middleware:**
- `hono/cors` - CORS
- `hono/logger` - Request logging
- `hono/jwt` - JWT verification
- `hono/bearer-auth` - Bearer token auth
- `hono/basic-auth` - Basic auth
- `hono/secure-headers` - Security headers
- `hono/etag` - ETag generation
- `hono/compress` - Response compression
- `hono/cache` - Caching
- `hono/csrf` - CSRF protection

Reference: [Built-in Middleware](https://hono.dev/docs/middleware/builtin)

---

## Security Headers Middleware

Add security headers using post-processing middleware pattern.

**Custom security headers middleware:**

```typescript
app.use('*', async (c, next) => {
  try {
    await next()
  } finally {
    const h = c.res.headers

    if (!h.has('Strict-Transport-Security')) {
      h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    if (!h.has('X-Content-Type-Options')) {
      h.set('X-Content-Type-Options', 'nosniff')
    }
    if (!h.has('Referrer-Policy')) {
      h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    }
  }
})
```

**Prefer built-in secureHeaders:**

```typescript
import { secureHeaders } from 'hono/secure-headers'

// ✅ Better - built-in middleware
app.use('*', secureHeaders())
```

**secureHeaders options:**

```typescript
app.use('*', secureHeaders({
  strictTransportSecurity: 'max-age=31536000',
  xContentTypeOptions: 'nosniff',
  xFrameOptions: 'DENY',
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
  }
}))
```

**Post-processing pattern:**

Use `await next()` then modify `c.res.headers` in `finally` block to ensure headers are set even on errors.

Reference: [Secure Headers](https://hono.dev/docs/middleware/builtin/secure-headers)

---

## Input Validation

Use `validator` middleware to validate request data (json, form, query, param, header, cookie).

**With Zod:**

```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post('/user', zValidator('json', schema), (c) => {
  const data = c.req.valid('json') // Typed as { name: string, age: number }
  return c.json(data)
})
```

**Built-in Validator:**

```typescript
import { validator } from 'hono/validator'

app.post('/post', validator('form', (value, c) => {
  const title = value['title']
  if (!title || typeof title !== 'string') {
    return c.text('Invalid title', 400)
  }
  return { title }
}), (c) => {
  const { title } = c.req.valid('form')
  return c.json({ title })
})
```

---

## Runtime Adapters

## Bun and Node.js Setup

Hono runs on Bun natively. For Node.js, use the node adapter.

**Bun setup:**

```typescript
// src/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

```bash
bun run src/index.ts
```

**Bun with explicit port:**

```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello!'))

export default {
  port: 3000,
  fetch: app.fetch,
}
```

**Node.js setup:**

```typescript
// src/index.ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => c.text('Hello Node!'))

serve({
  fetch: app.fetch,
  port: 3000,
})
```

**Install for Node.js:**

```bash
npm install hono @hono/node-server
```

**Accessing environment variables:**

```typescript
import { env } from 'hono/adapter'

app.get('/config', (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  return c.json({ DATABASE_URL })
})
```

**Deno setup:**

```typescript
import { Hono } from 'jsr:@hono/hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

Reference: [Bun](https://hono.dev/docs/getting-started/bun) | [Node.js](https://hono.dev/docs/getting-started/nodejs)

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

---

## Helpers

## Advanced Streaming Patterns

Beyond `streamSSE`, Hono supports raw `ReadableStream` for custom streaming.

**Manual ReadableStream:**

```typescript
app.post('/ai', async (c) => {
  const text = await generateAIResponse()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(text))
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    }
  })
})
```

**Prefer Hono helpers when possible:**

```typescript
import { stream } from 'hono/streaming'

// ✅ Better - uses Hono's context lifecycle
app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('chunk 1')
    await s.write('chunk 2')
  })
})
```

**When to use raw ReadableStream:**

- Custom binary protocols
- Integrating with external streaming APIs
- Fine-grained control over encoding

Reference: [MDN ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## JSX Engine

Hono has a built-in JSX engine that is fast and lightweight. It runs on any runtime.

**Configuration (tsconfig.json):**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

**Usage:**

```typescript
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <h1>My App</h1>
          {children}
        </body>
      </html>
    )
  })
)

app.get('/', (c) => {
  return c.render(<div>Hello!</div>)
})
```

**Streaming:**

```typescript
import { streamSSR } from 'hono/streaming'

app.get('/stream', (c) => {
  return streamSSR(c, async (stream) => {
    await stream.write(<h1>Hello</h1>)
    await stream.write(<p>World</p>)
  })
})
```

---

## Streaming and SSE

Hono provides streaming helpers for real-time responses.

**Basic streaming:**

```typescript
import { stream } from 'hono/streaming'

app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('Hello ')
    await s.sleep(1000)
    await s.write('World!')
  })
})
```

**Text streaming:**

```typescript
import { streamText } from 'hono/streaming'

app.get('/text', (c) => {
  return streamText(c, async (s) => {
    for (const word of ['Hello', ' ', 'World']) {
      await s.writeln(word)
      await s.sleep(500)
    }
  })
})
```

**Server-Sent Events (SSE):**

```typescript
import { streamSSE } from 'hono/streaming'

app.get('/sse', (c) => {
  return streamSSE(c, async (s) => {
    let id = 0
    while (true) {
      await s.writeSSE({
        data: JSON.stringify({ time: Date.now() }),
        event: 'tick',
        id: String(id++),
      })
      await s.sleep(1000)
    }
  })
})
```

**Client-side consumption:**

```javascript
const eventSource = new EventSource('/sse')
eventSource.addEventListener('tick', (e) => {
  console.log(JSON.parse(e.data))
})
```

**Abort handling:**

```typescript
app.get('/stream', (c) => {
  return stream(c, async (s) => {
    s.onAbort(() => {
      console.log('Client disconnected')
    })
    // ... streaming logic
  })
})
```

Reference: [Streaming](https://hono.dev/docs/helpers/streaming)

---

## Migration

## v3 to v4 Migration

Hono v4 removed several deprecated features.

**`c.jsonT()` removed:**

```typescript
// ❌ v3 - obsolete
return c.jsonT({ data: 'typed' })

// ✅ v4 - use c.json()
return c.json({ data: 'typed' })
```

**Streaming moved to helper:**

```typescript
// ❌ v3 - removed from context
return c.stream(async (stream) => { ... })
return c.streamText(async (stream) => { ... })

// ✅ v4 - import from helper
import { stream, streamText } from 'hono/streaming'

app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('Hello')
    await s.sleep(1000)
    await s.write('World')
  })
})
```

**Next.js adapter renamed:**

```typescript
// ❌ v3 - obsolete
import { handle } from 'hono/nextjs'

// ✅ v4 - renamed
import { handle } from 'hono/vercel'
```

**Lambda adapter type renamed:**

```typescript
// ❌ v3 - obsolete
LambdaFunctionUrlRequestContext

// ✅ v4 - renamed
ApiGatewayRequestContextV2
```

**Deno import path changed:**

```typescript
// ❌ v3 - no longer published
import { Hono } from 'https://deno.land/x/hono/mod.ts'

// ✅ v4 - use JSR
import { Hono } from 'jsr:@hono/hono'
```

**`app.showRoutes()` moved:**

```typescript
// ❌ v3 - removed
app.showRoutes()

// ✅ v4 - import from dev helper
import { showRoutes } from 'hono/dev'
showRoutes(app)
```

Reference: [Migration Guide](https://github.com/honojs/hono/blob/main/docs/MIGRATION.md)

---

## References

- [Hono Documentation](https://hono.dev)
- [Getting Started](https://hono.dev/docs/getting-started/basic)
- [API Reference](https://hono.dev/docs/api/hono)

---

*Generated from 18 rules.*
