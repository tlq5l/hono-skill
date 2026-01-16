# Contributing to Hono Skill

Thank you for contributing to the Hono skill.

## Rule Format

Each rule in `rules/*.md` follows this structure:

```markdown
---
title: Rule Title
impact: CRITICAL | HIGH | MEDIUM | LOW
impactDescription: Brief description of impact
tags: comma, separated, tags
---

## Rule Title

Description and examples...
```

## File Naming

- `setup-*.md` - Routing and configuration
- `core-*.md` - Context, middleware, error handling, types
- `middleware-*.md` - Built-in middleware patterns
- `runtime-*.md` - Platform-specific adapters (Cloudflare, Bun, Node)
- `helper-*.md` - Streaming, SSE, other helpers
- `migration-*.md` - Version migration guides

## Adding Rules

1. Create a new `.md` file in `rules/` with appropriate prefix
2. Add YAML frontmatter with title, impact, impactDescription, tags
3. Include code examples showing correct patterns
4. Run `bun run build` to regenerate AGENTS.md

## Test Cases

Add entries to `test-cases.json` with:

```json
{
  "id": "unique-id",
  "rule": "rule-filename-without-md",
  "description": "What this tests",
  "bad": "code that agents should NOT generate",
  "good": "correct code pattern"
}
```

## Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/new-rule`)
3. Add your rule and test cases
4. Run `bun run build`
5. Commit your changes
6. Push to your branch
7. Open a Pull Request

## Code of Conduct

Be respectful and constructive. Focus on improving the skill's accuracy and usefulness for AI agents.
