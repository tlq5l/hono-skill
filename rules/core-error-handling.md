---
title: Error Handling
impact: HIGH
impactDescription: Different from Express error handling
tags: errors, exception, handling
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
