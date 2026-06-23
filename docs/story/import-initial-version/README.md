# 初始版本第一章导入说明

来源：`origin/初始版本`

来源提交：`d57cf4ddb35ae464b6cd66b8b63d72d8484c704e`

导入日期：2026-06-23

本次只导入第一章相关剧情与素材，不合并初始版本中的 Flask 后端和后台编辑器代码。

## 合并范围

- `n00060-n00079`：作为现有游戏的第一章“墓外”剧情，映射到 `env_entry_*` 与 `env_close_*`。
- `n00080-n00092`：初始版本章节表仍归在 chapter_1，但内容已进入“墓道口/墓门前导”，因此映射到现有 `gate_entry_000-gate_entry_012`。
- `gate_entry_012` 之后接回现有 `gate_entry_013`，继续当前墓门章节。

## 优先级

如果现有剧情与初始版本剧情冲突，本范围内以初始版本为准，包括正文、选项、背景图和节点指定立绘。

## 素材落点

- 第一章背景：`assets/story/backgrounds/chapter-1/`
- 墓门前导背景：`assets/story/backgrounds/tomb-gate-preface/`
- 初始版本立绘变体：`assets/story/portraits/initial/`

## 保留源文件

- `chapters.json`
- `content_overrides.json`
- `generated_dialogues_v2.py`
