import re
import urllib.request
from urllib.error import URLError, HTTPError
import ssl

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find external links
    links = re.findall(r'href=["\'](https?://[^"\']+)["\']', html)
    links = list(set(links))
    
    flaws = []
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print(f"Checking {len(links)} external links...")
    for link in links:
        # Ignore map tiles or fonts
        if 'basemaps.cartocdn.com' in link or 'fonts.googleapis.com' in link or 'fonts.gstatic.com' in link:
            continue
            
        req = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            urllib.request.urlopen(req, context=ctx, timeout=10)
        except HTTPError as e:
            if e.code not in [403]: # some sites block scrapers
                flaws.append(f"Broken: {link} - HTTP {e.code}")
        except URLError as e:
            flaws.append(f"Broken: {link} - {e.reason}")
        except Exception as e:
            flaws.append(f"Broken: {link} - {e}")

    if flaws:
        print("--- Broken Links ---")
        for f in flaws:
            print(f)
    else:
        print("All external links okay!")

if __name__ == "__main__":
    main()
