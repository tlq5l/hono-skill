---
title: Body Parsing
impact: HIGH
impactDescription: Standardized parsing for JSON/Form/Blob; eliminates manual stream handling
tags: body, json, form, parseBody
---

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

**When NOT to use this pattern:**
- When you need streaming access to the body (use `c.req.raw.body` directly).
- For very large file uploads where buffering the whole body is not feasible (use streaming).

Reference: [Body Parsing](https://hono.dev/docs/api/request#body)
