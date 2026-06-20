#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

MD_PATH = r'D:\AI\aiag\baisha_chenyan\text new.md'
with open(MD_PATH, 'r', encoding='utf-8') as f:
    raw = f.read()
if raw.startswith('# '):
    raw = raw[raw.index('\n')+1:]
text = raw.strip()

# Find 楔子 chapter
chapter_blocks = re.split(r'\n(?=## )', text)
for block in chapter_blocks:
    block = block.strip()
    if not block:
        continue
    fl = block.split('\n')[0]
    if fl.startswith('## 楔子'):
        ch_body = '\n'.join(block.split('\n')[1:]).strip()
        break

# Find first 玩家点击 section
sections = re.split(r'\n(?=### )', ch_body)
for sec in sections:
    if sec.startswith('### 玩家点击'):
        body = '\n'.join(sec.split('\n')[1:]).strip()
        
        # Find the positions of all #### sequences
        for m in re.finditer(r'^####\s*\S+', body, re.MULTILINE):
            print(f"Match at {m.start()}: [{m.group()}]")
        
        # Split using the same regex as in convert
        parts = re.split(r'\n(?=####\s*选)', body)
        print(f"\nTotal parts: {len(parts)}")
        for idx, p in enumerate(parts):
            print(f"\n=== Part {idx} ===")
            print(f"Length: {len(p)}")
            print(f"Content: [{p[:200]}]")
            if len(p) > 200:
                print(f"... (truncated, total {len(p)} chars)")
        
        # Check if #### 选B exists
        if '#### 选B' in body or '#### 选B' in body:
            print("\n### 选B found in body!")
        else:
            print("\n### 选B NOT found in body!")
            
        # Find all #### patterns
        all_matches = list(re.finditer(r'####\s*\S+', body))
        print(f"\nAll #### patterns: {len(all_matches)}")
        for m in all_matches:
            print(f"  {m.start()}: [{m.group()}] -> context: [{body[max(0,m.start()-5):m.start()+30]}]")
        
        break
