import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'DIALOGUES = \{(.+)\}', content, re.DOTALL)
dict_body = m.group(1)

issues = []
for tm in re.finditer(r'"(n\d+)"\s*:\s*\{', dict_body):
    nid = tm.group(1)
    start = tm.start()
    chunk = dict_body[start:start+2000]
    tq_m = re.search(r'"text":\s*"""(.+?)"""', chunk, re.DOTALL)
    if tq_m:
        txt = tq_m.group(1)
        if '【选' in txt or '####' in txt:
            shortened = txt[:100].replace('\n', ' | ')
            print(f'STILL HAS ARTIFACTS: {nid}: {shortened[:80]}')

# Count nodes
all_nodes = re.findall(r'"(n\d+)"\s*:', dict_body)
print(f'\nTotal nodes: {len(set(all_nodes))}')
if not issues:
    print('All artifacts cleaned!')
