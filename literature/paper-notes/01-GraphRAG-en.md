# GraphRAG: From Local to Global
**arXiv 2404.16130 | Microsoft Research | Pre-print**

## Problem
Naive RAG fails on *global sensemaking queries* — questions requiring synthesis across an entire corpus (e.g., "What are the main themes?"). Top-K chunk retrieval cannot cover information scattered across many documents.

## Core Idea
Build a **hierarchical graph index** from text, then answer global queries via **map-reduce over community summaries**.

## Method
1. **LLM-based entity/relationship extraction** from text chunks
2. **Leiden hierarchical community detection** on the entity-relation graph → produces multi-level communities (C0=coarsest → C3=finest)
3. **Community summarization** via LLM at each level → pre-computed "answer material"
4. **Global Search**: map query to all community summaries in parallel, then reduce into final answer
5. **Local Search**: fan-out from query entities to neighbors (standard KG-QA style)

## Key Innovation
Hierarchical community structure + community summaries enable answering queries that require *corpus-wide* understanding — something flat vector indices fundamentally cannot do.

## Benchmarks
- **Datasets**: Podcast transcripts, News articles (2013–2023)
- **Eval**: LLM-as-Judge pairwise comparison on Comprehensiveness, Diversity, Empowerment, Relevance
- **Results**: Significantly outperforms naive RAG on global queries in comprehensiveness and diversity. C0 (coarsest) achieves competitive quality at minimal token cost.

## Limitations
- **Extremely expensive**: ~$33K for 5GB legal corpus (full LLM extraction + summarization)
- **Static, pre-built graph**: no dynamic updates, no query-adaptive restructuring
- **Fixed hierarchy**: Leiden determines structure once; cannot zoom in/out on-demand
- **Single graph type**: entity-relation only, no causal/temporal/taxonomic graphs

## Relevance to Our Work
Proves hierarchical graph structure matters for global reasoning. But its static pre-built paradigm is exactly what we aim to replace with **test-time incremental construction**.
