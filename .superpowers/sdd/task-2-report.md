## Task 2: Add Chapter API Endpoints to app.py

### Status: DONE

### What I Implemented

Added chapter API endpoints to `app.py` per the task brief:

1. **Chapter loading functions** (lines 19-44):
   - `CHAPTERS_FILE` path constant
   - `load_chapters()` - reads chapters.json, returns list
   - `save_chapters(chapters)` - writes chapters.json
   - `get_chapter_for_node(node_id)` - finds chapter_id for a node via string comparison

2. **Chapter API endpoints** (lines 4379-4391):
   - `GET /api/chapters` - returns all chapters as JSON
   - `POST /api/chapters/save` - saves chapters from request body

3. **Modified dialogue API** (line 4356):
   - Added `'chapter_id': get_chapter_for_node(dialogue_id)` to the return payload

### What I Tested

- `GET /api/chapters` returns 200 with 10 chapters
- `POST /api/chapters/save` saves and returns status ok with count
- `POST /api/dialogue` returns chapter_id:
  - n00001 → "prologue"
  - n00047 → "chapter_1"
  - n00089 → "chapter_2"
  - n99999 → None (unknown node)

### Files Changed

- `baisha_chenyan/app.py` (42 insertions)

### Self-Review

- **Completeness**: All 5 steps from the task brief implemented and verified.
- **Quality**: Code follows existing patterns (json.load/save, jsonify, similar function signatures).
- **Discipline**: No overbuilding. Only what was specified was added. No comments added.
- **Potential concern**: The `get_chapter_for_node` function performs a linear scan of chapters for every dialogue request. With only 10 chapters this is negligible, but could be optimized with a node→chapter index if performance matters. This matches the task brief exactly.

### Commit

`3b0efd3` - feat: add chapter API endpoints and chapter_id to dialogue response
