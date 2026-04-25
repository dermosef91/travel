import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    flaws = []
    
    # Check for duplicate IDs
    id_matches = re.findall(r'id=["\']([^"\']+)["\']', html)
    seen = set()
    duplicates = set()
    for i in id_matches:
        if i in seen:
            duplicates.add(i)
        seen.add(i)
    
    if duplicates:
        flaws.append(f"Duplicate IDs found: {duplicates}")

    # Check broken internal links
    link_matches = re.findall(r'href=["\']#([^"\']+)["\']', html)
    broken_links = set([l for l in link_matches if l not in seen and l != ''])
    if broken_links:
        flaws.append(f"Broken internal links found: {broken_links}")

    # Check for empty src or missing alt in images
    img_tags = re.findall(r'<img[^>]+>', html)
    for img in img_tags:
        src_match = re.search(r'src=["\']([^"\']*)["\']', img)
        alt_match = re.search(r'alt=["\']([^"\']*)["\']', img)
        
        src_val = src_match.group(1) if src_match else None
        
        if not src_val:
            flaws.append(f"Image missing src: {img}")
        if not alt_match:
            flaws.append(f"Image missing alt: {src_val}")
        elif src_val and 'placeholder' in src_val.lower():
            flaws.append(f"Placeholder image used: {src_val}")

    if 'lorem ipsum' in html.lower():
        flaws.append("Lorem Ipsum dummy text found in HTML.")
        
    print("--- HTML Flaws ---")
    for f in flaws:
        print(f)
        
    # JS checks
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js = f.read()
            if 'TODO' in js:
                print("--- JS Flaws ---")
                print("TODO found in script.js")
    except:
        pass
        
    # CSS checks
    try:
        with open('styles.css', 'r', encoding='utf-8') as f:
            css = f.read()
            if 'TODO' in css:
                print("--- CSS Flaws ---")
                print("TODO found in styles.css")
    except:
        pass

if __name__ == "__main__":
    main()
