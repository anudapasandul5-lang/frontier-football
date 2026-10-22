import concurrent.futures,hashlib,json
from pathlib import Path
import requests
from PIL import Image, ImageOps
from review import ROOT,save,sheet

repo=ROOT.parent.parent
urls=json.loads((repo/'.photo-review-venv/download-urls.json').read_text())
meta={f['id']:f for f in json.loads((ROOT/'drive-inventory.json').read_text())['files']}
out=ROOT/'originals';out.mkdir(exist_ok=True)
previews=ROOT/'full-previews';previews.mkdir(exist_ok=True)
def fetch(f):
    suffix=Path(f['name']).suffix.lower();dst=out/(f['key']+suffix)
    try:
        if not dst.exists():
            r=requests.get(f['url'],timeout=90);r.raise_for_status();dst.write_bytes(r.content)
        digest=hashlib.md5(dst.read_bytes()).hexdigest()
        expected=meta[f['id']].get('md5Checksum')
        if expected and digest!=expected: raise ValueError('Downloaded original checksum mismatch')
        with Image.open(dst) as im:
            w,h=im.size;ex=im.getexif();iso=ex.get(34855)
            im=ImageOps.exif_transpose(im).convert('RGB')
            im.thumbnail((1800,1800));preview=previews/(f['key']+'.jpg');im.save(preview,quality=96)
        return {'key':f['key'],'id':f['id'],'name':f['name'],'path':str(dst),'thumb':str(preview),'w':w,'h':h,'md5':digest,'checksumVerified':bool(expected),'iso':iso}
    except Exception as e: return dict(key=f['key'],error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    result=list(pool.map(fetch,urls))
save(result,'original-checks.json')
good=[x for x in result if 'error' not in x]
sheet(good,'finalists')
print(json.dumps({'verified':len(good),'errors':[x for x in result if 'error' in x]}))
