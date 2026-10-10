from pathlib import Path
import json, subprocess, time

folder = Path.cwd() / '.tmp/scrapbook-v1/production'
folder.mkdir(exist_ok=True)
def browser(*args):
    result = subprocess.run(['rtk', 'proxy', 'agent-browser', '--session', 'scrapbook-production', '--json', *args], capture_output=True, text=True, encoding='utf-8', check=True)
    data = json.loads(result.stdout)
    if not data.get('success'):
        raise RuntimeError(data)
    return data.get('data', {})

browser('set', 'media', 'light', 'reduced-motion')
audit = []
for width in [1440, 400, 320, 700]:
    browser('set', 'viewport', str(width), '1000' if width == 1440 else '844')
    for slug, route in [('who', '/who-we-are'), ('series', '/who-we-are/4x4-series')]:
        browser('open', 'http://localhost:4173' + route)
        browser('eval', '''(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}scrollTo(0,0);})()''')
        time.sleep(.25)
        result = browser('eval', '''JSON.stringify({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelector('h1').innerText,broken:Array.from(document.querySelectorAll('main img')).filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).map(i=>i.src),links:Array.from(document.querySelectorAll('main a')).map(a=>({text:a.innerText,href:a.getAttribute('href')})),cards:Array.from(document.querySelectorAll('.scrapbook-reveal')).map(e=>{const r=e.getBoundingClientRect();return {text:e.innerText,left:r.left,right:r.right,top:r.top+scrollY,bottom:r.bottom+scrollY,opacity:getComputedStyle(e).opacity}})})''').get('result')
        audit.append({'width': width, 'route': route, **json.loads(result)})
        browser('screenshot', '--full', str(folder / f'{slug}-{width}.png'))
        if slug == 'who':
            browser('eval', "document.getElementById('run-heading').scrollIntoView()")
            browser('screenshot', str(folder / f'board-{width}.png'))
        print(f'{slug} {width}: ' + str(audit[-1]['overflow']) + ' overflow, ' + str(len(audit[-1]['broken'])) + ' broken images')
(folder / 'audit.json').write_text(json.dumps(audit, indent=2), encoding='utf-8')
