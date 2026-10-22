import json,re
from pathlib import Path
from html import unescape
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parent;REPO=ROOT.parents[1]
records=json.loads((REPO/'docs/photo-selection-2026-10-14.json').read_text())
missing=set();pages=0
for page in (REPO/'out').rglob('*.html'):
    pages+=1
    for tag in re.findall(r'<img\b[^>]*>',page.read_text(encoding='utf-8')):
        for name in ['src','srcSet']:
            match=re.search(r'\b'+name+r'="([^"]*)"',tag,re.I)
            if not match:continue
            for src in [s.strip().split(' ')[0] for s in unescape(match[1]).split(',')]:
                if src.startswith('/') and not (REPO/'out'/src.lstrip('/')).is_file():missing.add(src)
assert not missing,missing
hero=(REPO/'out/index.html').read_text(encoding='utf-8')
assert '/home/who-we-are.webp' in hero
assert '1HBvbjQitxALSxMpRR8-1G72A2VWA2zek' not in hero
assert 'google.com/thumbnail' not in hero
report={'htmlPagesChecked':pages,'missingImages':list(missing),'selectedAssets':len(records),'uniqueSourceFrames':len({x['key'] for x in records}),'browserVisualCheck':'not run: local-preview access declined','heroVideo':'unchanged'}
(ROOT/'application-checks.json').write_text(json.dumps(report,indent=2))
# CSS framing simulations only, not browser screenshots or final retouched photos.
im=Image.open(REPO/'public/home/who-we-are.webp').convert('RGB')
canvas=Image.new('RGB',(1440,900),'#0a0a0a');canvas.paste(ImageOps.fit(im,(1440,900),centering=(.5,.5)))
canvas.save(ROOT/'after-hero-desktop-crop.jpg',quality=95)
ImageOps.fit(im,(400,750),centering=(.75,.5)).save(ROOT/'after-hero-phone-crop.jpg',quality=95)
print(json.dumps(report))
