#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert text new.md to DIALOGUES dict for app.py.
Each ### heading = one node. Choices map to first ### after #### 选X.
"""
import re, ast, sys

MD_PATH = r'D:\AI\aiag\baisha_chenyan\text new.md'
OUT_PATH = r'D:\AI\aiag\baisha_chenyan\generated_dialogues_v2.py'

CHAPTER_BG = {
    "楔子": "assets/M1/01环境地图/白沙宋墓地形图.png",
    "墓外": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
    "墓门": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
    "甬道": "assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png",
    "前室": "assets/M1/16_出土器物与人骨/地券.png",
    "过道": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
    "后室": "assets/M1/16_出土器物与人骨/地券.png",
    "暗格": "assets/M1/16_出土器物与人骨/地券.png",
    "终章": "assets/M1/16_出土器物与人骨/地券.png",
    "封存": "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
}
DEFAULT_BG = "assets/M1/01环境地图/白沙宋墓地形图.png"

# ==================== Phase 1: Parse md into events ====================
with open(MD_PATH, 'r', encoding='utf-8') as f:
    lines = f.readlines()

events = []
i = 0
while i < len(lines):
    line = lines[i].rstrip('\n')
    stripped = line.strip()

    # Chapter heading
    if stripped.startswith('## '):
        ch = stripped[3:].strip()
        events.append(('chapter', ch))
        i += 1
        continue

    # Skip # heading (title)
    if stripped.startswith('# ') and not stripped.startswith('## '):
        i += 1
        continue

    # ### 玩家点击 - check if followed by #### 选项
    if stripped.startswith('### 玩家点击'):
        # Look ahead for #### 选项
        j = i + 1
        has_options = False
        prompt_lines = []
        while j < len(lines):
            nl = lines[j].strip()
            if nl.startswith('#### 选项'):
                has_options = True
                break
            if nl.startswith('### ') or nl.startswith('## '):
                break
            if nl and nl != '------':
                prompt_lines.append(nl)
            j += 1

        if has_options:
            events.append(('choice_prompt', '\n'.join(prompt_lines).strip()))
            i = j  # move to #### 选项
        else:
            # Sequential node with player text
            prompt_text = '\n'.join(prompt_lines).strip()
            events.append(('speaker', '系统', prompt_text))
            i = j
        continue

    # #### 选项 - parse choice list
    if stripped.startswith('#### 选项'):
        options = []
        i += 1
        while i < len(lines):
            nl = lines[i].strip()
            if nl.startswith('###') or nl.startswith('####') or nl.startswith('------'):
                break
            m = re.match(r'^([A-D])[.、]\s*(.*)', nl)
            if m:
                options.append((m.group(1), m.group(2).strip()))
            elif nl:
                # Might be continuation of previous option or new option format
                pass
            i += 1
        events.append(('choice_options', options))
        continue

    # #### 选X or ### 选X (formatting error)
    m_choice = re.match(r'#{3,4}\s*选([A-D])', stripped)
    if m_choice:
        letter = m_choice.group(1)
        events.append(('choice_response_start', letter))
        i += 1
        continue

    # #### 选X或Y
    m_combo = re.match(r'#{3,4}\s*选([A-D])或([A-D])', stripped)
    if m_combo:
        letters = m_combo.group(1) + m_combo.group(2)
        events.append(('choice_combo_start', letters))
        i += 1
        continue

    # ------ separator
    if stripped == '------':
        events.append(('separator', None))
        i += 1
        continue

    # ### speaker heading
    if stripped.startswith('### '):
        speaker = stripped[4:].strip()
        # Collect text until next heading
        text_lines = []
        i += 1
        while i < len(lines):
            nl = lines[i].strip()
            if nl.startswith('### ') or nl.startswith('## ') or nl.startswith('####') or nl == '------':
                break
            if nl:
                text_lines.append(nl)
            i += 1
        text = '\n'.join(text_lines).strip()
        events.append(('speaker', speaker, text))
        continue

    # #### other四级标题 - skip
    if stripped.startswith('#### '):
        i += 1
        continue

    # Empty line or other content - skip
    i += 1

# ==================== Phase 2: Process events into nodes ====================
nodes = {}
node_counter = 0
current_chapter = "楔子"
current_bg = CHAPTER_BG.get(current_chapter, DEFAULT_BG)

# State
mode = "normal"  # normal, choice_prompt, choice_options, choice_response, choice_continuation
choice_prompt_node = None
choice_options_list = []  # [(letter, text), ...]
choice_responses = {}  # letter -> node_id
current_choice = None
last_node_id = None

def get_bg():
    return current_bg

def make_node_id():
    global node_counter
    node_counter += 1
    return f"n{node_counter:05d}"

def create_node(speaker, text):
    nid = make_node_id()
    nodes[nid] = {
        "speaker": speaker,
        "text": text,
        "background_image": get_bg(),
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    }
    return nid

def update_chapter(ch_title):
    global current_chapter, current_bg
    current_chapter = ch_title
    # Match chapter name against CHAPTER_BG keys
    for key in CHAPTER_BG:
        if key in ch_title:
            current_bg = CHAPTER_BG[key]
            return
    current_bg = DEFAULT_BG

def chain_to(node_id):
    """Chain last_node to this node."""
    global last_node_id
    if last_node_id and nodes[last_node_id]["next"] is None:
        nodes[last_node_id]["next"] = node_id
    last_node_id = node_id

def set_choice_next(letter, next_node_id):
    """Set the choice option's next pointer."""
    if choice_prompt_node is None:
        return
    choices = nodes[choice_prompt_node]["choices"]
    for i, (lt, txt) in enumerate(choice_options_list):
        if lt == letter and i < len(choices):
            choices[i]["next"] = next_node_id
            break

def finalize_choice_section():
    """Called when we leave choice section. Chain all responses to continuation."""
    global choice_responses, choice_prompt_node, choice_options_list, current_choice
    # Responses will be chained when continuation node is created
    pass

# ==================== Main processing loop ====================
for idx, event in enumerate(events):
    etype = event[0]

    if etype == 'chapter':
        update_chapter(event[1])
        continue

    if etype == 'separator':
        continue

    if etype == 'choice_prompt':
        # Create choice prompt node
        mode = "choice_prompt"
        choice_prompt_node = create_node("系统", event[1])
        nodes[choice_prompt_node]["next"] = None
        choice_options_list = []
        choice_responses = {}
        current_choice = None
        # Chain previous node to this choice node
        chain_to(choice_prompt_node)
        continue

    if etype == 'choice_options':
        choice_options_list = event[1]
        # Set choices on the prompt node
        nodes[choice_prompt_node]["choices"] = [
            {"text": txt, "next": None} for lt, txt in choice_options_list
        ]
        mode = "choice_options"
        continue

    if etype == 'choice_response_start':
        current_choice = event[1]
        mode = "choice_response"
        continue

    if etype == 'choice_combo_start':
        # Combined choice (e.g., A和C share response)
        # For now, set current_choice to first letter
        # The caller should handle by setting both letters' next to same node
        current_choice = event[1][0]  # first letter
        mode = "choice_response"
        continue

    if etype == 'speaker':
        speaker = event[1]
        text = event[2]

        # Skip empty nodes
        if not text.strip():
            continue

        if mode == "choice_response" and current_choice:
            # This is the response node for current_choice
            nid = create_node(speaker, text)
            choice_responses[current_choice] = nid
            set_choice_next(current_choice, nid)
            current_choice = None
            mode = "choice_continuation"
            last_node_id = nid
            continue

        if mode == "choice_continuation":
            # This is the continuation/merge node
            nid = create_node(speaker, text)
            # Chain all choice responses to this node
            for lt, resp_id in choice_responses.items():
                nodes[resp_id]["next"] = nid
            # Chain choice prompt to... nothing (choices handle it)
            choice_prompt_node = None
            choice_options_list = []
            choice_responses = {}
            current_choice = None
            mode = "normal"
            last_node_id = nid
            continue

        if mode in ("choice_prompt", "choice_options"):
            # No choices after prompt, treat as sequential
            nid = create_node(speaker, text)
            chain_to(nid)
            mode = "normal"
            continue

        # Normal sequential node
        nid = create_node(speaker, text)
        chain_to(nid)
        continue

# ==================== Phase 3: Output ====================
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write('DIALOGUES = {\n\n')
    for nid in sorted(nodes.keys()):
        d = nodes[nid]
        f.write(f'    # ===== {nid} =====\n')
        f.write(f'    "{nid}": {{\n')
        f.write(f'        "speaker": {repr(d["speaker"])},\n')
        # Text with triple quotes
        text = d["text"]
        if '"""' in text:
            text = text.replace('"""', '\\"\\"\\"')
        f.write(f'        "text": """{text}""",\n')
        f.write(f'        "background_image": {repr(d["background_image"])},\n')
        if d["choices"]:
            f.write(f'        "choices": [\n')
            for c in d["choices"]:
                f.write(f'            {{"text": {repr(c["text"])}, "next": {repr(c["next"])} }},\n')
            f.write(f'        ],\n')
        else:
            f.write(f'        "choices": [],\n')
        f.write(f'        "next": {repr(d["next"])},\n')
        f.write(f'        "portrait": None,\n')
        f.write(f'        "puzzle": None,\n')
        f.write(f'    }},\n\n')
    f.write('}\n')

# Verify syntax
with open(OUT_PATH, 'r', encoding='utf-8') as f:
    code = f.read()
try:
    ast.parse(code)
    print("Syntax OK")
except SyntaxError as e:
    print(f"SYNTAX ERROR at line {e.lineno}: {e.msg}")
    sys.exit(1)

# Stats
total = len(nodes)
choice_nodes = sum(1 for d in nodes.values() if d["choices"])
sequential = total - choice_nodes
print(f"Total nodes: {total}")
print(f"Choice nodes: {choice_nodes}")
print(f"Sequential nodes: {sequential}")
print(f"Last node: n{node_counter:05d}")
