import re

path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

count = text.count('cz_94355')
print(f'Found cz_94355 {count} times.')

# check if it is in an ID attribute
if 'id="cz_94355"' in text or "id='cz_94355'" in text:
    print('Container ID exists!')
else:
    print('Container ID not found!')
    
# output the context of where cz_94355 appears
idx = text.find('cz_94355')
if idx != -1:
    print(text[max(0, idx-50):min(len(text), idx+100)])
