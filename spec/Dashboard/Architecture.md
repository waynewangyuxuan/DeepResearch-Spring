# Dashboard Architecture

> Tech stack, data flow, and system design.

## Data Flow

```
spec/ (Markdown files)
    ↓ Parser (gray-matter + regex)
Dashboard (Next.js Web App)
    ↓ Writer
Write back to spec/ (Markdown files)
```

Dashboard maintains no database. All data sourced from spec/ Markdown files.
Edits (e.g. Todo checkbox) write back to original files.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js (App Router) | SSR + API routes + React |
| Markup | MDX | Markdown renderable as React components |
| Parsing | gray-matter | YAML frontmatter extraction |
| Styling | Tailwind CSS | Utility-first, design token friendly |
| File Watch | Chokidar (dev only) | Hot updates when spec/ files change |
| Markdown | remark + remark-gfm | GFM table/checkbox parsing |

## Data Interface

```typescript
interface ParsedSpec {
  literature: { queue: QueueItem[] }
  concepts:   { ideasLog: Idea[] }
  prototypes: PrototypeEntry[]
  progress:   SessionEntry[]
  todo:       TodoItem[]
}
```

## Parsing Strategy

Each parser reads a specific Markdown file and extracts structured data:
- `parseReadingQueue()` — split by 待读/在读/已读 headings, parse tables
- `parseIdeasLog()` — split by ### headings, extract **bold** field labels
- `parsePrototypes()` — scan Prototypes/ subdirectories, read README.md
- `parseProgress()` — parse ## Session: headings + 4-dimension subsections
- `parseTodo()` — match `- [ ]` / `- [x]` patterns, track line numbers

## Update Workflow

Three editing entry points, all equivalent:
1. IDE — directly edit Markdown files
2. AI session — Claude updates spec/ files
3. Dashboard — interactive edits write back to files

Chokidar watches spec/ → re-parse → push via SSE → hot-update views.
