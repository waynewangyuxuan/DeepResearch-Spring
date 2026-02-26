# Track 2: Graph-based Knowledge Representation — Literature Notes

聚焦三个子问题：Representation、Construction、Utilization。

---

## 全景地图

2024-2025 年，Graph + LLM 方向经历了从 "静态预构建 KG" 到 "推理时动态构建/演化图" 的范式转变。按与我们问题的相关性排序。

### Tier 1: 直接相关 — 推理时动态图构建

这一组工作**最接近我们的核心问题**（test-time incremental graph construction）。

---

#### TRAIL: Joint Inference and Refinement of Knowledge Graphs with LLMs
- **arXiv**: 2508.04474 (Aug 2025)
- **核心创新**: 把 KG 从 "只读资源" 变成 "可交互的、可修改的推理伙伴"
- **方法**: LLM agent 在每一步推理时可以做三种操作之一：
  1. **Retrieve** — 从 KG 中检索相关子图
  2. **Hypothesize** — 假设缺失的 facts 并添加到 KG
  3. **Synthesize** — 基于当前 context 生成答案
- **关键机制**: Confidence-based evaluation 决定何时继续扩展 KG、何时停止
- **效果**: 比 KG-augmented 和 RAG baselines 高 3-13%
- **与我们的联系**: 这就是 Chuong 描述的 historian 工作方式的形式化——从问题出发，搜索证据，假设缺失信息，逐步构建。但 TRAIL 的图是 flat 的，没有 Frederick 提出的多层级结构

---

#### Think-on-Graph 3.0 (ToG-3)
- **来源**: ResearchGate (2025)
- **核心创新**: Dual-evolving multi-agent system，在推理过程中**自适应构建目标图索引**
- **方法**:
  - 多个 agent 协作：一个负责 query 演化，一个负责 sub-graph 精炼
  - 图不是一次性构建的，而是随推理过程动态演化
  - 支持异构知识源的整合
- **权衡**: 精度最好，但延迟是 baseline 的 2-3x
- **与我们的联系**: "dynamic graph evolution" 的理念与我们一致。multi-agent 架构可以参考。但同样没有层级结构

---

#### Graph-Augmented Reasoning (GAR)
- **来源**: aimodels.fyi (2025)
- **核心创新**: Step-by-step 的 KG 构建与检索
- **方法**:
  1. 从 problem statement 推导出初始 KG
  2. 随推理推进，LLM 请求特定信息
  3. 新 nodes/edges 被添加，旧关系被修正
  4. 图结构适应当前推理路径
- **效果**: 比 vanilla LLM +22.1%
- **与我们的联系**: 最接近 "增量构建" 的直觉。但粒度是 single reasoning chain，不是 multi-round deep research

---

#### Graph-PRefLexOR
- **来源**: Wiley Advanced Intelligent Discovery (2025)
- **核心创新**: 在 LLM 的 "thinking phase" 中构建图，使用 special tokens 做符号抽象
- **方法**: 把图构建嵌入到 transformer 的生成过程中（不是外部工具调用，而是模型内部的符号操作）
- **与我们的联系**: 这个方向更偏 model architecture，短期可能不是我们能做的。但 "thinking phase 中构建图" 的概念值得注意

---

### Tier 2: 重要背景 — 静态/半静态 Graph RAG

这些是当前的 standard approaches，我们需要理解它们的局限以定位自己的工作。

---

#### GraphRAG (Microsoft, 2024)
- **arXiv**: 2404.16130
- **核心方法**:
  1. LLM 从文档中抽取 entity-relation KG
  2. Leiden 算法做 hierarchical community detection
  3. LLM 对每个 community 生成摘要
  4. 查询时：local search（子图检索）+ global search（community 摘要检索）
- **关键贡献**: 证明了 graph structure + community summaries 对 query-focused summarization 显著优于 naive RAG
- **局限**:
  - 图是**预构建的**，不随查询演化
  - 构建成本极高（5GB 法律文档 ~$33K）
  - 社区层级是固定的，不能按需 zoom in/out
- **与我们的联系**: Leiden 的 hierarchical clustering 是 Frederick 多层级图的一个简化版本。但 GraphRAG 的层级是预先确定的，而 Frederick 的设想是 on-demand 的

---

#### LightRAG (EMNLP 2025)
- **核心方法**: Dual-level graph-augmented index（key-value schema），支持 incremental update
- **优势**: 比 GraphRAG 便宜 10x，精度接近
- **与我们的联系**: "incremental update" 能力直接相关。轻量化设计适合多轮 deep research 中的频繁更新

---

#### HippoRAG (NeurIPS 2024) → HippoRAG 2
- **核心方法**: 受人类海马体长期记忆启发，KG + Personalized PageRank
- **关键创新**:
  - 模拟人类记忆的 encoding → consolidation → retrieval 过程
  - HippoRAG 2 改进了 multi-hop retrieval（associativity）和 sense-making
  - 比 GraphRAG/RAPTOR/LightRAG 的离线索引成本更低
- **与我们的联系**: "memory consolidation" 的概念直接对应 Frederick 的 "zoom out"——从细节中压缩出高层级摘要。PageRank 可以用来做 graph-based aspect selection

---

#### RAPTOR (ICLR 2024)
- **核心方法**: Recursive Abstractive Processing for Tree-Organized Retrieval
- **与我们的联系**: 递归摘要 + 树状组织，是多层级结构的一个简化版本

---

### Tier 3: 思维图范式 — 推理结构本身是图

---

#### Graph of Thoughts (GoT) — AAAI 2024
- **arXiv**: 2308.09687
- **核心创新**: LLM 的推理过程建模为任意图（而非链或树）
  - 节点 = LLM thoughts
  - 边 = 依赖关系
  - 支持 merge（合并多个 thoughts）、refine（反馈循环）、decompose（拆分子任务）
- **效果**: Sorting 质量比 ToT +62%，成本 -31%
- **与我们的联系**: GoT 是关于**推理结构**的，不是关于知识表示的。但 merge + refine 的操作与多图组合问题直接相关。可以把 GoT 的操作词汇（merge, refine, decompose, loop back）借鉴到我们的图组合设计中

---

#### Graph Chain-of-Thought (Graph-CoT) — ACL 2024 Findings
- **核心方法**: 每轮迭代三步：LLM reasoning → graph interaction → graph execution
- **与我们的联系**: 这个三步循环可以扩展为 deep research 的每一轮搜索循环

---

### Tier 4: 综合视角 — Surveys & Frameworks

---

#### A Survey of Context Engineering for LLMs (Jul 2025, arXiv)
- 把 "prompt engineering" 升级为 "context engineering" 的学科
- 涵盖 context retrieval, generation, compression, selection
- **与我们的联系**: 图就是一种 structured context。survey 中的 context assembly 策略可以指导我们的 Utilization 子问题

#### Agentic Context Engineering (ACE) (Oct 2025, arXiv)
- **核心创新**: 不改模型权重，而是用 agentic 方法优化 LLM 的 input context
- 在 AppWorld 上用 DeepSeek-V3.1 + ACE (59.4%) 接近 GPT-4.1 agent (60.3%)
- **与我们的联系**: 直接相关——图构建本质上就是一种 context engineering

#### Deep Researcher with Test-Time Diffusion (TTD-DR) (Jul 2025, arXiv)
- **核心创新**: Draft-centric iterative approach，维护全局 coherence
- 解决了线性/并行 deep research pipeline 丢失 global context 的问题
- **与我们的联系**: 图可以作为 TTD-DR 中维护 global context 的骨架

#### LLM-empowered KG Construction Survey (Oct 2025, arXiv)
- 全面综述从 rule-based → statistical → LLM-driven 的 KG 构建范式转变
- 指出未来方向：dynamic knowledge memory for agentic systems, multimodal KG construction

---

## 关键发现 & 对我们设计的启发

### 发现 1: "推理时动态图" 是 2025 最热的方向
TRAIL、ToG-3、GAR 都在做这件事，但它们都是针对 **单次 QA** 设计的，没有人把它扩展到 **multi-round deep research** 的场景。这是我们的差异化空间。

### 发现 2: 多层级结构是公认的方向，但缺少好的实现
- GraphRAG 有 community hierarchy（通过 Leiden）
- RAPTOR 有 recursive tree
- HippoRAG 有 memory consolidation
- 但没有人做到 Frederick 设想的 **on-demand, recursive zoom in/out**

### 发现 3: 图构建和图利用通常是分离的
大多数工作要么专注于构建（GraphRAG, LightRAG），要么专注于利用（GoT, Graph-CoT）。**把构建和利用统一到一个 test-time loop 中**是一个明确的 gap。

### 发现 4: 操作词汇正在收敛
跨多篇论文，图上的核心操作逐渐收敛为：
- **Retrieve** — 从图中检索相关子结构
- **Expand** — 添加新节点/边（from search results）
- **Merge** — 合并多个子图
- **Refine** — 修正/更新已有关系
- **Compress** — 将低层级细节压缩为高层级摘要（zoom out）
- **Decompose** — 将高层级节点展开为更细的子图（zoom in）

### 发现 5: 成本是核心约束
GraphRAG 的 $33K/5GB 告诉我们，图构建不能太重。LightRAG 的 10x 降本方向是对的。我们的增量构建天然有成本优势——只构建当前需要的部分。

---

## 推荐精读清单（按优先级）

| 优先级 | 论文 | 原因 |
|--------|------|------|
| ★★★ | TRAIL (2508.04474) | 最接近我们的 "test-time graph construction" 设想 |
| ★★★ | GraphRAG (2404.16130) | 必读 baseline，hierarchical community 的原始设计 |
| ★★★ | ACE (2510.04618) | Context engineering 的 agentic 方法，框架层面直接相关 |
| ★★☆ | LightRAG (2410.05779) | 增量更新 + 轻量化设计，工程层面参考 |
| ★★☆ | HippoRAG / HippoRAG 2 | Memory-inspired 设计，consolidation 机制可借鉴 |
| ★★☆ | GoT (2308.09687) | 图操作词汇（merge, refine, decompose）的参考 |
| ★★☆ | TTD-DR (2507.16075) | Deep research + test-time 结合的直接参考 |
| ★☆☆ | ToG-3 | Multi-agent + dynamic graph，但延迟问题待解决 |
| ★☆☆ | GAR | Step-by-step KG 构建，概念简洁但场景偏小 |
| ★☆☆ | Context Engineering Survey (2507.13334) | 广泛背景读物 |
