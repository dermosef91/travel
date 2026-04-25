import re
from collections import defaultdict

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Split into chapters
    parts = re.split(r'<!-- ============= CHAPTER \d+ ============= -->', html)
    # The first part is the header/intro.
    
    flaws = []
    
    chapter_stats = {}
    
    for i, part in enumerate(parts[1:], start=1):
        # find the <h2 class="chapter-title">
        title_match = re.search(r'<h2 class="chapter-title">(.*?)</h2>', part)
        title = title_match.group(1).replace('\n', '').strip() if title_match else f"Chapter {i} (Title Missing)"
        
        # count paragraphs in chapter-body
        body_match = re.search(r'<div class="chapter-body">(.*?)<div class="practical">', part, re.DOTALL)
        body_text = body_match.group(1) if body_match else part
        paragraphs = len(re.findall(r'<p>', body_text))
        
        # count highlights
        highlights = len(re.findall(r'<div class="highlight">', part))
        
        # count practical tips
        practical_items = len(re.findall(r'<div class="practical-item">', part))
        
        # check for why worth it
        has_why = '<div class="why-worth-it">' in part
        
        # check for magic moment
        has_magic = '<div class="magic-moment">' in part
        
        chapter_stats[i] = {
            'title': title,
            'paragraphs': paragraphs,
            'highlights': highlights,
            'practical_items': practical_items,
            'has_why': has_why,
            'has_magic': has_magic
        }

    for idx, stats in chapter_stats.items():
        if stats['highlights'] != 3:
            flaws.append(f"Chapter {idx} has {stats['highlights']} highlights (expected 3).")
        if stats['practical_items'] != 2:
            flaws.append(f"Chapter {idx} has {stats['practical_items']} practical items (expected 2?).")
        if not stats['has_why']:
            flaws.append(f"Chapter {idx} missing 'why-worth-it'.")
        if not stats['has_magic']:
            flaws.append(f"Chapter {idx} missing 'magic-moment'.")

    if not flaws:
        print("No structural flaws found in formatting/density across chapters.")
    else:
        for f in flaws:
            print("-", f)

if __name__ == "__main__":
    main()
