import re

with open('script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

chapters = re.findall(r'(ch\d+):\s*\{([^}]*tips[^}]*)\}', js_content, re.DOTALL)
for ch, body in chapters:
    links_match = re.search(r'links:\s*\[(.*?)\]', body, re.DOTALL)
    links_count = 0
    if links_match:
        links_content = links_match.group(1)
        links_count = len(re.findall(r'\{', links_content))
    
    # "tips" might not be an array, the user says "have 2 practical, insted of 3 tips".
    # literally: "many of the other chapters only have 2 practical, insted of 3 tips"
    # what does "2 practical" mean? Is it the number of links in script.js?
    print(f"{ch}: {links_count} links")

