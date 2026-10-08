import random, math
from PIL import Image, ImageDraw, ImageFont
F="/root/.claude/skills/synced/e0ba6eef-0505-44a5-8519-7122102ce657_8388ecc8-0b41-47b9-805d-92f89b7bcc61/canvas-design/canvas-fonts/"
S=2; W,H=3840,2160
TEAL=(12,114,126); DEEP=(9,98,109); BONE=(239,234,224); YEL=(250,186,42)
def rgba(c,a): return (*c,int(255*a))
img=Image.new("RGBA",(W*S,H*S),TEAL); d=ImageDraw.Draw(img,"RGBA")
s=lambda v:int(round(v*S))
def line(p,q,c,w=2): d.line([(s(p[0]),s(p[1])),(s(q[0]),s(q[1]))],fill=c,width=max(1,s(w)))
def rect(x0,y0,x1,y1,outline=None,fill=None,w=2): d.rectangle([s(x0),s(y0),s(x1),s(y1)],outline=outline,fill=fill,width=s(w))
def circ(cx,cy,r,outline=None,fill=None,w=2): d.ellipse([s(cx-r),s(cy-r),s(cx+r),s(cy+r)],outline=outline,fill=fill,width=s(w))
def dashed(p,q,c,w=2,dash=10,gap=8):
    L=math.dist(p,q); n=int(L//(dash+gap))+1; ux,uy=(q[0]-p[0])/L,(q[1]-p[1])/L
    for i in range(n):
        a=i*(dash+gap); b=min(a+dash,L)
        if a<L: line((p[0]+ux*a,p[1]+uy*a),(p[0]+ux*b,p[1]+uy*b),c,w)
mono=ImageFont.truetype(F+"DMMono-Regular.ttf",s(15))
def text(x,y,t,font,fill,track=0,anchor="la"):
    if track==0: d.text((s(x),s(y)),t,font=font,fill=fill,anchor=anchor); return
    for ch in t:
        d.text((s(x),s(y)),ch,font=font,fill=fill,anchor=anchor); x+=font.getlength(ch)/S+track
def tw(t,font,track): return sum(font.getlength(c)/S+track for c in t)-track

M=140
# grid
gx0,gx1=1320,3700; gap=36; cols=rows=4
cw=(gx1-gx0-gap*(cols-1))/cols; ch=cw*2/3
gh=rows*ch+gap*(rows-1); gy0=(H-gh)/2
HL=2
random.seed(5)
k=0
for r in range(rows):
    for c in range(cols):
        k+=1
        x0=gx0+c*(cw+gap); y0=gy0+r*(ch+gap); x1=x0+cw; y1=y0+ch
        hi=(k==5)
        ground=YEL if hi else DEEP
        rect(x0,y0,x1,y1,fill=ground)
        lc=TEAL if hi else rgba(BONE,.78)
        pad=22; px0,py0,px1,py1=x0+pad,y0+pad,x1-pad,y1-pad-18
        pw,ph=px1-px0,py1-py0
        rect(px0,py0,px1,py1,outline=lc,w=HL)
        line((px0+pw/2,py0),(px0+pw/2,py1),lc,HL)
        circ(px0+pw/2,py0+ph/2,ph*.14,outline=lc,w=HL)
        bw,bh=pw*.16,ph*.5
        for sx in (px0,px1-bw):
            rect(sx,py0+(ph-bh)/2,sx+bw,py0+(ph+bh)/2,outline=lc,w=HL)
        # players: 4v4 in rows of play
        pts=[(px0+random.uniform(.06,.94)*pw,py0+random.uniform(.1,.9)*ph) for _ in range(8)]
        dc=TEAL if hi else BONE
        # pass trace through 5 points, ends at a goal mouth
        chain=pts[:3]; end=(px1 if k%2 else px0, py0+ph/2+random.uniform(-.08,.08)*ph)
        chain.append(end)
        tc=TEAL if hi else YEL
        for a,b in zip(chain,chain[1:]): dashed(a,b,tc,2.4,9,7)
        for i,p in enumerate(pts):
            if i<4: circ(p[0],p[1],6,outline=dc,w=2.2)
            else: circ(p[0],p[1],6,fill=dc)
        circ(end[0],end[1],4,fill=tc)
        lab=mono; lcol=TEAL if hi else rgba(BONE,.62)
        text(x0+pad,y1-pad+2,f"{k:02d}",lab,lcol,track=2,anchor="ls")
        text(x1-pad,y1-pad+2,"4 × 4",lab,lcol,track=2,anchor="rs") if False else None
# ruler ticks top and left of grid
tc=rgba(BONE,.55)
for i in range(0,int(gx1-gx0)+1,20):
    x=gx0+i; L=14 if i%100==0 else 6
    line((x,gy0-28),(x,gy0-28-L),tc,1.6)
for i in range(0,int(gh)+1,20):
    y=gy0+i; L=14 if i%100==0 else 6
    line((gx0-28,y),(gx0-28-L,y),tc,1.6)
# left panel
big=ImageFont.truetype(F+"BigShoulders-Bold.ttf",s(330))
word="FRONTIER"
bb=big.getbbox(word); wpx=(bb[2]-bb[0])/S
size=330*(1000/ (wpx))   # fit width to ~1000
big=ImageFont.truetype(F+"BigShoulders-Bold.ttf",s(size)); bb=big.getbbox(word)
cap_bottom=gy0+gh
d.text((s(M-bb[0]/S),s(cap_bottom)),word,font=big,fill=BONE,anchor="ls")
cap_h=(big.getbbox("F")[3]-big.getbbox("F")[1])/S
top_of_word=cap_bottom-cap_h
# yellow rule + labels above word
line((M,top_of_word-52),(M+1000,top_of_word-52),rgba(BONE,.5),1.6)
sm=ImageFont.truetype(F+"DMMono-Regular.ttf",s(19))
text(M,top_of_word-30,"FOOTBALL · COMMUNITY · CULTURE",sm,rgba(BONE,.85),track=5,anchor="ls")
circ(M+1000-7,top_of_word-30-7,7,fill=YEL)
# top-left plate id + crest
text(M,gy0-10,"PLATE 4 × 4",sm,rgba(BONE,.85),track=5,anchor="ls")
text(M,gy0+22,"SURVEY OF PLAY — SIXTEEN OBSERVATIONS",sm,rgba(BONE,.55),track=5,anchor="ls")
crest=Image.open("/home/user/frontier-football/public/crest.webp").convert("RGBA")
cs=150; crest=crest.resize((s(cs),int(s(cs)*crest.height/crest.width)),Image.LANCZOS)
img.alpha_composite(crest,(s(M),s(gy0+90)))
# coordinates bottom, under word
text(M,cap_bottom+58,"6.9271° N  79.8612° E",sm,rgba(BONE,.6),track=5,anchor="ls")
text(M+1000,cap_bottom+58,"COLOMBO",sm,rgba(BONE,.6),track=5,anchor="rs")
out=img.convert("RGB").resize((W,H),Image.LANCZOS)
out.save("/home/user/frontier-football/promo-mockups/title-plate-pitch-cartography.png",optimize=True)
print(size,gy0,gh,top_of_word)
