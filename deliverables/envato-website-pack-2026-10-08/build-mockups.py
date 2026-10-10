from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import json

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'mockups'
OUT.mkdir(exist_ok=True)
BONE = '#efeae0'
INK = '#0a0a0a'
YELLOW = '#faba2a'
FONT = 'C:/Windows/Fonts/arialbd.ttf'
REGULAR = 'C:/Windows/Fonts/segoeui.ttf'

def text(canvas, position, value, size=30, colour=INK, bold=False):
    ImageDraw.Draw(canvas).text(position, value, font=ImageFont.truetype(FONT if bold else REGULAR, size), fill=colour)

def screen(path, width):
    im = Image.open(path).convert('RGBA')
    return im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)

def browser(path, width=2600):
    im = screen(path, width)
    bar = round(width * .029)
    border = max(3,round(width*.002))
    result = Image.new('RGBA',(width+border*2,im.height+bar+border*2), INK)
    draw=ImageDraw.Draw(result)
    draw.rectangle((border,border,width+border,bar+border),fill=BONE)
    for i in range(3):
        x=border+round(width*.015)+i*round(width*.011)
        r=round(width*.0027)
        draw.ellipse((x-r,bar//2-r,x+r,bar//2+r),fill=INK)
    text(result,(round(width*.36),round(bar*.17)),'frontier-football.vercel.app',round(width*.011))
    result.alpha_composite(im,(border,bar+border))
    return result

def phone(path,width=480):
    im=screen(path,width)
    pad=20
    result=Image.new('RGBA',(width+2*pad,im.height+2*pad),(0,0,0,0))
    d=ImageDraw.Draw(result)
    d.rounded_rectangle((0,0,result.width-1,result.height-1),radius=65,fill=INK)
    mask=Image.new('L',im.size,0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,im.width-1,im.height-1),radius=46,fill=255)
    result.paste(im,(pad,pad),mask)
    d.rounded_rectangle((result.width//2-57,30,result.width//2+57,53),radius=12,fill=INK)
    return result

def stage(name,bg=BONE):
    im=Image.new('RGBA',(3840,2160),bg)
    text(im,(180,105),'FRONTIER FOOTBALL',32,INK if bg==BONE else BONE,True)
    return im

desktop=ROOT/'screenshots/desktop'
mobile=ROOT/'screenshots/mobile'
home=desktop/'01-home-1920x1080.jpg'
hero=browser(home,2850)
hero.save(OUT/'01-desktop-home-transparent.png')
p=phone(mobile/'01-home-430x932.jpg',620)
p.save(OUT/'02-phone-home-transparent.png')

canvas=stage('responsive')
canvas.alpha_composite(hero,(235,360))
canvas.alpha_composite(p,(2930,455))
text(canvas,(180,1965),'FOOTBALL. COMMUNITY. CULTURE.',53,INK,True)
text(canvas,(2850,1985),'LIVE WEBSITE / OCT 2026',26)
canvas.convert('RGB').save(OUT/'03-responsive-showcase-3840x2160.png')

canvas=stage('events',INK)
event=browser(desktop/'03-events-1920x1080.jpg',2820)
canvas.alpha_composite(event,((3840-event.width)//2,340))
text(canvas,(180,1965),'JOIN THE ACTION.',67,YELLOW,True)
canvas.convert('RGB').save(OUT/'04-events-showcase-3840x2160.png')

canvas=stage('mobile')
items=[('01-home-430x932.jpg','HOME'),('03-events-430x932.jpg','EVENTS'),('04-gallery-430x932.jpg','GALLERY')]
for x,(file,label) in zip([615,1615,2615],items):
    panel=phone(mobile/file,545)
    canvas.alpha_composite(panel,(x,420))
    text(canvas,(x,1755),label,30,INK,True)
text(canvas,(180,1965),'THE GAME. WHEREVER YOU ARE.',53,INK,True)
canvas.convert('RGB').save(OUT/'05-mobile-trio-3840x2160.png')

files=sorted(desktop.glob('*.jpg'))+sorted(mobile.glob('*.jpg'))
sheet=Image.new('RGB',(1800,round((len(files)+2)//3)*410),BONE)
for i,path in enumerate(files):
    tile=Image.open(path).convert('RGB')
    tile.thumbnail((555,335),Image.Resampling.LANCZOS)
    x=30+(i%3)*590
    y=30+(i//3)*410
    sheet.paste(tile,(x+(555-tile.width)//2,y))
    text(sheet,(x,y+345),path.stem,19)
sheet.save(ROOT/'PREVIEW.png')

manifest=[]
for path in sorted(ROOT.rglob('*')):
    if path.suffix.lower() in ['.jpg','.png']:
        with Image.open(path) as im:
            manifest.append({'file':path.relative_to(ROOT).as_posix(),'width':im.width,'height':im.height,'mode':im.mode,'bytes':path.stat().st_size})
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(f'Generated {len(manifest)} images; preview: {ROOT / "PREVIEW.png"}')
