---
title: Context Object Pattern
impact: CRITICAL
impactDescription: Prevents memory leaks/race conditions; single-object context replaces req/res
tags: context, request, response
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
