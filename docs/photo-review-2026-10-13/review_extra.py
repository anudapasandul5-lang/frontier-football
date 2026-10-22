import json,base64,gzip,concurrent.futures
from pathlib import Path
import requests
from PIL import Image
from review import ROOT,THUMBS,save,sheet
names={'1wAZE5laQlMY6kzRTkwfTyANlGLvMpvrP':'pick-szn4','1Nr5ZuBh-82emRoeYf0pgbXHWsELbIkZb':'pick-ucl','1gtT-u0RgyXtcS19to1gZTuVkL8PC6Uty':'pick-szn2','1FUfaxcc0dHielxCqVJj5eZG586fpg-yT':'pick-road','1p_xmnnJg3M2zlcsOQCOJwtapUDH7Rv3O':'pick-szn6','1_2FO1y8gBjY4yTHk4XBnvBIRFTYbPxi1':'pick-division0','1gih-t2kIMq7Nx1y7oLlTvf2zrJObRLNW':'pick-turf','1HGXOPq8HVLiX7bg1WXkzT7IJwdeIrpJs':'unconfirmed-4x4'}
files=[]
for n in (0,1):files+=json.loads(gzip.decompress(base64.b64decode((ROOT/f'new-picks-{n}.b64').read_text())))['files']
def fetch(pair):
    n,f=pair;dst=THUMBS/f'E{n:03}.jpg'; key=f'E{n:03}'
    group=names.get(f['parents'][0],'unknown');dim=f.get('imageMediaMetadata',{})
    item={'key':key,'id':f['id'],'name':f['name'],'group':group,'album':group,'w':dim.get('width'),'h':dim.get('height'),'md5':f.get('md5Checksum'),'thumb':str(dst),'source':f"https://drive.google.com/file/d/{f['id']}/view"}
    try:
        if not dst.exists():
            url=f['thumbnailLink'];url=__import__('re').sub(r'=s\d+$','=s400',url)
            r=requests.get(url,timeout=35);r.raise_for_status();dst.write_bytes(r.content)
        with Image.open(dst) as im:im.verify()
        return item
    except Exception as e:return dict(item,error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:items=list(pool.map(fetch,enumerate(files,1)))
save(items,'extra-review.json')
groups={}
for i in items:
    if 'error' not in i:groups.setdefault(i['group'],[]).append(i)
for group,its in groups.items():sheet(its,group)
print(json.dumps({'total':len(items),'errors':[x for x in items if 'error' in x]}))
