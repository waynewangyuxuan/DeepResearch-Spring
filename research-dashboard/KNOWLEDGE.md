# Research Dashboard：Markdown-Driven 研究仪表盘

> 从 Context OS 的 Markdown 文件自动生成极简交互式仪表盘。
> 不改变文件结构，只读取并呈现。"Markdown 是数据库，Dashboard 是视图。"

---

## 1. 核心理念

### 1.1 数据流

```
spec/ (Markdown files)
    ↓ 解析
Dashboard (Web App)
    ↓ 编辑
写回 spec/ (Markdown files)
```

Dashboard 不维护自己的数据库。所有数据来自 spec/ 下的 Markdown 文件，编辑后写回原文件。Context OS 的 Markdown 结构就是 single source of truth。

### 1.2 设计原则

**极简主义**：信息密度高，视觉噪声低。每个像素都有目的。
**Typography-first**：字体即层级。用字重/字号/颜色区分信息，少用边框和分割线。
**Monochrome + Accent**：底色纯净（白/近白），一个强调色标记状态和焦点。
**Micro-visualization**：小而密的可视化（sparklines、进度条、热力图），不用大图表。
**Zero-navigation**：一页总览，钻入靠 expand/collapse，不靠页面跳转。

## 2. 技术架构

### 2.1 推荐方案：MDX + Next.js

```
tech-stack/
├── Next.js (App Router)     ← 框架
├── MDX                      ← Markdown + JSX 组件
├── gray-matter              ← YAML frontmatter 解析
├── Tailwind CSS             ← 样式
└── Chokidar (dev)           ← 文件监听热更新
```

**为什么 MDX**：Markdown 可直接渲染，需要交互的地方内嵌 React 组件。保持文件 AI 可读（MDX 本质还是 Markdown），同时支持丰富交互。

### 2.2 备选方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| MDX + Next.js | 灵活、组件化、SSG | 需要编码 |
| Evidence.dev | SQL 查 Markdown 元数据 | 偏 BI，定制性弱 |
| Obsidian Publish | 零开发 | 不可定制、交互弱 |
| Docusaurus | 文档站成熟 | 不适合 Dashboard 布局 |

## 3. 页面设计

### 3.1 单页总览布局

```
┌─────────────────────────────────────────────┐
│  Research Dashboard          [周期选择] [🔍] │
├─────────────┬───────────────────────────────┤
│  导航面板    │  主内容区                       │
│  ─────────  │                               │
│  📚 文献     │  ┌─ Status Bar ─────────────┐ │
│  💡 想法     │  │ 12 papers │ 5 ideas │ 3p │ │
│  🧪 原型     │  └────────────────────────────┘│
│  📈 进度     │                               │
│  📋 Todo    │  [当前选中区域的详细内容]         │
│             │                               │
└─────────────┴───────────────────────────────┘
```

### 3.2 五个核心视图

**Literature View**：Reading-Queue 三态表 + 论文卡片网格。卡片展示标题、状态色带（待读灰/在读蓝/已读绿）、一句话收获。点击展开 Summary.md 内容。

**Ideas View**：时间线布局。每个想法一张卡片，左侧状态 emoji，右侧触发来源和关联链接。按状态可筛选。

**Prototypes View**：卡片列表。每张显示 README 第一段、最近修改时间、状态（活跃/归档）。关联到触发它的 Concept。

**Progress View**：日历热力图 + session 列表。热力图一格代表一天（有 session = 亮色）。点击日期展开该 session 的四维度摘要。

**Todo View**：直接渲染 Todo.md，支持勾选写回。

## 4. 设计系统

### 4.1 色彩

```
背景：#FAFAFA（近白）    文字：#1A1A1A（近黑）
次要文字：#6B7280         边框：#E5E7EB（极淡灰）
强调色：#2563EB（蓝）      成功：#059669    警告：#D97706
```

Monochrome 为主，强调色只用于状态指示和可交互元素。

### 4.2 字体

标题 Inter/SF Pro 字重 600，正文同族字重 400 行高 1.6，代码 JetBrains Mono。层级只靠字号和字重。

### 4.3 Micro-visualization 组件

| 组件 | 用途 | 实现 |
|------|------|------|
| Status Dot | 论文/想法状态 | 8px 圆点 + 状态色 |
| Sparkline | 每周活跃度 | SVG path，无坐标轴 |
| Progress Ring | 想法成熟度 | SVG circle，环形进度 |
| Heat Calendar | session 频率 | CSS Grid，色块 |
| Tag Chip | 论文标签 | pill shape，浅色底 |

## 5. 数据解析层

### 5.1 Markdown → JSON

```typescript
interface ParsedSpec {
  literature: { queue: QueueItem[]; papers: Paper[] }
  concepts:   { ideasLog: Idea[]; folders: ConceptFolder[] }
  prototypes: PrototypeEntry[]
  progress:   SessionEntry[]
  todo:       TodoItem[]
}
```

解析器读 spec/ 目录，产出结构化 JSON 供组件消费。每次文件变化重新解析。

### 5.2 写回机制

编辑操作（勾选 Todo、更新状态）→ 修改 JSON → 序列化回 Markdown → 写入原文件。保持 Markdown 格式不变，AI 仍可读。

## 6. 更新工作流

```
研究者工作 → 编辑 Markdown（IDE/AI/Dashboard 均可）
    ↓
Dashboard 检测变化（Chokidar watch）
    ↓
重新解析 → 热更新视图
```

三种编辑入口等价：IDE 直接改文件、AI session 更新、Dashboard 交互编辑。

## 7. 与 exploratory-research-os 的关系

Dashboard 是 exploratory-research-os 的**视图层**：Literature/ → Literature View、Concepts/ → Ideas View、Prototypes/ → Prototypes View、Progress/ → Heat Calendar + Session 列表、Todo.md → Todo View。不改变底层文件结构。

*Markdown 是数据库，Dashboard 是视图，AI 是协作者。三者共享同一份文件。*
