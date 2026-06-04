# Git 分支与文档分类

本文用于说明当前 GitHub 仓库中 `main`、`develop`、`feature`、`task` 四类分支分别放什么、谁来用、如何合并。

## 1. 四类分支的含义

| 分支类型 | 用途 | 适合放什么 | 不适合放什么 | 合并方向 |
|---|---|---|---|---|
| `main` | 对外稳定版本 | 已确认、可运行、可给团队引用的代码和权威文档 | 草稿、未校核剧情、未接入小游戏、临时截图、IDE 配置 | 只从 `develop` 或负责人确认的分支合并 |
| `develop` | 整合测试版本 | 多个模块合在一起测试，准备进入 `main` 的内容 | 个人草稿、散乱文件、未经说明的素材 | 合并到 `main` |
| `feature/*` | 功能模块开发 | NPC、小游戏、记录夹、线索墙、自由对话 API、场景功能等较完整模块 | 只改一两句话的小修小补 | 合并到 `develop` |
| `task/*` | 小任务整理 | 文档修订、素材清单、路径修正、表格补充、归档整理、错字修正 | 大功能开发、多人长期协作模块 | 合并到 `develop`，少数可由负责人确认后进 `main` |

## 2. 当前推荐分支命名

| 类型 | 命名示例 | 说明 |
|---|---|---|
| 主分支 | `main` | 稳定版本，不直接写草稿 |
| 整合分支 | `develop` | 总负责人或整合人用于集中测试 |
| 功能分支 | `feature/fixed-npc-dialogue` | 固定 NPC 剧情模块 |
| 功能分支 | `feature/free-npc-api` | 自由 NPC API 接入 |
| 功能分支 | `feature/minigame-dig` | 挖土消消乐 |
| 功能分支 | `feature/minigame-inscription` | 题记辨读 |
| 功能分支 | `feature/record-folder` | 记录夹、关系图、三栏报告 |
| 小任务分支 | `task/gdd-update` | GDD 口径更新 |
| 小任务分支 | `task/docs-cleanup` | 文档整理 |
| 小任务分支 | `task/asset-index` | 图片资产表补充 |

## 3. 当前文档按分支归属分类

这里的“归属”不是要求移动文件，而是说明它们应该在哪类分支上维护、确认和合并。

### 3.1 应进入 `main` 的权威文档

这些文档一旦由总负责人确认，就应保留在 `main`，供全团队引用。

| 文档 | 进入 `main` 的条件 | 理由 |
|---|---|---|
| `README.md` | 仓库入口说明已确认 | 团队和 GitHub 访问入口 |
| `docs/PRD/M1初步需求文档_PRD.md` | 当前 PRD 版本已确认 | 产品范围基线 |
| `docs/design/GDD.md` | v0.1 口径经负责人确认 | 游戏设计总文档 |
| `docs/design/剧情创作框架与NPC节点模板.md` | 创作边界经负责人确认 | 剧情负责人交付依据 |
| `docs/team/协作流程.md` | 团队协作方式确认 | 团队工作流入口 |
| `docs/team/团队分工与模块接口需求文档.md` | 分工和接口确认 | 成员交付边界 |
| `docs/team/Git分支与文档分类.md` | 本分类确认 | GitHub 协作规则 |
| `docs/handoff/线索交付文档/交付清单.md` | 交付包范围确认 | 线索文档索引 |
| `docs/handoff/线索交付文档/M1线索交付包_团队使用说明_v1.0.md` | 使用口径确认 | 团队查阅入口 |
| `docs/handoff/线索交付文档/01_核心交付/` | 线索、R 链、边界校核确认 | 线索权威依据 |
| `docs/handoff/线索交付文档/06_ID与校核交付/` | ID 和校核报告确认 | 防止 ID 混乱 |
| `docs/team/standards/M1线索总表模板.md` | 表格格式确认 | 成员交付模板 |

### 3.2 适合在 `develop` 整合的文档

这些文档可以先在 `develop` 里试运行、互相对齐，确认后再进 `main`。

| 文档或目录 | 用途 | 进入 `main` 前要确认 |
|---|---|---|
| `docs/design/` 新增设计文档 | GDD、记录夹、NPC、小游戏等设计补充 | 是否与 PRD、线索总表冲突 |
| `docs/PRD/planning/M1开发实施顺序表.md` | 排期和开发顺序 | 是否仍符合当前版本目标 |
| `docs/assets/项目资产清单.md` | 素材分类和使用说明 | 图片路径、用途、是否被游戏引用 |
| `docs/team/团队工作内容_PRD抽取.md` | 团队任务拆解 | 是否与最新 GDD 一致 |
| `docs/handoff/线索交付文档/02_章节精修交付/` | 各章节细化 | 是否已经被核心总表吸收 |
| `docs/handoff/线索交付文档/03_后室专项交付/` | 后室专项设计 | 是否和后室最新数据一致 |
| `docs/handoff/线索交付文档/04_规范与校核/` | 文案和校核规范 | 是否更新为当前三条硬性禁止口径 |
| `docs/handoff/线索交付文档/05_剧情体验交付/` | 剧情体验、回收链、节奏表 | 是否符合剧情自由度和分栏规则 |

### 3.3 适合用 `feature/*` 分支维护的内容

这些是“模块级”工作，通常由某个负责人或小组持续开发。

| 功能分支 | 适合维护的内容 | 对应文件 |
|---|---|---|
| `feature/fixed-npc-dialogue` | 固定 NPC 角色、小传、节点、对白、选项反馈 | `docs/design/剧情创作框架与NPC节点模板.md`，后续 NPC 节点表 |
| `feature/free-npc-api` | 自由 NPC API、章节 allowedClues、暂不回答边界 | `docs/PRD/modules/NPC自由对话模块需求文档.md` |
| `feature/record-folder` | 记录夹、卡片列表、关系图、三栏报告 | 后续 `docs/design/记录夹与线索墙设计.md` |
| `feature/minigame-dig` | 挖土消消乐原型和接入说明 | 后续小游戏原型与接入表 |
| `feature/minigame-inscription` | 题记辨读小游戏 | 后续小游戏原型与接入表 |
| `feature/minigame-rear-relic` | 后室遗物定位小游戏 | 后续小游戏原型与接入表 |
| `feature/scene-data-refactor` | `data/scenes.js` 拆分或数据字段统一 | `data/scenes.js`、后续数据规范 |
| `feature/assets-m1-map` | M1 图片资产映射、备用图用途说明 | `docs/assets/`、`assets/M1/` |

### 3.4 适合用 `task/*` 分支处理的内容

这些是“小而清楚”的任务，完成后可以较快合并。

| 小任务分支 | 适合处理的内容 |
|---|---|
| `task/update-gdd-wording` | GDD 某一处口径修正 |
| `task/fix-doc-paths` | README、仓库整理方案、文档路径修正 |
| `task/archive-old-docs` | 旧稿归档、重复文件清理 |
| `task/update-clue-boundary` | 线索边界措辞修正 |
| `task/add-asset-purpose` | 为未说明用途的图片补备注 |
| `task/gitignore-cleanup` | `.gitignore` 规则补充 |
| `task/readme-update` | README 更新 |

## 4. 合并规则

推荐流程：

```text
task/* 或 feature/*
→ develop
→ main
```

特殊情况：

1. 只改错别字、路径、README 这类低风险内容，可以由负责人确认后从 `task/*` 直接合入 `main`。
2. 涉及运行代码、数据结构、线索 ID、剧情边界、小游戏接入的内容，先合入 `develop` 测试。
3. `feature/*` 不直接合入 `main`，除非总负责人确认它已经完成测试。
4. `main` 不放个人草稿，也不放未说明用途的大量素材。

## 5. 成员交付建议

不熟悉 Git 的成员可以不直接操作分支，而是按固定格式交给总负责人：

| 成员类型 | 建议交付方式 | 由谁整理进 Git |
|---|---|---|
| 剧情负责人 | 剧情节点表、NPC 角色表、对白草稿 | 总负责人 / 整合人 / AI 助手 |
| 自由 NPC 负责人 | 知识范围表、暂不回答边界、示例问答 | 总负责人 / 技术整合 |
| 小游戏负责人 | 独立原型、接入表、素材说明 | 技术整合 |
| 图片素材负责人 | 图片资产表、图片路径、用途说明 | 总负责人 / 资产整合 |
| 线索负责人 | clueId、章节表、校核说明 | 总负责人 |

## 6. 当前建议

当前本地整理分支适合先作为 `task/repo-docs-structure` 或 `task/docs-classification` 提交。确认文档和运行状态后，再由总负责人决定是否合入 `develop`，最后再进 `main`。

如果团队还没有正式建立 `develop` 分支，可以先在 GitHub 上保留 `main`，本地用 `codex/repo-structure-cleanup` 做整理；等仓库结构稳定后，再创建 `develop` 作为日常整合分支。
