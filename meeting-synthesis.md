# Meeting Synthesis — Deep Research Spring

三次组会的核心内容整理，聚焦 deep research 方向和 Wayne 个人任务线。

---

## 组会全景

三次会议涉及两个并行的项目线，以及一个新启动的 deep research 研究方向。

### 项目线 A：Qualitative Analysis Evaluation（定性分析评估）

这条线围绕一个核心问题：**如何评估 LLM 生成的 codebook 的质量？** 具体来说，当 LLM 对语料进行 deductive coding 后，如何系统地衡量其结果与人工 ground truth 的对齐程度。

团队手头已有的资产（Frederick 提出的 "四/五要素" 框架）：
1. **Corpora** — 原始语料数据
2. **Deductive coding results** — LLM 的编码结果
3. **LM Codebook (LMCB)** — LLM 生成的编码本
4. **GT Codebook (GTCB)** — 人工 ground truth 编码本
5. **GT deductive coding results** — 人工编码结果

核心洞察是：不同要素对之间的比较衡量的是不同维度的质量——1↔2 衡量 groundedness，3↔4 衡量 alignment，2↔3 衡量 codebook 的 coverage/utilization，等等。Frederick 反复强调需要一个**逻辑组织方案**来替代平铺的指标列表。

进展状态：
- 已有 8-10 个数据集，各配有 human ground truth 和 LLM deductive coding 结果
- Taggert 梳理了约 30 个指标的精选列表（从 Irene 的更大列表中筛选），其中 ~20 个已实现
- T1 指标（传统 NLP 指标，基于 ground truth）基本就绪
- T2 指标（来自定性分析文献的概念性指标，如 credibility、transferability）尚未启动
- Hungarian algorithm 已实现两个版本（基于 semantic similarity 和基于 assignment overlap）
- 下一步：将指标分配到上述框架的各个 pairwise 组合中，然后开始跑实验

### 项目线 B：Systemic World Model & Forecasting

Chuong 提出了两个方向：
1. **Persona-based analysis** — 调查 LLM 模拟不同视角（文化、社会、宗教等）的能力和偏差。核心关切是：LLM 训练数据中某些社区视角被低估，导致生成的 persona 不可验证
2. **Multi-modal knowledge graph construction** — 超越纯文本，结合图像、地理数据、artifacts 等多模态数据构建更丰富的 world model

Frederick 的回应：
- 对多模态方向持审慎态度——目前没有 solid evidence 证明 LLM 从图像获得比文本更好的空间/图示理解
- 真正的核心挑战不是多模态，而是**如何将多个小图（每个 ~20 nodes）组合成一个连贯的叙事**——"mosaic art" 隐喻
- 提出了**多层级图结构**的设想：不是传统的百万节点知识图谱，而是递归的、可 zoom in/out 的分层图结构
- 推荐阅读 *The Mediterranean* 一书，因为其多层级推理方式与此设想高度相关

### 新方向：Deep Research

这是最新一次会议的重点。团队正式启动了 deep research 方向的基础设施和基线工作。

**已有的基础设施：**
- Google Search API（~40 queries/day）
- Infinite Cloud Go
- YouTube/Bilibili transcript downloader + Whisper
- Sandbox all-in-one Docker container
- 本地 LLM 部署能力
- OpenAI API keys（预算有限）

**Benchmark 选择讨论：**
- ❌ 传统 QA benchmarks（HotpotQA、WebQA 等）— 太基础，close-ended，不是团队的定位
- ❌ BrowseComp — 偏 browser use / computer use，暂不在范围内
- ❌ HLE、GAIA — 与当前 pipeline 定位不匹配
- ❌ XBench — 问题全是中文，且更偏 computer use
- ✅ **Live Research Bench** (~100 questions) — 开放式研究问题，有 rubric 评估，高优先级
- ✅ **Deep Research Bench 2** — 类似，有 human-made rubrics
- ✅/⚠️ **FutureX / forecasting benchmarks** — 用于补充评估，对知识截止时间敏感

**关于 Search R1 等基线：**
- Search R1 使用 Qwen 2.5 7B，在传统 QA benchmark 上定位为 RAG 增强
- 团队认为这些基线的定位（close-ended factual QA）与自己的方向（open-ended deep research）不同
- 但仍需作为 baseline 运行，可能需要自行在新 benchmark 上重新训练/运行
- Qisen 已成功在服务器上部署了 Search R1 的 inference，但未开始 training

**关于 MiroFlow / MiroThinker：**
- MiroFlow 是基础设施框架，MiroThinker 是基于它的 agent（使用专门训练的模型）
- MiroFlow 支持数百轮迭代的长程 agent 循环
- 即使用 GPT 替换 MiroThinker 的专用模型，MiroFlow + GPT 的组合也表现不错
- 但整体运行起来比较复杂

**Incremental Graph Construction (IGC) Pipeline — Qiyue Gao 主导：**
- 一个用图结构做 context engineering 的 deep research pipeline
- 完成度约 60-70%（可以端到端运行，但图表示等环节还不够成熟）
- 图目前以文本形式存储（textual representation of graph）
- 图构建部分有优化空间（如何表示图、如何增量更新）
- 下一步：先在 Live Research Bench 等 3 个 benchmark 上跑出初始结果，然后再优化

**任务分工：**
- Qiyue Gao (Bird) — 运行 IGC pipeline 在上述 benchmark 上
- Qisen Yang — 部署 MiroFlow/Search R1 等基线
- 其余成员 — 协助基线运行和指标工程

---

## Wayne 的个人任务线：In-context / Test-time Learning for Graph Construction

从三次会议的讨论中提炼出与 Wayne 任务直接相关的关键线索：

### 核心问题
如何在 deep research 过程中**增量地构建和维护知识图谱**，使其成为有效的 context engineering 手段？这不是传统的百万节点 KG，而是一系列人类可理解的小图（~20 nodes each），它们通过多层级结构组织在一起。

### 关键概念框架

**1. 图的构建（单图层面）**
- 每个图是自包含的、结构良好的小模块
- 类型多样：因果图、时间线、社交网络、分类法、表格等
- 每个图附带元数据/文本描述
- 这一步相对容易

**2. 图的组合（跨图层面）— 核心难题**
- Qisen 的 related work writing 类比：每篇论文有多个 facets，写综述时需要从每篇论文中选择特定 aspects，然后跨论文组合成连贯叙事
- 两个子问题：
  - **选择**：从每个图中选择哪些 aspects？
  - **组合**：如何将选出的 aspects 编织成连贯的 story？
- Frederick 的 "mosaic art" 隐喻：就像用小色块拼成大画面

**3. 多层级结构（架构层面）**
- Frederick 的核心提议：不是单一层级的大图，而是递归的层级结构
- Level 1、Level 2、Level 3... 不同层级的图可以独立存在
- 同层级内可以横向推理（horizontal reasoning），跨层级可以纵向推理（vertical reasoning / zoom in & out）
- 人类推理就是这样工作的：灵活地在不同粒度之间跳转

**4. 问题驱动 vs 数据驱动**
- Chuong 的关键洞察：历史学家不是先收集所有数据再拼图，而是**从问题出发**
- 类似 BFS/DFS 搜索：从一个发现出发，提出假设，寻找证据支持，如果满意则停止，如果不满意则继续扩展
- 这意味着图的构建是**问题驱动的增量过程**，不是一次性构建

### 与 In-context / Test-time Learning 的联系

这些讨论天然对应 test-time learning 的范式：
- **In-context learning** — 如何在 LLM 的 context window 中有效表示和利用已构建的图？
- **Test-time adaptation** — 如何根据当前查询/问题动态调整图的结构和内容？
- **Incremental construction** — 如何在推理过程中逐步构建和更新图？
- **Multi-level reasoning** — 如何支持在不同抽象层级之间的灵活切换？

### 需要跟踪的 Literature 方向

基于会议讨论，以下方向的文献需要重点追踪：

1. **GraphRAG 及变种** — 图增强的检索增强生成，特别是增量构建方面
2. **Search R1 / WebThinker / MiroThinker** — 当前 deep research agent 的代表性工作
3. **递归/分层知识表示** — 超越扁平 KG 的层级化图结构
4. **Test-time compute / inference-time learning** — 如何在推理时利用额外计算
5. **Context engineering** — 如何为 LLM 组织最有效的 context
6. **Qualitative coding / deductive coding with LLM** — 团队自己的前期工作

### 需要的 Prototype 方向

1. 单图构建的 prompt engineering 实验（不同图类型）
2. 图的文本表示 vs 结构化表示的对比
3. 多图合并策略的小规模 prototype
4. 层级图结构的概念验证

---

## 近期行动项

| 优先级 | 任务 | 负责人 |
|--------|------|--------|
| P0 | 在 Live Research Bench / DR Bench 2 上运行 IGC pipeline | Qiyue (Bird) |
| P0 | 部署 Search R1 / MiroFlow 基线 | Qisen |
| P1 | 整理 in-context/test-time learning for graph construction 的文献 | Wayne (Qisen) |
| P1 | 设计增量图构建的概念方案 | Wayne (Qisen) |
| P2 | 完成 qualitative analysis 指标的 pairwise 框架组织 | Taggert + team |
| P2 | Workshop paper 提交（已基本完成） | Qisen |
