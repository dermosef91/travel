import re
from html.parser import HTMLParser

class ChapterParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.chapters = {}
        self.current_chapter = None
        self.in_chapter = False
        self.current_tag_stack = []

    def handle_starttag(self, tag, attrs):
        self.current_tag_stack.append(tag)
        attrs_dict = dict(attrs)
        
        # Detect chapter start
        if tag == 'section' and 'class' in attrs_dict and 'chapter' in attrs_dict['class'].split():
            self.current_chapter = attrs_dict.get('id', 'Unknown')
            self.chapters[self.current_chapter] = {
                'highlights': 0,
                'practical_items': 0,
                'magic_moment': 0,
                'hero_images': 0,
                'paragraphs': 0
            }
            self.in_chapter = True
            
        elif self.in_chapter:
            if tag == 'div' and 'class' in attrs_dict:
                classes = attrs_dict['class'].split()
                if 'highlight' in classes and 'highlights' not in classes:
                    self.chapters[self.current_chapter]['highlights'] += 1
                if 'practical-item' in classes:
                    self.chapters[self.current_chapter]['practical_items'] += 1
                if 'magic-moment' in classes:
                    self.chapters[self.current_chapter]['magic_moment'] += 1
                if 'chapter-hero' in classes:
                    self.chapters[self.current_chapter]['hero_images'] += 1
            if tag == 'img' and 'class' in attrs_dict and 'hero-image' in attrs_dict['class'].split():
                self.chapters[self.current_chapter]['hero_images'] += 1
            if tag == 'p':
                self.chapters[self.current_chapter]['paragraphs'] += 1

    def handle_endtag(self, tag):
        if self.current_tag_stack:
            self.current_tag_stack.pop()
        if tag == 'section':
            self.in_chapter = False

parser = ChapterParser()
with open('index.html', 'r', encoding='utf-8') as f:
    parser.feed(f.read())

print("HTML Inconsistencies Report:")
for ch, stats in parser.chapters.items():
    print(f"{ch}: Highlights={stats['highlights']}, PracticalItems={stats['practical_items']}, MagicMoment={stats['magic_moment']}, Paragraphs={stats['paragraphs']}")


with open('script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

m = re.search(r"const climateData = (\{.*?\});\n", js_content, re.DOTALL)
if m:
    data_str = m.group(1)
    print("\nJS Inconsistencies Report (tips array length):")
    chapters_matches = re.finditer(r"['\"]?([IVX]+)['\"]?:\s*\{([^}]*)\}", data_str, re.DOTALL)
    for match in chapters_matches:
        chapter = match.group(1)
        body = match.group(2)
        tips = re.search(r"tips:\s*\[(.*?)\]", body, re.DOTALL)
        tips_count = 0
        if tips:
            # simply count lines that look like strings or number of commas
            t_str = tips.group(1)
            # count strings by splitting on "," and filtering whitespace
            tips_count = len([x for x in t_str.split(',') if x.strip()])
            
        links = re.search(r"links:\s*\[(.*?)\]", body, re.DOTALL)
        links_count = 0
        if links:
            l_str = links.group(1)
            links_count = len([x for x in l_str.split('{') if x.strip()]) - 1 # count object starts
            
        print(f"Chapter {chapter}: Tips={tips_count}, Links={max(0, links_count)}")

