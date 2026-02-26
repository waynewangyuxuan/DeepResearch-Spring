# TRAIL: The Three-Action Loop Explained

**TRAIL operates through a three-action loop — Retrieve, Hypothesize, Synthesize — that repeats until the agent is confident enough in its answer.**

## Retrieve

Retrieve is the most straightforward step. The agent takes the current query, extracts key entities from it, links them to nodes in the knowledge graph, then expands one or two hops outward to pull back a local subgraph. These triples are serialized into text and fed into the LLM's context. This is essentially standard KG-augmented retrieval — entity linking plus neighborhood expansion — nothing particularly novel here. The real value of Retrieve is what happens *after* it: the system can recognize that what it pulled back isn't sufficient, which triggers the next action.

## Hypothesize

Hypothesize is where TRAIL gets interesting. When the retrieved subgraph has gaps — say, two entities are both present but no edge connects them — the agent feeds the query, retrieved subgraph, and reasoning history into the LLM and asks it to *propose* missing facts as candidate triples (subject, predicate, object). Crucially, it doesn't blindly trust a single generation. Instead, it samples multiple times from the same context (e.g., 5 candidates), then uses a secondary model (or the same model with a different prompt) to perform consensus aggregation. Only facts that appear consistently across samples get written into the KG. If a newly proposed fact contradicts an existing edge, a conflict resolution mechanism compares confidence scores — the lower-confidence one gets pruned or marked uncertain. So Hypothesize is essentially **quality-gated LLM infilling**: guess boldly, verify strictly.

## Synthesize

Synthesize is the agent's attempt to produce an answer. It packs everything together — the original query, retrieved subgraphs, newly hypothesized triples, and the full reasoning history — and generates a response. But Synthesize is not necessarily the endpoint. The system runs a **confidence assessment** on the generated answer. If confidence is below threshold, the answer is treated as additional context and the loop restarts: back to Retrieve (now with richer context), possibly another round of Hypothesize, then another Synthesize attempt. Only when confidence crosses the threshold does the loop terminate and output the final answer.

## Summary

Retrieve fetches what's already known, Hypothesize fills in what's missing, and Synthesize tests whether the accumulated knowledge is sufficient. The three form a tightening loop — each iteration potentially improves the KG and brings the answer closer to confidence.
