"""Apply the approved review as local web assets; originals remain untouched."""
import json,re
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[1]
selection=json.loads((ROOT/'selection.json').read_text())
local=json.loads((ROOT/'local-inventory.json').read_text())['items']
drive=json.loads((ROOT/'drive-review.json').read_text())['items']
items={x['key']:x for x in local+drive+json.loads((ROOT/'papare-review.json').read_text())}
for x in json.loads((ROOT/'quality-inventory.json').read_text()):items[x['key']].update(x)
alt={
'L1542':'Players contest the ball in a daylight 4 x 4 Series SZN 4 match',
'L1567':'Players jump for the ball beside the goal at 4 x 4 Series SZN 4',
'L1574':'Two players challenge for the ball beside the fence at 4 x 4 Series SZN 4',
'L1501':'A player in red strikes towards the goalkeeper at 4 x 4 Series SZN 4',
'L1514':'A number 9 player strikes towards the goalkeeper at 4 x 4 Series SZN 4',
'L1156':'Pantera FC players raise the trophy together after 4 x 4 Series SZN 4',
'L1155':'Pantera FC players celebrate with the trophy after 4 x 4 Series SZN 4',
'L1148':'Pantera FC with medals and the SZN 4 trophy beside the pitch',
'L1184':'Four friends smiling together beside the pitch at 4 x 4 Series SZN 4',
'L1181':'Four football friends standing arm in arm beside the SZN 4 pitch',
'L0119':'Players greet their goalkeeper on the pitch at 4 x 4 Series SZN 2',
'L0089':'Players pose together with medals and a trophy at 4 x 4 Series SZN 2',
'L0010':'4 x 4 Series SZN 2 trophies and medals arranged on a table',
'L0717':'A goalkeeper reaches towards the ball at 4 x 4 Series SZN 2',
'L1048':'Partner prize boxes and a trophy at 4 x 4 Series SZN 4',
'L1979':'Turf Wars players and organisers together with a trophy at Club Fusion',
'L1978':'Turf Wars players receive a trophy at Club Fusion',
'L2080':'Two supporters embrace during the Champions League final watch party',
'L2125':'A supporter claps while watching the Champions League final',
'L2189':'Hype cans beside Frontier and Main Sports Bar cards at the UCL final watch party',
'D0326':'Players challenge for the ball in the afternoon sun at 4 x 4 Series SZN 1',
'D0331':'Three players chase the ball beside the goal at 4 x 4 Series SZN 1',
'D0366':'Players contest a header at 4 x 4 Series SZN 1',
'D1558':'Ramadan FC with medals and the 4 x 4 Series SZN 3 trophy',
'D1564':'Ramadan FC pose with the trophy after 4 x 4 Series SZN 3',
'D1864':'Two players challenge for the ball in daylight at 4 x 4 Series SZN 3',
'D1601':'Players close in on the ball at 4 x 4 Series SZN 3',
'D2876':'Spain players lift the trophy after 4 x 4 Series SZN 6',
'D2908':'Spain players with medals and the SZN 6 trophy',
'D2887':'Players contest the ball near the goal at 4 x 4 Series SZN 6',
'D2929':'SZN 6 trophies, medals and partner prize boxes arranged on a table',
'D3078':'Two Division 0 players holding controllers during a match at Pixels N Pints',
'D3079':'Division 0 players seated with controllers at Pixels N Pints',
'D3094':'Division 0 players watch the screen with controllers in hand',
'D3113':'Players and friends gather around a Division 0 console match',
'D3097':'The Pixels N Pints entrance, venue partner for Division 0',
'D3207':'Argentina supporters holding flags at the World Cup final watch party',
'D3143':'A group of supporters around a table with Argentina flags at the World Cup final watch party',
'D3238':'Supporters watching the World Cup final together at Main Sports Bar',
'D3567':'Supporters smiling and celebrating at the England v Argentina watch party',
'D3414':'A supporter raises both arms at the England v Argentina watch party',
'D3487':'A room of supporters watching the England v Argentina match',
'D3607':'Four friends smiling together at the Spain v France watch party',
'D3580':'A crowded Frontier Spain v France watch party at Main Sports Bar',
'D3604':'The Main Sports Bar entrance and crowd at the Spain v France watch party',
'D3629':'An England supporter celebrates with both arms raised at the Norway v England watch party',
'D3640':'An England supporter smiles with an arm raised at the Norway v England watch party',
'D3732':'Supporters watching the Norway v England match around a table',
'P0173':'Players lift a trophy together after 4 x 4 Series SZN 5; photograph by ThePapare',
'P0227':'Players pose with medals and a trophy after 4 x 4 Series SZN 5; photograph by ThePapare',
}
assets={
'/home/who-we-are.webp':'L1542',
'/home/moment-crowd.webp':'L1184', # clean community frame for the full-screen motion, instead of noisy crowd enlargement
'/home/moment-celebration.webp':'L1156','/home/moment-duel.webp':'D0326',
'/home/moment-strike.webp':'L1501','/home/moment-hands.webp':'L1181',
'/home/moment-flags.webp':'D3207','/home/moment-night.webp':'L1574',
'/who/szn6-scramble.webp':'L1184','/who/division-0-crowd.webp':'D3113','/who/norway-england-fan.webp':'D3629',
'/heroes/who.webp':'L1184','/heroes/events.webp':'L1574','/heroes/community.webp':'L1156',
'/heroes/contact.webp':'L1181','/heroes/collaborate.webp':'L1048',
'/heroes/gallery.webp':'L1184',
'/pages/community-team.webp':'L1184','/pages/community-final-table.webp':'D3143','/pages/community-division-0.webp':'D3078',
'/pages/events-strike.webp':'L1501','/pages/events-keeper.webp':'L1514','/pages/events-day-match.webp':'L1574',
'/pages/contact-cheer.webp':'L1156','/pages/contact-trophies.webp':'L0010','/pages/contact-watching.webp':'D3732',
'/pages/collab-venue.webp':'D3097','/pages/collab-bar-crowd.webp':'D3580','/pages/collab-celebration.webp':'L2080',
'/pages/collab-partner-can.webp':'L2189','/pages/collab-prizes.webp':'L1048','/pages/collab-community.webp':'L1184',
'/pages/division-0-screen.webp':'D3094','/pages/division-0-players.webp':'D3079',
'/pages/competition-4x4.webp':'L1574','/pages/competition-division-0.webp':'D3078',
'/champions/szn-1.webp':'D0326','/champions/szn-2.webp':'L0119','/champions/szn-3.webp':'D1558',
'/champions/szn-4.webp':'L1156','/champions/szn-6.webp':'D2876','/champions/turf-wars.webp':'L1979',
'/champions/division-0.webp':'D3078','/champions/wa-final-esp-arg.webp':'D3207',
'/champions/wa-semi-eng-arg.webp':'D3567','/champions/wa-semi-esp-fra.webp':'D3607',
'/champions/wa-norway-england.webp':'D3629','/champions/wa-ucl-final-night.webp':'L2080',
'/gallery/szn-5-hero.webp':'P0173'}
records=[]
def export(key,src,width=1600):
    item=items[key];out=REPO/'public'/src.lstrip('/');out.parent.mkdir(parents=True,exist_ok=True)
    assert Path(item['path']).is_file(),key
    with Image.open(item['path']) as source:
        source=ImageOps.exif_transpose(source).convert('RGB');im=ImageOps.contain(source,(min(width,source.width),min(width,source.height)))
        im.save(out,format='WEBP',quality=88,method=6)
        for w in [800,1200]:
            if w<im.width:
                ImageOps.contain(im,(w,10000)).save(out.with_name(out.stem+f'-{w}.webp'),format='WEBP',quality=84,method=6)
        dim=(im.width,im.height)
    records.append(dict(key=key,src=src,source=item['path'],driveId=item.get('id'),w=dim[0],h=dim[1],alt=alt.get(key,f"Frontier Football {item['name']}")))
    return dim
for src,key in assets.items():export(key,src,2400 if src.startswith('/heroes/') or src=='/home/who-we-are.webp' else 1600)
by_src={x['src']:x for x in records}

# Accurate alt text in every static caller. Split the different brand/home uses first.
p=REPO/'app/collaborate/page.tsx';text=p.read_text(encoding='utf-8').replace('/home/moment-celebration.webp','/pages/collab-celebration.webp');p.write_text(text,encoding='utf-8')
p=REPO/'content.js';text=p.read_text(encoding='utf-8')
text=text.replace('photo: "/home/moment-flags.webp"','photo: "/pages/collab-community.webp"')
text=text.replace('photo: "/pages/contact-trophies.webp"','photo: "/pages/collab-prizes.webp"')
text=text.replace('src: "https://drive.google.com/thumbnail?id=12p617pNQRoxt3Ae0DsPqI1UMWX6dHeND&sz=w1200"','src: "/pages/division-0-screen.webp"')
text=text.replace('src: "https://drive.google.com/thumbnail?id=1JySS8J-819N82HC7EiALOFOttBQ1uNul&sz=w1200"','src: "/pages/division-0-players.webp"')
text=text.replace('photo: "/gallery/szn-5-hero.webp",','photo: "/gallery/szn-5-hero.webp",\n      photoCredit: "ThePapare",')
text=re.sub(r'      // Clean frame at 24s.*?      photo:','      // Photos-only selection, 2026-10-14: credited SZN5 trophy photograph.\n      photo:',text,flags=re.S)
p.write_text(text,encoding='utf-8')
for p in list((REPO/'app').rglob('*.tsx'))+[REPO/'content.js']:
    text=p.read_text(encoding='utf-8');old=text
    for src,record in by_src.items():
        # Literal object pairs, including PageHero photos; no content/event facts are changed.
        for label in ['alt','photoAlt']:
            pattern=r'((?:src|photo): "'+re.escape(src)+r'",\s*'+label+r': ")[^"]*(")'
            text=re.sub(pattern,lambda m:m[1]+record['alt']+m[2],text)
        # photoCredit is between photo and photoAlt on SZN5.
        text=re.sub(r'(photo: "'+re.escape(src)+r'",\s*photoCredit: "ThePapare",\s*photoAlt: ")[^"]*(")',lambda m:m[1]+record['alt']+m[2],text)
    if text!=old:p.write_text(text,encoding='utf-8')

# Plain static data, preserving the existing HomePhoto interface.
home='''/* Reviewed camera originals, 2026-10-14. Local exports preserve complete frames;
   sourceUrl records provenance. The home hero is reserved for video. */
export type HomePhoto = { id: string; src: string; sourceUrl: string; w: number; h: number; alt: string };
'''
def home_data(src):
    x=by_src[src];key=x['key'];source=items[key]
    return dict(id=key,src=src,sourceUrl=f"https://drive.google.com/file/d/{source['id']}/view" if source.get('id') else '',w=x['w'],h=x['h'],alt=x['alt'])
home+='export const marqueePhotos: HomePhoto[] = '+json.dumps([home_data('/home/moment-'+n+'.webp') for n in ['celebration','duel','strike','hands','flags','night']],indent=2)+';\n'
home+='export const statementPhoto: HomePhoto = '+json.dumps(home_data('/home/moment-crowd.webp'),indent=2)+';\n'
home+='export const competitionPhotos = '+json.dumps({name:home_data(src) for name,src in [('4 x 4 Series','/pages/competition-4x4.webp'),('Division 0','/pages/competition-division-0.webp')]},indent=2)+';\n'
(REPO/'lib/home-photos.ts').write_text(home,encoding='utf-8')

# ThePapare albums keep their credited archive layout; the selected SZN5 still replaces only its prior video frame.
sets={a:ks for a,ks in selection['highlights'].items() if a not in ['frontier-futsal','szn-5','turf-wars']}
hs={}
def normal(name):return re.sub(r'[^0-9a-z]','',Path(name).stem.lower())
for album,keys in sets.items():
    manifest=json.loads((REPO/'public/albums'/f'{album}.json').read_text())['items'];hs[album]=[]
    for key in keys:
        item=items[key];id=item.get('id')
        if not id:
            matches=[x for x in drive if x.get('album')==album and normal(x['name'])==normal(item['name'])]
            assert matches,(album,key,item['name'])
            id=matches[0]['id']
        n=next(i+1 for i,x in enumerate(manifest) if x['i']==id)
        src=f'/gallery/highlights/{album}/{n}.webp';w,h=export(key,src)
        hs[album].append(dict(n=n,id=id,src=src,w=w,h=h,alt=alt[key]))
    export(keys[0],f'/gallery/cover/{album}.webp',800)
reel=[]
for album in ['szn-6','wa-final-esp-arg','szn-1','wa-semi-eng-arg','szn-4','wa-norway-england','szn-3','wa-ucl-final-night','szn-2','division-0']:
    f=hs[album][0];key=sets[album][0];src=f"/gallery/reel/{album}-{f['n']}.webp"
    # A compact reel copy, no enlargement beyond the reviewed source.
    w,h=export(key,src,round(420*f['w']/f['h']))
    reel.append(dict(src=src,w=w,h=h,alt=f['alt'],albumId=album))
p=REPO/'lib/highlights.ts';text=p.read_text(encoding='utf-8');tail=text[text.index('/* The picture an album card'):]
text='/* Reviewed featured photos, 2026-10-14. Original album positions/Drive IDs remain provenance. */\nexport type Highlight = { n: number; id: string; src: string; w: number; h: number; alt: string };\n'
text+='export const highlights: Record<string, Highlight[]> = '+json.dumps(hs,indent=2)+';\n'
text+='export type ReelFrame = { src: string; w: number; h: number; alt: string; albumId: string | null };\n'
text+='export const reel: ReelFrame[] = '+json.dumps(reel,indent=2)+';\n'+tail
p.write_text(text,encoding='utf-8')
(ROOT/'applied-assets.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
assert all((REPO/'public'/x['src'].lstrip('/')).exists() for x in records)
print('Exported',len(records),'page, highlight, cover and reel assets')
