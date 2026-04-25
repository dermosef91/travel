import re
import json

with open('script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

m = re.search(r"const climateData = (\{.*?\});", js_content, re.DOTALL)
if m:
    data_str = m.group(1)
    
    # We can use AST or regex to count elements in 'tips: [ ... ]'
    chapters_matches = re.finditer(r"['\"]?([IVX]+)['\"]?:\s*\{([^}]*)\}", data_str, re.DOTALL)
    for match in chapters_matches:
        chapter = match.group(1)
        body = match.group(2)
        
        tips_match = re.search(r"tips:\s*\[(.*?)\]", body, re.DOTALL)
        if tips_match:
            tips_str = tips_match.group(1).strip()
            # Split by comma but ignore commas inside strings
            # Simple heuristic: count the number of list items by splitting on lines or counting quotes
            items = re.findall(r"['\"](.*?)['\"]", tips_str, re.DOTALL)
            print(f"Chapter {chapter}: {len(items)} tips")
        else:
            print(f"Chapter {chapter}: 0 tips")

