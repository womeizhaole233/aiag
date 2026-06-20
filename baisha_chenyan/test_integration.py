#!/usr/bin/env python3
"""Integration tests for chapter title screen and management system.
Uses Flask test client - no server startup needed."""
import json
import os
import shutil
import sys

sys.path.insert(0, 'D:/AI/aiag/baisha_chenyan')
from app import app, load_chapters, save_chapters, get_chapter_for_node, CHAPTERS_FILE

app.config['TESTING'] = True
client = app.test_client()

RESULTS = []


def test(name, passed, detail=''):
    status = 'PASS' if passed else 'FAIL'
    RESULTS.append((name, passed, detail))
    marker = 'PASS' if passed else 'FAIL'
    print(f'  {marker} [{status}] {name}')
    if detail and not passed:
        print(f'       Detail: {detail}')


def run_tests():
    print('=' * 60)
    print('TASK 5: Integration Testing')
    print('=' * 60)

    # ===== STEP 1: Test Complete Flow =====
    print('\n--- Step 1: Test Complete Flow ---')

    # Test 1.1: Chapters API returns data
    r = client.get('/api/chapters')
    data = json.loads(r.data)
    chapters = data.get('chapters', [])
    test('1.1: GET /api/chapters returns chapter list',
         r.status_code == 200 and len(chapters) > 0,
         f'status={r.status_code}, count={len(chapters)}')

    # Test 1.2: Chapter data structure is correct
    ch0 = chapters[0] if chapters else {}
    has_fields = all(k in ch0 for k in ['id', 'number', 'title', 'start_node', 'end_node', 'background_image'])
    test('1.2: Chapter data has required fields',
         has_fields,
         f'fields={list(ch0.keys())}')

    # Test 1.3: Prologue chapter exists with correct start_node
    prologue = next((c for c in chapters if c['id'] == 'prologue'), None)
    test('1.3: Prologue chapter exists',
         prologue is not None and prologue.get('start_node') == 'n00001',
         f'prologue start_node={prologue.get("start_node") if prologue else None}')

    # Test 1.4: Chapter 1 exists with correct node range
    ch1 = next((c for c in chapters if c['id'] == 'chapter_1'), None)
    test('1.4: Chapter 1 exists with correct range',
         ch1 is not None and ch1.get('start_node') == 'n00047' and ch1.get('end_node') == 'n00088',
         f'ch1 start={ch1.get("start_node") if ch1 else None}, end={ch1.get("end_node") if ch1 else None}')

    # Test 1.5: Dialogue API returns chapter_id
    with client.session_transaction() as sess:
        sess.clear()
    r = client.post('/api/dialogue', json={'choice_next': None})
    d = json.loads(r.data)
    test('1.5: Dialogue API returns chapter_id field',
         'chapter_id' in d and d['chapter_id'] is not None,
         f'chapter_id={d.get("chapter_id")}, id={d.get("id")}')

    # Test 1.6: First dialogue node belongs to prologue
    test('1.6: First dialogue node (n00001) belongs to prologue',
         d.get('chapter_id') == 'prologue' and d.get('id') == 'n00001',
         f'chapter_id={d.get("chapter_id")}, id={d.get("id")}')

    # Test 1.7: Navigate to chapter 1 boundary
    r = client.post('/api/dialogue', json={'choice_next': 'n00047'})
    d = json.loads(r.data)
    test('1.7: Node n00047 (chapter_1 start) returns correct chapter_id',
         d.get('chapter_id') == 'chapter_1',
         f'chapter_id={d.get("chapter_id")}, id={d.get("id")}')

    # Test 1.8: Chapter save API works
    r = client.post('/api/chapters/save', json={'chapters': chapters})
    save_data = json.loads(r.data)
    test('1.8: POST /api/chapters/save accepts chapter data',
         r.status_code == 200 and save_data.get('status') == 'ok',
         f'status={save_data.get("status")}')

    # Test 1.9: Modified chapter title persists
    chapters_copy = [dict(c) for c in chapters]
    chapters_copy[0]['title'] = '序章'
    client.post('/api/chapters/save', json={'chapters': chapters_copy})
    r = client.get('/api/chapters')
    updated = json.loads(r.data).get('chapters', [])
    test('1.9: Modified chapter title persists via save API',
         updated[0]['title'] == '序章',
         f'title={updated[0]["title"]}')
    # Restore
    client.post('/api/chapters/save', json={'chapters': chapters})

    # Test 1.10: All chapter node ranges are sequential and non-overlapping
    sorted_chs = sorted(chapters, key=lambda c: c.get('start_node', ''))
    overlaps = False
    for i in range(len(sorted_chs) - 1):
        if sorted_chs[i].get('end_node', '') >= sorted_chs[i + 1].get('start_node', ''):
            overlaps = True
    test('1.10: Chapter node ranges are sequential and non-overlapping',
         not overlaps,
         f'overlapping={overlaps}')

    # ===== STEP 2: Test Edge Cases =====
    print('\n--- Step 2: Test Edge Cases ---')

    # Test 2.1: Missing chapters.json (graceful handling)
    backup_file = CHAPTERS_FILE + '.test_backup'
    shutil.copy2(CHAPTERS_FILE, backup_file)
    os.remove(CHAPTERS_FILE)
    r = client.get('/api/chapters')
    data = json.loads(r.data)
    test('2.1: Missing chapters.json returns empty list gracefully',
         r.status_code == 200 and data.get('chapters', []) == [],
         f'chapters={data.get("chapters")}')
    # Restore
    shutil.move(backup_file, CHAPTERS_FILE)

    # Test 2.2: get_chapter_for_node with valid node in prologue
    chapter_id = get_chapter_for_node('n00001')
    test('2.2: get_chapter_for_node returns prologue for n00001',
         chapter_id == 'prologue',
         f'chapter_id={chapter_id}')

    # Test 2.3: get_chapter_for_node with valid node in chapter_1
    chapter_id = get_chapter_for_node('n00047')
    test('2.3: get_chapter_for_node returns chapter_1 for n00047',
         chapter_id == 'chapter_1',
         f'chapter_id={chapter_id}')

    # Test 2.4: get_chapter_for_node with node in last chapter
    chapter_id = get_chapter_for_node('n00362')
    test('2.4: get_chapter_for_node returns closure for n00362',
         chapter_id == 'closure',
         f'chapter_id={chapter_id}')

    # Test 2.5: get_chapter_for_node with invalid node
    chapter_id = get_chapter_for_node('invalid_xyz')
    test('2.5: get_chapter_for_node returns None for invalid node',
         chapter_id is None,
         f'chapter_id={chapter_id}')

    # Test 2.6: get_chapter_for_node with empty string
    chapter_id = get_chapter_for_node('')
    test('2.6: get_chapter_for_node returns None for empty string',
         chapter_id is None,
         f'chapter_id={chapter_id}')

    # Test 2.7: Chapter overlay during choice nodes
    with client.session_transaction() as sess:
        sess.clear()
    r = client.post('/api/dialogue', json={'choice_next': 'n00007'})
    d = json.loads(r.data)
    has_choices = len(d.get('choices', [])) > 0
    test('2.7: Choice node has chapter_id for overlay detection',
         has_choices and d.get('chapter_id') is not None,
         f'choices={len(d.get("choices", []))}, chapter_id={d.get("chapter_id")}')

    # Test 2.8: Dialogue API with invalid node_id
    with client.session_transaction() as sess:
        sess.clear()
    r = client.post('/api/dialogue', json={'choice_next': 'nonexistent_node'})
    d = json.loads(r.data)
    test('2.8: Invalid node falls back to first dialogue',
         d.get('id') == 'n00001',
         f'id={d.get("id")}')

    # Test 2.9: Back navigation - chapter_id changes correctly
    with client.session_transaction() as sess:
        sess.clear()
    # Go to chapter_1
    client.post('/api/dialogue', json={'choice_next': 'n00047'})
    d_ch1 = json.loads(client.post('/api/dialogue', json={'choice_next': None}).data)
    # Go back to prologue last node
    client.post('/api/dialogue', json={'choice_next': 'n00046'})
    d_prologue = json.loads(client.post('/api/dialogue', json={'choice_next': None}).data)
    test('2.9: Back navigation crosses chapter boundary correctly',
         d_ch1.get('chapter_id') == 'chapter_1' and d_prologue.get('chapter_id') == 'prologue',
         f'ch1={d_ch1.get("chapter_id")}, back={d_prologue.get("chapter_id")}')

    # Test 2.10: Chapter overlay CSS and JS in game.html
    with open('D:/AI/aiag/baisha_chenyan/templates/game.html', 'r', encoding='utf-8') as f:
        game_html = f.read()
    test('2.10: game.html contains chapter overlay markup and JS',
         all(x in game_html for x in ['chapter-overlay', 'chapterOverlay', 'loadChapters',
                                       'showChapterOverlay', 'getChapterDisplayInfo']),
         'all elements present')

    # Test 2.11: Back navigation JS skips chapter overlay
    # Check if loadDialogue handles back navigation with chapter overlay skip
    has_back_skip = 'isBackNavigation' in game_html or 'isGoingBack' in game_html
    test('2.11: Back navigation has chapter overlay skip logic',
         has_back_skip,
         f'has_skip={has_back_skip}')

    # Test 2.12: Admin chapter management tab
    with open('D:/AI/aiag/baisha_chenyan/templates/admin_bg.html', 'r', encoding='utf-8') as f:
        admin_html = f.read()
    test('2.12: admin_bg.html contains chapter management tab',
         all(x in admin_html for x in ['chapterList', '章节管理', 'loadChapters', 'renderChapterList',
                                        'showChapterModal', 'saveChaptersToServer']),
         'all admin chapter features present')

    # Test 2.13: Game page renders correctly
    with client.session_transaction() as sess:
        sess.clear()
    r = client.get('/game')
    test('2.13: Game page renders successfully',
         r.status_code == 200,
         f'status={r.status_code}')

    # Test 2.14: Admin page renders correctly
    r = client.get('/admin/bg')
    test('2.14: Admin page renders successfully',
         r.status_code == 200,
         f'status={r.status_code}')

    # ===== Summary =====
    print('\n' + '=' * 60)
    total = len(RESULTS)
    passed = sum(1 for _, p, _ in RESULTS if p)
    failed = total - passed
    print(f'RESULTS: {passed}/{total} passed, {failed} failed')
    print('=' * 60)

    if failed > 0:
        print('\nFailed tests:')
        for name, p, detail in RESULTS:
            if not p:
                print(f'  - {name}: {detail}')

    return failed == 0


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
