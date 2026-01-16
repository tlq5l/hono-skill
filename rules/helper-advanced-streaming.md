---
title: Advanced Streaming Patterns
impact: MEDIUM
impactDescription: Manual streaming beyond SSE helpers
tags: streaming, readablestream, advanced
---

## Advanced Streaming Patterns

Beyond `streamSSE`, Hono supports raw `ReadableStream` for custom streaming.

**Manual ReadableStream:**

```typescript
app.post('/ai', async (c) => {
  const text = await generateAIResponse()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(text))
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    }
  })
})
```

**Prefer Hono helpers when possible:**

```typescript
import { stream } from 'hono/streaming'

// ✅ Better - uses Hono's context lifecycle
app.get('/stream', (c) => {
  return stream(c, async (s) => {
    await s.write('chunk 1')
    await s.write('chunk 2')
  })
})
```

**When to use raw ReadableStream:**

- Custom binary protocols
- Integrating with external streaming APIs
- Fine-grained control over encoding

Reference: [MDN ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
