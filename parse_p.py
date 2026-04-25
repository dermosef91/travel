import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for match in re.finditer(r'<section class="chapter" id="(ch\d+)">(.*?)</section>', html, re.DOTALL):
    ch = match.group(1)
    body = match.group(2)
    
    # We want to check <p> tags only in the top-level body, not inside highlights or practical items or quote
    # Let's extract the first div in chapter-body which always contains the narrative paragraphs
    ch_body_match = re.search(r'<div class="chapter-body">\s*<div>(.*?)</div>\s*<div>\s*<div class="highlights">', body, re.DOTALL)
    if ch_body_match:
        narrative = ch_body_match.group(1)
        narrative_ps = len(re.findall(r'<p>', narrative))
        if narrative_ps != 2:
            print(f"{ch} has {narrative_ps} narrative paragraphs instead of 2")

