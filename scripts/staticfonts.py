"""@font-face CSS for the static Archivo/Geist TTFs (see make-static-fonts.py)."""
import base64
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(ROOT, 'public', 'fonts', 'static')

FACES = [
    ('Archivo', 'normal', [400, 500, 600, 700, 800, 900]),
    ('Archivo', 'italic', [400, 600, 700]),
    ('Geist', 'normal', [400, 500, 600, 700]),
]


def font_face_css(embed=True, base_url=None):
    """embed=True inlines base64 data URIs (self-contained HTML). Otherwise use base_url + filename."""
    out = []
    for fam, style, weights in FACES:
        for w in weights:
            fn = f"{fam}-{w}{'-italic' if style == 'italic' else ''}.ttf"
            if embed:
                with open(os.path.join(STATIC, fn), 'rb') as fh:
                    src = 'data:font/ttf;base64,' + base64.b64encode(fh.read()).decode()
            else:
                src = f"{base_url.rstrip('/')}/{fn}"
            out.append(f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{w};src:url('{src}') format('truetype');}}")
    return '\n'.join(out)
