# Dashboard Design System

> Typography-first, monochrome + accent, micro-visualization.

## Design Principles

- **Extreme minimalism**: high information density, low visual noise
- **Typography-first**: hierarchy via font weight/size/color, not borders
- **Monochrome + Accent**: clean base, one accent color for status and interaction
- **Micro-visualization**: sparklines, heat maps, status dots — no large charts
- **Zero-navigation**: single page, expand/collapse, no page jumps

## Colors

```
Background:   #FAFAFA (near white)
Foreground:   #1A1A1A (near black)
Muted text:   #6B7280
Border:       #E5E7EB (very light gray)
Accent:       #2563EB (blue) — status indicators + interactive elements
Success:      #059669 (green) — completed / read status
Warning:      #D97706 (amber) — in-progress / attention
```

## Typography

| Role | Font | Weight | Size | Line Height |
|------|------|--------|------|-------------|
| Heading 1 | Inter / SF Pro | 600 | 1.5rem | 2rem |
| Heading 2 | Inter / SF Pro | 600 | 1.25rem | 1.75rem |
| Heading 3 | Inter / SF Pro | 600 | 1rem | 1.5rem |
| Body | Inter / SF Pro | 400 | 0.875rem | 1.4rem |
| Small | Inter / SF Pro | 400 | 0.75rem | 1rem |
| Code | JetBrains Mono | 400 | 0.875rem | 1.4rem |

## Micro-Visualization Components

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Status Dot | Paper/idea status indicator | 8px circle + state color |
| Sparkline | Weekly activity trend | SVG path, no axes/labels |
| Progress Ring | Idea maturity distribution | SVG circle, donut progress |
| Heat Calendar | Session frequency | CSS Grid color blocks (GitHub style) |
| Tag Chip | Paper keywords/tags | Pill shape, light background |

## Spacing

- Base unit: 4px
- Component padding: 12px / 16px
- Section gaps: 24px / 32px
