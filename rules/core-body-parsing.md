---
title: Body Parsing
impact: HIGH
impactDescription: Parsing request bodies correctly
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

**Note:** `parseBody` handles both urlencoded and multipart automatically.
