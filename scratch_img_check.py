import urllib.request
import os
import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    img_tags = re.findall(r'<img[^>]+>', html)
    flaws = []
    
    for img in img_tags:
        src_match = re.search(r'src=["\']([^"\']*)["\']', img)
        if src_match:
            src = src_match.group(1)
            # check local paths
            if not src.startswith('http'):
                if not os.path.exists(src):
                    flaws.append(f"Missing local image: {src}")

    for f in flaws:
        print(f)
    if not flaws:
        print("All local images exist.")

if __name__ == "__main__":
    main()
