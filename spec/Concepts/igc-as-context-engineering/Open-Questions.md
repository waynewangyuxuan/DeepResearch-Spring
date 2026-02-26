# IGC as Context Engineering — Open Questions

> Unresolved research questions and next exploration directions.

## Representation

1. **Graph format**: Current IGC pipeline uses pure text for graph representation.
   Should we use more structured formats? (JSON, adjacency list, embeddings)
   - Trade-off: text is LLM-native but loses structural precision
   - Experiment idea: compare text vs JSON vs structured on small tasks

## Graph Management

2. **Create new vs update existing**: When should the agent start a new graph
   versus updating an existing one during incremental construction?
   - Needs heuristic or learned policy

3. **Automatic level discovery**: How does the agent decide which hierarchy level
   to reason at? Currently no mechanism for this.

## Evaluation

4. **Graph quality metrics**: How to measure graph quality? Relationship to
   final report quality? Need both intrinsic (graph coherence) and extrinsic
   (downstream task performance) metrics.

## Efficiency

5. **Token cost control**: Multi-level graphs + multi-round search = potentially
   high token consumption. How to budget compute effectively?
   - Related to test-time compute allocation literature

## Next Explorations

- [ ] Literature survey: GraphRAG variants, hierarchical KG, test-time compute
- [ ] Analyze IGC pipeline code: understand current graph representation
- [ ] Design 2-3 small-scale prototype experiments
- [ ] Align with Qiyue (Bird) on IGC pipeline optimization direction
