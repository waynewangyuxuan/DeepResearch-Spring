# GraphRAG: From Local to Global
**Paper**: arXiv 2404.16130 (Apr 2024)
**Authors**: Darren Edge, Ha Trinh, Newman Cheng, Joshua Bradley, Alex Chao, Apurva Mody, Steven Truitt, Jonathan Larson — **Microsoft Research**
**Venue**: Pre-print, open-sourced at github.com/microsoft/graphrag

---

## Why — 问题动机

传统 RAG 的核心缺陷是 **"连点成线" 的失败**：当回答一个问题需要跨越多个散落的信息片段、通过它们的共享属性进行关联推理时，基于 chunk 检索的 naive RAG 完全无能为力。

具体来说，作者区分了两类查询：
- **Local queries** — 关于特定实体的细节问题（"Scrooge 是谁？"）→ naive RAG 能处理
- **Global queries** — 关于整个语料的宏观理解问题（"这个数据集的主要主题是什么？"）→ naive RAG 失败，因为答案分散在整个语料中，无法通过 top-K chunk 检索覆盖

**核心论点**: 要回答 global sensemaking 类问题，你需要一个能捕捉语料**全局结构**的索引——而不只是一堆 embeddings。

---

## What — 核心贡献

GraphRAG = **LLM-驱动的知识图谱构建** + **层级社区检测** + **Map-Reduce 式查询**

它证明了：把非结构化文本转化为结构化的、分层的图索引，能显著提升 global query 的回答质量。

---

## How — 方法详解

### Indexing Pipeline（离线阶段）

```
Source Documents
    ↓ (1) Text Chunking
Text Chunks
    ↓ (2) Entity & Relationship Extraction (LLM)
Raw Entities + Relations (tuples)
    ↓ (3) Element Summarization (LLM)
Entity/Relation Description Summaries
    ↓ (4) Graph Construction
Entity-Relation Graph
    ↓ (5) Leiden Community Detection (hierarchical)
Community Hierarchy (C0, C1, C2, C3...)
    ↓ (6) Community Summarization (LLM)
Community Summaries at each level
```

**关键细节**:

**(2) Entity & Relationship Extraction**: 用 LLM 对每个 chunk 做 few-shot information extraction，输出 (entity, entity_type, description) 和 (source, target, relationship_description) 的 tuple 列表。

**(5) Leiden Community Detection**: 这是与传统 KG 方法的核心差异。不是简单地存储一个 flat 的 entity-relation 图，而是用 **Leiden 算法**做**递归的层级社区检测**：
- 先在全图上检测一级社区（C0 = 最粗粒度）
- 在每个社区内部递归检测子社区（C1, C2, C3...）
- 直到叶子社区无法再分
- **Leiden vs Louvain**: Leiden 多了一个 refinement phase，保证每个社区内部是 well-connected 的（没有孤立节点），确保每个社区代表一个内聚的主题
- 使用 `graspologic` 库实现

**(6) Community Summarization**: 对每一级的每个社区，用 LLM 生成摘要。这些摘要就是回答 global query 的 "预制材料"。

### Query Pipeline（在线阶段）

**Global Search（Map-Reduce）**:
1. **Map**: 将查询发送给**每一个 community summary**，独立、并行地生成部分答案
2. **Reduce**: 汇总所有相关的部分答案，生成最终的全局回答

**Local Search**:
- 以查询中的实体为入口，fan out 到其邻居和关联概念
- 类似传统 KG-based QA

### 四级社区的设计

| Level | 粒度 | 用途 |
|-------|------|------|
| C0 | Root communities (最粗) | 最宏观的主题概览，token 成本最低 |
| C1 | Sub-communities | 中等粒度 |
| C2 | Sub-sub-communities | 较细粒度 |
| C3 | Leaf communities (最细) | 最详细，token 成本最高 |

---

## Benchmarks & Evaluation

### 数据集
1. **Podcast Transcripts** — *Behind the Tech with Kevin Scott* 播客公开文字稿，涵盖多位科技领袖对话
2. **News Articles** — 2013-2023 年的新闻文章，跨 entertainment、business、sports、technology、health、science

### 对比条件（6 个）
- **C0, C1, C2, C3** — GraphRAG 的四级社区
- **TS (Text Summarization)** — 直接对源文本做 map-reduce 摘要（无图结构）
- **SS (Semantic Search)** — 标准 vector RAG baseline

### 评估指标（LLM-as-Judge）
- **Comprehensiveness** — 答案是否覆盖了问题的所有相关方面
- **Diversity** — 答案是否提供了多样化的视角
- **Empowerment** — 答案是否帮助读者理解主题并做出判断
- **Relevance** — 答案是否切中问题

使用 **pairwise comparison** 方法：给 LLM 两个答案（顺序随机），让它判断哪个更好。

### 核心结果
- 对 **global sensemaking 类问题**，GraphRAG **在 comprehensiveness 和 diversity 上大幅领先** naive RAG
- C0 (root-level) 在 token 成本极低的情况下就能达到竞争性能
- 更细粒度的 C1-C3 在某些问题上更好，但 token 成本线性增长

---

## Limitations / 与我们工作的关系

### 局限
1. **索引成本极高**: 5GB 法律文档 ~$33K。全量 LLM 调用做 extraction + summarization 非常昂贵
2. **图是预构建的、静态的**: 不随查询演化。新数据进来需要重新构建整个图
3. **社区层级是固定的**: Leiden 一次性确定层级结构。不能按需 zoom in/out，也不能根据特定查询动态重组
4. **单一图类型**: 只有 entity-relation 图。没有因果图、时间线、taxonomy 等多样化图类型
5. **面向 QA 设计**: 目标是回答问题，不是生成长篇研究报告

### 对我们的启发
- **Leiden 的层级社区 = Frederick 多层级图的简化版**: 证明了层级化图结构对 global reasoning 的价值。但我们需要 on-demand 的、query-adaptive 的层级
- **Community summary = zoom out 操作的一种实现**: 把一个社区压缩成一段摘要 ≈ 从 Level 2 zoom out 到 Level 1
- **Map-Reduce 查询 = multi-graph utilization 的暴力解**: 我们需要更 selective 的方案
- **成本问题**: 说明增量构建（只构建当前需要的部分）有明确的经济价值

---

## 一句话定位

> GraphRAG 证明了 "图结构 + 层级摘要" 对 global sensemaking 的巨大价值，但它的静态预构建范式在成本和适应性上都有硬伤——这正是我们要用 test-time incremental construction 解决的。
