"""Cut static (non-variable) TTF instances from the variable site fonts.

Why: Chrome prints variable fonts to PDF as Type 3 glyph shapes. Many office
printers and RIPs render Type 3 text as scattered dots (unreadable). Static
TrueType instances are embedded as proper CID TrueType fonts, which print crisp.

Usage: python scripts/make-static-fonts.py   (writes public/fonts/static/*.ttf)
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'fonts')
OUT = os.path.join(SRC, 'static')
os.makedirs(OUT, exist_ok=True)

JOBS = [
    ('archivo.woff2', 'Archivo', 'normal', [400, 500, 600, 700, 800, 900], {'wdth': 100}),
    ('archivo-italic.woff2', 'Archivo', 'italic', [400, 600, 700], {'wdth': 100}),
    ('geist.woff2', 'Geist', 'normal', [400, 500, 600, 700], {}),
]
for src, fam, style, weights, extra in JOBS:
    for w in weights:
        font = TTFont(os.path.join(SRC, src))
        inst = instancer.instantiateVariableFont(font, {'wght': w, **extra}, inplace=False)
        inst.flavor = None
        name = f"{fam}-{w}{'-italic' if style == 'italic' else ''}.ttf"
        inst.save(os.path.join(OUT, name))
        print('wrote', name, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')
