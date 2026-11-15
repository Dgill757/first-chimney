"""Shrink photos inside PDFs printed by Chrome. Usage: python scripts/compress-pdf.py file.pdf [...]"""
import os
import sys

import pymupdf

for path in sys.argv[1:]:
    doc = pymupdf.open(path)
    doc.rewrite_images(dpi_threshold=160, dpi_target=150, quality=72)
    tmp = path + ".tmp"
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    os.replace(tmp, path)
    print(f"compressed {os.path.basename(path)}: {os.path.getsize(path) / 1e6:.2f} MB")
