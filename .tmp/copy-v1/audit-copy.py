from pathlib import Path
import fitz, json, re

out=Path('.tmp/copy-v1/pages')
pdf=fitz.open(r'C:\Users\anuda\Downloads\Frontier_Football_Website_Copy.pdf')
page_names={2:'home',3:'home',4:'home',5:'who-we-are',6:'who-we-are',7:'events',8:'events',9:'community',10:'community',11:'collaborate',12:'collaborate',13:'collaborate',14:'contact',15:'gallery',16:'404',17:'metadata'}
exclude=('VISUAL DIRECTION','SCROLL BEHAVIOUR','BUTTON BEHAVIOUR','WHAT SHOWS HERE','HALL OF FAME REFERENCE','STICKER FRAME REFERENCE','SCRAPBOOK LAYOUT','SUB PAGE OPENED','SEASON ','SUNDAY LEAGUE SIGN-UP WORDING','FILM STRIP REFERENCE','ROLLS LEFT','MENU ITEMS','MENU OPEN','MENU CLOSE')
def norm(s):
    return re.sub(r'\s+',' ',s.replace('’',"'").replace('‘',"'")).strip().casefold()
blocks=[]
for i,name in page_names.items():
    label=None; lines=[]
    def flush():
        if label and lines and not label.startswith(exclude):
            text=' '.join(lines).replace('Three years in','Two years in')
            blocks.append({'page':name,'sourcePage':i+1,'placement':label,'text':text})
    for b in pdf[i].get_text('dict')['blocks']:
        if 'lines' not in b: continue
        for l in b['lines']:
            for s in l['spans']:
                if s['color']==0xe97404:
                    flush(); label=s['text']; lines=[]
                elif s['color']==0x305552 or (s['color']==0xffffff and s['size']>=17):
                    flush(); label=None; lines=[]
                elif label and s['text'].strip()!='photo' and s['size']>7.5 and s['color'] in (0xc2037,0xfaba2a):
                    lines.append(s['text'])
    flush()

records=json.loads((out/'browser-audit.json').read_text(encoding='utf-8'))
results=[]
for block in blocks:
    for width in (1440,400):
        record=next(r for r in records if r['name']==('home' if block['page']=='metadata' else block['page']) and r['width']==width)
        actual=(record['description'] if block['placement']=='DESCRIPTION' and block['page']=='metadata' else record['text'])
        matched=norm(block['text']) in norm(actual)
        conditional=block['page']=='events' and block['text'] in ['Our events','Watch parties, game nights, community sessions and our football events. See what is coming up and be there.']
        results.append({**block,'width':width,'matched':matched,'conditional':conditional})
        if not matched: print(('CONDITIONAL' if conditional else 'MISMATCH')+': '+str(width)+' '+block['page']+' '+block['placement']+' '+block['text'])
(out/'pdf-copy-audit.json').write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding='utf-8')
print(f'{len(blocks)} source blocks checked at both widths; {sum(x["matched"] for x in results)} matched; {sum(not x["matched"] and x["conditional"] for x in results)} conditional; {sum(not x["matched"] and not x["conditional"] for x in results)} mismatched')
