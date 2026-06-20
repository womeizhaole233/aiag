import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'DIALOGUES = \{(.+)\}', content, re.DOTALL)
dict_body = m.group(1)

# Find all nodes with artifacts in their text
# Search for triple-quoted text
for tm in re.finditer(r'"(n\d+)"\s*:\s*\{', dict_body):
    nid = tm.group(1)
    start = tm.start()
    chunk = dict_body[start:start+2000]
    # Find text field
    tq_m = re.search(r'"text":\s*"""(.+?)"""', chunk, re.DOTALL)
    if tq_m:
        txt = tq_m.group(1)
        issues = []
        if '【选' in txt:
            issues.append('【选】')
        if '####' in txt:
            issues.append('####')
        if '##' in txt:
            issues.append('##')
        if issues:
            shortened = txt[:100].replace('\n', ' | ')
            print(f'{nid}: [{",".join(issues)}] {shortened}')
