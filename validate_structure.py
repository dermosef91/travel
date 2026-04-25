import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

chapters = re.finditer(r'<section class="chapter" id="(ch\d+)">(.*?)</section>', html, re.DOTALL)
for match in chapters:
    ch = match.group(1)
    body = match.group(2)
    
    issues = []
    
    # Check elements
    expected_classes = [
        "container", "chapter-header", "chapter-number", "chapter-title", 
        "chapter-subtitle", "chapter-hero ", "scene", "chapter-hero-quote", 
        "quote-text", "quote-attr", "chapter-body", "why-worth-it", 
        "highlights", "highlight", "highlight-icon", "practical", 
        "practical-grid", "practical-item", "magic-moment", "magic-moment-label", 
        "magic-moment-text"
    ]
    
    for cls in expected_classes:
        if cls not in body:
            issues.append(f"Missing class '{cls}'")
            
    p_items = len(re.findall(r'<div class="practical-item">', body))
    if p_items != 2:
        issues.append(f"Has {p_items} practical items instead of 2")
        
    highlights = len(re.findall(r'<div class="highlight">', body))
    if highlights != 3:
        issues.append(f"Has {highlights} highlights instead of 3")
        
    if issues:
        print(f"{ch} structural issues: {', '.join(issues)}")

print("Validation done.")

