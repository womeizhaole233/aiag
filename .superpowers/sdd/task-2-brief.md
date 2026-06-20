## Task 2: Add Chapter API Endpoints to app.py

**Files:**
- Modify: `app.py` (add new routes after existing routes)

**Interfaces:**
- Consumes: `chapters.json` file
- Produces: `GET /api/chapters` returns chapter list, `POST /api/chapters/save` saves chapters, `GET /api/dialogue` now includes `chapter_id`

- [ ] **Step 1: Add chapters.json loading functions**

Add after line 17 (after `TERMINAL_NEXTS` definition):

```python
# ==================== 章节配置 ====================
CHAPTERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chapters.json')

def load_chapters():
    """返回章节配置列表"""
    if os.path.exists(CHAPTERS_FILE):
        try:
            with open(CHAPTERS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f) or {}
            return data.get('chapters', [])
        except Exception:
            pass
    return []

def save_chapters(chapters):
    """保存章节配置"""
    with open(CHAPTERS_FILE, 'w', encoding='utf-8') as f:
        json.dump({'chapters': chapters}, f, ensure_ascii=False, indent=2)

def get_chapter_for_node(node_id):
    """根据节点ID查找所属章节"""
    chapters = load_chapters()
    for ch in chapters:
        if ch.get('start_node', '') <= node_id <= ch.get('end_node', ''):
            return ch.get('id')
    return None
```

- [ ] **Step 2: Add chapter API endpoints**

Add after the `/api/reset` route (around line 3450):

```python
@app.route('/api/chapters')
def chapters_api():
    """返回章节配置"""
    chapters = load_chapters()
    return jsonify({'chapters': chapters})

@app.route('/api/chapters/save', methods=['POST'])
def chapters_save_api():
    """保存章节配置"""
    data = request.get_json() or {}
    chapters = data.get('chapters', [])
    save_chapters(chapters)
    return jsonify({'status': 'ok', 'count': len(chapters)})
```

- [ ] **Step 3: Modify dialogue API to include chapter_id**

Find the `dialogue_api` function (around line 4307) and modify the return statement to include `chapter_id`:

```python
@app.route('/api/dialogue', methods=['POST'])
def dialogue_api():
    """一次性返回当前对话内容（不再流式打字）"""
    data = request.get_json() or {}
    choice_next = data.get('choice_next')
    if choice_next:
        session['current_dialogue'] = choice_next

    dialogue_id = session.get('current_dialogue', 'n00001')
    dialogue = get_dialogue(dialogue_id) or DIALOGUES.get('n00001', {})

    speaker, text, bg, portrait, next_id = apply_overrides(dialogue_id, dialogue)

    return jsonify({
        'id': dialogue_id,
        'speaker': speaker,
        'text': text,
        'choices': dialogue.get('choices', []),
        'next': next_id,
        'background_image': bg,
        'portrait': portrait,
        'puzzle': dialogue.get('puzzle'),
        'chapter_id': get_chapter_for_node(dialogue_id),  # 新增
    })
```

- [ ] **Step 4: Test the API endpoints**

Run the Flask app and test:
```bash
python app.py
```

Test in browser or curl:
- `GET /api/chapters` should return chapter list
- `POST /api/dialogue` should include `chapter_id` field

- [ ] **Step 5: Commit**

```bash
git add app.py
git commit -m "feat: add chapter API endpoints and chapter_id to dialogue response"
```
