import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 1. Total duration from hero
    hero_dur = re.search(r'Duration</div>\s*<div class="hero-meta-value">(\d+) days', html)
    if hero_dur:
        print(f"Hero Duration: {hero_dur.group(1)} days")
    
    # 2. Add up nights/days in Route Overview
    route_list = re.findall(r'<span class="route-mode">([^<]+)<span class="route-go">', html)
    total_days = 0
    for r in route_list:
        # e.g., "Sri Lanka · 13 nights", "Overland · 8 days", "Train · 21h", "China · 2-3 days"
        match = re.search(r'(\d+)(?:-(\d+))?\s*(night|day)', r)
        if match:
            v1 = int(match.group(1))
            v2 = int(match.group(2)) if match.group(2) else v1
            
            # if ranges, let's take max or ave? just print it out
            val = (v1 + v2) / 2 if v2 else v1
            total_days += val
            print(f"  {r} -> {val} days")
        else:
            print(f"  {r} -> ?")
    
    print(f"Total roughly from Route Overview: {total_days}")

    # 3. Check script.js for tracker tracking day ranges
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()
    
    days_tracker = re.findall(r"day:\s*'([\d–-]+)'", js)
    print(f"Ranges in script.js: {days_tracker}")
    if days_tracker:
        last_range = days_tracker[-1]
        print(f"Last day in script.js: {last_range}")

if __name__ == "__main__":
    main()
