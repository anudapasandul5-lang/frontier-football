from pathlib import Path
import json, subprocess, time
folder = Path.cwd() / '.tmp/scrapbook-v1/production'
def browser(*args):
    r = subprocess.run(['rtk','proxy','agent-browser','--session','frontier-copy','--json',*args],capture_output=True,text=True,encoding='utf-8',check=True)
    result=json.loads(r.stdout)
    if not result.get('success'): raise RuntimeError(result)
    return result.get('data',{})
def evaluate(js): return browser('eval',js).get('result')
checks=[]
browser('set','media','light','no-preference')
for width in [1440,400]:
    browser('set','viewport',str(width),'1000' if width==1440 else '844')
    browser('open','http://localhost:4173/who-we-are')
    time.sleep(.8)
    assert evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches") is False
    for i in range(4):
        evaluate(f"document.querySelectorAll('.scrapbook-reveal')[{i}].scrollIntoView({{block:'center'}})")
        time.sleep(.9)
    opacity=evaluate("Array.from(document.querySelectorAll('.scrapbook-reveal')).map(e=>Number(getComputedStyle(e).opacity))")
    assert opacity == [1,1,1,1], opacity
    evaluate('document.querySelector(\'.scrapbook-reveal a[href="/who-we-are/4x4-series"]\').focus()')
    time.sleep(.2)
    focus=evaluate("getComputedStyle(document.activeElement).outlineWidth")
    browser('press','Enter')
    time.sleep(.8)
    url=browser('get','url').get('url')
    assert url.endswith('/who-we-are/4x4-series'),url
    links=evaluate('Array.from(document.querySelectorAll(\'.scrapbook-reveal a\')).map(a=>a.getAttribute("href"))')
    assert links==[f'/albums/szn-{n}' for n in range(1,7)],links
    statuses=evaluate('(async()=>await Promise.all(Array.from(document.querySelectorAll(".scrapbook-reveal a")).map(async a=>({href:a.getAttribute("href"),status:(await fetch(a.href)).status}))))()')
    assert all(row['status']==200 for row in statuses),statuses
    evaluate('document.querySelector(\'a[href="/who-we-are#run-heading"]\').focus()')
    browser('press','Enter')
    time.sleep(.9)
    back=browser('get','url').get('url')
    assert back.endswith('/who-we-are#run-heading'),back
    evaluate("document.querySelectorAll('.scrapbook-reveal')[3].scrollIntoView({block:'center'})")
    time.sleep(.9)
    jumped=evaluate("Array.from(document.querySelectorAll('.scrapbook-reveal')).every(e=>Number(getComputedStyle(e).opacity)===1)")
    assert jumped,jumped
    browser('screenshot',str(folder/f'flow-{width}.png'))
    browser('set','media','light','reduced-motion')
    time.sleep(.3)
    reset=evaluate("Array.from(document.querySelectorAll('.scrapbook-reveal')).every(e=>getComputedStyle(e).transform==='none'&&Number(getComputedStyle(e).opacity)===1)")
    assert reset,reset
    checks.append({'width':width,'normalMotionReveals':opacity,'keyboardOpen':url,'keyboardReturn':back,'allAlbums200':statuses,'anchorJumpRevealsAll':jumped,'reducedMotionResets':reset,'focusOutline':focus})
    browser('set','media','light','no-preference')
    print(f'Flow {width}: passed',flush=True)
(folder/'flow.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
