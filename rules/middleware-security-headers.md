---
title: Security Headers Middleware
impact: HIGH
impactDescription: Mitigates XSS/Clickjacking; automated security baseline
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

**When NOT to use this pattern:**
- When you are behind a proxy/CDN that already handles security headers (though defense-in-depth is good).
- If a specific header breaks your application (configure it carefully instead of disabling).

Reference: [Secure Headers](https://hono.dev/docs/middleware/builtin/secure-headers)
