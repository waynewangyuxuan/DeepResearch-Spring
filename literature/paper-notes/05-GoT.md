# Graph of Thoughts: Solving Elaborate Problems with LLMs
**Paper**: arXiv 2308.09687 (Aug 2023)
**Authors**: Maciej Besta, Nils Blach, Ales Kubicek, Robert Gerstenberger et al.
**Affiliations**: ETH Zurich
**Venue**: AAAI 2024

---

## Why — 问题动机

LLM 推理范式的演进路径：

```
IO (Input-Output)          → 单次生成，无中间推理
    ↓
CoT (Chain-of-Thought)     → 线性推理链
    ↓
CoT-SC (Self-Consistency)  → 多条推理链 + 投票
    ↓
ToT (Tree of Thoughts)     → 树状分支 + 回溯
    ↓
GoT (Graph of Thoughts)    → 任意图结构 ← 本文
```

**核心问题**: CoT 是线性的（A→B→C→D），ToT 是树状的（可以分支但不能合并），**都无法表达推理中的合并、循环、反馈**。

现实中的推理往往是：
- 你先探索多个方向（branching）
- 然后把不同方向的 insights 合并（merging）
- 发现某个 thought 有问题后改进它（refining/looping）
- 把大问题拆成小问题分别解决后再合并（decompose + merge）

**核心论点**: 需要一种能表达**任意推理拓扑**的框架——图是最自然的选择。

---

## What — 核心贡献

GoT 把 LLM 的推理过程建模为一个**有向图**：
- **节点** = LLM thoughts（一段推理输出）
- **边** = thoughts 之间的依赖关系
- 支持 CoT、ToT 无法实现的操作：merge, refine (loop), decompose

---

## How — 方法详解

### 形式化定义

GoT = 一个四元组 **(G, T, E, R)**:
- **G** — LLM reasoning graph（所有 thoughts 及其关系）
- **T** — Thought Transformations（可用的图操作集合）
- **E** — Evaluator function（对 thoughts 打分）
- **R** — Ranking function（排序选择最优 thoughts）

### 核心操作（Thought Transformations）

| 操作 | 图语义 | 描述 |
|------|--------|------|
| **Generate (Branch)** | 从一个节点分出多条边 | 从一个 thought 生成多个候选 thoughts |
| **Aggregate (Merge)** | 多条边汇聚到一个新节点 | 合并多个 thoughts 的 insights 形成综合 thought |
| **Refine (Loop)** | 自环（同一节点上的边）| 基于反馈改进一个 thought |
| **Decompose** | 一个节点展开为多个子节点 | 把复杂任务拆解为多个子任务 |

**关键特性**: 这些操作是 **domain-dependent** 的——比如：
- 排序任务中的 merge = 合并两个已排序的子列表
- 文档任务中的 decompose = 把文章拆为段落级摘要
- 推理任务中的 refine = 用新证据修正之前的结论

### 系统架构

```
┌──────────────────────────────────────────┐
│                Controller                │
│  ┌─────────────┐  ┌───────────────────┐  │
│  │ Graph of    │  │ Graph Reasoning   │  │
│  │ Operations  │  │ State (GRS)       │  │
│  │ (GoO)       │  │ = thoughts 的     │  │
│  │ = 执行计划   │  │   当前状态和历史   │  │
│  └─────────────┘  └───────────────────┘  │
└──────────────┬───────────────────────────┘
               │
    ┌──────────┼──────────┐
    ↓          ↓          ↓
┌────────┐ ┌────────┐ ┌────────┐
│Prompter│ │ LLM    │ │Scoring │
│(准备    │ │(执行    │ │Module  │
│ prompt) │ │ 推理)   │ │(验证+  │
└────────┘ └────────┘ │ 打分)  │
                      └────────┘
```

**Graph of Operations (GoO)** = 预定义的执行计划，规定了对 thoughts 施加哪些 transformations
**Graph Reasoning State (GRS)** = thoughts 的实时状态图，记录所有历史

GoT 的巧妙之处：GoO 可以被设计为模拟任何已有方法——如果 GoO 是线性的就等价于 CoT，如果 GoO 是树状的就等价于 ToT。

---

## Benchmarks & Evaluation

### 任务
1. **Sorting** — 对 32/64/128 个元素排序
2. **Set Intersection** — 求两个集合的交集
3. **Keyword Counting** — 从文档中计数关键词
4. **Document Merging** — 合并多段文本

### 使用模型
- GPT-3.5-turbo（主要）
- GPT-4（补充）

### 核心结果

| 指标 | 数据 |
|------|------|
| Sorting quality vs ToT | **+62%** improvement (P=64) |
| Sorting cost vs ToT | **-31%** cost reduction |
| Sorting vs CoT (P=64) | median error **-65%** |
| Sorting vs IO (P=64) | median error **-83%** |
| P=128 elements vs ToT | median error **-69%** |

### Cost-Quality Tradeoff
- GoT 和 ToT 的成本比 CoT 高（因为每个 Generate 操作产生 k 个 thoughts）
- 但 GoT 通过 merge 和 refine 把这些多余的 thoughts 有效利用了 → 质量更高
- GoT 实现了 **logarithmic latency + linear volume** → 最优的 cost-quality tradeoff

---

## Limitations

1. **GoO 需要人工设计**: 目前 Graph of Operations 是 task-specific 的，需要人类根据任务特点设计执行计划。没有 automated GoO discovery
2. **任务偏简单**: Sorting, set intersection 等任务结构清晰。对于开放式推理（如 deep research），如何设计 GoO 是未解决的问题
3. **没有知识图谱**: GoT 是关于**推理结构**的，不涉及外部知识检索或图谱构建
4. **单轮推理**: 没有跨 query 的状态保持

---

## 与我们工作的关系

### 核心价值：操作词汇的借鉴

GoT 最大的贡献不是它的系统实现，而是它**定义了一套图上操作的通用词汇**：

| GoT 操作 | 在 IGC (我们) 中的对应 |
|----------|----------------------|
| **Generate/Branch** | 从一个 research question 衍生多个 sub-questions |
| **Aggregate/Merge** | 合并多个子图的 aspects 为连贯叙事 |
| **Refine/Loop** | 根据新搜索结果修正已有图中的 facts |
| **Decompose** | Frederick 的 zoom-in：展开高层级节点为细粒度子图 |
| **Evaluate** | Confidence-based 判断（类似 TRAIL） |

这套词汇可以直接作为我们 IGC pipeline 中 graph operations 的设计基础。

### Controller + GoO 的架构启发

GoT 的 Controller / GoO / GRS 三层架构可以映射到 deep research 中：
- **GoO** → deep research 的高层策略（先搜索、再构图、再合并、再生成报告）
- **GRS** → 已构建的所有图的当前状态
- **Controller** → agent 的决策模块（下一步做什么操作？）

### 差异
GoT 操作的是 LLM thoughts（纯文本推理片段），我们操作的是 knowledge graphs（结构化的 entity-relation 或其他类型的图）。但**操作的抽象层面是一致的**。

---

## 一句话定位

> GoT 为 LLM 推理定义了一套通用的图操作词汇（merge, refine, decompose, branch），虽然它本身不涉及知识图谱，但这套操作词汇可以直接移植到我们的 incremental graph construction 设计中，作为 graph-level 操作的理论基础。
