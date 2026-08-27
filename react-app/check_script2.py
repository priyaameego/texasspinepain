path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('cz_94355')
idx2 = text.find('particlesJS("cz_94355"')
print('cz_94355 is at', idx)
print('particlesJS init is at', idx2)
print(text[max(0, idx2-300):min(len(text), idx2+500)])
