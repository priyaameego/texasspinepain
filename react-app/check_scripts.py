import re
with open(r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'<script.*?</script>', text, flags=re.IGNORECASE | re.DOTALL):
    s = m.group(0)
    if 'src=' in s:
        print('SRC Script:', re.search(r'src=[\'\"]([^\'\"]+)', s).group(1))
    elif 'particlesJS' in s:
        print('INLINE Script with particlesJS')
    elif 'dangerouslySetInnerHTML' in s:
        pass # other inline scripts
