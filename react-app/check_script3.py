path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

idx2 = text.find('particlesJS("cz_94355"')
print(text[max(0, idx2-500):min(len(text), idx2+100)])
