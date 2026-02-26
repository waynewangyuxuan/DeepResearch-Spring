# Evidence: Exploratory Research OS

> 设计决策的来源与支撑

---

## E1. Literature → Concepts → Prototypes 三区分离

**来源**：eLabFTW（开源电子实验笔记本）的设计——实验、协议、资源分区存储。RSpace 类似地将实验数据、样本管理、外部集成分层。

**Graphex 先前实践验证**：Prompt_Engineering_Log.md 本质上就是 Concepts/ 的雏形（Ideas-Log + 实验设计），Node_Edge_Schema.md 是概念设计文档，Knowledge_Graph_Health_Metrics.md 是文献综述产物。三者分散在 uploads 中，没有结构化组织——正是本模块要解决的问题。

## E2. Reading-Queue 三态管理

**来源**：Zotero 的 collection + tag 系统，简化为 Markdown 表格。

**为什么不直接用 Zotero**：Context OS 需要 AI 可读。Zotero 的数据存在 SQLite 中，AI 无法直接消费。Reading-Queue.md 是"AI 能读的 Zotero"。

**实践验证**：研究者常见的痛点是"我两周前看过一篇相关的论文但忘了叫什么"。Reading-Queue 的"已读 + 一句话核心收获"就是为了解决这个问题。

## E3. Ideas-Log 时间序设计

**来源**：物理实验的 lab notebook 传统——按时间顺序记录，不修改历史记录。

**为什么不按主题组织想法**：因为探索阶段的想法还没有稳定的主题分类。今天觉得属于 A 方向的想法，下周可能发现属于 B。时间序是最无偏的组织方式——当想法成熟后再升级为 Folder（按主题）。

**认知科学支撑**：外化（externalization）降低工作记忆负担。想法写下来后，大脑可以释放容量去想新的。Ideas-Log 就是"大脑的 swap space"。

## E4. 想法状态标记（💡→🔍→📐→🧪→✅/❌）

**来源**：GTD 的 next action / someday-maybe 分类，适配到研究想法的生命周期。

**实践**：不标记状态的后果是"所有想法看起来同等重要"。状态标记让 AI 和研究者都能快速定位"当前最值得投入精力的想法是哪个"。

## E5. 原型的自我清理规则

**来源**：Sacred（ML 实验追踪工具）的实验隔离设计——每个实验有独立的配置、代码快照和输出。

**反面案例**：没有隔离规则时，原型 A 修改了一个共享模块，导致原型 B 突然跑不通——但两个原型的作者不知道彼此的存在。"原型间不允许隐式依赖"直接预防这个问题。

## E6. Connections.md（论文间联系）

**来源**：Semantic Scholar 的 citation graph + Connected Papers 的可视化。

**在 Context OS 中的价值**：AI 读到 Connections.md 时，可以快速理解"这篇论文在更大的研究图景中处于什么位置"，而不需要读完所有相关论文。这是 Meta.md 路由表思想在文献层面的延伸。

## E7. Progress 增加"想了什么"和"方向变了吗"

**来源**：Context OS 的 session protocol（end-session 产出 Progress），扩展到认知活动。

**为什么重要**：探索性研究的最大进展往往不是代码或数据，而是"想通了一件事"或"决定不做某个方向了"。如果 Progress 只记录行为（做了什么），会遗漏最有价值的认知进展。

*证据来源：eLabFTW、Zotero、Sacred、Graphex 实践、认知科学外化理论。*
