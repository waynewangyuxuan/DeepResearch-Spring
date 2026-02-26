# Evidence: Research Dashboard

> 设计决策的来源与支撑

---

## E1. Markdown-as-Database 架构

**来源**：Evidence.dev 的核心理念——SQL + Markdown 生成静态 BI 报告。我们去掉 SQL 层（不需要数据库），保留"Markdown 是 source of truth"。

**为什么不直接用 Evidence.dev**：Evidence 面向 BI 分析（SQL 查数据库），不适合解析 Markdown 文件。但其"代码即报告"的思路直接启发了本模块的架构。

## E2. MDX 选型

**来源**：MDX（Markdown + JSX）在 Next.js 生态中的成熟应用。Docusaurus、Nextra 等文档框架均基于 MDX。

**关键优势**：MDX 文件对 AI 来说仍是 Markdown（可读可写），对浏览器来说是 React 组件（可交互）。这解决了"AI 可读 vs 人类可交互"的矛盾。

## E3. Typography-First 设计

**来源**：iA Writer 的设计哲学——"只有字体"。Edward Tufte 的信息设计原则：最大化数据墨水比（data-ink ratio），消除图表垃圾（chartjunk）。

**实践验证**：2025 Dashboard 设计趋势报告指出：极简主义、micro-visualization、认知负荷降低是三大方向。大图表正在被 sparklines 和内联指标取代。

## E4. Monochrome + Single Accent 配色

**来源**：Vercel Dashboard、Linear App 的设计语言——接近纯黑白底，一个品牌色做强调。

**认知科学**：色彩过多增加认知负担。研究表明有效仪表盘使用不超过 5 种颜色。Monochrome + 1 accent 是最保守有效的方案。

## E5. Zero-Navigation 单页设计

**来源**：Zero-interface 设计趋势（2025）——减少 UI 表面积，让内容本身成为导航。

**为什么不用多页**：研究者的使用场景是"快速扫一眼全局状态"，不是"深入某个特定页面"。多页需要记住导航结构，单页展开/折叠更符合扫描式阅读。

## E6. Chokidar 文件监听 + 热更新

**来源**：Vite 的 HMR（Hot Module Replacement）机制。Chokidar 是 Node.js 最成熟的文件监听库（Webpack、Vite 均内置使用）。

**为什么重要**：研究者可能在 IDE 中改了一个 Markdown 文件，Dashboard 应该立即反映变化，无需手动刷新。这是"三种编辑入口等价"的技术保障。

## E7. Micro-Visualization 组件选择

**来源**：Edward Tufte 的 sparklines 概念——"数据密集、设计简洁、字号大小的图形"。适合嵌入文本流中。

**具体参考**：GitHub 贡献热力图（heat calendar）、Linear 的进度环（progress ring）、Notion 的状态点（status dot）。这些都是"不需要图例就能理解"的可视化。

*证据来源：Evidence.dev、MDX 生态、iA Writer、Tufte 信息设计、Vercel/Linear 设计系统、GitHub UX。*
