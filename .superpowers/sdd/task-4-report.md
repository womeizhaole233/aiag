## Task 4 Report: Add Chapter Management Tab to Admin Editor

**Status:** DONE

### What I Implemented

Added a chapter management tab to the admin editor (`templates/admin_bg.html`) with full CRUD and reorder capabilities:

1. **Tab buttons** in left panel header - "节点列表" (active by default) and "章节管理"
2. **Tab CSS styles** for tab buttons, chapter list items, action buttons, and add button
3. **Chapter list container** (`#chapterList`) hidden by default, shown when chapter tab is active
4. **Chapter management JavaScript** including:
   - `loadChapters()` - fetches chapters from `GET /api/chapters`
   - `renderChapterList()` - renders chapter items with number, title, and action buttons
   - `selectChapter()` - highlights selected chapter
   - `addChapter()` / `editChapter()` - opens modal for creating/editing
   - `deleteChapter()` - removes chapter with confirmation
   - `moveChapter()` - reorders chapters up/down
   - `saveChaptersToServer()` - saves via `POST /api/chapters/save`
   - `showChapterModal()` / `closeModal()` / `saveChapterModal()` - modal form handling
   - Tab switching logic to toggle between node list and chapter list

5. **Chapter modal** - separate `#modal` element (distinct from existing `#newModal` for new nodes) with fields for: number, title, ID, background image, description, start node, end node

### What I Tested

- Flask app starts successfully on port 5002
- `/admin/bg` loads with both tab buttons visible
- Clicking "章节管理" tab shows chapter list (10 chapters loaded from API)
- Clicking "编辑" on a chapter opens modal with pre-filled data
- Modal closes on cancel
- Clicking "节点列表" tab switches back to node list view with toolbar
- All 10 chapters display correctly: 楔子(0), 墓外(1), 墓门(2), 甬道(3), 前室(4), 过道(5), 后室(6), 暗格(7), 终章(8), 封存(9)

### Files Changed

- `baisha_chenyan/templates/admin_bg.html` - Added ~190 lines (CSS, HTML, JS)

### Self-Review Findings

1. **Fixed `showToast` → `toast`**: The task brief referenced `showToast()` but the existing codebase uses `toast()`. Fixed both occurrences.
2. **Added separate modal element**: The task brief referenced `document.getElementById('modal')` but the existing HTML only had `#newModal`. Added a new `<div class="modal-bg" id="modal">` with inner `<div class="modal" id="modalContent">` to avoid conflicts with the existing new-node modal.
3. **Added backdrop click handler**: Clicking outside the chapter modal closes it, matching UX of existing new-node modal.

### Concerns

None. Implementation follows existing patterns and works as expected.
