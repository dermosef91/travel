import re

with open('/Users/moritzgrassy/travel/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace `<h2 class="chapter-title">...</h2>` 
# with wrap it in a flex container and add the button.
# But we need the chapter ID. The chapter section looks like:
# <section class="chapter" id="ch1"> ... <h2 class="chapter-title">...</h2>

def replacer(match):
    ch_id = match.group(1)
    title_content = match.group(2)
    # the entire section up to the subtitle
    # It would be easier to just regex replace `<h2 class="chapter-title">...</h2>`
    # if we know the chapter ID.
    pass

# We can iterate over all `<section class="chapter" id="chX">`
sections = re.findall(r'<section class="chapter" id="(ch\d+)">.*?<h2 class="chapter-title">(.*?)</h2>', content, re.DOTALL)

for ch_id, title_content in sections:
    old_h2 = f'<h2 class="chapter-title">{title_content}</h2>'
    new_h2 = f'''<div class="chapter-title-wrap">
          <h2 class="chapter-title">{title_content}</h2>
          <button class="locate-btn" onclick="flyToChapter('{ch_id}')" title="Locate on map"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg></button>
        </div>'''
    content = content.replace(old_h2, new_h2)

with open('/Users/moritzgrassy/travel/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Replaced {len(sections)} chapter headers.")
