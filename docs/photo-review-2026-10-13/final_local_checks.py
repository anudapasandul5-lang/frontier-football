import json
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from review import ROOT
allitems=json.loads((ROOT/'local-inventory.json').read_text())['items']
keys=['L1542','L1567','L1574','L1184','L1181','L1155','L1156','L1148','L1231','L1225','L1213','L1501','L1514']
items=[x for x in allitems if x['key'] in keys]
for item in items:
    with Image.open(item['path']) as im:
        im=ImageOps.exif_transpose(im).convert('RGB')
        ImageOps.contain(im,(1800,1800)).save(ROOT/'full-previews'/f"{item['key']}.jpg",quality=96)
        panel=Image.new('RGB',(1400,570),'#191919');d=ImageDraw.Draw(panel)
        d.text((10,10),f"{item['key']} {item['name']} {im.width} x {im.height}",fill='white')
        p=ImageOps.contain(im,(950,520));panel.paste(p,(10,40))
        # centre action detail, actual source pixels
        cx=int(im.width*.52);cy=int(im.height*.42)
        panel.paste(im.crop((cx-210,cy-210,cx+210,cy+210)),(976,85))
        panel.save(ROOT/'quality'/f"{item['key']}.jpg",quality=98)
for off in range(0,len(items),3):
    canvas=Image.new('RGB',(1400,1710),'#191919')
    for n,item in enumerate(items[off:off+3]):
        with Image.open(ROOT/'quality'/f"{item['key']}.jpg") as im:canvas.paste(im,(0,n*570))
    canvas.save(ROOT/'quality'/f'final-local-{off//3+1}.jpg',quality=97)
print('Checked',len(items))
