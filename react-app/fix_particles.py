import re
path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

bad_tag = '\t\t\t\t\t<script id="cz_particles-js" src="/wp-content/plugins/codevz-plus/wpbakery/assets/js/particles.js?ver=6.0"></script>\n'
# try removing with different whitespace
text = text.replace(bad_tag, '')
bad_tag2 = '<script id="cz_particles-js" src="/wp-content/plugins/codevz-plus/wpbakery/assets/js/particles.js?ver=6.0"></script>\n'
text = text.replace(bad_tag2, '')
bad_tag3 = '<script id="cz_particles-js" src="/wp-content/plugins/codevz-plus/wpbakery/assets/js/particles.js?ver=6.0"></script>'
text = text.replace(bad_tag3, '')

# insert it before the <script dangerouslySetInnerHTML={{ __html: `
target = '<script dangerouslySetInnerHTML={{ __html: `'
tag_to_insert = '<script id="cz_particles-js" src="/wp-content/plugins/codevz-plus/wpbakery/assets/js/particles.js?ver=6.0"></script>\n'

new_text = text.replace(target, tag_to_insert + target)

if text != new_text:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Fixed particles script!')
else:
    print('Failed to fix')
