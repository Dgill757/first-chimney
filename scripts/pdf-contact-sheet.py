"""Make contact sheets from a PDF: python scripts/pdf-contact-sheet.py file.pdf out_prefix [per_sheet=8] [cols=4] [width=470]"""
import sys

import pymupdf
from PIL import Image

path, prefix = sys.argv[1], sys.argv[2]
per = int(sys.argv[3]) if len(sys.argv) > 3 else 8
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
w = int(sys.argv[5]) if len(sys.argv) > 5 else 470
d = pymupdf.open(path)
n = d.page_count
for s in range(0, n, per):
    imgs = []
    for i in range(s, min(s + per, n)):
        pix = d[i].get_pixmap(dpi=int(w / 8.5 * 1.0 * 1.0) or 55)
        im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        imgs.append(im)
    h = max(i.height for i in imgs)
    rows = (len(imgs) + cols - 1) // cols
    S = Image.new('RGB', (cols * (w + 8), rows * (h + 8)), (120, 120, 120))
    for k, im in enumerate(imgs):
        S.paste(im, ((k % cols) * (w + 8) + 4, (k // cols) * (h + 8) + 4))
    out = f'{prefix}{s // per + 1:02d}.jpg'
    S.save(out, quality=82)
    print(out, f'pages {s + 1}-{min(s + per, n)}')
