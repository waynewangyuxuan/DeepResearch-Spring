# Ideas Log

> Time-ordered idea stream. New ideas append at the top.

---

## 2025-02-25

### 📐 Question-Driven Incremental Graph Construction

**Trigger**: meeting-synthesis.md — Chuong's analogy to historian methodology
**Intuition**: Start from question, form hypothesis, search for evidence, build graph
incrementally. Like BFS/DFS — if satisfied stop, if not expand further.
Graph is built alongside the search, not after data collection.
**Related**: [Concepts/igc-as-context-engineering/Design.md](igc-as-context-engineering/Design.md)
**Status**: 📐 Designing (core of IGC concept)

### 🔍 Multi-level Graph Zoom

**Trigger**: meeting-synthesis.md — Frederick's core proposal
**Intuition**: Recursive hierarchy of ~20-node graphs. Level 0 = global causal graph,
Level 1 = regional graphs, Level 2 = detail graphs. Horizontal reasoning within levels,
vertical zoom in/out across levels. Not pre-built — on-demand.
**Related**: [Concepts/igc-as-context-engineering/Design.md](igc-as-context-engineering/Design.md)
**Status**: 🔍 Exploring

### 🔍 Multi-Graph Composition as Narrative Synthesis

**Trigger**: meeting-synthesis.md — Qisen's related-work writing analogy
**Intuition**: Like writing a related work section — select aspects from each paper/graph,
then weave into coherent narrative. Two sub-problems: aspect selection and narrative synthesis.
**Related**: [Concepts/igc-as-context-engineering/Design.md](igc-as-context-engineering/Design.md)
**Status**: 🔍 Exploring

### 💡 Graph Representation Comparison

**Trigger**: igc-concept.md Open Question #1
**Intuition**: Current IGC pipeline uses pure text for graph representation.
Compare: plain text vs JSON vs adjacency list vs embeddings.
Trade-off: text is LLM-native but loses structural precision.
**Related**: Prototypes/ (future proto-001)
**Status**: 💡 Sprouting
