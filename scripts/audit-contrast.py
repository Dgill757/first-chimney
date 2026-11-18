"""Flag low-contrast text in PDFs (hard to read printed or laminated).

Usage: python scripts/audit-contrast.py file.pdf [...]   (prints spans with contrast ratio < 4.0)
Method: render each page, take the dominant background colour around each text span, compare to the span colour.
"""
import sys
import collections

import pymupdf


def lum(c):
    def f(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = c
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = lum(a), lum(b)
    if la < lb:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)


THRESH = 4.0
for path in sys.argv[1:]:
    d = pymupdf.open(path)
    flagged = collections.OrderedDict()
    for pn, page in enumerate(d):
        pix = page.get_pixmap(dpi=72)
        W, H = pix.width, pix.height
        spans = []
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    if s['text'].strip():
                        spans.append(s)
        for s in spans:
            x0, y0, x1, y1 = [int(round(v)) for v in s['bbox']]
            x0, y0 = max(x0, 0), max(y0, 0)
            x1, y1 = min(x1, W), min(y1, H)
            if x1 - x0 < 2 or y1 - y0 < 2:
                continue
            # background = most common colour in the box; text colour from span
            cnt = collections.Counter()
            for yy in range(y0, y1):
                for xx in range(x0, x1):
                    cnt[tuple(pix.pixel(xx, yy)[:3])] += 1
            bg = cnt.most_common(1)[0][0]
            col = s['color']
            fg = ((col >> 16) & 255, (col >> 8) & 255, col & 255)
            r = ratio(fg, bg)
            if r < THRESH:
                key = (pn + 1, s['text'][:40], '#%02x%02x%02x' % fg, '#%02x%02x%02x' % bg)
                flagged[key] = round(r, 2)
    print(f'== {path}: {len(flagged)} low-contrast spans')
    for (pn, t, fg, bg), r in list(flagged.items())[:25]:
        print(f'   p{pn} ratio {r} fg {fg} on {bg}: {t!r}')
