# TRAIL: Joint Inference and Refinement of Knowledge Graphs with LLMs
**arXiv 2508.04474 | Pre-print**

## Problem
Existing KG+LLM methods treat **inference and knowledge refinement as separate stages** — build KG first, then query it. This prevents real-time knowledge integration and error correction during reasoning.

## Core Idea
Unify **thinking, reasoning, and incremental learning** into a single interactive loop where the KG is continuously refined *during* inference.

## Method
At each reasoning step, the agent chooses one of three actions:
1. **RETRIEVE** — fetch relevant subgraph from KG
2. **HYPOTHESIZE** — propose missing facts, add to KG
3. **SYNTHESIZE** — generate answer from current context

**Confidence-driven mechanism** governs KG updates:
- Multi-candidate sampling → secondary model consensus aggregation
- High-confidence facts → add to KG; Low-confidence → mark uncertain; Contradictions → prune existing facts
- Loop continues until confidence threshold is met

## Key Innovation
The *interaction* between retrieve/hypothesize/synthesize: retrieval exposes KG gaps → triggers hypotheses → new facts may contradict old ones → triggers confidence re-evaluation → may prune stale knowledge.

## Benchmarks
- **MMLU-Pro_Health**: 76.5% (highest), **MMLU-Pro_Biology**: 88.7% (highest)
- +3–13% over KG-augmented and retrieval-augmented baselines
- **Cross-validation**: TRAIL-refined KG plugged into LightRAG → significant improvement over vanilla KG

## Limitations
- Flat KG (no hierarchy), single-QA focus (no cross-query accumulation)
- Computational cost of multi-sampling + aggregation not well discussed

## Relevance to Our Work
Closest methodological reference — proves joint inference+refinement is viable. We need to extend it from **single-QA → multi-round deep research** and from **flat KG → multi-level, multi-type graphs**.
