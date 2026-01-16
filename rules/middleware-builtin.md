---
title: Built-in Middleware
impact: MEDIUM
impactDescription: Common middleware with correct imports
tags: middleware, cors, logger, jwt, auth
---

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
