---
title: Middleware Pattern
impact: HIGH
impactDescription: Proper async execution; prevents 'hanging request' bugs common in callback styles
tags: middleware, async, next
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
