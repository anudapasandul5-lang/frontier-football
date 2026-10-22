import json
from pathlib import Path
from PIL import Image,ImageOps
from review import ROOT,sheet
repo=ROOT.parents[1]
items=[]
for album in ['frontier-futsal','szn-5']:
    for i,p in enumerate(sorted((repo/'public'/'albums'/album).glob('*.webp'))):
        if p.stem.endswith('-400'):continue
        items.append(dict(key=f'P{len(items)+1:04}',name=p.name,path=str(p),thumb=str(p),group=album))
    sheet([x for x in items if x['group']==album],f'papare-{album}')
(ROOT/'papare-review.json').write_text(json.dumps(items,indent=2))
raw=[]
for p in Path('D:/Frontier Football').rglob('*.ARW'):
    data=p.read_bytes();start=0;candidates=[]
    while True:
        start=data.find(b'\xff\xd8\xff',start)
        if start<0:break
        end=data.find(b'\xff\xd9',start+3)
        if end>=0:
            try:
                import io
                im=Image.open(io.BytesIO(data[start:end+2]));im.load()
                candidates.append((im.width*im.height,im.copy()))
            except Exception:pass
        start+=3
    if candidates:
        im=max(candidates,key=lambda x:x[0])[1];dst=ROOT/'thumbs'/f'RAW{len(raw)+1:02}.jpg'
        ImageOps.contain(im,(1000,1000)).convert('RGB').save(dst,quality=95)
        raw.append(dict(key=f'RAW{len(raw)+1:02}',name=p.name,path=str(p),thumb=str(dst),w=im.width,h=im.height))
sheet(raw,'raw-previews')
(ROOT/'raw-review.json').write_text(json.dumps(raw,indent=2))
print('Third party photos',len(items),'RAW embedded previews',len(raw))
