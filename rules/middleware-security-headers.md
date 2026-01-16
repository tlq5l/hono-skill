---
title: Security Headers Middleware
impact: HIGH
impactDescription: Post-processing middleware for security
tags: security, middleware, headers
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
