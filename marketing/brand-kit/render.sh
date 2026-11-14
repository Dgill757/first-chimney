#!/usr/bin/env bash
# Renders print-ready merch artwork (transparent PNG where it matters).
# Usage from repo root: bash marketing/brand-kit/render.sh
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p print
r() { # item w h
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --default-background-color=00000000 \
    --force-device-scale-factor=1 --window-size="$2,$3" --virtual-time-budget=4000 \
    --screenshot="$HERE/print/$1.png" "file:///$HERE/template.html?item=$1" >/dev/null 2>&1
  echo "print/$1.png ($2x$3)"
}
r hoodie-back 3000 3600
r hoodie-front-chest 1200 700
r beanie-patch 1500 900
r truck-magnet-24x12 3600 1800
r business-card-front 1125 675
r business-card-back 1125 675
