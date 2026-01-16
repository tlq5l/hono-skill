---
title: Runtime Detection
impact: LOW
impactDescription: Ensures cross-runtime compatibility (Node, Bun, Cloudflare)
tags: adapter, runtime, cloudflare, bun
---

## Runtime Detection

Use `getRuntimeKey` to detect which runtime the application is running on.

```typescript
import { getRuntimeKey } from 'hono/adapter'

const runtime = getRuntimeKey()

if (runtime === 'workerd') {
  console.log('Running on Cloudflare Workers')
} else if (runtime === 'bun') {
  console.log('Running on Bun')
} else if (runtime === 'node') {
  console.log('Running on Node.js')
} else if (runtime === 'deno') {
  console.log('Running on Deno')
} else {
  console.log('Running on unknown runtime')
}
```

**When NOT to use this pattern:**
- If you are building a runtime-specific app (e.g., only Cloudflare Workers) and don't need cross-platform compatibility.
- When performance is critical and runtime checks add unnecessary overhead (though `getRuntimeKey` is very fast).

Reference: [Runtime Helper](https://hono.dev/docs/helpers/adapter#runtime)
