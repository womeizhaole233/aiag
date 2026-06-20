import sys, re

data = sys.stdin.buffer.read().decode('utf-8')

opt4 = len(re.findall(r'^#### 选项$', data, re.MULTILINE))
choice4 = len(re.findall(r'^#### 选', data, re.MULTILINE))
choice_plain = len(re.findall(r'^选[ABC]', data, re.MULTILINE))
lines = len(data.splitlines())

print(f'#### 选项: {opt4}')
print(f'#### 选X: {choice4}')
print(f'选X plain: {choice_plain}')
print(f'Total lines: {lines}')
