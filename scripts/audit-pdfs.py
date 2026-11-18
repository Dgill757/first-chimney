"""Print-readiness audit for every PDF in the repo (run from repo root: python scripts/audit-pdfs.py).

Fails (exit 1) if any PDF has:
  - Type 3 fonts (many printers draw them as dots / unreadable "hieroglyphics")
  - non-embedded fonts
  - leftover hidden build markers (@@...@@)
Also reports tiny text (< 5.5 pt) so it can be reviewed.
"""
import collections
import glob
import os
import sys

import pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
files = [
    f
    for f in glob.glob('**/*.pdf', recursive=True)
    if 'node_modules' not in f and not f.replace('\\', '/').startswith('dist/') and '_inputs' not in f
]
failed = False
for f in sorted(files):
    d = pymupdf.open(f)
    kinds = collections.Counter()
    unembedded = 0
    tiny = []
    hidden = []
    for i, p in enumerate(d):
        for x in p.get_fonts(full=True):
            kinds[x[2]] += 1
            if not x[3] and x[2] != 'Type3':
                unembedded += 1
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    t = s['text'].strip()
                    if t and s['size'] < 5.5:
                        tiny.append((i + 1, round(s['size'], 1), t[:24]))
                    if '@@' in t:
                        hidden.append((i + 1, t[:24]))
    ok = 'Type3' not in kinds and not hidden and unembedded == 0
    failed |= not ok
    print(('OK  ' if ok else 'FAIL'), os.path.basename(f)[:52].ljust(52), f'{d.page_count:>3}pp', dict(kinds), 'tiny:', len(tiny), tiny[:2], 'hidden:', hidden[:2])
sys.exit(1 if failed else 0)
