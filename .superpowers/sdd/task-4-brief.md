## Task 4: Add Chapter Management Tab to Admin Editor

**Files:**
- Modify: `templates/admin_bg.html`

**Interfaces:**
- Consumes: `GET /api/chapters`, `POST /api/chapters/save`
- Produces: Chapter management UI with list, edit, add, delete, reorder functions

- [ ] **Step 1: Add tab buttons to left panel header**

Find the left panel header in `admin_bg.html` (around line 100-110). Add a second tab button:

```html
<header>
    <span class="tab-btn active" data-tab="nodes">节点列表</span>
    <span class="tab-btn" data-tab="chapters">章节管理</span>
    <span class="sub" id="nodeCount">-</span>
</header>
```

- [ ] **Step 2: Add tab CSS styles**

Add to the `<style>` block:

```css
.tab-btn {
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    color: var(--mute);
}
.tab-btn.active {
    background: var(--accent);
    color: #1a1410;
}
.tab-btn:hover:not(.active) {
    color: var(--text);
}
.chapter-list { flex: 1; overflow: auto; }
.chapter-item {
    padding: 10px 12px;
    border-bottom: 1px solid #2a2622;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}
.chapter-item:hover { background: #2b2722; }
.chapter-item.active { background: #3a322a; }
.chapter-item .ch-num {
    font-family: Menlo, Consolas, monospace;
    color: var(--accent);
    font-size: 12px;
    min-width: 30px;
}
.chapter-item .ch-title { flex: 1; }
.chapter-item .ch-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}
.chapter-item:hover .ch-actions { opacity: 1; }
.chapter-item .ch-actions button {
    background: none;
    border: 1px solid var(--line);
    color: var(--mute);
    padding: 2px 6px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
}
.chapter-item .ch-actions button:hover {
    border-color: var(--accent);
    color: var(--text);
}
.add-chapter-btn {
    margin: 10px 12px;
    padding: 8px;
    background: var(--panel2);
    border: 1px dashed var(--line);
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    color: var(--mute);
    font-size: 13px;
}
.add-chapter-btn:hover {
    border-color: var(--accent);
    color: var(--text);
}
```

- [ ] **Step 3: Add chapter list container**

In the left panel, after the toolbar div, add a hidden chapter list container:

```html
<div class="chapter-list" id="chapterList" style="display:none;"></div>
```

- [ ] **Step 4: Add chapter management JavaScript**

Add to the `<script>` block:

```javascript
// ========== 章节管理 ==========
let chaptersData = [];
let activeChapterId = null;

async function loadChapters() {
    try {
        const r = await fetch('/api/chapters');
        const data = await r.json();
        chaptersData = data.chapters || [];
        renderChapterList();
    } catch (e) {
        console.error('Failed to load chapters:', e);
    }
}

function renderChapterList() {
    const list = document.getElementById('chapterList');
    list.innerHTML = chaptersData.map(ch => `
        <div class="chapter-item ${ch.id === activeChapterId ? 'active' : ''}" 
             data-id="${ch.id}" onclick="selectChapter('${ch.id}')">
            <span class="ch-num">${ch.number}</span>
            <span class="ch-title">${ch.title}</span>
            <span class="ch-actions">
                <button onclick="event.stopPropagation(); editChapter('${ch.id}')">编辑</button>
                <button onclick="event.stopPropagation(); moveChapter('${ch.id}', -1)">↑</button>
                <button onclick="event.stopPropagation(); moveChapter('${ch.id}', 1)">↓</button>
                <button onclick="event.stopPropagation(); deleteChapter('${ch.id}')">删除</button>
            </span>
        </div>
    `).join('') + `
        <div class="add-chapter-btn" onclick="addChapter()">+ 新增章节</div>
    `;
}

function selectChapter(id) {
    activeChapterId = id;
    renderChapterList();
}

async function addChapter() {
    showChapterModal({
        id: '',
        number: chaptersData.length,
        title: '',
        background_image: '',
        description: '',
        start_node: '',
        end_node: ''
    }, true);
}

function editChapter(id) {
    const ch = chaptersData.find(c => c.id === id);
    if (ch) showChapterModal(ch, false);
}

async function deleteChapter(id) {
    if (!confirm('确定要删除此章节吗？')) return;
    chaptersData = chaptersData.filter(c => c.id !== id);
    await saveChaptersToServer();
    renderChapterList();
}

async function moveChapter(id, direction) {
    const idx = chaptersData.findIndex(c => c.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= chaptersData.length) return;
    
    [chaptersData[idx], chaptersData[newIdx]] = [chaptersData[newIdx], chaptersData[idx]];
    chaptersData.forEach((ch, i) => ch.number = i === 0 ? 0 : i);
    
    await saveChaptersToServer();
    renderChapterList();
}

async function saveChaptersToServer() {
    try {
        await fetch('/api/chapters/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({chapters: chaptersData})
        });
        showToast('章节配置已保存');
    } catch (e) {
        showToast('保存失败: ' + e.message);
    }
}

function showChapterModal(chapter, isNew) {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <h3>${isNew ? '新增章节' : '编辑章节'}</h3>
        <label>章节序号</label>
        <input type="number" id="chNumber" value="${chapter.number}" min="0">
        <label>章节标题</label>
        <input type="text" id="chTitle" value="${chapter.title}" placeholder="如：墓外">
        <label>章节ID</label>
        <input type="text" id="chId" value="${chapter.id}" ${isNew ? '' : 'readonly'} placeholder="如：chapter_1">
        <label>背景图路径</label>
        <input type="text" id="chBg" value="${chapter.background_image}" placeholder="assets/M1/...">
        <label>简介</label>
        <textarea id="chDesc">${chapter.description || ''}</textarea>
        <label>起始节点</label>
        <input type="text" id="chStart" value="${chapter.start_node}" placeholder="n00001">
        <label>结束节点</label>
        <input type="text" id="chEnd" value="${chapter.end_node}" placeholder="n00046">
        <div class="row">
            <button class="btn" onclick="closeModal()">取消</button>
            <button class="btn primary" onclick="saveChapterModal('${chapter.id}', ${isNew})">保存</button>
        </div>
    `;
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

async function saveChapterModal(originalId, isNew) {
    const ch = {
        id: document.getElementById('chId').value.trim(),
        number: parseInt(document.getElementById('chNumber').value) || 0,
        title: document.getElementById('chTitle').value.trim(),
        background_image: document.getElementById('chBg').value.trim(),
        description: document.getElementById('chDesc').value.trim(),
        start_node: document.getElementById('chStart').value.trim(),
        end_node: document.getElementById('chEnd').value.trim()
    };
    
    if (!ch.id || !ch.title) {
        showToast('请填写章节ID和标题');
        return;
    }
    
    if (isNew) {
        chaptersData.push(ch);
    } else {
        const idx = chaptersData.findIndex(c => c.id === originalId);
        if (idx >= 0) chaptersData[idx] = ch;
    }
    
    chaptersData.sort((a, b) => a.number - b.number);
    await saveChaptersToServer();
    renderChapterList();
    closeModal();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        document.querySelector('.node-list').style.display = tab === 'nodes' ? '' : 'none';
        document.getElementById('chapterList').style.display = tab === 'chapters' ? '' : 'none';
        document.querySelector('.toolbar').style.display = tab === 'nodes' ? '' : 'none';
    });
});

loadChapters();
```

- [ ] **Step 5: Test the chapter management tab**

Run the Flask app and test:
- Go to `/admin/bg`
- Click "章节管理" tab - should see chapter list
- Click "新增章节" - should open modal
- Click "编辑" on a chapter - should open modal with data
- Click "↑" or "↓" to reorder chapters
- Click "删除" to remove a chapter
- Verify changes persist after page reload

- [ ] **Step 6: Commit**

```bash
git add templates/admin_bg.html
git commit -m "feat: add chapter management tab to admin editor"
```
