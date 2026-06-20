## Task 5: Integration Testing

**Files:**
- Test: All modified files

**Interfaces:**
- End-to-end flow: Admin edits chapter → Frontend shows updated title screen

- [ ] **Step 1: Test complete flow**

1. Start Flask app: `python app.py`
2. Open admin editor at `/admin/bg`
3. Go to "章节管理" tab
4. Edit "楔子" chapter - change title to "序章"
5. Save changes
6. Open game at `/game`
7. Start new game - should see "序章" title screen
8. Play through to chapter 1 - should see "第一章 墓外" title screen

- [ ] **Step 2: Test edge cases**

- Test with missing chapters.json (should handle gracefully)
- Test with invalid node IDs in chapter range
- Test chapter overlay during choice nodes
- Test back navigation (left arrow) - should not re-show chapter title

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete chapter title screen and management system"
```
