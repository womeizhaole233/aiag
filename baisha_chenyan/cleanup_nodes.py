import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the DIALOGUES dict
m = re.search(r'DIALOGUES = \{(.+)\}', content, re.DOTALL)
if not m:
    print('Could not find DIALOGUES')
    exit(1)

full_start = m.start()
full_end = m.end()
dict_body = m.group(0)

def clean_text(txt):
    lines = txt.split('\n')
    new_lines = []
    for line in lines:
        stripped = line.strip()
        if re.match(r'^（选项[A-D]）$', stripped):
            continue
        if re.match(r'^【选[A-D]】$', stripped):
            continue
        if re.match(r'^【选[A-D]】', stripped):
            line = re.sub(r'^【选[A-D]】', '', line)
        if re.match(r'^#### .+', stripped):
            continue
        if re.match(r'^## ', stripped):
            continue
        if re.match(r'^[A-D]\.\s', stripped):
            continue
        new_lines.append(line)
    
    while new_lines and not new_lines[-1].strip():
        new_lines.pop()
    result = '\n'.join(new_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result

# Process each text field safely
# Match: "text": """ ... """
# Using non-greedy match for triple-quoted strings
pattern = re.compile(r'("text":\s*""")(.*?)(""")', re.DOTALL)

def replace_text(m2):
    prefix = m2.group(1)
    raw = m2.group(2)
    suffix = m2.group(3)
    cleaned = clean_text(raw)
    return prefix + cleaned + suffix

new_dict_body, count = pattern.subn(replace_text, dict_body)

if count > 0:
    new_content = content[:full_start] + new_dict_body + content[full_end:]
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Cleaned {count} text fields')

    import ast
    try:
        ast.parse(new_content)
        print('Syntax OK')
    except SyntaxError as e:
        print(f'Syntax Error at line {e.lineno}: {e.msg}')
else:
    print('No changes needed')
