#!/usr/bin/env bash
# Render the owner's manual and team handbook to PDF with headless Chrome, then compress photos.
set -e
cd "$(dirname "$0")"
python build-handbook.py
CHROME="${CHROME_PATH:-C:/Program Files/Google/Chrome/Application/chrome.exe}"
DIR="$(pwd -W 2>/dev/null || pwd)"
for pair in "manual.html:First-Chimney-Owners-Operating-Manual.pdf" "team-handbook.html:First-Chimney-Team-Handbook.pdf"; do
  src="${pair%%:*}"; out="${pair##*:}"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --allow-file-access-from-files --virtual-time-budget=8000 --print-to-pdf="$DIR/$out" "file:///$DIR/$src" 2>/dev/null
done
python ../../scripts/compress-pdf.py First-Chimney-Owners-Operating-Manual.pdf First-Chimney-Team-Handbook.pdf || echo "compression skipped"
