import os
import re
src_dir = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes'
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
            # Replace FAQ...s with FAQ's
            new_content = re.sub(r'FAQ[^s\w]*s', "FAQ's", content)
            if new_content != content:
                print('Modified:', path)
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
