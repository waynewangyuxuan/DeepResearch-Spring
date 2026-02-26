# Integration Guide: Research Dashboard

> 为你的 exploratory-research-os 项目搭建极简研究仪表盘

---

## 1. 前置条件

**必需**：已按 exploratory-research-os 建立 spec/ 结构（Literature/ + Concepts/ + Prototypes/）。
**技术环境**：Node.js 18+、npm/pnpm。

## 2. 执行计划

### Round 1: 项目初始化

```
Step 1: 在研究项目根目录创建 dashboard/
  dashboard/
  ├── package.json
  ├── next.config.mjs
  ├── tailwind.config.ts
  ├── tsconfig.json
  └── src/
      ├── app/
      ├── components/
      ├── lib/
      └── styles/

Step 2: 安装依赖
  next, react, tailwindcss, gray-matter, chokidar,
  @next/mdx, remark-gfm

Step 3: 配置 Tailwind 设计 token
  - 色彩：#FAFAFA 背景、#1A1A1A 文字、#2563EB 强调色
  - 字体：Inter + JetBrains Mono
  - 间距：4px 基准网格
```

### Round 2: 解析层

```
Step 4: 实现 Markdown 解析器
  src/lib/parser.ts
  - parseReadingQueue(path) → QueueItem[]
  - parseIdeasLog(path) → Idea[]
  - parsePrototypes(path) → PrototypeEntry[]
  - parseProgress(path) → SessionEntry[]
  - parseTodo(path) → TodoItem[]

Step 5: 实现文件监听
  src/lib/watcher.ts
  - 监听 spec/ 目录变化
  - 变化 → 重新解析 → 通过 WebSocket 推送前端

Step 6: 实现写回
  src/lib/writer.ts
  - updateTodoStatus(item, checked) → 修改 Todo.md
  - updateIdeaStatus(idea, newStatus) → 修改 Ideas-Log.md
```

### Round 3: 核心视图

```
Step 7: Status Bar 组件
  - 论文数、想法数、原型数、本周 session 数
  - 全部用 micro-visualization（数字 + sparkline）

Step 8: Literature View
  - Reading-Queue 三态表（灰/蓝/绿状态带）
  - 论文卡片网格，点击展开 Summary.md

Step 9: Ideas View
  - 时间线 + 状态筛选
  - 卡片：emoji + 标题 + 触发来源 + 关联

Step 10: Prototypes View
  - 卡片列表：README 首段 + 修改时间 + 状态

Step 11: Progress View
  - Heat Calendar（CSS Grid 实现）
  - Session 列表（四维度摘要）
```

### Round 4: 打磨 + 部署

```
Step 12: Todo View + 写回交互
  - 复选框勾选 → 写回 Todo.md

Step 13: 全局搜索
  - 全文搜索 spec/ 下所有 Markdown

Step 14: 响应式适配
  - 移动端：导航面板折叠、卡片单列

Step 15: 部署（可选）
  - next build && next export → 静态部署
  - 或 next dev 本地使用
```

## 3. 用户交互点

| 阶段 | 需要确认什么 |
|------|------------|
| Round 1 | 技术栈偏好（Next.js ok？）、设计 token 微调 |
| Round 2 | spec/ 的 Markdown 格式是否稳定 |
| Round 3 | 各视图布局是否满足需求 |
| Round 4 | 部署方式（本地 / 静态站点 / 云） |

## 4. 验证清单

### 解析
- [ ] parser 正确解析 Reading-Queue 三态
- [ ] parser 正确解析 Ideas-Log 条目和状态
- [ ] 文件变化 → Dashboard 2 秒内更新

### 视图
- [ ] Literature View 显示所有论文 + 状态色带
- [ ] Ideas View 按时间排列 + 状态可筛选
- [ ] Progress Heat Calendar 数据准确
- [ ] Todo 勾选后写回文件成功

### 设计
- [ ] 色彩只用 Monochrome + 1 accent
- [ ] 字体层级清晰（标题/正文/代码三层）
- [ ] 无大面积图表，只有 micro-visualization

## 5. 后续扩展

| 需求 | 动作 |
|------|------|
| 叠加 benchmark 数据 | 增加 Experiments View（来自 research-context-os） |
| 多人协作 | 加 git sync + 冲突提示 |
| AI 摘要 | 集成 LLM 自动生成 Progress 摘要 |
| 离线 PWA | next-pwa 插件 |

*Round 1 → 2 → 3 → 4。最小可用：Round 1-3 即可日常使用。*
