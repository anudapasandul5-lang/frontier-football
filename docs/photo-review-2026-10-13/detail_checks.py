import json
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from review import ROOT,save
items=json.loads((ROOT/'original-checks.json').read_text())
local=json.loads((ROOT/'local-inventory.json').read_text())['items']
keys=['L0010','L0089','L0119','L0217','L0248','L0717','L1048','L1246','L1247','L2080','L2125','L2189','L1978','L1979']
items += [x for x in local if x['key'] in keys]
out=ROOT/'quality';out.mkdir(exist_ok=True)
results=[]
for i,item in enumerate(items):
    with Image.open(item['path']) as im:
        im=ImageOps.exif_transpose(im).convert('RGB');w,h=im.size
        # Diagnostic detail samples remain at 1:1, without noise removal or sharpening.
        panel=Image.new('RGB',(1400,570),'#191919');d=ImageDraw.Draw(panel)
        d.text((12,10),f"{item['key']} {item['name']} | {w} x {h}",fill='white')
        small=ImageOps.contain(im,(960,520));panel.paste(small,((970-small.width)//2,42+(520-small.height)//2))
        cx=int(w*.5);cy=int(h*.38);left=max(0,min(w-420,cx-210));top=max(0,min(h-420,cy-210))
        detail=im.crop((left,top,left+420,top+420));panel.paste(detail,(976,85))
        d.text((980,48),'100% source detail (no retouching)',fill='white')
        panel.save(out/(item['key']+'.jpg'),quality=98)
        dst=ROOT/'full-previews'/(item['key']+'.jpg');thumb=ImageOps.contain(im,(1800,1800));thumb.save(dst,quality=96)
        results.append(dict(item,w=w,h=h,preview=str(dst),quality=str(out/(item['key']+'.jpg'))))
save(results,'quality-inventory.json')
for offset in range(0,len(results),3):
    canvas=Image.new('RGB',(1400,1710),'#191919')
    for n,item in enumerate(results[offset:offset+3]):
        with Image.open(item['quality']) as p:canvas.paste(p,(0,n*570))
    canvas.save(out/f'checks-{offset//3+1:02}.jpg',quality=97)
print('Quality panels',len(results))
