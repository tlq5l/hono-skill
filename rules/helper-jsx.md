---
title: JSX Engine
impact: MEDIUM
impactDescription: Built-in JSX middleware and rendering
tags: jsx, ssr, renderer
---

## JSX Engine

Hono has a built-in JSX engine that is fast and lightweight. It runs on any runtime.

**Configuration (tsconfig.json):**

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

**Usage:**

```typescript
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <h1>My App</h1>
          {children}
        </body>
      </html>
    )
  })
)

app.get('/', (c) => {
  return c.render(<div>Hello!</div>)
})
```

**Streaming:**

```typescript
import { streamSSR } from 'hono/streaming'

app.get('/stream', (c) => {
  return streamSSR(c, async (stream) => {
    await stream.write(<h1>Hello</h1>)
    await stream.write(<p>World</p>)
  })
})
```
