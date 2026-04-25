import re

with open('/Users/moritzgrassy/travel/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The current HTML has:
# <button class="locate-btn" onclick="flyToChapter('chX')" title="Locate on map"><svg ...>...</svg></button>
# We want to replace it with:
# <button class="locate-btn" onclick="flyToChapter('chX')">Map</button>

def replacer(match):
    ch_id = match.group(1)
    return f'<button class="locate-btn" onclick="flyToChapter(\'{ch_id}\')">Map</button>'

# Find the button and replace
new_content = re.sub(r'<button class="locate-btn" onclick="flyToChapter\(\'([^\']+)\'\)".*?</button>', replacer, content)

with open('/Users/moritzgrassy/travel/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("HTML buttons updated.")
