import os
import re

def style_to_react(style_str):
    styles_dict = []
    for prop in style_str.split(';'):
        if not prop.strip(): continue
        parts = prop.split(':', 1)
        if len(parts) == 2:
            key = parts[0].strip()
            val = parts[1].strip().replace("'", '"')
            # camelCase the keys
            key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), key)
            # Remove !important
            val = val.replace('!important', '').strip()
            styles_dict.append(f"{key}: '{val}'")
    return f"{{{{ {', '.join(styles_dict)} }}}}"

def convert_html_to_jsx(html_path, out_path, component_name):
    with open(html_path, 'r', encoding='utf-8', errors='replace') as f:
        html = f.read()

    body_match = re.search(r'<body([^>]*)>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    body_attrs = body_match.group(1) if body_match else ''
    body_content = body_match.group(2) if body_match else html

    body_class_match = re.search(r'class="([^"]*)"', body_attrs, re.IGNORECASE)
    body_class = body_class_match.group(1) if body_class_match else ''

    body_id_match = re.search(r'id="([^"]*)"', body_attrs, re.IGNORECASE)
    body_id = body_id_match.group(1) if body_id_match else ''

    helmet_body = ""
    if body_class or body_id:
        cls_attr = f' className="{body_class}"' if body_class else ''
        id_attr = f' id="{body_id}"' if body_id else ''
        helmet_body = f"\n        <body{id_attr}{cls_attr} />"

    head_match = re.search(r'<head[^>]*>(.*?)</head>', html, re.DOTALL | re.IGNORECASE)
    head_content = head_match.group(1) if head_match else ''

    def script_repl(match):
        attrs = match.group(1)
        body = match.group(2)
        if body.strip():
            escaped_body = body.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')
            return f"<script{attrs} dangerouslySetInnerHTML={{{{ __html: `{escaped_body}` }}}} />"
        return f"<script{attrs}></script>"
        
    def style_tag_repl(match):
        attrs = match.group(1)
        body = match.group(2)
        if body.strip():
            escaped_body = body.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')
            return f"<style{attrs} dangerouslySetInnerHTML={{{{ __html: `{escaped_body}` }}}} />"
        return f"<style{attrs}></style>"

    def process_tags(content):
        # We need to find tags, extract class and style, and map style to React inline styles
        def tag_repl(match):
            tag_full = match.group(0)
            
            # Extract style
            style_match = re.search(r'(?:\s|^)style="([^"]*)"', tag_full)
            if not style_match:
                return tag_full
                
            style_str = style_match.group(1)
            react_style = style_to_react(style_str)
            
            # Replace the old style="..." with style={{...}}
            tag_full = re.sub(r'\sstyle="[^"]*"', f' style={react_style}', tag_full)
            return tag_full

        # Apply tag replacer
        content = re.sub(r'<[a-zA-Z0-9]+[^>]*(?:\s)style="[^"]*"[^>]*>', tag_repl, content)
        return content

    def clean_html(content):
        content = process_tags(content)
        
        def href_repl(match):
            href = match.group(1)
            if href.startswith('https://texasspinepain.com'):
                href = href.replace('https://texasspinepain.com', '')
            if href.endswith('index.html'):
                href = href[:-10]
            href = href.replace('../', '')
            href = href.replace('./', '')
            if not href.startswith('/') and not href.startswith('http') and not href.startswith('#') and not href.startswith('mailto:') and not href.startswith('tel:'):
                href = '/' + href
            if href.endswith('/') and len(href) > 1:
                href = href[:-1]
            if href == '':
                href = '/'
            return f'href="{href}"'
            
        content = re.sub(r'href="([^"]+)"', href_repl, content)

        content = content.replace('class=', 'className=')
        content = content.replace('for=', 'htmlFor=')
        content = content.replace('tabindex=', 'tabIndex=')
        content = content.replace('autocomplete=', 'autoComplete=')
        content = content.replace('novalidate=', 'noValidate=')
        content = content.replace('readonly=', 'readOnly=')
        content = content.replace('maxlength=', 'maxLength=')
        content = content.replace('minlength=', 'minLength=')
        content = content.replace('enctype=', 'encType=')
        content = content.replace('allowfullscreen', 'allowFullScreen')
        content = content.replace('frameborder', 'frameBorder')
        content = content.replace('crossorigin', 'crossOrigin')
        content = content.replace('charset=', 'charSet=')
        content = content.replace('http-equiv', 'httpEquiv')

        # Fix relative paths so they resolve correctly on all React routes
        content = re.sub(r'href="wp-([^"]+)"', r'href="/wp-\1"', content)
        content = re.sub(r'src="wp-([^"]+)"', r'src="/wp-\1"', content)
        content = re.sub(r'href="\.\./wp-([^"]+)"', r'href="/wp-\1"', content)
        content = re.sub(r'src="\.\./wp-([^"]+)"', r'src="/wp-\1"', content)
        content = content.replace('http://texasspinepain.com/wp-content', '/wp-content')
        content = content.replace('https://texasspinepain.com/wp-content', '/wp-content')
        content = content.replace('url(wp-content', 'url(/wp-content')
        content = content.replace('url(\'wp-content', 'url(\'/wp-content')
        content = content.replace('url("wp-content', 'url("/wp-content')
        content = content.replace('url(../wp-content', 'url(/wp-content')
        content = content.replace('%3D', '=')

        content = re.sub(r'<(img|br|input|hr|meta|link|wbr|base)([^>]*?)(?<!/)>', r'<\1\2 />', content, flags=re.IGNORECASE)
        content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)
        content = re.sub(r'<noscript([^>]*)>(.*?)</noscript>', r'', content, flags=re.DOTALL | re.IGNORECASE)
        content = re.sub(r'<script([^>]*)>(.*?)</script>', script_repl, content, flags=re.DOTALL | re.IGNORECASE)
        content = re.sub(r'<style([^>]*)>(.*?)</style>', style_tag_repl, content, flags=re.DOTALL | re.IGNORECASE)
        
        content = content.replace('stroke-width', 'strokeWidth')
        content = content.replace('stroke-linecap', 'strokeLinecap')
        content = content.replace('stroke-linejoin', 'strokeLinejoin')
        content = content.replace('fill-rule', 'fillRule')
        content = content.replace('clip-rule', 'clipRule')
        
        return content

    body_content = clean_html(body_content)
    head_content = clean_html(head_content)

    # Determine relative path for RunScripts
    # out_path is something like .../react-app/src/routes/index.jsx or .../react-app/src/routes/contact/index.jsx
    if 'routes\\index.jsx' in out_path or 'routes/index.jsx' in out_path.replace('\\', '/'):
        run_scripts_path = '../RunScripts'
    else:
        run_scripts_path = '../../RunScripts'

    jsx_template = f"""import React from 'react';
import {{ Helmet }} from 'react-helmet-async';
import RunScripts from '{run_scripts_path}';

export default function {component_name}() {{
  return (
    <>
      <Helmet>
        {{/* Original Head Content */}}
        {helmet_body}
        {head_content}
      </Helmet>
      <RunScripts>
        <div className="page-wrapper">
          {body_content}
        </div>
      </RunScripts>
    </>
  );
}}
"""
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(jsx_template)
    print(f"Converted {html_path} to {out_path}")

base_clone = r"c:\\Users\\Priya\\Documents\\Ameegolabs\\pain management\\texasspinepain-clone\\texasspinepain.com"
base_react = r"c:\\Users\\Priya\\Documents\\Ameegolabs\\pain management\\react-app\\src\\routes"

routes = [
    ("", "index.html", "index.jsx", "HomePage"),
    ("contact-us", "index.html", "index.jsx", "ContactUsPage"),
    ("dr-pritesh-patel", "index.html", "index.jsx", "DrPriteshPatelPage"),
    ("expert-pain-management-in-dallas", "index.html", "index.jsx", "ExpertPainManagementPage"),
    ("frequently-asked-questions", "index.html", "index.jsx", "FaqPage"),
    ("insurance-benefits", "index.html", "index.jsx", "InsuranceBenefitsPage"),
    ("letter-of-protection", "index.html", "index.jsx", "LetterOfProtectionPage"),
    ("motor-vehicle-accidents", "index.html", "index.jsx", "MotorVehicleAccidentsPage"),
    ("services", "index.html", "index.jsx", "ServicesPage"),
    ("truck-accidents", "index.html", "index.jsx", "TruckAccidentsPage"),
    ("workers-compensation", "index.html", "index.jsx", "WorkersCompensationPage")
]

for route_dir, html_name, jsx_name, comp_name in routes:
    html_path = os.path.join(base_clone, route_dir, html_name) if route_dir else os.path.join(base_clone, html_name)
    out_path = os.path.join(base_react, route_dir, jsx_name) if route_dir else os.path.join(base_react, jsx_name)
    
    if os.path.exists(html_path):
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        try:
            convert_html_to_jsx(html_path, out_path, comp_name)
        except Exception as e:
            print(f"Failed converting {html_path}: {e}")
    else:
        print(f"File not found: {html_path}")
