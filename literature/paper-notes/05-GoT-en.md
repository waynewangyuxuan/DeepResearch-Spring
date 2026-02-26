# Graph of Thoughts: Solving Elaborate Problems with LLMs
**arXiv 2308.09687 | AAAI 2024 | ETH Zurich**

## Problem
LLM reasoning paradigms evolved from IO → CoT (linear chain) → ToT (tree with branching). But **trees cannot express merging, looping, or feedback** — real reasoning requires combining insights from multiple branches, refining thoughts iteratively, and decomposing problems.

## Core Idea
Model LLM reasoning as a **directed graph** where nodes = thoughts and edges = dependencies. This generalizes all prior frameworks (CoT, ToT) and enables new operations.

## Method
Formal framework: **(G, T, E, R)** — Graph, Transformations, Evaluator, Ranking

Four core **Thought Transformations**:
| Operation | Graph Semantics | Description |
|-----------|----------------|-------------|
| **Generate/Branch** | One node → multiple children | Explore multiple directions from a thought |
| **Aggregate/Merge** | Multiple nodes → one new node | Combine insights from different branches |
| **Refine/Loop** | Self-edge on a node | Iteratively improve a thought with feedback |
| **Decompose** | One node → multiple sub-nodes | Break complex task into sub-tasks |

**Architecture**: Controller orchestrates execution via:
- **Graph of Operations (GoO)** — pre-defined execution plan (which transformations to apply)
- **Graph Reasoning State (GRS)** — real-time state of all thoughts

GoO can simulate any prior method: linear GoO = CoT, tree GoO = ToT.

## Key Innovation
The **operation vocabulary** (merge, refine, decompose, branch) — a universal set of graph-level operations applicable beyond GoT's original scope.

## Benchmarks
- Tasks: Sorting (32/64/128 elements), Set Intersection, Keyword Counting, Document Merging
- GPT-3.5-turbo / GPT-4
- Sorting: **+62%** quality vs ToT, **-31%** cost; vs CoT: **-65%** median error
- Achieves **logarithmic latency + linear volume** = optimal cost-quality tradeoff

## Limitations
- GoO requires **manual task-specific design** — no automated discovery
- Tasks are structurally clean (sorting, set ops); open-ended reasoning GoO design is unsolved
- No knowledge graph, no cross-query state, single-round only

## Relevance to Our Work
Provides the **theoretical operation vocabulary** for our IGC pipeline. Generate/Branch = derive sub-questions; Aggregate/Merge = combine sub-graph aspects; Refine/Loop = update facts with new evidence; Decompose = Frederick's zoom-in. Controller/GoO/GRS maps to our agent's decision module / strategy / graph state.
