# HippoRAG: Neurobiologically Inspired Long-Term Memory for LLMs
**arXiv 2405.14831 | NeurIPS 2024 | Follow-up: "From RAG to Memory" (ICML 2025)**

## Problem
Standard RAG encodes each passage **independently** — it cannot perform cross-passage knowledge integration at retrieval time. Multi-hop questions requiring connections across passages fail.

## Core Idea
Inspired by **Hippocampal Indexing Theory**: use a **schemaless knowledge graph** as the hippocampus (associative index) and **Personalized PageRank (PPR)** to simulate pattern completion.

## Method
- **Neocortex** = LLM (pattern recognition), **Parahippocampal region** = Retrieval Encoder, **Hippocampus** = KG
1. **Offline Indexing**: Open IE extracts (subject, predicate, object) triples → schemaless KG. Tracks passage ↔ triple mapping.
2. **Online Retrieval**: Query → NER → seed nodes in KG → **PPR** propagates from seeds → high-scoring nodes identify relevant passages
3. **Node Specificity**: IDF-like weighting — high-frequency entities (e.g., "United States") get downweighted as seeds, mimicking sparse coding in the brain

## Key Innovation
PPR enables **single-step multi-hop retrieval**: probability diffusion across the graph naturally bridges information across passages. One PPR run replaces expensive iterative retrieval (like IRCoT).

## Benchmarks
- **MuSiQue, 2WikiMultiHopQA, HotpotQA** (multi-hop QA)
- Up to **+20%** over SOTA single-step RAG
- **Comparable to IRCoT** but **10–30x cheaper, 6–13x faster**
- HippoRAG + IRCoT yields further significant improvement

## Limitations
- Pre-built static graph, noisy schemaless KG from Open IE
- PPR propagation may be insufficient for very long chains (>4 hops)
- No multi-level structure

## Relevance to Our Work
**PPR** is a strong candidate for graph-based aspect selection in our multi-graph utilization. **Node Specificity** provides automatic de-noising. The "from RAG to Memory" follow-up directly aligns with our direction — memory consolidation ≈ Frederick's zoom-out operation.
