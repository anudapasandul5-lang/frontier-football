from pathlib import Path
import json, re, subprocess, html

root = Path.cwd()
destination = root / '.tmp' / 'scrapbook-v1'
destination.mkdir(exist_ok=True)
data = json.loads(subprocess.check_output(['rtk', 'proxy', 'node', '--input-type=module', '-e', "import raw from './content.js'; console.log(JSON.stringify(raw));"], text=True))
source = (root / 'out/who-we-are.html').read_text(encoding='utf-8')
fonts = re.search(r'<html[^>]*class="([^"]+)"', source).group(1)
styles = ''.join(f'<link rel="stylesheet" href="http://localhost:4173{href}">' for href in re.findall(r'<link[^>]*href="([^"]+\.css)"[^>]*>', source))
e = html.escape
competitions = {item['name']: item for item in data['competitions']}
season = data['seasons'][0]
party = data['watchAlongs'][0]
pins = [
    ('Ground Zero', competitions['Ground Zero'], '/albums/frontier-futsal'),
    ('4 x 4 Series', season, '#seasons'),
    ('Watch Parties', party, '/gallery#watch-alongs'),
    ('Division 0', competitions['Division 0'], '/albums/division-0'),
]
cards = []
for i, (name, item, href) in enumerate(pins):
    credit = f'<small class="credit">{e(item["photoCredit"])}</small>' if item.get('photoCredit') else ''
    cards.append(f'<li class="pin pin-{i+1}"><a href="{href}"><span class="number">{i+1}</span><img class="{"credited" if credit else ""}" src="http://localhost:4173{item["photo"]}" alt="{e(item["photoAlt"])}"><strong>{name} <span aria-hidden="true">↗</span></strong>{credit}</a></li>')
seasons = []
for item in sorted(data['seasons'], key=lambda s: s['season']):
    facts = ''.join(f'<p>{e(item[key])}</p>' for key in ['date', 'venue'] if item.get(key) and not item[key].startswith('TODO'))
    champion = f'<p><span class="micro">Champion</span><br><strong>{e(item["champion"])}</strong></p>' if not item['champion'].startswith('TODO') else ''
    seasons.append(f'<a class="season" href="http://localhost:4173/albums/{item["albumId"]}"><img src="http://localhost:4173{item["photo"]}" alt="{e(item["photoAlt"])}"><div><h3>Season {item["season"]}</h3>{facts}{champion}</div></a>')
css = '''
body{background:#efeae0;color:#0a0a0a;font-family:var(--font-geist);margin:0}*{box-sizing:border-box}
main{max-width:1120px;margin:0 auto;padding:64px 24px}h1,h2,h3,strong{font-family:var(--font-bricolage);font-weight:800}h1,h2{font-size:clamp(36px,5.4vw,78px);line-height:.95;text-transform:uppercase;margin:0 0 38px;letter-spacing:-.03em}
.board{position:relative;height:1100px;border:1px solid #0a0a0a40;margin-top:40px;overflow:hidden}.thread{position:absolute;inset:0;width:100%;height:100%;stroke:#0a0a0a;stroke-width:2;fill:none;vector-effect:non-scaling-stroke}
.pins{list-style:none;padding:0;margin:0}.pin{position:absolute;width:37%;}.pin-1{left:57%;top:4%;transform:rotate(-4deg)}.pin-2{left:6%;top:26%;transform:rotate(5deg)}.pin-3{left:57%;top:48%;transform:rotate(-3deg)}.pin-4{left:6%;top:70%;transform:rotate(4deg)}
.pin a{display:block;padding:10px 10px 18px;background:#efeae0;border:2px solid #0a0a0a;position:relative;text-decoration:none;color:inherit}.pin img{width:100%;aspect-ratio:1.85;object-fit:cover;display:block}.pin img.credited{object-fit:contain;background:#0a0a0a}.pin strong{display:flex;justify-content:space-between;font-size:24px;margin:12px 4px 0}.pin .number{position:absolute;z-index:2;top:-18px;left:calc(50% - 18px);width:36px;height:36px;border-radius:50%;background:#0a0a0a;color:#efeae0;display:grid;place-items:center;font-size:15px;font-weight:700}.credit{display:block;margin:7px 4px 0;font-size:10px}.pin a:focus-visible,.season:focus-visible{outline:3px solid #0a0a0a;outline-offset:8px}
#seasons{padding-top:96px}.section-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:32px;gap:16px}.section-head h2{margin:0}.micro{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.season{display:block;border:1px solid #0a0a0a;color:inherit;text-decoration:none}.season img{display:block;width:100%;aspect-ratio:1.6;object-fit:cover}.season>div{padding:20px}h3{font-size:28px;text-transform:uppercase;line-height:1;margin:0 0 16px}.season p{font-size:15px;line-height:1.5;margin:0 0 12px}.season strong{font-size:20px}
@media(max-width:600px){main{padding:40px 16px}.board{height:1160px;margin-top:28px}.pin{width:74%}.pin-1,.pin-3{left:20%}.pin-2,.pin-4{left:5%}.pin strong{font-size:20px}.pin a{padding:7px 7px 12px}.credit{font-size:9px}.pin .number{width:28px;height:28px;top:-14px;left:calc(50% - 14px)}.grid{grid-template-columns:1fr;gap:20px}#seasons{padding-top:64px}.section-head{align-items:start}.section-head .micro{max-width:65px;text-align:right}.thread{stroke-width:1.5}}
'''
css += '''
/* Revision 2: match the site's large editorial type and photograph-led scale. */
main{max-width:1320px;padding:80px 48px}
h1,h2,h3,.pin strong{font-variation-settings:"wdth" 75}
h1{font-size:clamp(76px,12vw,170px);max-width:850px;line-height:.82;letter-spacing:-.025em;margin-bottom:72px}
.board{border:0;height:1500px;margin-top:0;overflow:visible}
.pin{width:46%}.pin-1{left:52%;top:4%;transform:rotate(-5deg)}.pin-2{left:2%;top:27%;transform:rotate(4deg)}.pin-3{left:52%;top:50%;transform:rotate(-3deg)}.pin-4{left:2%;top:73%;transform:rotate(5deg)}
.pin a{border:1px solid #0a0a0a;padding:12px 12px 22px;transition:transform .35s cubic-bezier(.23,1,.32,1)}
.pin a:before{content:"";position:absolute;inset:7px -7px -7px 7px;border:1px solid #0a0a0a;z-index:-1;background:#efeae0}
.pin a:hover{transform:rotate(2deg) translateY(-7px)}
.pin img{aspect-ratio:1.6}.pin strong{font-size:clamp(28px,3.2vw,46px);line-height:1;text-transform:uppercase;margin:20px 6px 0;letter-spacing:-.02em}
.pin strong span{font-family:var(--font-geist);font-weight:400;font-size:32px;transition:transform .3s}.pin a:hover strong span{transform:translate(3px,-3px)}
.pin .number{width:42px;height:42px;top:-21px;left:calc(50% - 21px);font-size:15px;border:5px solid #efeae0;outline:1px solid #0a0a0a}
.credit{margin:12px 6px 0;font-size:11px}.thread{stroke-width:1.5}
#seasons{padding-top:130px;border-top:1px solid #0a0a0a;margin-top:80px}.section-head{margin-bottom:52px}.section-head h2{font-size:clamp(50px,8vw,110px);line-height:.88}.grid{gap:48px 28px}.season{border:0;border-bottom:1px solid #0a0a0a}.season img{aspect-ratio:1.4}.season>div{padding:22px 0 24px}h3{font-size:clamp(30px,3vw,46px);margin-bottom:20px}.season strong{font-size:24px}
@media(max-width:700px){main{padding:48px 20px}h1{font-size:clamp(62px,15vw,104px);max-width:550px;margin-bottom:48px;line-height:.86}.board{height:1360px}.pin{width:86%}.pin-1,.pin-3{left:11%}.pin-2,.pin-4{left:2%}.pin-1{top:3%}.pin-2{top:27%}.pin-3{top:51%}.pin-4{top:75%}.pin a{padding:8px 8px 18px}.pin strong{font-size:28px;margin:16px 4px 0}.pin strong span{font-size:25px}.pin .number{width:34px;height:34px;top:-17px;left:calc(50% - 17px);border-width:3px}.credit{font-size:10px;margin:10px 4px 0}.grid{grid-template-columns:1fr;gap:32px}.season img{aspect-ratio:1.5}#seasons{margin-top:48px;padding-top:56px}.section-head{margin-bottom:32px}.section-head h2{font-size:52px}h3{font-size:36px}}
@media(min-width:701px) and (max-width:1000px){.board{height:1300px}.pin strong{font-size:30px}.grid{grid-template-columns:repeat(2,1fr)}}
@media(prefers-reduced-motion:reduce){.pin a,.pin strong span{transition:none}.pin a:hover{transform:none}}
'''
output = f'''<!doctype html><html lang="en" class="{fonts}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Scrapbook layout mock</title>{styles}<style>{css}</style></head><body><main><section aria-labelledby="mock-heading"><h1 id="mock-heading">The run so far</h1><div class="board"><svg class="thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M75.5 4 C75 16,24 14,24.5 26 S75 37,75.5 48 S24 59,24.5 70" vector-effect="non-scaling-stroke"/></svg><ol class="pins">{''.join(cards)}</ol></div></section><section id="seasons"><div class="section-head"><h2>4 x 4 Series</h2><p class="micro">All six seasons</p></div><div class="grid">{''.join(seasons)}</div></section></main></body></html>'''
output = output.replace('The run so far</h1>', 'The run<br>so far</h1>')
output = output.replace('</style>', '.thread-mobile{display:none}@media(max-width:700px){.thread{display:none}.thread-mobile{display:block}}</style>')
output = output.replace('</svg>', '</svg><svg class="thread thread-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M54 3 C95 12,10 16,45 27 C5 38,95 40,54 51 C95 63,6 63,45 75" vector-effect="non-scaling-stroke"/></svg>', 1)
output = output.replace('M75.5 4 C75 16,24 14,24.5 26 S75 37,75.5 48 S24 59,24.5 70', 'M75 4 C94 16,14 11,25 27 C12 42,96 35,75 50 C94 67,7 57,25 73')
(destination / 'mock.html').write_text(output, encoding='utf-8')
(root / 'out/__scrapbook-mock.html').write_text(output, encoding='utf-8')
print(destination / 'mock.html')
