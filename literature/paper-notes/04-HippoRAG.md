# HippoRAG: Neurobiologically Inspired Long-Term Memory for LLMs
**Paper**: arXiv 2405.14831 (May 2024)
**Authors**: Bernal Jiménez Gutiérrez, Yiheng Shu, Yu Gu, Michihiro Yasunaga, Yu Su
**Affiliations**: Ohio State University, Stanford
**Venue**: NeurIPS 2024 Main Conference
**Follow-up**: "From RAG to Memory" (ICML 2025)

---

## Why — 问题动机

哺乳动物的大脑能够在不断变化的环境中**持续整合大量新知识**，同时避免灾难性遗忘。LLMs + RAG 还做不到这一点：

**现有 RAG 的根本问题**: 每个新 passage 是**独立编码**的。你无法在检索时跨越多个 passage 的边界做知识整合。

举例：假设 Passage A 说 "张三是李四的老师"，Passage B 说 "李四发明了 X"。当你问 "张三的学生发明了什么？" 时：
- Naive RAG 检索到 Passage A（匹配 "张三"），但可能检索不到 Passage B（因为 B 里没有 "张三"）
- 即使两个都检索到了，RAG 也无法保证 LLM 能正确连接它们

**核心论点**: RAG 需要一个类似人类海马体的**长期记忆系统**——不是简单的 key-value store，而是能做 associative retrieval（关联检索）的结构化索引。

---

## What — 核心贡献

HippoRAG 受**海马体索引理论 (Hippocampal Indexing Theory)** 启发，把 RAG 的记忆系统类比为：

| 大脑组件 | HippoRAG 对应 | 功能 |
|---------|--------------|------|
| **Neocortex** (新皮层) | LLM | 模式识别、语义理解、知识处理 |
| **Parahippocampal regions** (海马旁区) | Retrieval Encoder | 把新信息编码为可索引的表示 |
| **Hippocampus** (海马体) | Knowledge Graph (schemaless KG) | 作为索引结构，连接跨 passage 的知识 |

**关键创新**: 用 **Personalized PageRank (PPR)** 在 KG 上做检索，模拟海马体的 pattern completion 过程。

---

## How — 方法详解

### 三阶段架构

```
Phase 1: Offline Indexing (Encoding)
    Text → LLM (Open IE) → Schemaless KG
    - 从每个 passage 中提取 (subject, predicate, object) triples
    - 无需预定义 ontology（schemaless）
    - Entities 作为 nodes，relations 作为 edges
    - 同时记录 passage ↔ triple 的映射

Phase 2: Online Retrieval
    Query → NER → Seed Nodes → PPR on KG → Ranked Passages

    2a. Named Entity Recognition: 从 query 中提取实体
    2b. Node Matching: 将 query 实体匹配到 KG 中的节点（= seed nodes）
    2c. Personalized PageRank: 从 seed nodes 出发，在 KG 上做 PPR
        → PPR 分数高的节点 = 与 query 实体关联最紧密的知识
    2d. Passage Ranking: 根据 PPR 分数，对包含高分节点的 passages 排序
    2e. Return top passages as context

Phase 3: Answer Generation
    Retrieved passages → LLM → Answer
```

### Node Specificity（节点特异性）

受神经生物学启发的关键机制。类似 IDF 的思路：

- 如果一个 entity 出现在很多 passage 中（如 "United States"），它作为 seed node 的权重应该被降低
- 如果一个 entity 很少出现（高特异性），它作为 seed node 更有信息量

公式：`specificity(node) ∝ 1 / document_frequency(node)`

这模拟了大脑中 **sparse coding** 的原则——高特异性的神经元编码更具辨识度的信息。

### 为什么 PPR 有效？

PPR 的数学特性天然适合知识整合：
- 从 seed nodes 出发，概率在图上扩散
- 多跳邻居的分数会衰减但不会消失
- 如果多个 seed nodes 通过图路径汇聚到同一个中间节点 → 该节点获得高分
- 这就实现了 **single-step multi-hop retrieval**：一步 PPR 就等价于多步 iterative retrieval

---

## Benchmarks & Evaluation

### 主要 Benchmark
- **MuSiQue** — multi-hop QA, 需要 2-4 步推理
- **2WikiMultiHopQA** — 基于 Wikipedia 的 multi-hop QA
- **HotpotQA** — 2-hop QA

### Baselines
- **Naive RAG** (Contriever, ColBERTv2)
- **Propositionizer** (将 passage 分解为原子命题)
- **RAPTOR** (recursive abstractive tree)
- **IRCoT** (iterative retrieval with chain-of-thought)

### 核心结果

| 方面 | 数据 |
|------|------|
| vs SOTA single-step RAG | 在 MuSiQue 和 2WikiMultiHopQA 上 **高达 +20%** |
| vs IRCoT (iterative) | **同等或更好**的性能，但 **10-30x 更便宜, 6-13x 更快** |
| HippoRAG + IRCoT | 进一步显著提升 → 可以作为 iterative method 的 drop-in enhancement |

### 新能力
HippoRAG 可以处理**现有方法完全无法处理的场景**——需要在大量 passages 中做远距离知识关联的任务。

---

## HippoRAG 2 (Follow-up, ICML 2025)

标题: "From RAG to Memory: Non-Parametric Continual Learning for Large Language Models"

关键改进：
- 增强了 **associativity**（关联性）— 更好的 multi-hop retrieval
- 增强了 **sense-making** — 不只是检索，还包括初步的推理整合
- 比 GraphRAG/RAPTOR/LightRAG 的离线索引成本更低

---

## Limitations

1. **图仍然是预构建的、静态的**: 与 GraphRAG 类似，不支持推理时动态修改
2. **Schemaless KG 可能噪声较大**: Open IE 提取的 triples 质量参差不齐
3. **PPR 的单步特性**: 虽然高效，但对于非常长的推理链（>4 步），PPR 的传播范围可能不够
4. **没有多层级结构**: 所有节点在同一个图中，没有抽象层级

---

## 与我们工作的关系

### 核心启发

1. **Memory Consolidation ≈ Frederick 的 zoom out**:
   - HippoRAG 2 的 "from RAG to memory" 方向暗示了一种 consolidation 机制
   - 类比：把多个细粒度的 passage-level triples "固化" 为更抽象的高层级知识
   - 这正是 Frederick 设想中从 Level 2 zoom out 到 Level 1 的操作

2. **PPR for Graph-based Aspect Selection**:
   - 我们的 "多图组合" 问题中的 aspect selection 步骤可以用 PPR 实现
   - 给定当前 research question（作为 seed nodes），PPR 找出最相关的 subgraph components
   - 比 naive 的 semantic similarity 检索更能捕捉结构关系

3. **Node Specificity = 去噪机制**:
   - 在 deep research 中，某些 entities 出现频率极高但信息量低
   - Node specificity 可以自动降权这类 nodes，聚焦 informative 的部分

4. **Neurobiological framing 的叙事价值**:
   - 用认知科学/神经生物学框架来包装我们的设计，增加论文的叙事深度
   - "test-time graph construction as memory formation" 是一个有吸引力的类比

---

## 一句话定位

> HippoRAG 证明了 "受大脑启发的结构化记忆" 在 RAG 中的强大效果，其 PPR-based retrieval 和 node specificity 机制可以直接借鉴到我们的 multi-graph 利用设计中——而它的 "from RAG to Memory" 后续工作更直接指向了我们的方向。
