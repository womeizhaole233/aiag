#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parse text new.md and generate DIALOGUES dict for app.py.
"""
import re, json

MD_PATH = r'D:\AI\aiag\baisha_chenyan\text new.md'

with open(MD_PATH, 'r', encoding='utf-8') as f:
    raw = f.read()

# Remove title line
if raw.startswith('# '):
    raw = raw[raw.index('\n')+1:]

text = raw.strip()

# ==============================
# 1. Split into chapters
# ==============================
chapter_blocks = re.split(r'\n(?=## )', text)

# Chapter config
CHAPTER_BG = {
    "楔子": "assets/M1/01环境地图/白沙宋墓地形图.png",
    "第一章  墓外": "assets/M1/01环境地图/白沙宋墓地形图.png",
    "第二章  墓门": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
    "第三章 甬道": "assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png",
    "第四章 前室": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
    "第五章 过道": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
    "第六章 后室": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
    "第七章  暗格": "assets/M1/16_出土器物与人骨/地券.png",
    "终章": "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
    "封存": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
}
PREFIX_MAP = {
    "楔子": "pro", "第一章  墓外": "ch1", "第二章  墓门": "ch2",
    "第三章 甬道": "ch3", "第四章 前室": "ch4", "第五章 过道": "ch5",
    "第六章 后室": "ch6", "第七章  暗格": "ch7", "终章": "final", "封存": "end",
}

# ==============================
# 2. Parse nodes from a chapter body
# ==============================
def parse_chapter(ch_title, ch_body):
    """Parse a chapter body into a list of raw node dicts."""
    bg = CHAPTER_BG.get(ch_title, "assets/M1/01环境地图/白沙宋墓地形图.png")
    prefix = PREFIX_MAP.get(ch_title, "ch")
    
    # Split by ### headings
    sections = re.split(r'\n(?=### )', ch_body)
    
    raw_nodes = []
    click_counter = [0]
    choice_counter = [0]
    
    i = 0
    while i < len(sections):
        sec = sections[i].strip()
        if not sec:
            i += 1
            continue
        
        lines = sec.split('\n')
        header = lines[0].replace('### ', '').strip()
        body = '\n'.join(lines[1:]).strip()
        
        if header == '玩家点击':
            click_counter[0] += 1
            # ---- Parse the click section ----
            # Find prompt text (before #### 选项)
            opt_marker = None
            for m in re.finditer(r'^####\s+(?:选项|选择)\s*$', body, re.MULTILINE):
                opt_marker = m.start()
                break
            
            if opt_marker is None:
                # No choices - treat as normal
                raw_nodes.append({
                    'id': f"{prefix}_{len(raw_nodes)+1:03d}",
                    'speaker': '系统',
                    'text': body,
                    'bg': bg,
                    'choices': [],
                    'is_click': True,
                })
                i += 1
                continue
            
            prompt = body[:opt_marker].strip()
            rest = body[opt_marker:]
            
            # Parse option items (A. ..., B. ..., etc.)
            opt_lines = rest.split('\n')
            options = []  # [(letter, text)]
            in_opts = False
            for l in opt_lines:
                s = l.strip()
                if s.startswith('#### '):
                    if '选项' in s or '选择' in s:
                        in_opts = True
                        continue
                    else:
                        break
                if in_opts:
                    m = re.match(r'[\(（]?([A-Da-d])[)）]?[.．\s]\s*(.*)', s)
                    if m:
                        options.append((m.group(1).upper(), m.group(2).strip()))
                    elif s.startswith('---'):
                        break
            
            # Find choice outcome headers #### 选X
            # Split rest by #### 选
            outcome_parts = re.split(r'\n(?=####\s*选)', rest)
            
            # Parse each outcome part
            outcomes = {}  # letter -> response text
            for op in outcome_parts:
                op = op.strip()
                if not op or op.startswith('#### 选项') or op.startswith('#### 选择'):
                    continue
                
                op_lines = op.split('\n')
                # Extract the header: #### 选A, #### 选A或C, #### 选B：
                hdr = op_lines[0].replace('####', '').strip()
                # Remove trailing punctuation
                hdr = re.sub(r'[：:]\s*$', '', hdr).strip()
                
                # Extract letters
                letter_part = hdr.replace('选', '').strip()
                letters = re.split(r'[或&、]', letter_part)
                letters = [l.strip() for l in letters if l.strip() in 'ABCDabcd']
                
                # Body of the outcome (without the #### header)
                outcome_body = '\n'.join(op_lines[1:]).strip()
                
                # Parse nested ### nodes within outcome body
                nested = re.split(r'\n(?=### )', outcome_body)
                response_parts = []
                for nsec in nested:
                    nsec = nsec.strip()
                    if not nsec:
                        continue
                    nlines = nsec.split('\n')
                    nheader = nlines[0].replace('### ', '').strip()
                    nbody = '\n'.join(nlines[1:]).strip()
                    if nheader and nheader != '系统':
                        response_parts.append(f"【{nheader}】\n{nbody}")
                    else:
                        response_parts.append(nbody)
                
                combined = '\n\n'.join(response_parts)
                
                for letter in letters:
                    outcomes[letter] = combined
            
            # Build choices list
            choices_list = []
            response_nodes = {}  # response_id -> text
            
            for letter, opt_text in options:
                resp_text = outcomes.get(letter, f"（{letter}的回应）")
                # Find or create response node
                resp_key = resp_text  # use text as key
                if resp_key not in response_nodes:
                    choice_counter[0] += 1
                    rid = f"{prefix}_r_{choice_counter[0]:03d}"
                    response_nodes[resp_key] = rid
                
                rid = response_nodes[resp_key]
                choices_list.append({'text': opt_text, 'next': rid})
            
            # Create choice node
            nid = f"{prefix}_q_{click_counter[0]:03d}"
            raw_nodes.append({
                'id': nid,
                'speaker': '系统',
                'text': prompt if prompt else '请选择：',
                'bg': bg,
                'choices': choices_list,
                'is_click': True,
            })
            
            # Create response nodes
            for resp_text, rid in response_nodes.items():
                raw_nodes.append({
                    'id': rid,
                    'speaker': '系统',
                    'text': resp_text,
                    'bg': bg,
                    'choices': [],
                    'is_response': True,
                })
            
        else:
            # Normal node
            raw_nodes.append({
                'id': f"{prefix}_{len(raw_nodes)+1:03d}",
                'speaker': header,
                'text': body,
                'bg': bg,
                'choices': [],
            })
        
        i += 1
    
    return raw_nodes


# ==============================
# 3. Process all chapters
# ==============================
all_raw = []  # list of (ch_title, raw_nodes)

for block in chapter_blocks:
    block = block.strip()
    if not block:
        continue
    fl = block.split('\n')[0]
    if not fl.startswith('## '):
        continue
    ch_title = fl[3:].strip()
    ch_body = '\n'.join(block.split('\n')[1:]).strip()
    nodes = parse_chapter(ch_title, ch_body)
    all_raw.append((ch_title, nodes))

# ==============================
# 4. Link nodes and build DIALOGUES
# ==============================
DIALOGUES = {}
all_node_ids = []  # ordered by appearance

# Track response nodes that need convergence
convergence_queue = []  # list of response node IDs

for ch_title, raw_nodes in all_raw:
    for node in raw_nodes:
        nid = node['id']
        DIALOGUES[nid] = {
            'speaker': node['speaker'],
            'text': node['text'],
            'background_image': node['bg'],
            'choices': node['choices'],
            'next': None,
        }
        all_node_ids.append(nid)
        
        if node.get('is_response'):
            convergence_queue.append(nid)
        else:
            # Link all waiting convergence targets to this node
            for rid in convergence_queue:
                if DIALOGUES[rid]['next'] is None and not DIALOGUES[rid]['choices']:
                    DIALOGUES[rid]['next'] = nid
            convergence_queue = []

# Second pass: link sequential non-choice nodes
prev_id = None
for nid in all_node_ids:
    node = DIALOGUES[nid]
    if prev_id and not DIALOGUES[prev_id]['choices'] and not DIALOGUES[prev_id].get('_skip_link'):
        if DIALOGUES[prev_id]['next'] is None:
            DIALOGUES[prev_id]['next'] = nid
    prev_id = nid

# Last node
if all_node_ids:
    last = all_node_ids[-1]
    if not DIALOGUES[last]['choices'] and DIALOGUES[last]['next'] is None:
        DIALOGUES[last]['next'] = 'game_end'

# Add game_end
DIALOGUES['game_end'] = {
    'speaker': '系统',
    'text': '——全剧终——',
    'background_image': 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
    'choices': [],
    'next': None,
}
all_node_ids.append('game_end')

# ==============================
# 5. Generate Python code
# ==============================
def esc(s):
    s = s.replace('\\', '\\\\').replace('"""', '\\"\\"\\"')
    return s

py_lines = ['DIALOGUES = {\n']
for nid in all_node_ids:
    node = DIALOGUES[nid]
    py_lines.append(f'    # ===== {nid} =====')
    py_lines.append(f'    "{nid}": {{')
    py_lines.append(f'        "speaker": "{esc(node["speaker"])}",')
    py_lines.append(f'        "text": """{esc(node["text"])}""",')
    py_lines.append(f'        "background_image": "{node["background_image"]}",')
    
    choices = node['choices']
    if choices:
        py_lines.append('        "choices": [')
        for c in choices:
            py_lines.append(f'            {{"text": "{esc(c["text"])}", "next": "{c["next"]}"}},')
        py_lines.append('        ],')
    else:
        py_lines.append('        "choices": [],')
    
    nxt = node['next']
    py_lines.append(f'        "next": "{nxt}"' if nxt else '        "next": None')
    py_lines.append('    },')
    py_lines.append('')

py_lines.append('}\n')

with open(r'D:\AI\aiag\baisha_chenyan\generated_dialogues.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(py_lines))

# Stats
choice_nodes = sum(1 for nid in all_node_ids if DIALOGUES[nid]['choices'])
response_nodes = sum(1 for nid in all_node_ids if DIALOGUES[nid].get('_is_response'))
print(f"Total nodes: {len(all_node_ids)}")
print(f"Choice nodes: {choice_nodes}")
print(f"Game end node: {'game_end' in DIALOGUES}")

# Print sample nodes
print("\n=== Sample choice nodes ===")
for nid in all_node_ids:
    if DIALOGUES[nid]['choices']:
        print(f"  {nid}: {len(DIALOGUES[nid]['choices'])} choices")
        print(f"    text: {DIALOGUES[nid]['text'][:60]}")
        for c in DIALOGUES[nid]['choices'][:3]:
            print(f"    -> {c['text'][:40]} -> {c['next']}")
        if len(all_node_ids) > 10:
            break

print("\n=== Sample response nodes ===")
count = 0
for nid in all_node_ids:
    node = DIALOGUES[nid]
    if node['choices']:
        for c in node['choices']:
            cn = DIALOGUES.get(c['next'], {})
            if cn:
                print(f"  {c['next']}: text={cn.get('text','')[:60]}..., next={cn.get('next')}")
                count += 1
                if count >= 5:
                    break
    if count >= 5:
        break
