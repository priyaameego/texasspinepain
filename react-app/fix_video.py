import re

path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace href="" data-html= with href="#!" onClick={(e) => e.preventDefault()} data-html=
new_text = re.sub(r'href=[\'\"][\'\"]\s+data-html', r'href="#!" onClick={(e) => e.preventDefault()} data-html', text)

if new_text != text:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Updated hrefs for video popups')
else:
    print('No changes made')
