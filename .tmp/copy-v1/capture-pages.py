import json, subprocess, time, sys
from pathlib import Path

root=Path.cwd()
out=root/'.tmp/copy-v1/pages'
out.mkdir(parents=True,exist_ok=True)
session='frontier-copy-qa'
def run(*args):
    p=subprocess.run(['rtk','proxy','agent-browser','--session',session,*args],capture_output=True,text=True,encoding='utf-8',timeout=60)
    if p.returncode: raise RuntimeError(p.stdout+p.stderr)
    return p.stdout
def evaluate(js):
    return json.loads(run('--json','eval',js))['data']['result']

records=json.loads((out/'browser-audit.json').read_text(encoding='utf-8')) if sys.argv[1:] else []
for width,height in [(1440,1000),(400,844)]:
    run('set','viewport',str(width),str(height))
    for name,path in [('home','/'),('who-we-are','/who-we-are'),('events','/events'),('gallery','/gallery'),('community','/community'),('collaborate','/collaborate'),('contact','/contact'),('404','/copy-ticket-missing-page')]:
        if sys.argv[1:] and name not in sys.argv[1:]: continue
        run('open','http://localhost:4173'+path)
        evaluate('''(async()=>{await document.fonts.ready; for(const i of document.images) {if(i.getBoundingClientRect().width>0)i.loading='eager';} for(let y=0;y<document.body.scrollHeight;y+=innerHeight){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,130));} await Promise.race([Promise.allSettled([...document.images].filter(i=>i.getBoundingClientRect().width>0).map(i=>i.decode())),new Promise(r=>setTimeout(r,3000))]); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,1200)); return true;})()''')
        record=evaluate('''(()=>({url:location.href,width:innerWidth,height:innerHeight,pageHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,description:document.querySelector('meta[name=description]')?.content,ogDescription:document.querySelector('meta[property="og:description"]')?.content,text:document.body.innerText,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&(!i.complete||i.naturalWidth===0)).map(i=>i.currentSrc),headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>e.textContent),links:[...document.querySelectorAll('main a')].map(a=>({text:a.textContent,href:a.getAttribute('href')}))}))()''')
        record.update(name=name)
        records=[r for r in records if (r['name'],r['width'])!=(name,width)]+[record]
        (out/f'{name}-{width}.json').write_text(json.dumps(record,indent=2,ensure_ascii=False),encoding='utf-8')
        (out/f'{name}-{width}.txt').write_text(record['text'],encoding='utf-8')
        run('screenshot','--full',str(out/f'{name}-{width}.png'))
        print(f'{name} {width}: overflow={record["overflow"]}, broken images={len(record["brokenImages"])}, height={record["pageHeight"]}',flush=True)
(out/'browser-audit.json').write_text(json.dumps(records,indent=2,ensure_ascii=False),encoding='utf-8')
