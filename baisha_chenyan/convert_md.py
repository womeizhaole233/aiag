#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert text new.md to DIALOGUES dict for app.py.
"""
import re

MD_PATH = r'D:\AI\aiag\baisha_chenyan\text new.md'

with open(MD_PATH, 'r', encoding='utf-8') as f:
    raw = f.read()
if raw.startswith('# '):
    raw = raw[raw.index('\n')+1:]
text = raw.strip()

# ==============================
# Phase 1: Split by ###, then merge choice-related sections
# ==============================
chapters_raw = re.split(r'\n(?=## )', text)
all_sections = []

for ch_block in chapters_raw:
    ch_block = ch_block.strip()
    if not ch_block: continue
    lines = ch_block.split('\n')
    if not lines[0].startswith('## '): continue
    ch_title = lines[0][3:].strip()
    ch_body = '\n'.join(lines[1:]).strip()
    parts = re.split(r'\n(?=### )', ch_body)
    for part in parts:
        part = part.strip()
        if not part: continue
        plines = part.split('\n')
        header = plines[0][4:].strip()
        body = '\n'.join(plines[1:]).strip()
        all_sections.append((ch_title, header, body, header == '玩家点击'))

# Merge choice-related sections into click sections
merged = []
i = 0
while i < len(all_sections):
    ct, hdr, body, is_c = all_sections[i]
    
    if is_c:
        click_lines = [body] if body else []
        last_was_choice = bool(re.search(r'####\s+选[A-D][^#]*$', body, re.MULTILINE))
        
        j = i + 1
        while j < len(all_sections):
            nct, nhdr, nbody, nis_c = all_sections[j]
            if nis_c: break
            
            # Check if this section continues a choice outcome
            nlines = nbody.split('\n') if nbody else []
            starts_with_choice = any(re.match(r'^####\s+选', l.strip()) for l in nlines[:3])
            
            # Check if previous content has open #### 选X (not yet followed by next #### 选Y)
            prev_text = '\n'.join(click_lines)
            # Count open #### 选X vs resolved ones (followed by next #### 选 or ---)
            open_choices = bool(re.search(r'####\s+选[A-D][^#]*$', prev_text, re.MULTILINE))
            
            if last_was_choice or starts_with_choice or open_choices:
                click_lines.append(f"### {nhdr}")
                if nbody: click_lines.append(nbody)
                
                # Check if this section ends with a choice marker
                last_was_choice = bool(re.search(r'####\s+选[A-D]', nbody or ''))
                last_was_choice = last_was_choice or bool(re.search(r'####\s+选[A-D][^#]*$', '\n'.join(click_lines[-3:]), re.MULTILINE))
                j += 1
            else:
                break
        
        merged.append((ct, hdr, '\n'.join(click_lines), True))
        i = j
    else:
        merged.append((ct, hdr, body, False))
        i += 1

print(f"Sections: {len(merged)}, Click sections: {sum(1 for *_, c in merged if c)}")

# ==============================
# Phase 2: Parse choices from click sections
# ==============================
def clean_response_text(text):
    """Clean ### Speaker markers from within response text"""
    # Replace ### Speaker patterns with 【Speaker】
    lines = text.split('\n')
    result = []
    for l in lines:
        m = re.match(r'^###\s+(.+)', l)
        if m:
            speaker = m.group(1).strip()
            if speaker == '系统':
                continue  # skip plain system markers
            result.append(f"【{speaker}】")
        else:
            result.append(l)
    return '\n'.join(result).strip()

def parse_click(body):
    lines = body.split('\n')
    options = []
    outcome_lines = {}
    current_outcome_letters = []
    mode = 'idle'
    
    for line in lines:
        s = line.strip()
        
        if re.match(r'^####\s+(?:选项|选择)', s):
            mode = 'opts'
            current_outcome_letters = []
            continue
        
        m = re.match(r'^####\s+选(.+)', s)
        if m:
            mode = 'outcome'
            cstr = m.group(1).strip().replace('：', '').replace(':', '')
            letters = re.findall(r'[A-Da-d]', cstr.upper())
            current_outcome_letters = letters
            for l in letters:
                if l not in outcome_lines:
                    outcome_lines[l] = []
            last_was_sep = True  # new outcome section
            continue
        
        if s.startswith('---'):
            if mode == 'outcome':
                # separator between outcomes
                current_outcome_letters = []
            continue
        
        if mode == 'opts':
            m_opt = re.match(r'([A-Da-d])[.．\s]\s*(.*)', s)
            if m_opt:
                options.append((m_opt.group(1).upper(), m_opt.group(2).strip()))
        
        elif mode == 'outcome' and current_outcome_letters:
            for l in current_outcome_letters:
                outcome_lines[l].append(line)
    
    # Build response text for each option
    option_responses = {}
    for letter, opt_text in options:
        resp_lines = outcome_lines.get(letter, [])
        # Clean #### 选X headers from response
        resp_lines = [l for l in resp_lines if not re.match(r'^\s*####\s+选', l.strip())]
        # Clean ### Speaker markers
        resp_text_raw = '\n'.join(resp_lines).strip()
        resp_text = clean_response_text(resp_text_raw)
        if not resp_text:
            resp_text = f"（选项{letter}）"
        option_responses[letter] = (opt_text, resp_text)
    
    return options, option_responses

# ==============================
# Phase 3: Build DIALOGUES
# ==============================
BG_MAP = {
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

DIALOGUES = {}
all_ids = []
cnt = [0]
converge = []

def nid():
    cnt[0] += 1
    return f"n{cnt[0]:05d}"

for ct, hdr, body, is_c in merged:
    bg = BG_MAP.get(ct, "assets/M1/01环境地图/白沙宋墓地形图.png")
    
    if is_c:
        options, opt_resp = parse_click(body)
        
        if not options:
            # Simple prompt without choices - treat as normal node
            n = nid()
            DIALOGUES[n] = {'speaker': '系统', 'text': body, 'background_image': bg, 'choices': [], 'next': None}
            all_ids.append(n)
            for r in converge:
                if DIALOGUES[r].get('next') is None: DIALOGUES[r]['next'] = n
            converge = []
            continue
        
        # Create choice node
        cid = nid()
        choices = []
        resp_map = {}
        
        for letter, (opt_txt, resp_txt) in opt_resp.items():
            if resp_txt not in resp_map:
                rid = nid()
                resp_map[resp_txt] = rid
            choices.append({'text': opt_txt, 'next': resp_map[resp_txt]})
        
        DIALOGUES[cid] = {'speaker': '系统', 'text': '请选择：', 'background_image': bg, 'choices': choices, 'next': None}
        all_ids.append(cid)
        
        for r in converge:
            if DIALOGUES[r].get('next') is None: DIALOGUES[r]['next'] = cid
        converge = []
        
        for resp_txt, rid in resp_map.items():
            DIALOGUES[rid] = {'speaker': '系统', 'text': resp_txt, 'background_image': bg, 'choices': [], 'next': None}
            all_ids.append(rid)
            converge.append(rid)
    else:
        n = nid()
        DIALOGUES[n] = {'speaker': hdr, 'text': body, 'background_image': bg, 'choices': [], 'next': None}
        all_ids.append(n)
        for r in converge:
            if DIALOGUES[r].get('next') is None: DIALOGUES[r]['next'] = n
        converge = []

# Sequential linking
prev = None
for n in all_ids:
    if prev and not DIALOGUES[prev]['choices'] and DIALOGUES[prev]['next'] is None:
        DIALOGUES[prev]['next'] = n
    prev = n

if all_ids:
    last = all_ids[-1]
    if not DIALOGUES[last]['choices'] and DIALOGUES[last]['next'] is None:
        DIALOGUES[last]['next'] = 'game_end'

DIALOGUES['game_end'] = {'speaker': '系统', 'text': '——全剧终——',
    'background_image': 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png', 'choices': [], 'next': None}
all_ids.append('game_end')

# ==============================
# Output
# ==============================
def esc(s):
    return s.replace('\\', '\\\\').replace('"""', '\\"\\"\\"')

lines_out = ['DIALOGUES = {\n']
for n in all_ids:
    nd = DIALOGUES[n]
    lines_out.append(f'    # ===== {n} =====')
    lines_out.append(f'    "{n}": {{')
    lines_out.append(f'        "speaker": "{esc(nd["speaker"])}",')
    lines_out.append(f'        "text": """{esc(nd["text"])}""",')
    lines_out.append(f'        "background_image": "{nd["background_image"]}",')
    if nd['choices']:
        lines_out.append('        "choices": [')
        for c in nd['choices']:
            lines_out.append(f'            {{"text": "{esc(c["text"])}", "next": "{c["next"]}"}},')
        lines_out.append('        ],')
    else:
        lines_out.append('        "choices": [],')
    lines_out.append(f'        "next": "{nd["next"]}"' if nd['next'] else '        "next": None')
    lines_out.append('    },\n')
lines_out.append('}\n')

with open(r'D:\AI\aiag\baisha_chenyan\generated_dialogues.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines_out))

print(f"\nDone: {len(all_ids)} nodes, {sum(1 for n in all_ids if DIALOGUES[n]['choices'])} choice nodes")

# Verify a few choice nodes
print("\n=== Sample choice nodes ===")
for n in all_ids:
    if DIALOGUES[n]['choices']:
        print(f"\nNode {n}: {len(DIALOGUES[n]['choices'])} choices")
        print(f"  Choices:")
        for c in DIALOGUES[n]['choices'][:3]:
            r = DIALOGUES.get(c['next'], {})
            print(f"    [{c['text'][:40]}] -> {c['next']}: {r.get('text','')[:50]}")
        if len(all_ids) > 20:
            break
