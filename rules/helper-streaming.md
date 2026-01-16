---
title: Streaming and SSE
impact: MEDIUM
impactDescription: Enables real-time AI responses and SSE; low-latency user experience
tags: streaming, sse, realtime
---

## Streaming and SSE

Hono provides streaming helpers for real-time responses.

**Basic streaming:**

```typescript
import { stream } from 'hono/streaming'

app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('Hello ')
    await s.sleep(1000)
    await s.write('World!')
  })
})
```

**Text streaming:**

```typescript
import { streamText } from 'hono/streaming'

app.get('/text', (c) => {
  return streamText(c, async (s) => {
    for (const word of ['Hello', ' ', 'World']) {
      await s.writeln(word)
      await s.sleep(500)
    }
  })
})
```

**Server-Sent Events (SSE):**

```typescript
import { streamSSE } from 'hono/streaming'

app.get('/sse', (c) => {
  return streamSSE(c, async (s) => {
    let id = 0
    while (true) {
      await s.writeSSE({
        data: JSON.stringify({ time: Date.now() }),
        event: 'tick',
        id: String(id++),
      })
      await s.sleep(1000)
    }
  })
})
```

**Client-side consumption:**

```javascript
const eventSource = new EventSource('/sse')
eventSource.addEventListener('tick', (e) => {
  console.log(JSON.parse(e.data))
})
```

**Abort handling:**

```typescript
app.get('/stream', (c) => {
  return stream(c, async (s) => {
    s.onAbort(() => {
      console.log('Client disconnected')
    })
    // ... streaming logic
  })
})
```

**When NOT to use this pattern:**
- For small responses where buffering is faster and simpler.
- When the client doesn't support streaming (e.g., some older HTTP clients).
- If you need to modify the response headers *after* streaming has started (impossible).

Reference: [Streaming](https://hono.dev/docs/helpers/streaming)
