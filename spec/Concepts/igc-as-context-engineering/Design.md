# IGC as Context Engineering — Design

> Design space for incremental graph construction in deep research.

## 1. Graph Type Taxonomy (Frederick)

Six graph types, each with max ~20 nodes (human-readable upper bound):

| Type | Description | Example Use |
|------|-------------|-------------|
| Causal Graph | Cause-effect network | Why did X happen? |
| Timeline | Temporal event chain | Evolution of a field |
| Social Network | Entity/person relationships | Who influences whom? |
| Taxonomy | Hierarchical classification | Categorize methods |
| Table | Structured data | Compare approaches |
| Geographical | Spatial distribution | Regional analysis |

## 2. Single Graph Construction (Relatively Easy)

Given related information, LLM builds a specific graph type. Existing precedent
(GraphRAG etc). Core challenge is prompt design. Each graph is self-contained
with metadata and text description.

## 3. Multi-Graph Composition (Core Challenge)

**Qisen's related-work analogy:**
- Each paper has multiple facets (intro, method, experiment...)
- Writing related work = selecting specific aspects from each paper + weaving into narrative
- Similarly: select aspects from multiple graphs + compose into coherent narrative

**Two sub-problems:**
1. **Aspect Selection** — what to pick from each graph (depends on current research question)
2. **Narrative Synthesis** — how to weave selected aspects into coherent story

## 4. Multi-Level Structure (Frederick's Core Proposal)

```
Level 0 (highest abstraction):  [Global Causal Graph]
Level 1:                        [Regional_A] <-> [Regional_B]
Level 2:                   [Detail_A1][Detail_A2]  [Detail_B1][Detail_B2]
```

- Horizontal reasoning: across graphs at same level
- Vertical reasoning: zoom in (expand detail) / zoom out (return to macro)
- Built on-demand, not pre-constructed

## 5. Question-Driven Incremental Construction (Chuong's Insight)

```
Initial Question → Hypothesis → Search for evidence → Graph_1 (partial)
  → New sub-questions emerge → Search more → Graph_1 updated + Graph_2 created
  → Evaluate: satisfied? → Yes: synthesize / No: expand further
```

Like BFS/DFS search strategy. Graph is built alongside the search process.

## Connection to Test-Time Learning

| TTL Concept | IGC Mapping |
|-------------|-------------|
| In-context examples | Constructed graphs as structured context |
| Test-time adaptation | Dynamic graph selection/recomposition per query |
| Incremental learning | Graph structure updates after each search round |
| Multi-scale reasoning | Switching between graph hierarchy levels |
| Memory consolidation | Compressing low-level details to high-level summaries |
