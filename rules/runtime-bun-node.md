---
title: Bun and Node.js Setup
impact: HIGH
impactDescription: Alternative runtimes with different patterns
tags: runtime, bun, node, setup
---

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
