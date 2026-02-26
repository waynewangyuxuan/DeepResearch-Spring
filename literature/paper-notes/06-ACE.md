# ACE: Agentic Context Engineering
**Paper**: arXiv 2510.04618 (Oct 2025)
**Authors**: Qizheng Zhang, Changran Hu, Shubhangi Upasani, Boyuan Ma, Fenglu Hong et al.
**Affiliations**: Stanford University, SambaNova Systems, UC Berkeley
**Venue**: ICLR 2026

---

## Why — 问题动机

LLM 的性能高度依赖于 input context 的质量。现有的 context 优化方法有两大类：

1. **Weight-based** (fine-tuning, RLHF, etc.) — 改模型权重。昂贵，需要 GPU，不灵活
2. **Context-based** (prompt engineering, few-shot examples, etc.) — 改输入。轻量，但手工设计

**Context-based 方法的现有自动化尝试及其问题**:
- **MIPROv2** — 优化 prompt 模板
- **GEPA** — 用遗传算法演化 prompt
- **Dynamic Cheatsheet** — 从执行经验中学习 "小抄"

这些方法都有一个共同的致命缺陷：**Context Collapse（上下文坍塌）**

> 在迭代 rewriting 过程中，context 突然从 18,282 tokens 缩水到 122 tokens，accuracy 从 66.7 暴跌到 57.1

原因：iterative summarization/rewriting 会丢失 domain-specific insights，趋向于产生越来越短、越来越 generic 的 context。

**另一个缺陷**: **Brevity Bias（简洁偏差）**——优化过程倾向于删减细节以换取简洁，但那些细节可能对特定任务至关重要。

**核心论点**: 需要一种**结构化的、增量的** context 演化方法，既保留细节，又能持续积累新知识——而不是反复重写。

---

## What — 核心贡献

ACE 把 context 视为一本**不断演化的 playbook**——通过模块化的 generation → reflection → curation 过程，积累、精炼、组织策略。

核心思路：**不改权重，改 context**。用 agentic 方法让 context 自我进化。

---

## How — 方法详解

### 三角色架构

```
┌─────────────────────────────────────────────────┐
│                 ACE Framework                   │
│                                                 │
│  ┌───────────┐    ┌───────────┐    ┌──────────┐ │
│  │ Generator │ →  │ Reflector │ →  │ Curator  │ │
│  │           │    │           │    │          │ │
│  │ 执行任务,  │    │ 分析成败,  │    │ 转化为   │ │
│  │ 产生      │    │ 提取      │    │ 结构化   │ │
│  │ reasoning │    │ insights  │    │ delta    │ │
│  │ traces    │    │           │    │ updates  │ │
│  └───────────┘    └───────────┘    └──────────┘ │
│                                                 │
│  Context Playbook (持续演化的结构化知识)           │
└─────────────────────────────────────────────────┘
```

### 三个角色的详细职责

**1. Generator（生成器）**
- 接收新的 query/task
- 基于当前 context playbook 执行推理
- 产出 reasoning trajectories
- 同时暴露 effective strategies 和 recurring pitfalls

**2. Reflector（反思器）**
- 独立于 Curator 运行（separation of concerns）
- 分析 Generator 的执行结果：成功了为什么成功？失败了为什么失败？
- 提取 generalizable insights（而不是 task-specific observations）
- 关键：**不做 rewriting**——只做评估和洞察提取

**3. Curator（策展器）**
- 把 Reflector 的 insights 转化为**结构化的 delta updates**
- 每条 insight 附带 helpful/harmful 计数器
- 使用 **deterministic merging**：
  - 新 insight 与已有 insight 做 de-duplication
  - 基于 helpful/harmful 比率做 pruning
  - 过时或低质量的 insights 被移除
- **关键创新**: 这个过程是**增量的**（delta updates），不是全量 rewriting → 避免 context collapse

### 防止 Context Collapse 的机制

| 机制 | 作用 |
|------|------|
| **Delta updates** (非全量 rewriting) | 每次只添加/修改/删除具体条目，保留整体结构 |
| **Helpful/harmful counters** | 量化每条 insight 的价值，数据驱动的 pruning |
| **Deterministic merging** | 去重逻辑是确定性的（非 LLM rewriting），不会引入噪声 |
| **Reflection ≠ Curation** | 把 "理解发生了什么" 和 "如何更新 context" 分离 |

### 两种适配模式

- **Offline**: 用一批 training examples 预先构建 playbook，然后在 test time 使用
- **Online**: 在实际执行中边跑边学（self-supervised，不需要 labeled data）

---

## Benchmarks & Evaluation

### AppWorld Benchmark（Agent 任务）

AppWorld = 一个模拟真实世界 app 操作的 agent benchmark

| 方法 | Score | 备注 |
|------|-------|------|
| IBM CUGA (GPT-4.1-based) | 60.3% | 排行榜第一的产品级 agent |
| **ReAct + ACE (DeepSeek-V3.1)** | **59.4%** | 用开源小模型逼近 SOTA |
| Online ACE | **+8.4% TGC, +0.7% SGC** | 在 harder test-challenge split 上超过 CUGA |

**意义**: 不改模型权重、不用 GPT-4 级别的模型，仅通过优化 context 就能达到产品级 agent 的水平。

### Financial Reasoning (FiNER, Formula)

- ACE 平均比 baselines 高 **+8.6%**

### 对比 baselines

| Baseline | ACE 优势 |
|----------|---------|
| ICL (in-context learning) | 显著更好 |
| MIPROv2 | 显著更好 |
| GEPA | 显著更好 |
| Dynamic Cheatsheet | 显著更好 |
| **平均** | **+10.6%** |

### 效率

| 指标 | 数据 |
|------|------|
| Adaptation latency reduction | **-86.9%** |
| Rollout cost reduction | up to **-83.6%** |
| Offline: latency vs GEPA | **-82.3%** |
| Online: latency vs Dynamic Cheatsheet | **-91.5%** |

### Self-Supervised 能力

**不需要 labeled data** 也能工作——利用自然的 execution feedback（如代码执行成功/失败）来驱动 Reflector 和 Curator。这意味着在 deep research 场景中，我们可以用搜索结果的相关性、图构建的一致性等 implicit feedback 来驱动 context 优化。

---

## Limitations

1. **Playbook 的结构是预定义的**: ACE 假设 context 的组织方式（structured insights with counters）是固定的。对于不同类型的任务可能需要不同的 playbook 结构
2. **Reflector 的质量依赖 LLM**: 如果 LLM 不能正确归因成功/失败原因，insights 会有噪声
3. **没有层级化的 context 组织**: Playbook 内部是 flat 的 insight 列表

---

## 与我们工作的关系

### 核心联系

**ACE 和我们的 IGC 本质上在做同一件事**——都是在 test-time 通过 agentic 方法优化 LLM 的 input context，而不改模型权重。区别在于：
- ACE 的 context = 一个结构化的 text playbook
- 我们的 context = 一组多层级的知识图谱

### 直接可借鉴

1. **Generator → Reflector → Curator 的三角色架构**:
   映射到 IGC：
   - Generator = 用当前图 context 执行 deep research 步骤
   - Reflector = 分析该步骤的结果（搜索是否有效？图是否需要更新？）
   - Curator = 决定如何增量更新图结构

2. **Delta updates 防 collapse**:
   这直接适用于图的增量更新——不要每轮重建图，而是做 structured delta（add/modify/remove nodes and edges）

3. **Helpful/harmful counters**:
   可以给图中的每个 node/edge 附加使用频率和贡献度统计，用于 pruning 不重要的信息

4. **Self-supervised adaptation**:
   在 deep research 中，report 质量的 implicit feedback 可以驱动图结构的优化

### 我们的差异化

ACE 的 playbook 是 unstructured text（虽然有 internal structure）。我们用**图**作为 context 的骨架，天然比 text playbook 更有结构、更适合 relational reasoning。

---

## 一句话定位

> ACE 证明了 "不改权重、只优化 context" 在 agent 场景中的巨大潜力。它的 Generator-Reflector-Curator 架构和 delta update 机制可以直接移植到我们的 incremental graph construction 流程中——只需把 "text playbook" 替换为 "knowledge graph"。
