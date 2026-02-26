# Literature Reading List

In-context / Test-time Learning for Graph Construction 相关文献追踪。

状态标记：🔴 未读 | 🟡 在读 | 🟢 已读

详细笔记见 `track2-graph-based-kr.md`（已完成首轮调研）。

---

## Track 1: Deep Research Agents & Pipelines

| Paper | 关键词 | 状态 | 笔记 |
|-------|--------|------|------|
| Search R1 (Qwen 2.5 7B) | RL for search, RAG | 🔴 | 团队基线之一，QA-based 定位，非 deep research |
| WebThinker | web search agent | 🔴 | 称自己为 WebSearch 但也用 web dataset |
| MiroThinker / MiroFlow | agentic loop, 600+ rounds, multi-tool | 🔴 | MiroFlow 是 infra，MiroThinker 是 agent+model |
| TTD-DR (2507.16075) | test-time diffusion, deep research | 🔴 | Draft-centric iterative approach，维护 global context ★★☆ |
| Deep Research Bench 2 | benchmark, rubric evaluation | 🔴 | 开放式研究问题，团队主要 benchmark |
| Live Research Bench | benchmark, ~100 questions | 🔴 | 高优先级 benchmark |

## Track 2: Graph-based Knowledge Representation

### Tier 1 — 推理时动态图构建（核心）

| Paper | 关键词 | 状态 | 优先级 | 笔记 |
|-------|--------|------|--------|------|
| **TRAIL** (2508.04474) | KG traverse + expand + refine at inference | 🔴 | ★★★ | 最接近我们设想：interactive KG 修改，confidence-based stopping |
| **ToG-3** (Think-on-Graph 3.0) | dual-evolving multi-agent, adaptive graph | 🔴 | ★☆☆ | 精度好但 2-3x latency |
| **GAR** (Graph-Augmented Reasoning) | step-by-step KG build & retrieve | 🔴 | ★☆☆ | +22.1% over vanilla LLM，概念简洁 |
| **Graph-PRefLexOR** | symbolic graph in thinking phase | 🔴 | ★☆☆ | 偏 model architecture，概念值得注意 |

### Tier 2 — 静态/半静态 Graph RAG（Baseline）

| Paper | 关键词 | 状态 | 优先级 | 笔记 |
|-------|--------|------|--------|------|
| **GraphRAG** (2404.16130) | community detection, hierarchical summary | 🔴 | ★★★ | 必读 baseline，Leiden hierarchy |
| **LightRAG** (2410.05779, EMNLP 2025) | dual-level index, incremental update, 10x cheaper | 🔴 | ★★☆ | 增量更新 + 轻量化设计 |
| **HippoRAG / HippoRAG 2** (NeurIPS 2024) | memory-inspired, PageRank, consolidation | 🔴 | ★★☆ | Memory consolidation = zoom out |
| RAPTOR (ICLR 2024) | recursive abstractive tree | 🔴 | ★☆☆ | 递归摘要 + 树组织 |

### Tier 3 — 推理图结构

| Paper | 关键词 | 状态 | 优先级 | 笔记 |
|-------|--------|------|--------|------|
| **GoT** (2308.09687, AAAI 2024) | graph of thoughts, merge/refine/decompose | 🔴 | ★★☆ | 操作词汇参考 |
| Graph-CoT (ACL 2024 Findings) | iterative: reason → interact → execute | 🔴 | ★☆☆ | 三步循环可扩展 |

## Track 3: Test-time Compute & In-context Learning

| Paper | 关键词 | 状态 | 笔记 |
|-------|--------|------|------|
| Cognition Engineering (2504.13828) | test-time scaling, inference-time reasoning | 🔴 | 理论框架：test-time scaling 的系统性视角 |
| (待补充) | test-time training, TTT layers | 🔴 | |

## Track 4: Context Engineering

| Paper | 关键词 | 状态 | 优先级 | 笔记 |
|-------|--------|------|--------|------|
| **ACE** (2510.04618) | agentic context engineering, no weight update | 🔴 | ★★★ | DeepSeek + ACE ≈ GPT-4.1 agent |
| Context Engineering Survey (2507.13334) | retrieval, generation, compression, selection | 🔴 | ★☆☆ | 广泛背景 |
| LangChain: Context Engineering for Agents | write/select/compress/isolate strategies | 🔴 | ★☆☆ | 实践指南 |

## Track 5: Qualitative Analysis + LLM（团队前期工作）

| Paper | 关键词 | 状态 | 笔记 |
|-------|--------|------|------|
| 团队 workshop paper (submission #47) | deductive coding, LLM codebook evaluation | 🟢 | 已提交，8 pages |

## Track 6: Surveys & Meta

| Paper | 关键词 | 状态 | 笔记 |
|-------|--------|------|------|
| LLM-empowered KG Construction Survey (2510.20345) | KG construction paradigm shift | 🔴 | 全景综述 |
| Graph RAG Survey (ACM TOIS 2025) | GraphRAG 方法论综述 | 🔴 | |
| Awesome-GraphRAG (GitHub) | curated list | 🔴 | 持续追踪用 |

---

## 其他参考

- *The Mediterranean* (Fernand Braudel) — Frederick 推荐，multi-level 历史推理的典范
