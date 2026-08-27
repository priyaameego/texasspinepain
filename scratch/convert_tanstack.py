import os
import re

src_dir = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes'

routes = [
    '/', '/contact-us', '/dr-pritesh-patel', '/expert-pain-management-in-dallas', 
    '/about-us', '/frequently-asked-questions', '/insurance-benefits', 
    '/letter-of-protection', '/motor-vehicle-accidents', '/services', 
    '/truck-accidents', '/workers-compensation'
]

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace <a href="ROUTE"> with <Link to="ROUTE">
    # Because HTML does not allow nested <a> tags, we can process it sequentially.
    
    parts = re.split(r'(<a\s+[^>]*>)', content)
    
    new_content = ""
    inside_link = False
    
    for i, part in enumerate(parts):
        if part.startswith('<a '):
            # Check if this anchor is for an internal route
            href_match = re.search(r'href=[\'"]([^\'"]+)[\'"]', part)
            if href_match:
                href = href_match.group(1)
                # Some hrefs might have trailing slash or query params, let's just check the base
                base_href = href.split('?')[0].split('#')[0]
                if base_href in routes or href in routes:
                    # Convert to Link
                    part = part.replace('<a ', '<Link ').replace('href=', 'to=')
                    inside_link = True
                else:
                    inside_link = False
            else:
                inside_link = False
            new_content += part
        else:
            if inside_link:
                # We need to replace the FIRST </a> we see with </Link>
                # But since parts could contain multiple </a> if we didn't split by </a>,
                # wait, part is just the text between <a ...> and the next <a ...>
                # Let's replace the first </a> with </Link>
                if '</a>' in part:
                    part = part.replace('</a>', '</Link>', 1)
                    inside_link = False
            new_content += part

    if new_content != content:
        # Add import if needed
        if 'import { Link } from' not in new_content:
            new_content = new_content.replace("import { Helmet } from 'react-helmet-async';", "import { Helmet } from 'react-helmet-async';\nimport { Link } from '@tanstack/react-router';")
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False


modified = 0
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            if process_file(path):
                modified += 1

print(f"Modified {modified} files.")
