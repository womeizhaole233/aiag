## Task 3: Add Chapter Overlay to game.html

**Files:**
- Modify: `templates/game.html`

**Interfaces:**
- Consumes: `chapter_id` from `/api/dialogue` response
- Produces: Chapter overlay UI with fade animation

- [ ] **Step 1: Add chapter overlay HTML**

In `game.html`, add the overlay div inside `.game-container` (after the debug panel div, around line 314):

```html
<!-- 章节标题屏 -->
<div id="chapterOverlay" class="chapter-overlay">
    <div class="chapter-bg" id="chapterBg"></div>
    <div class="chapter-content">
        <div class="chapter-number" id="chapterNumber"></div>
        <div class="chapter-title" id="chapterTitle"></div>
    </div>
</div>
```

- [ ] **Step 2: Add chapter overlay CSS**

In the `<style>` block of `game.html`, add before `{% endblock %}` (around line 256):

```css
/* ===== 章节标题屏 ===== */
.chapter-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.8s ease-in-out;
}
.chapter-overlay.visible {
    opacity: 1;
    pointer-events: auto;
}
.chapter-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.4);
}
.chapter-content {
    position: relative;
    text-align: center;
    color: #d4c5a9;
}
.chapter-number {
    font-size: 1.2em;
    letter-spacing: 0.3em;
    margin-bottom: 0.5em;
    opacity: 0.8;
}
.chapter-title {
    font-size: 2.5em;
    font-weight: bold;
    letter-spacing: 0.2em;
}
```

- [ ] **Step 3: Add chapter overlay JavaScript**

In the `<script>` block of `game.html`, add after the `let historyStack = []` line (around line 323):

```javascript
// ========== 章节标题屏 ==========
let currentChapter = null;
let chaptersData = [];

async function loadChapters() {
    try {
        const r = await fetch('/api/chapters');
        const data = await r.json();
        chaptersData = data.chapters || [];
    } catch (e) {
        console.error('Failed to load chapters:', e);
    }
}

function getChapterDisplayInfo(chapterId) {
    const ch = chaptersData.find(c => c.id === chapterId);
    if (!ch) return null;
    
    // 特殊处理：楔子、终章、封存不显示序号
    const specialChapters = ['prologue', 'finale', 'closure'];
    const isSpecial = specialChapters.includes(chapterId);
    
    return {
        number: isSpecial ? '' : `第${ch.number}章`,
        title: ch.title,
        background_image: ch.background_image
    };
}

function showChapterOverlay(chapterId) {
    const info = getChapterDisplayInfo(chapterId);
    if (!info) return Promise.resolve();
    
    return new Promise((resolve) => {
        const overlay = document.getElementById('chapterOverlay');
        const bg = document.getElementById('chapterBg');
        const numberEl = document.getElementById('chapterNumber');
        const titleEl = document.getElementById('chapterTitle');
        
        // 设置内容
        numberEl.textContent = info.number;
        titleEl.textContent = info.title;
        if (info.background_image) {
            bg.style.backgroundImage = `url('/${info.background_image.replace(/^\\/?/, '')}')`;
        }
        
        // 淡入
        overlay.classList.add('visible');
        
        // 停留2秒后淡出
        setTimeout(() => {
            overlay.classList.remove('visible');
            setTimeout(resolve, 800); // 等待淡出动画完成
        }, 2000);
    });
}
```

- [ ] **Step 4: Modify loadDialogue to detect chapter changes**

Find the `loadDialogue` function and add chapter detection logic. Add after `currentNodeId = data.id;` (around line 422):

```javascript
// 检测章节变化
const newChapter = data.chapter_id;
if (newChapter && newChapter !== currentChapter) {
    currentChapter = newChapter;
    // 显示章节标题屏（非阻塞）
    showChapterOverlay(newChapter);
}
```

- [ ] **Step 5: Load chapters on page load**

Add at the end of the script, before the closing `</script>` tag (around line 548):

```javascript
// 页面加载时获取章节数据
loadChapters();
```

- [ ] **Step 6: Test the chapter overlay**

Run the Flask app and test:
- Start a new game - should see "楔子" title screen
- Play through to chapter 1 - should see "第一章 墓外" title screen
- Verify fade in/out animation works

- [ ] **Step 7: Commit**

```bash
git add templates/game.html
git commit -m "feat: add chapter title screen overlay with fade animation"
```
