import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

chapters = re.findall(r'<section class="chapter" id="(ch\d+)">.*?</section>', content, re.DOTALL)
print(f"Found {len(chapters)} chapters")
for match in re.finditer(r'<section class="chapter" id="(ch\d+)">(.*?)</section>', content, re.DOTALL):
    ch = match.group(1)
    body = match.group(2)
    practical_items = len(re.findall(r'<div class="practical-item">', body))
    links = len(re.findall(r'<a class="highlight-link"', body))
    p_tags = len(re.findall(r'<p ', body)) + len(re.findall(r'<p>', body))
    print(f"{ch}: {practical_items} practical items, {links} highlights, {p_tags} p tags")

