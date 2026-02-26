# ACE: Agentic Context Engineering
**arXiv 2510.04618 | ICLR 2026 | Stanford / SambaNova / UC Berkeley**

## Problem
Context-based optimization (prompt engineering, few-shot) is lightweight but manual. Existing automated approaches (MIPROv2, GEPA, Dynamic Cheatsheet) suffer from **Context Collapse** — iterative rewriting shrinks context from 18K to 122 tokens, losing domain-specific insights — and **Brevity Bias** — optimization favors conciseness at the expense of critical details.

## Core Idea
Treat context as an **evolving playbook** that grows through structured **generation → reflection → curation**, with **delta updates** instead of full rewrites.

## Method
Three-role architecture:
1. **Generator** — executes tasks using current playbook, produces reasoning traces
2. **Reflector** — analyzes success/failure, extracts *generalizable* insights (not task-specific). Does NOT rewrite — only evaluates.
3. **Curator** — converts insights into **structured delta updates** with helpful/harmful counters. Uses deterministic merging (dedup, ratio-based pruning).

**Anti-collapse mechanisms**:
- Delta updates (add/modify/remove entries, not full rewrite)
- Helpful/harmful counters for data-driven pruning
- Deterministic merging (no LLM rewriting noise)
- Separation of reflection from curation

**Two adaptation modes**: Offline (pre-build from training data) and Online (learn while executing, self-supervised via execution feedback).

## Key Innovation
The **delta update paradigm** that prevents context collapse while enabling continuous knowledge accumulation. Plus the principled separation of reflection (understand what happened) from curation (decide how to update).

## Benchmarks
- **AppWorld**: ACE + DeepSeek-V3.1 achieves 59.4% (vs. IBM CUGA GPT-4.1 at 60.3% — near-SOTA with open-source model)
- **Financial reasoning**: +8.6% avg over baselines
- **Avg over all baselines**: +10.6%
- **Efficiency**: -86.9% adaptation latency, up to -83.6% rollout cost, -91.5% latency vs Dynamic Cheatsheet

## Limitations
- Playbook structure is pre-defined (may need different structures for different task types)
- Reflector quality depends on LLM attribution capability
- Flat insight list — no hierarchical context organization

## Relevance to Our Work
Architecture maps directly to IGC: Generator = execute research step, Reflector = analyze results, Curator = update graph structure. Delta updates ↔ incremental graph updates. Helpful/harmful counters ↔ node/edge contribution statistics. Self-supervised adaptation via execution feedback is exactly what we need for deep research.
