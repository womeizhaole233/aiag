# Task 2 Report: 创建首页内容片段模板

## 完成的工作

1. **创建了 `templates/index_content.html` 文件**
   - 文件路径: `D:\AI\aiag\baisha_chenyan\templates\index_content.html`
   - 从 `index.html` 中提取 `{% block content %}` 部分
   - 移除了 `{% extends "base.html" %}` 和 `{% block content %}{% endblock %}` 标签
   - 将 `<a href="/game"><button>...</button></a>` 改为 `<button onclick="loadPage('game')">...</button>`

## 文件内容

```html
<div class="fade-in" style="text-align:center;padding:40px 20px">
    <div class="paper-card" style="max-width:700px;margin:0 auto;padding:40px">
        <p style="font-size:18px;line-height:1.8;color:#3d2a1a;margin-bottom:25px;font-family:'STKaiti','KaiTi',serif">
            河南，禹县，白沙镇。<br>
            一个在地图上几乎找不到名字的地方。<br>
            可你的外祖父来过。
        </p>
        <p style="font-size:16px;line-height:1.8;color:#5a4a2a;margin-bottom:30px">
            1951年冬，你作为一名年轻的考古助教，<br>
            跟随北大考古队来到白沙水库工地。<br>
            一座北宋壁画墓即将重见天日。
        </p>
        <div class="scroll-decoration" style="margin:25px auto;width:60%"></div>
        <p style="font-size:14px;color:#8b7355;margin-bottom:25px">
            ⚱️ 沉浸式考古剧情体验 ⚱️<br>
            每一段对话都会缓缓呈现，如纸页翻动
        </p>
        <button class="btn" style="font-size:18px;padding:12px 40px" onclick="loadPage('game')">
            📜 开启尘封的记忆
        </button>
    </div>
</div>
```

## 修改说明

| 项目 | 原始 | 修改后 |
|------|------|--------|
| 模板继承 | `{% extends "base.html" %}` | 移除 |
| 内容块标签 | `{% block content %}{% endblock %}` | 移除 |
| 按钮链接 | `<a href="/game"><button>...</button></a>` | `<button onclick="loadPage('game')">...</button>` |

## 提交的 commit hash

未提交（等待进一步集成测试）

## 任何问题或顾虑

1. **依赖后端 API**: 此模板需要配合 Flask 后端的 `/api/page/index` 路由使用，该路由需返回包含 `#app-content` 容器的 HTML
2. **依赖 content-loader.js**: `loadPage('game')` 函数由 `static/js/content-loader.js` 提供，需确保该脚本已加载
3. **样式依赖**: 此模板使用了 `base.html` 中定义的 CSS 类（`.fade-in`, `.paper-card`, `.scroll-decoration`, `.btn`），通过 AJAX 加载时这些样式需在页面中已存在
