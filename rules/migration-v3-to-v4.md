---
title: v3 to v4 Migration
impact: HIGH
impactDescription: Breaking changes from Hono v3
tags: migration, v3, v4, breaking
---

## v3 to v4 Migration

Hono v4 removed several deprecated features.

**`c.jsonT()` removed:**

```typescript
// ❌ v3 - obsolete
return c.jsonT({ data: 'typed' })

// ✅ v4 - use c.json()
return c.json({ data: 'typed' })
```

**Streaming moved to helper:**

```typescript
// ❌ v3 - removed from context
return c.stream(async (stream) => { ... })
return c.streamText(async (stream) => { ... })

// ✅ v4 - import from helper
import { stream, streamText } from 'hono/streaming'

app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('Hello')
    await s.sleep(1000)
    await s.write('World')
  })
})
```

**Next.js adapter renamed:**

```typescript
// ❌ v3 - obsolete
import { handle } from 'hono/nextjs'

// ✅ v4 - renamed
import { handle } from 'hono/vercel'
```

**Lambda adapter type renamed:**

```typescript
// ❌ v3 - obsolete
LambdaFunctionUrlRequestContext

// ✅ v4 - renamed
ApiGatewayRequestContextV2
```

**Deno import path changed:**

```typescript
// ❌ v3 - no longer published
import { Hono } from 'https://deno.land/x/hono/mod.ts'

// ✅ v4 - use JSR
import { Hono } from 'jsr:@hono/hono'
```

**`app.showRoutes()` moved:**

```typescript
// ❌ v3 - removed
app.showRoutes()

// ✅ v4 - import from dev helper
import { showRoutes } from 'hono/dev'
showRoutes(app)
```

Reference: [Migration Guide](https://github.com/honojs/hono/blob/main/docs/MIGRATION.md)
