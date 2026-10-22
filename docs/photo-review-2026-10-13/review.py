import argparse, concurrent.futures, hashlib, json, re, time
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import requests

ROOT = Path(__file__).resolve().parent
THUMBS = ROOT / 'thumbs'
SHEETS = ROOT / 'sheets'
for p in (THUMBS, SHEETS): p.mkdir(parents=True, exist_ok=True)

def save(data, name):
    (ROOT / name).write_text(json.dumps(data, indent=2), encoding='utf-8')

def sheet(items, group):
    for offset in range(0, len(items), 64):
        batch=items[offset:offset+64]
        canvas=Image.new('RGB',(1920,8*178+42),'#161616')
        d=ImageDraw.Draw(canvas); d.text((10,10),f'{group} | {offset+1}-{offset+len(batch)}',fill='white')
        for n,item in enumerate(batch):
            x=(n%8)*240; y=(n//8)*178+42
            try:
                with Image.open(item['thumb']) as im:
                    im=ImageOps.contain(im.convert('RGB'),(234,150))
                    canvas.paste(im,(x+(240-im.width)//2,y+(150-im.height)//2))
            except Exception: d.text((x+4,y+50),'UNREADABLE',fill='red')
            d.text((x+4,y+152),f"{item['key']} {item.get('name','')[:22]}",fill='white')
        canvas.save(SHEETS / f'{group}-{offset//64+1:02}.jpg',quality=92)

def local():
    source=Path('D:/Frontier Football')
    paths=sorted(p for p in source.rglob('*') if p.suffix.lower() in ('.jpg','.jpeg','.png'))
    # Identical names and byte lengths are candidate duplicates; compare hashes before excluding.
    buckets={}
    for p in paths: buckets.setdefault((p.name,p.stat().st_size),[]).append(p)
    selected=[]; duplicates=[]
    for bucket in buckets.values():
        seen={}
        for p in bucket:
            digest=hashlib.md5(p.read_bytes()).hexdigest() if len(bucket)>1 else None
            if digest and digest in seen: duplicates.append({'path':str(p),'sameAs':str(seen[digest])});continue
            if digest: seen[digest]=p
            selected.append(p)
    items=[]; errors=[]
    for n,p in enumerate(sorted(selected),1):
        key=f'L{n:04}'; dst=THUMBS/f'{key}.jpg'
        try:
            with Image.open(p) as im:
                w,h=im.size; ex=im.getexif()
                iso=ex.get(34855); dt=ex.get(36867)
                im.draft('RGB',(600,600)); im=ImageOps.exif_transpose(im)
                im.thumbnail((480,480)); im.convert('RGB').save(dst,quality=90)
            rel=p.relative_to(source);parts=rel.parts
            group='disk-'+('-'.join(parts[:2]) if parts[0]=='4 x 4 Series 2026' else parts[0])
            group=re.sub(r'[^a-zA-Z0-9-]','-',group)
            items.append({'key':key,'name':p.name,'path':str(p),'thumb':str(dst),'w':w,'h':h,'iso':iso,'date':dt,'group':group})
        except Exception as e: errors.append({'key':key,'path':str(p),'error':str(e)})
        if n%200==0: print('disk',n,'/',len(selected),flush=True)
    save({'items':items,'errors':errors,'duplicates':duplicates,'raw':len(paths)},'local-inventory.json')
    groups={}
    for i in items: groups.setdefault(i['group'],[]).append(i)
    for group,its in groups.items(): sheet(its,group)
    print('disk completed',len(items),'readable',len(errors),'unreadable',len(duplicates),'duplicates',flush=True)

def drive():
    files=json.loads((ROOT/'drive-inventory.json').read_text(encoding='utf-8'))['files']
    files += json.loads((ROOT/'extra-drive-inventory.json').read_text(encoding='utf-8'))['files']
    # Disk SZN2/4 and UCL originals are reviewed separately; still include all Drive versions.
    files=[f for f in files if f.get('mimeType','').startswith('image/')]
    def fetch(pair):
        n,f=pair; key=f'D{n:04}';dst=THUMBS/f'{key}.jpg'
        item={'key':key, 'id':f['id'],'name':f['name'],'album':f['album'],'group':'drive-'+f['album'],'w':f.get('imageMediaMetadata',{}).get('width'),'h':f.get('imageMediaMetadata',{}).get('height'),'thumb':str(dst),'size':f.get('size'),'source':f"https://drive.google.com/file/d/{f['id']}/view"}
        try:
            if not dst.exists():
                url=f.get('thumbnailLink') or f"https://drive.google.com/thumbnail?id={f['id']}&sz=w400"
                url=re.sub(r'=s\d+$','=s400',url)
                for attempt in range(3):
                    r=requests.get(url,timeout=35)
                    if r.ok: break
                    time.sleep(2+attempt)
                r.raise_for_status(); dst.write_bytes(r.content)
            with Image.open(dst) as im: im.verify()
            return item,None
        except Exception as e: return item, str(e)
    items=[];errors=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as pool:
        for n,(item,error) in enumerate(pool.map(fetch,enumerate(files,1)),1):
            if error: errors.append(dict(item,error=error))
            else: items.append(item)
            if n%200==0:
                print('drive',n,'/',len(files),flush=True)
                save({'items':items,'errors':errors,'raw':len(files)},'drive-review.json')
                groups={}
                for i in items: groups.setdefault(i['group'],[]).append(i)
                for group,its in groups.items(): sheet(its,group)
    save({'items':items,'errors':errors,'raw':len(files)},'drive-review.json')
    groups={}
    for i in items: groups.setdefault(i['group'],[]).append(i)
    for group,its in groups.items(): sheet(its,group)
    print('drive completed',len(items),'readable',len(errors),'failures',flush=True)

def current():
    repo=ROOT.parent.parent
    items=[]
    for folder in ('home','heroes','who','pages','champions','gallery/cover'):
        for p in sorted((repo/'public'/folder).glob('*.webp')):
            with Image.open(p) as im: w,h=im.size
            items.append({'key':f'C{len(items)+1:03}','name':str(p.relative_to(repo/'public')),'thumb':str(p),'w':w,'h':h})
    save(items,'current-inventory.json');sheet(items,'current')
    print('current',len(items))

if __name__=='__main__':
    mode=argparse.ArgumentParser();mode.add_argument('mode',choices=['local','drive','current']);args=mode.parse_args()
    globals()[args.mode]()
