#!/usr/bin/env bash
# Renders every holiday creative from template.html with headless Chrome.
# Usage (from repo root): bash marketing/holiday-2026/render.sh
# Requires Google Chrome and Python 3 with Pillow (for PNG -> JPG).
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p out

render() { # name size w h
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size="$3,$4" --virtual-time-budget=4000 \
    --screenshot="$HERE/out/$1.png" "file:///$HERE/template.html?size=$2" >/dev/null 2>&1
  echo "rendered $1 ($3x$4)"
}

render instagram-feed-1080x1080     feed      1080 1080
render instagram-facebook-4x5-1080x1350 portrait 1080 1350
render story-1080x1920              story     1080 1920
render facebook-link-1200x630       landscape 1200 630
render og-default                   og-default 1200 630
render og-designer                  og-designer 1200 630
render first-chimney-holiday-coupon coupon 1080 1500
