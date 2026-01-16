#!/usr/bin/env bun

/**
 * Build script for Hono Skill
 *
 * Compiles rules/*.md → AGENTS.md
 * Following Vercel's agent-skills pattern
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const SKILL_DIR = import.meta.dir.replace('/src', '')
const RULES_DIR = join(SKILL_DIR, 'rules')
const OUTPUT = join(SKILL_DIR, 'AGENTS.md')

interface RuleFrontmatter {
  title: string
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  impactDescription: string
  tags: string
}

function parseFrontmatter(content: string): { frontmatter: RuleFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Invalid frontmatter')
  }

  const yaml = match[1]
  const body = match[2].trim()

  const frontmatter: RuleFrontmatter = {
    title: '',
    impact: 'MEDIUM',
    impactDescription: '',
    tags: ''
  }

  for (const line of yaml.split('\n')) {
    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()
    if (key && value) {
      (frontmatter as any)[key.trim()] = value
    }
  }

  return { frontmatter, body }
}

function loadMetadata() {
  const path = join(SKILL_DIR, 'metadata.json')
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function buildAgentsMd() {
  const metadata = loadMetadata()
  const ruleFiles = readdirSync(RULES_DIR).filter(f => f.endsWith('.md')).sort()

  const rules: Array<{ frontmatter: RuleFrontmatter; body: string; file: string }> = []

  for (const file of ruleFiles) {
    const content = readFileSync(join(RULES_DIR, file), 'utf-8')
    const { frontmatter, body } = parseFrontmatter(content)
    rules.push({ frontmatter, body, file })
  }

  // Group by category
  const setupRules = rules.filter(r => r.file.startsWith('setup-'))
  const coreRules = rules.filter(r => r.file.startsWith('core-'))
  const middlewareRules = rules.filter(r => r.file.startsWith('middleware-'))
  const runtimeRules = rules.filter(r => r.file.startsWith('runtime-'))
  const helperRules = rules.filter(r => r.file.startsWith('helper-'))
  const migrationRules = rules.filter(r => r.file.startsWith('migration-'))

  const output = `# Hono Web Framework Skill

> ${metadata.abstract}

**Version**: ${metadata.version} | **Status**: ${metadata.status} | **Generated**: ${metadata.generatedAt}
**Source**: [honojs/hono](${metadata.sourceRepo}) @ v${metadata.sourceVersion}

---

## Quick Reference

### Minimal App
\`\`\`typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))

export default app
\`\`\`

### Key Differences from Express
| Express | Hono |
|---------|------|
| \`req.params.id\` | \`c.req.param('id')\` |
| \`res.json(data)\` | \`return c.json(data)\` |
| \`next()\` callback | \`await next()\` async |
| \`process.env\` | \`c.env\` (Workers) |

---

## Setup & Routing

${setupRules.map(r => r.body).join('\n\n---\n\n')}

---

## Core Concepts

${coreRules.map(r => r.body).join('\n\n---\n\n')}

---

## Middleware

${middlewareRules.map(r => r.body).join('\n\n---\n\n')}

---

## Runtime Adapters

${runtimeRules.map(r => r.body).join('\n\n---\n\n')}

---

## Helpers

${helperRules.map(r => r.body).join('\n\n---\n\n')}

---

## Migration

${migrationRules.map(r => r.body).join('\n\n---\n\n')}

---

## References

- [Hono Documentation](https://hono.dev)
- [Getting Started](https://hono.dev/docs/getting-started/basic)
- [API Reference](https://hono.dev/docs/api/hono)

---

*Generated from ${rules.length} rules.*
`

  writeFileSync(OUTPUT, output)
  console.log(`✅ Built AGENTS.md (${output.length} chars, ${rules.length} rules)`)
}

buildAgentsMd()
