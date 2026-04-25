from bs4 import BeautifulSoup

with open('index.html', 'r') as f:
    soup = BeautifulSoup(f, 'html.parser')

chapters = soup.find_all('article', class_='chapter')

for ch in chapters:
    ch_id = ch.get('id', 'No ID')
    highlights = ch.find_all('div', class_='highlight-card')
    hero = ch.find('div', class_='hero-image')
    hero_img = hero.find('img') if hero else None
    paragraphs = ch.find_all('p')
    # Filter paragraphs that are part of highlights or other structural elements to just count narrative paragraphs
    narrative_p = [p for p in paragraphs if not p.find_parent('div', class_='chapter-highlights')]
    
    print(f"Chapter: {ch_id}")
    print(f"  Hero Image: {'Yes' if hero_img else 'No'}")
    print(f"  Highlights count: {len(highlights)}")
    print(f"  Narrative Length (paragraphs): {len(narrative_p)}")

