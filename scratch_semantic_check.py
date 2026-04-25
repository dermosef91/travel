import re

def main():
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Look for chapter definitions in climateData
    chapters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"]
    
    missing_chapters = []
    
    # We can try to extract the climateData object
    # Just check if 'chapter: "I"' exists
    for ch in chapters:
        # allow spaces, single/double quotes, etc.
        pattern = r'chapter\s*:\s*["\']' + ch + r'["\']'
        if not re.search(pattern, js):
            missing_chapters.append(ch)

    if missing_chapters:
        print(f"Missing chapters in JS data (likely climateData): {missing_chapters}")
    else:
        print("All chapters found in JS data.")
        
    # Also in index.html, check if we have all chapters
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    html_ch_missing = []
    for ch in chapters:
        # chapters usually are like <h2 class="chapter-number">Chapter IV</h2>
        # or similar.
        pattern2 = r'>Chapter\s+' + ch + r'<'
        if not re.search(pattern2, html, re.IGNORECASE):
            html_ch_missing.append(ch)
            
    if html_ch_missing:
        print(f"Missing chapters in HTML headings: {html_ch_missing}")
    else:
        print("All chapter headings found in HTML.")

if __name__ == "__main__":
    main()
