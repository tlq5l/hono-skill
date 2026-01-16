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

**Supported Runtimes:**
- `workerd`: Cloudflare Workers / Pages
- `bun`: Bun
- `node`: Node.js
- `deno`: Deno
- `fastly`: Fastly Compute
- `edge-light`: Vercel Edge Functions
