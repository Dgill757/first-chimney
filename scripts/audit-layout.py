"""Flag near-empty pages (orphans) and text running into the page edge. python scripts/audit-layout.py file.pdf [...]"""
import sys

import pymupdf

for path in sys.argv[1:]:
    d = pymupdf.open(path)
    out = []
    for i, p in enumerate(d):
        H, W = p.rect.height, p.rect.width
        body = [b for b in p.get_text('blocks') if b[1] < H - 52 and b[3] > 40 and b[4].strip()]  # ignore header/footer bands
        if not body:
            out.append((i + 1, 'EMPTY'))
            continue
        low = max(b[3] for b in body)
        top = min(b[1] for b in body)
        filled = (low - 50) / (H - 100)
        edge = [b for b in body if b[0] < 20 or b[2] > W - 20]
        if filled < 0.30 and i > 0:
            out.append((i + 1, f'sparse {filled:.0%} filled'))
        if edge:
            out.append((i + 1, f'text within 20pt of edge: {edge[0][4][:30]!r}'))
    print(f'== {path.split(chr(92))[-1].split("/")[-1]}: {d.page_count} pages, {len(out)} flags')
    for pg, msg in out:
        print(f'   p{pg}: {msg}')
