import os
import re
import urllib.request
import urllib.error

base_url = 'https://texasspinepain.com'
public_dir = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\public'
jsx_path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'

with open(jsx_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Find all src=\"/wp-content/...\" or url(/wp-content/...)
urls = set()
for m in re.finditer(r'src=[\'\"](/wp-content/[^\'\"]+)[\'\"]', text):
    urls.add(m.group(1))

for m in re.finditer(r'url\([\'\"]?(/wp-content/[^\'\")]+)[\'\"]?\)', text):
    urls.add(m.group(1))
    
# also check srcset
for m in re.finditer(r'srcset=[\'\"]([^\'\"]+)[\'\"]', text):
    srcset = m.group(1)
    for part in srcset.split(','):
        part = part.strip()
        if part:
            url = part.split(' ')[0]
            if url.startswith('/wp-content'):
                urls.add(url)

print(f'Found {len(urls)} urls to check')

for url in urls:
    # URL might have query params like ?id=123, strip it for local file saving
    local_path = url.split('?')[0]
    local_file = os.path.join(public_dir, local_path.lstrip('/').replace('/', '\\'))
    
    if not os.path.exists(local_file):
        print(f'Downloading {url} ...')
        os.makedirs(os.path.dirname(local_file), exist_ok=True)
        try:
            full_url = base_url + url
            req = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                with open(local_file, 'wb') as f:
                    f.write(response.read())
            print(f'  -> Saved to {local_file}')
        except Exception as e:
            print(f'  -> Failed: {e}')
