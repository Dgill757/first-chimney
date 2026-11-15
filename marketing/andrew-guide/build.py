"""Build Andrew's guide: inline fonts and photos into one self-contained HTML, then print it to PDF.

Usage (from this folder):  python build.py
Outputs:
  First-Chimney-Andrews-Guide.html   interactive, works offline, one file
  First-Chimney-Andrews-Guide.pdf    print version (every section open)
"""
import base64, io, os, subprocess, sys
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT_HTML = HERE / 'First-Chimney-Andrews-Guide.html'
OUT_PDF = HERE / 'First-Chimney-Andrews-Guide.pdf'


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def webp_data_uri(path: Path, max_w: int, quality: int = 80) -> str:
    im = Image.open(path)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=quality, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


team = ROOT / 'public/media/team'
tokens = {
    '%%ARCHIVO%%': b64(ROOT / 'public/fonts/archivo.woff2'),
    '%%GEIST%%': b64(ROOT / 'public/fonts/geist.woff2'),
    '%%LOGO%%': webp_data_uri(ROOT / 'public/brand/logo-light.png', 560, 85),
    '%%ANDREW%%': webp_data_uri(team / 'andrew-paterini-owner-portrait.webp', 640, 78),
    '%%TRUCK%%': webp_data_uri(team / 'andrew-paterini-first-chimney-truck.webp', 900, 74),
    '%%JOB1%%': webp_data_uri(team / 'andrew-chimney-crown-repair.webp', 700, 72),
    '%%JOB2%%': webp_data_uri(team / 'chimney-masonry-scaffolding-repair.webp', 700, 72),
}

html = (HERE / 'guide.src.html').read_text(encoding='utf-8')
for k, v in tokens.items():
    html = html.replace(k, v)
missing = [k for k in tokens if k in html]
assert not missing, missing
OUT_HTML.write_text(html, encoding='utf-8')
print(f'HTML  {OUT_HTML.name}  {OUT_HTML.stat().st_size / 1024:.0f} KB')

chrome = os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
if not Path(chrome).exists():
    sys.exit('Chrome not found; set CHROME_PATH to render the PDF.')
url = 'file:///' + str(OUT_HTML).replace('\\', '/') + '?print=1'
subprocess.run(
    [chrome, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
     '--virtual-time-budget=8000', f'--print-to-pdf={OUT_PDF}', url],
    check=True, stderr=subprocess.DEVNULL,
)
print(f'PDF   {OUT_PDF.name}  {OUT_PDF.stat().st_size / 1024:.0f} KB')
