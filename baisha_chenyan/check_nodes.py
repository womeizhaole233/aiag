import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract only the DIALOGUES dict portion
m = re.search(r'DIALOGUES = \{(.+)\}', content, re.DOTALL)
if m:
    dict_body = m.group(1)
    # Find all node keys
    nodes = re.findall(r'"(n\d+)"\s*:', dict_body)
    unique_nodes = sorted(set(nodes))
    print(f'Total nodes in DIALOGUES: {len(unique_nodes)}')
    print(f'Node IDs: {unique_nodes[0]} ... {unique_nodes[-1]}')
    
    # Count choices
    choices = dict_body.count('"choices":')
    print(f'Nodes with choices: {choices}')
    
    # Sample a few nodes
    for nid in ['n00001', 'n00007', 'n00050', unique_nodes[-1]]:
        if nid in dict_body:
            idx = dict_body.index(f'"{nid}":')
            chunk = dict_body[idx:idx+500]
            # Get text
            tq_m = re.search(r'"""(.+?)"""', chunk, re.DOTALL)
            if tq_m:
                txt = tq_m.group(1)[:80].replace('\n', ' ')
                print(f'\n{nid} text: {txt}')
            # Check for artifacts
            if '【选' in chunk or '####' in chunk:
                print(f'  WARNING: raw markdown in {nid}')
else:
    print('Could not find DIALOGUES dict')
