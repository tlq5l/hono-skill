# Hono Web Framework Skill

> Inspired by [Vercel's agent-skills](https://github.com/vercel-labs/agent-skills)

AI-agent skill for Hono web framework patterns, middleware, and runtime adapters.

## What is this?

A skill file that teaches AI coding agents (Claude, Copilot, Cursor, etc.) the correct patterns for Hono v4. Agents read `AGENTS.md` and apply the knowledge when helping with Hono code.

## Quick Start

1. Copy `AGENTS.md` to your project root (or `.claude/` for Claude Code)
2. Your AI agent will automatically pick up the Hono patterns

## Structure

```
hono/
├── AGENTS.md           # Compiled skill (agents read this)
├── rules/              # Modular rule files
│   ├── setup-*.md      # Routing and configuration
│   ├── core-*.md       # Context, middleware, types
│   ├── middleware-*.md # Built-in middleware
│   ├── runtime-*.md    # Cloudflare, Bun, Node adapters
│   ├── helper-*.md     # Streaming, SSE
│   └── migration-*.md  # v3 → v4 changes
├── test-cases.json     # Bad/good code pairs for testing
└── src/
    └── build.ts        # Compiles rules → AGENTS.md
```

## Key Hono Patterns

### Minimal App
```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

### Context Object (not req/res)
```typescript
app.get('/users/:id', (c) => {
  const id = c.req.param('id')        // NOT req.params.id
  const query = c.req.query('page')   // NOT req.query.page
  return c.json({ id, query })        // MUST return
})
```

### Async Middleware
```typescript
app.use('*', async (c, next) => {
  console.log('before')
  await next()              // NOT next() callback
  console.log('after')
})
```

### Cloudflare Workers
```typescript
type Bindings = { MY_KV: KVNamespace; API_KEY: string }

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  const key = c.env.API_KEY  // NOT process.env
  return c.text(`Key: ${key}`)
})
```

## Development

```bash
# Build AGENTS.md from rules
bun run build

# View test cases
cat test-cases.json
```

## Contributing

1. Add/edit rules in `rules/*.md`
2. Add test cases to `test-cases.json`
3. Run `bun run build`
4. Submit PR

## License

MIT
