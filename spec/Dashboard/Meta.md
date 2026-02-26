# Dashboard

> Markdown-driven research dashboard — visual layer for the spec/ structure.

**Documents**: 3

## Context Injection Guide

| Task Scenario | Read These Files | Lines |
|---------------|------------------|-------|
| Understand dashboard architecture | Architecture.md | ~45 |
| Review design system (colors, fonts) | Design-System.md | ~50 |
| Check component specs (5 views) | Components.md | ~80 |

## Documents

| File | Lines | Summary | When to Read |
|------|-------|---------|--------------|
| [Architecture.md](Architecture.md) | ~45 | Tech stack, data flow, parsing layer | Starting dashboard development |
| [Design-System.md](Design-System.md) | ~50 | Colors, typography, micro-visualizations | Building UI components |
| [Components.md](Components.md) | ~80 | 5 view specifications + page layout | Implementing views |

## Core Principle

"Markdown is the database, Dashboard is the view, AI is the collaborator."
Dashboard reads from spec/ Markdown files, displays them as interactive views,
and writes back edits to the same files. No separate database.
