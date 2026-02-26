# Incremental Graph Construction as Context Engineering

概念设计笔记。基于组会讨论整理。

---

## 问题定义

Deep research 的核心挑战：给定一个复杂的、开放式的研究问题，agent 需要通过多轮 web search + 信息整合，生成结构化的、有深度的研究报告。

**当前方法的局限：**
- 大多数 deep research pipeline 是 flat 的——收集信息然后直接生成报告
- 信息之间的结构关系（因果、时间、层级）在纯文本 context 中容易丢失
- Context window 有限，无法 naively 地把所有信息塞进去

**我们的假设：**
用增量构建的图结构作为 context engineering 的骨架，可以显著提升 deep research 的质量。

---

## 设计空间

### 1. 图的类型 Taxonomy

Frederick 在会上提到了多种图类型：

```
Causal Graph     — 因果关系网络
Timeline         — 时间序列事件链
Social Network   — 实体/人物关系网
Taxonomy         — 分类层级结构
Table            — 结构化数据表
Geographical     — 地理空间分布
```

每种类型最多 ~20 nodes（人类可读的上限）。

### 2. 单图构建（相对容易）

给定一组相关信息，让 LLM 构建一个特定类型的图。这一步已有较多先例（GraphRAG 等），核心是 prompt design。

### 3. 多图组合（核心难题）

**Qisen 的 related-work 类比：**
```
Paper_1: [intro, method, experiment, ...]
Paper_2: [intro, method, experiment, ...]
Paper_3: [intro, method, experiment, ...]
          ↓
Related Work Section:
  选择 Paper_1.method + Paper_2.experiment + Paper_3.intro
  → 编织成连贯叙事
```

同理，多个图的组合也是：
```
Graph_1: [aspect_A, aspect_B, aspect_C]
Graph_2: [aspect_D, aspect_E, aspect_F]
Graph_3: [aspect_G, aspect_H, aspect_I]
          ↓
选择 + 组合 → 连贯的综合叙事
```

**两个子问题：**
1. Aspect Selection — 从每个图中选什么？（取决于当前 research question）
2. Narrative Synthesis — 怎么把选出的 aspects 编织在一起？

### 4. 多层级结构（Frederick 的核心提议）

```
Level 0 (最高抽象):  [Global Causal Graph]
                          ↕
Level 1:             [Regional Graph_A] ←→ [Regional Graph_B]
                          ↕                      ↕
Level 2:        [Detail_A1] [Detail_A2]    [Detail_B1] [Detail_B2]
```

- 横向推理：同层级图之间的关系
- 纵向推理：zoom in (展开细节) / zoom out (回到宏观)
- 不是预先构建的，而是 on-demand 的

### 5. 问题驱动的增量构建（Chuong 的洞察）

```
Initial Question
    → Hypothesis_1
    → Search for evidence
    → Graph_1 (partial)
    → New sub-questions emerge
    → Search more
    → Graph_1 updated + Graph_2 created
    → Evaluate: satisfied?
        → Yes: synthesize and stop
        → No: expand further
```

类似 BFS/DFS 搜索策略，图是**边搜索边构建**的。

---

## 与 Test-time Learning 的连接

| TTL 概念 | 在 IGC 中的对应 |
|----------|----------------|
| In-context examples | 已构建的图作为 structured context |
| Test-time adaptation | 根据当前 query 动态选择/重组图 |
| Incremental learning | 每轮搜索后更新图结构 |
| Multi-scale reasoning | 在不同层级的图之间切换 |
| Memory consolidation | 将低层级细节压缩到高层级摘要 |

---

## Open Questions

1. **图的表示**：当前 IGC pipeline 用纯文本表示图。是否需要更结构化的表示？（如 JSON、adjacency list、embedding）
2. **何时创建新图 vs 更新旧图**：增量构建中的 graph management 策略
3. **层级的自动发现**：如何让 agent 自动决定当前该在哪个层级推理？
4. **评估**：图的质量如何衡量？与最终报告质量的关系？
5. **计算效率**：多层级图 + 多轮搜索的 token 消耗如何控制？

---

## 下一步

- [ ] 文献调研：GraphRAG 系列、hierarchical KG、test-time compute
- [ ] 分析 IGC pipeline 现有代码，理解当前图表示方式
- [ ] 设计 2-3 个小规模 prototype 实验
- [ ] 与 Qiyue (Bird) 对齐 IGC pipeline 的优化方向
