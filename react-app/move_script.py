import re
path = r'c:\Users\Priya\Documents\Ameegolabs\pain management\react-app\src\routes\about-us\index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the existing particles script at the end
script_tag = '<script id="cz_particles-js" src="/wp-content/plugins/codevz-plus/wpbakery/assets/js/particles.js?ver=6.0"></script>'
if script_tag in text:
    text = text.replace(script_tag + '\n', '')
    text = text.replace(script_tag, '')

# Insert the script tag right before the inline script
inline_trigger = 'if ( typeof particlesJS != "undefined" ) {'
new_text = text.replace(inline_trigger, script_tag + '\n					' + inline_trigger)

if text != new_text:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Moved particlesJS script tag higher up')
else:
    print('Failed to move')
