import json, subprocess
from pathlib import Path
session='frontier-copy'
def run(*args):
    p=subprocess.run(['rtk','proxy','agent-browser','--session',session,*args],capture_output=True,text=True,encoding='utf-8',timeout=45)
    if p.returncode: raise RuntimeError(p.stdout+p.stderr)
    return p.stdout
def evaluate(js): return json.loads(run('--json','eval',js))['data']['result']
checks={}
run('open','http://localhost:4173/events')
checks['events']=evaluate('''(()=>({anchors:[...document.querySelectorAll('main a')].filter(a=>a.getAttribute('href')?.startsWith('#')).map(a=>({href:a.getAttribute('href'),exists:!!document.getElementById(a.getAttribute('href').slice(1))})),order:[...document.querySelectorAll('main section[id]')].map(e=>e.id),upcomingAbsent:!document.getElementById('events')}))()''')
assert all(a['exists'] for a in checks['events']['anchors'])
assert checks['events']['order'].index('join')<checks['events']['order'].index('hall-of-fame')
for target in ['join','hall-of-fame']:
    evaluate(f'''[...document.querySelectorAll('main a')].find(a=>a.getAttribute('href')==='#{target}').click()''')
    run('wait','900')
    checks[target]=evaluate(f'''({{hash:location.hash,top:document.getElementById('{target}').getBoundingClientRect().top}})''')
    assert checks[target]['hash']=='#'+target
run('open','http://localhost:4173/')
run('set','viewport','390','844')
evaluate("document.querySelector('#moment').scrollIntoView()")
run('wait','1200')
run('mouse','wheel','500','0')
run('wait','1200')
checks['moment390']=evaluate("({opacity:getComputedStyle(document.querySelector('.moment-line--last')).opacity,sectionTop:document.querySelector('#moment').getBoundingClientRect().top})")
assert checks['moment390']['opacity']=='1'
run('set','viewport','1440','1000')
evaluate("document.querySelector('#competitions').scrollIntoView(); document.querySelectorAll('.comp__item')[3].focus()")
run('wait','700')
checks['watchParties']=evaluate("({focus:document.activeElement.dataset.i,photos:[...document.querySelectorAll('.comp__stage figure')].map(e=>({opacity:getComputedStyle(e).opacity,loaded:e.querySelector('img').naturalWidth>0}))})")
assert checks['watchParties']['photos'][3]['opacity']=='1'
assert checks['watchParties']['photos'][3]['loaded']
evaluate("scrollTo(0,0)")
run('find','role','button','click','--name','Menu')
checks['menu']=evaluate("({labels:[...document.querySelectorAll('#site-menu nav a')].map(a=>a.textContent.trim()).slice(0,7),close:[...document.querySelectorAll('#site-menu button')].some(b=>b.textContent.trim()==='Close')})")
assert checks['menu']['labels']==['Home','Who We Are','Events','Gallery','Community','Collaborate','Contact']
assert checks['menu']['close']
run('press','Escape')
checks['menuClosed']=evaluate("!document.querySelector('#site-menu').open")
assert checks['menuClosed']
Path('.tmp/copy-v1/smoke-checks.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
print(json.dumps(checks,indent=2))
