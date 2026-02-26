# Dashboard Components

> Page layout and five core view specifications.

## Page Layout

```
┌─────────────────────────────────────────────┐
│  Research Dashboard          [周期选择] [🔍] │
├─────────────┬───────────────────────────────┤
│  Navigation │  Main Content                 │
│  ─────────  │                               │
│  📚 文献     │  ┌─ Status Bar ─────────────┐ │
│  💡 想法     │  │ 12 papers │ 5 ideas │ 3p │ │
│  🧪 原型     │  └────────────────────────────┘│
│  📈 进度     │                               │
│  📋 Todo    │  [Selected view content]       │
│             │                               │
└─────────────┴───────────────────────────────┘
```

Single-page layout. Left sidebar for navigation. Status bar at top of main content.
View switching via expand/collapse, not page navigation.

## Status Bar

Horizontal bar showing aggregate counts with micro-visualizations:
- Paper count (status dot breakdown: gray/blue/green)
- Ideas count (status distribution)
- Prototypes count
- Sessions this week (sparkline)

## Literature View

Source: `spec/Literature/Reading-Queue.md`

- Three sections: 待读 / 在读 / 已读
- Each paper: status color band (gray=待读, accent=在读, green=已读)
- Card shows: title, keyword Tag Chips, priority badge (P0 red / P1 yellow / P2 gray)
- For 已读: core takeaway in accent text
- Click to expand: Summary.md content if paper folder exists

## Ideas View

Source: `spec/Concepts/Ideas-Log.md`

- Timeline layout: vertical time axis left, cards right
- Each card: status emoji (large) + title + trigger source + intuition (truncated)
- Filterable by status (💡🔍📐🧪✅❌)
- Progress Ring showing status distribution at top

## Prototypes View

Source: `spec/Prototypes/` subdirectories

- Card list: prototype name + README first paragraph + last modified + status badge
- Status: Active (accent) / Archived (muted)
- Related concept link
- Empty state: "No prototypes yet."

## Progress View

Source: `spec/Progress/`

- Heat Calendar: 7 columns (Mon-Sun) x N weeks, colored if session exists
- Session list below: date heading + four-dimension summary (Reading/Ideas/Prototypes/Direction)
- Click calendar cell → scroll to session
- Most recent session highlighted with accent border

## Todo View

Source: `spec/Todo.md`

- Grouped by priority sections (High / Medium / Low)
- Interactive checkboxes: click → POST /api/todo → write back to file
- Priority indicator: accent for high, muted for low
- Optimistic UI update on checkbox click
