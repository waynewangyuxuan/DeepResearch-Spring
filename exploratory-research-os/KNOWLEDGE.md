# Exploratory Research OS：探索性科研的上下文系统

> 面向文献调研、概念设计、原型迭代的 Context OS 变体。
> 与 research-context-os（工程化 benchmark）互补：这个管"想"，那个管"跑"。

---

## 1. 探索性科研 vs 工程化科研

| 维度 | 探索性（本模块） | 工程化（research-context-os） |
|------|---------------|---------------------------|
| 核心活动 | 读论文 → 想方案 → 做原型 | 配置 infra → 跑 benchmark → 分析 |
| 迭代对象 | 想法 / 概念设计 | 配置 / 参数 |
| 代码状态 | 混乱、频繁重写 | 相对稳定、可复现 |
| "进度"的含义 | 理解加深、方向变清晰 | 分数提升、论文数据就绪 |
| 核心痛点 | 散乱、找不到、忘了想过什么 | 不可复现、配置不一致 |

## 2. Spec 结构：探索版

```
spec/
├── Meta.md
├── Core/
│   ├── Research-Goal.md    ← 研究问题定义（不是 PRD）
│   ├── Technical.md
│   └── Regulation.md
├── Literature/             ← 文献管理（核心区域）
│   ├── Meta.md
│   ├── Reading-Queue.md    ← 待读 / 在读 / 已读
│   └── {paper-slug}/      ← 每篇重要论文一个 folder
├── Concepts/               ← 概念设计空间
│   ├── Meta.md
│   ├── Ideas-Log.md        ← 时间序的想法流
│   └── {concept-slug}/    ← 成熟想法升级为 folder
├── Prototypes/             ← 原型代码管理
│   ├── Meta.md
│   └── {proto-NNN}/       ← 每个原型一个 folder
├── Decisions/
├── Progress/
└── Todo.md
```

三个核心区域：Literature/（输入）→ Concepts/（思考）→ Prototypes/（输出）。

## 3. Literature/：文献管理

### 3.1 Reading-Queue.md

三区表格：**待读**（Paper + 为什么 + 优先级）、**在读**（Paper + 开始日期 + 笔记位置）、**已读**（Paper + 一句话核心收获 + 笔记链接）。本质是"AI 能读的 Zotero"。

### 3.2 论文 Folder 结构

```
Literature/{paper-slug}/
├── Summary.md      ← 结构化摘要（Problem/Method/Results/Relevance）
├── Notes.md        ← 自由笔记、批注、疑问
└── Connections.md  ← 与其他论文/概念的联系（可选）
```

**Summary.md 模板**：Authors/Year/Venue → Problem → Method → Key Results → Relevance → Limitations。每项一句话。

## 4. Concepts/：想法管理

### 4.1 Ideas-Log.md — 时间序的想法流

按日期倒序记录。每条包含：**想法标题**、**触发**（哪篇论文/哪个实验引发的）、**直觉**（初步思路）、**关联**（跟哪个 concept/experiment 有关）、**状态**。

状态标记：💡 萌芽 → 🔍 探索中 → 📐 设计中 → 🧪 原型中 → ✅ 验证 / ❌ 放弃

### 4.2 想法升级为 Folder

当一个想法从 Ideas-Log 中成熟到需要详细展开时，升级：

```
Concepts/{concept-slug}/
├── Motivation.md    ← 为什么值得做（引用 Literature/）
├── Design.md        ← 概念设计（可以有图、伪代码）
├── Open-Questions.md ← 还没想清楚的点
└── Related-Work.md  ← 相关论文汇总（引用 Literature/）
```

## 5. Prototypes/：混乱代码的有序管理

探索性代码天然混乱——A 跟 B 不兼容，上周的原型这周要大改。需要隔离 + 自述。

### 5.1 原型 Folder 结构

```
Prototypes/{proto-NNN}-{slug}/
├── README.md       ← 这个原型验证什么假设、怎么跑
├── CHANGELOG.md    ← 改了什么、为什么（git log 的人类版）
├── src/            ← 代码
└── results/        ← 输出（数据、图表）
```

### 5.2 自我清理规则（写入 Regulation.md）

每个原型必须有 README.md（不知道怎么跑 = 废代码）；原型间不允许隐式依赖（A 不能 import B 的内部模块）；废弃标记 `ARCHIVED` 前缀移到 `_archived/`；每周检查新建原型是否有 README。

## 6. 三区联动：Literature → Concepts → Prototypes

```
Literature/wang-2025-ttkq/Summary.md
    ↓ "这篇的方法可以改造用于..."
Concepts/test-time-entity-adaptation/Motivation.md
    ↓ "设计完了，试试看"
Prototypes/proto-003-tta-entity/README.md
    ↓ "验证了假设" or "假设不成立"
Concepts/test-time-entity-adaptation/Design.md  ← 更新
```

通过 Markdown 链接保持追溯。Meta.md 的路由表反映当前焦点。

## 7. Progress 的探索版

每条 session 日志包含四个维度：**阅读**（读了什么 + 笔记位置）、**想法**（新想法 + Ideas-Log 链接）、**原型**（做了什么 + 结果）、**方向调整**（战略级变化）。关键区别：不只是"做了什么"，还有"想了什么"和"方向变了吗"。

## 8. CLAUDE.md Start Working

读 spec/Meta.md → 读 Progress/LATEST.md（上次思考到哪）→ 读 Concepts/Meta.md（活跃概念）→ 读 Literature/Reading-Queue.md（当前在读什么）。

*探索性研究的 Context OS：输入是论文，输出是想法，代码只是验证工具。*
