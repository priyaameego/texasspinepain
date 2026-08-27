import os
import re

html_path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\texasspinepain-clone\texasspinepain.com\index.html'
out_path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\index.html'

with open(html_path, 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

head_match = re.search(r'<head[^>]*>(.*?)</head>', html, re.DOTALL | re.IGNORECASE)
if head_match:
    head_content = head_match.group(1)
    # Replace relative wp-content paths with absolute root paths
    head_content = re.sub(r'href="wp-([^"]+)"', r'href="/wp-\1"', head_content)
    head_content = re.sub(r'src="wp-([^"]+)"', r'src="/wp-\1"', head_content)
    # Also replace relative http paths just in case
    head_content = head_content.replace('http://texasspinepain.com/wp-content', '/wp-content')
    head_content = head_content.replace('https://texasspinepain.com/wp-content', '/wp-content')
    
    # Do the same for inline styles with background images
    head_content = head_content.replace('url(wp-content', 'url(/wp-content')
    head_content = head_content.replace('url(\'wp-content', 'url(\'/wp-content')
    head_content = head_content.replace('url("wp-content', 'url("/wp-content')
    
    # Fix URL encoding issues for files that were saved unencoded
    head_content = head_content.replace('%3D', '=')
    
    # We want to remove the <Helmet> from the components now so they don't conflict
    # Wait, the components have their own page-specific styles.
    # It's better to leave the <Helmet> in the components for page specific things.
    # But for the global index.html, we inject the global head.

    template = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    {head_content}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>"""

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(template)
    print("Successfully updated react-app/index.html")
else:
    print("Could not find head in original index.html")
