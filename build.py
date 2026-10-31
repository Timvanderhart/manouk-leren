#!/usr/bin/env python3
"""Bouwt twee versies: een fragment voor de Claude-artifact en een volledige index.html voor hosting."""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
TITLE = "Manouks GVR-trainer"
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400'
         '&family=IBM+Plex+Mono:wght@400;500&family=Young+Serif&display=swap">')

css = (SRC / "styles.css").read_text(encoding="utf-8")
body = (SRC / "body.html").read_text(encoding="utf-8")
data = "\n".join((SRC / "data" / f).read_text(encoding="utf-8") for f in ["meta.js", "flashcards.js", "mc.js", "open.js", "sprint.js"])
app = (SRC / "app.js").read_text(encoding="utf-8")

inner = f"{body}\n<script>\n{data}\n</script>\n<script>\n{app}\n</script>\n"

# 1. Artifact-fragment (skeleton wordt bij publiceren toegevoegd)
frag = (f'<title>{TITLE}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
        f'{FONTS}\n<style>\n{css}\n</style>\n{inner}')
(ROOT / "dist" / "artifact").mkdir(parents=True, exist_ok=True)
(ROOT / "dist" / "artifact" / "manouk-gvr.html").write_text(frag, encoding="utf-8")

# 2. Losse website
site_reset = (":root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
              "img{max-width:100%}[hidden]{display:none!important}")
full = (f'<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
        f'<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        f'<title>{TITLE}</title>\n<meta name="robots" content="noindex">\n'
        f'<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2232%22 fill=%22%23bf3f6c%22/%3E%3Ctext x=%2232%22 y=%2244%22 font-size=%2236%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22Georgia%22%3E%C2%A7%3C/text%3E%3C/svg%3E">\n'
        f'{FONTS}\n<style>\n{site_reset}\n{css}\n</style>\n</head>\n<body>\n{inner}</body>\n</html>\n')
(ROOT / "dist" / "site").mkdir(parents=True, exist_ok=True)
(ROOT / "dist" / "site" / "index.html").write_text(full, encoding="utf-8")
print("ok", len(frag), len(full))
