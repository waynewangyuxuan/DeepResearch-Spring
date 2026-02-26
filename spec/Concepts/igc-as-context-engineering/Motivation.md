# IGC as Context Engineering — Motivation

> Why incremental graph construction matters for deep research.

## Problem

Deep research agents face a fundamental challenge: given a complex, open-ended research
question, the agent must perform multi-round web search and information integration to
produce a structured, in-depth report.

**Current limitations of flat pipelines:**
- Most deep research pipelines collect information then directly generate reports
- Structural relationships (causal, temporal, hierarchical) are lost in plain-text context
- Context window is limited; cannot naively include all collected information

## Hypothesis

Using incrementally constructed graph structures as the backbone of context engineering
can significantly improve deep research quality. This is not a traditional million-node KG
but a series of human-readable small graphs (~20 nodes each), organized through a
multi-level structure.

## Why This Matters

- **For the team**: IGC pipeline (Qiyue) is 60-70% complete and running on benchmarks.
  Understanding graph construction deeply enables targeted optimization.
- **For the field**: Deep research is emerging but under-theorized. Connecting graph
  construction to test-time learning provides novel framing.
- **For Context Engineering**: Graphs as structured context is a concrete instantiation
  of context engineering principles beyond prompt templates.

## Key References

- GraphRAG (Microsoft) — graph-augmented retrieval with incremental construction
- See [Literature/Reading-Queue.md](../../Literature/Reading-Queue.md) for full paper tracking
- See [meeting-synthesis.md](../../../meeting-synthesis.md) for full meeting discussions
