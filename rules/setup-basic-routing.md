---
title: App Creation and Basic Routing
impact: CRITICAL
impactDescription: Prevents runtime errors; enforces return of response
tags: setup, routing, basics
---

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

**When NOT to use this pattern:**
- One-off scripts where Express is already set up.
- Legacy codebases with deep Express integration.
- If you need specific features only available in other frameworks (rare).

Reference: [Hono Routing](https://hono.dev/docs/api/routing)
