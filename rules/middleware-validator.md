---
title: Input Validation
impact: HIGH
impactDescription: Type-safe validation middleware
tags: validator, zod, middleware
---

## Input Validation

Use `validator` middleware to validate request data (json, form, query, param, header, cookie).

**With Zod:**

```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post('/user', zValidator('json', schema), (c) => {
  const data = c.req.valid('json') // Typed as { name: string, age: number }
  return c.json(data)
})
```

**Built-in Validator:**

```typescript
import { validator } from 'hono/validator'

app.post('/post', validator('form', (value, c) => {
  const title = value['title']
  if (!title || typeof title !== 'string') {
    return c.text('Invalid title', 400)
  }
  return { title }
}), (c) => {
  const { title } = c.req.valid('form')
  return c.json({ title })
})
```
