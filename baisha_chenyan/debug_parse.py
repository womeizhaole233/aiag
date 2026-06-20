#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

MD_PATH = r'D:\AI\aiag\baisha_chenyan\text new.md'
with open(MD_PATH, 'r', encoding='utf-8') as f:
    raw = f.read()
if raw.startswith('# '):
    raw = raw[raw.index('\n')+1:]
text = raw.strip()

# Find first chapter with a 玩家点击
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
        print("=== Found 玩家点击 section ===")
        body = '\n'.join(sec.split('\n')[1:]).strip()
        
        # Find #### 选项
        opt_match = re.search(r'^####\s+(?:选项|选择)\s*$', body, re.MULTILINE)
        if opt_match:
            print(f"Found 选项 at position {opt_match.start()}")
            prompt = body[:opt_match.start()].strip()
            rest = body[opt_match.start():]
            print(f"Prompt: [{prompt[:80]}...]")
            print(f"\nRest (first 200 chars): [{rest[:200]}]")
            
            # Parse options
            opt_lines = rest.split('\n')
            in_opts = False
            options = []
            for l in opt_lines:
                s = l.strip()
                print(f"  Line: [{s[:60]}]")
                if s.startswith('#### '):
                    if '选项' in s or '选择' in s:
                        in_opts = True
                        continue
                    else:
                        break
                if in_opts:
                    m = re.match(r'([A-Da-d])[.．]\s*(.*)', s)
                    if m:
                        options.append((m.group(1).upper(), m.group(2).strip()))
                        print(f"    OPTION: {m.group(1)} = {m.group(2).strip()}")
                    elif s.startswith('---'):
                        break
            
            print(f"\nParsed {len(options)} options")
            
            # Parse outcomes
            outcome_parts = re.split(r'\n(?=####\s*选)', rest)
            print(f"\nFound {len(outcome_parts)} outcome parts")
            for j, op in enumerate(outcome_parts):
                print(f"\n--- Outcome part {j} ---")
                print(f"  First 100 chars: [{op.strip()[:100]}]")
                if not op.strip() or '#### 选项' in op:
                    continue
                lines = op.split('\n')
                hdr = lines[0].replace('####', '').strip()
                hdr = re.sub(r'[：:]\s*$', '', hdr).strip()
                print(f"  Cleaned header: [{hdr}]")
                
                letter_part = hdr.replace('选', '').strip()
                letters = re.split(r'[或&、]', letter_part)
                letters = [l.strip() for l in letters if l.strip() in 'ABCDabcd']
                print(f"  Letters: {letters}")
        else:
            print("No 选项 found!")
        
        # Check #### 选A pattern
        print("\n\n=== Checking #### 选A pattern ===")
        matches = list(re.finditer(r'^####\s*选', body, re.MULTILINE))
        print(f"Found {len(matches)} #### 选 matches")
        for m in matches[:5]:
            print(f"  Position {m.start()}: [{body[m.start():m.start()+30]}]")
        
        break
