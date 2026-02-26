# Research Goal

> How to incrementally construct and maintain knowledge graphs during deep research,
> making them an effective context engineering mechanism?

## Research Question

Given a complex, open-ended research question, a deep research agent needs to perform
multi-round web search + information integration to produce structured, in-depth research
reports. Current approaches are flat — they collect information then directly generate reports.
Structural relationships (causal, temporal, hierarchical) are lost in plain-text context.

**Hypothesis**: Using incrementally constructed graph structures as the backbone of context
engineering can significantly improve deep research quality.

## Current Stage

Literature survey + concept design. No prototype code yet.

## Key Concepts

- **Incremental Graph Construction (IGC)** — build graphs on-demand during research
- **Multi-level graph hierarchy** — not one giant KG, but recursive layers of ~20-node graphs
- **Question-driven construction** — BFS/DFS search from hypotheses, not data-first
- **Test-time learning connection** — graphs as structured in-context examples

## Keywords

incremental graph construction, context engineering, test-time compute,
deep research agents, hierarchical knowledge representation, GraphRAG

## Team Context

- Wayne: In-context/Test-time Learning for Graph Construction (this project)
- Qiyue (Bird): Running IGC pipeline on benchmarks
- Qisen: Deploying Search R1 / MiroFlow baselines
- Frederick: Advisor, multi-level graph vision
