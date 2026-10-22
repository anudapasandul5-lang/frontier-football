"""Photo refresh, 2026-10-20 (v2): the owner's chosen folder (Desktop/frontier web)
replaces every site photo that has a matching event. Rules, from the owner:
  * every slot is cropped to its own frame's shape around a chosen focus point
  * NO PHOTO IS REPEATED. claim() stops the run if one source feeds two slots.
    The only allowed sharing is an album's own card/cover/lead (group "card:<album>").
  * only the folder's photos; sources are never enlarged; originals untouched.
Run with a Python that has Pillow:  python apply_refresh.py"""
import json, re
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
SRC = Path(r"C:\Users\anuda\Desktop\frontier web")
DRIVE = json.loads((REPO / "docs/photo-review-2026-10-13/drive-inventory.json").read_text())["files"]
TURF = str(ROOT / "turf-wars-source.webp")  # no new Turf Wars photo; D: original not mounted


def file_for(key):
    if Path(key).is_absolute():
        return Path(key)
    hits = [p for p in SRC.iterdir() if p.stem == key or (p.stem.startswith(key) and not key.startswith("DSC"))]
    assert hits, key
    return sorted(hits, key=lambda p: len(p.name))[0]


ALT = {
 "DSC_8486": "A crowd of supporters with Spain and Argentina flags at the World Cup final watch party",
 "DSC_8877": "Players close in on the ball under the floodlights at 4 x 4 Series SZN 6",
 "DSC_7395": "Four friends arm in arm at the Spain v France watch party",
 "DSC_2817": "Friends cheer and celebrate at their table at the Norway v England watch party",
 "DSC_7607": "A packed Main Sports Bar during the England v Argentina watch party",
 "DSC_8040": "Players chat on the pitch between games at 4 x 4 Series SZN 6",
 "DSC_8310": "Two players battle for the ball in a daylight 4 x 4 Series SZN 6 match",
 "DSC_8480": "A goalkeeper slides in as a player in orange strikes at 4 x 4 Series SZN 6",
 "DSC_9274": "The SZN 6 champions lift their trophies under the tent after the final",
 "DSC_8533": "A player winds up a strike in the evening sun at 4 x 4 Series SZN 6",
 "e6ccd632929a10a0001976a1436a927d": "Winners line up with their medals and the trophy after 4 x 4 Series SZN 5; photograph by ThePapare",
 "DSC_9019": "A defender slides in to block a shot under the floodlights at SZN 6",
 "DSC_8308": "Players chase the ball past the net at 4 x 4 Series SZN 6",
 "DSC_8461": "A goalkeeper in pink and a referee watch the play at 4 x 4 Series SZN 6",
 "DSC_8128": "A player strikes the ball while a referee looks on at 4 x 4 Series SZN 6",
 "DSC_9142": "A player receives an award at the SZN 6 presentation",
 "DSC_9054": "Players gather in a circle on the pitch at night at SZN 6",
 "DSC_8906": "Players in black huddle on the pitch at 4 x 4 Series SZN 6",
 "DSC_8084": "A goalkeeper in an orange bib plays the ball out at 4 x 4 Series SZN 6",
 "DSC_6047": "Players and friends gather round a Division 0 console match",
 "a7250da5259f21783b7d175e6814318f": "A player in black stretches for the ball at Ground Zero; photograph by ThePapare",
 TURF: "Turf Wars players and organisers together with a trophy at Club Fusion",
 "DSC_7926": "A player dribbles past palm trees at 4 x 4 Series SZN 6",
 "DSC_6070": "Division 0 players face the big screen with controllers in hand",
 "DSC_3035": "Supporters point and roar at the Norway v England watch party",
 "DSC_8645": "Teammates hold each other in a huddle at dusk at 4 x 4 Series SZN 6",
 "DSC_8471": "Friends with a Spain flag around a table at the World Cup final watch party",
 "DSC_8156": "Players join hands in a team huddle before a 4 x 4 Series SZN 6 match",
 "DSC_8225": "A player drives forward with the ball in a daylight 4 x 4 Series SZN 6 match",
 "DSC_8212": "A goalkeeper gathers the ball on the edge of his area at SZN 6",
 "DSC_8056": "A player stretches to win the ball in a crowded box at 4 x 4 Series SZN 6",
 "DSC_2663": "Supporters cheer with their arms up at the Norway v England watch party",
 "DSC_9258": "SZN 6 winners with their medals, prizes and trophy at the presentation",
 "DSC_7603": "A full room watching England v Argentina at Main Sports Bar",
 "DSC_6067": "The Pixels N Pints entrance, venue partner for Division 0",
 "DSC_7669": "A crowd holds its head in its hands at the England v Argentina watch party",
 "DSC_7853": "A supporter celebrates in front of the big screen at the England v Argentina watch party",
 "DSC_6066": "A giant Seixed bottle on display at Pixels N Pints during Division 0",
 "DSC_9120": "A player receives an award and a partner prize box at the SZN 6 presentation",
 "DSC_8450": "Supporters pose with Argentina flags at the World Cup final watch party",
 "DSC_8569": "A packed bar of supporters at the World Cup final watch party",
 "DSC_8849": "A referee and players during a night match at 4 x 4 Series SZN 6",
 "DSC_7884": "Players chase the ball beside the palm trees at 4 x 4 Series SZN 6",
 "DSC_8274": "Supporters watch the World Cup final on the big screen",
 "DSC_2702": "Supporters watch the Norway v England match together",
 "DSC_8333": "A supporter points a flag during the World Cup final watch party",
 "DSC_8355": "A crowded Chicken bar during the World Cup final watch party",
 "DSC_2821": "Friends laugh and point at the Norway v England watch party",
 "DSC_3137": "Supporters cheer at the Norway v England watch party",
 "DSC_2866": "Two friends talk at their table at the Norway v England watch party",
 "7aaf44b2325043b32863ae79266bf503": "Two players race for the ball in a women's match at Ground Zero; photograph by ThePapare",
 "DSC_9292": "SZN 6 runners-up with their medals and the trophy",
 "DSC_2878": "A supporter laughs with her friends at the Norway v England watch party",
 "DSC_6038": "A Division 0 player in a red shirt plays a match from the sofa",
 "DSC_2707": "Friends smile together at a table at the Norway v England watch party",
 "DSC_2695": "A supporter stands watching the Norway v England match",
 "DSC_2943": "An England supporter smiles at the bar during the Norway v England watch party",
 "DSC_8315": "Players jump for a high ball at 4 x 4 Series SZN 6",
 "DSC_8242": "A player drives forward behind the net at 4 x 4 Series SZN 6",
 "DSC_8249": "A goalkeeper waits beside the ball at 4 x 4 Series SZN 6",
 "DSC_8370": "Players battle for the ball through the fence at 4 x 4 Series SZN 6",
 "DSC_7358": "An England supporter punches the air at the Spain v France watch party",
 "DSC_2896": "A supporter in an Argentina shirt at the Norway v England watch party",
 "DSC_8492": "Supporters share a table at the World Cup final watch party",
 "DSC_6037": "Players and friends follow a Division 0 match on screen at Pixels N Pints",
 "DSC_6078": "A Division 0 player plays in the dark at Pixels N Pints",
 "64180eedf3609ee2af7a3963de801a1b": "Two players race for the ball in a women's match at Ground Zero",
 "5ad03adee47f63af37381581c1541f7b": "A player drives at two defenders at Ground Zero",
 "2e759a89f02dad23027364837500e0a5": "Two players square up over the ball at Ground Zero",
 "7b42c24563fa5141ef55d70774909ba5": "The women's winners receive the trophy at Ground Zero; photograph by ThePapare",
 "65d008dc9230d161a481e6cd8b45550d": "Players raise the trophy together after 4 x 4 Series SZN 5; photograph by ThePapare",
 "DSC_9098": "The 4 x 4 Series SZN 6 champions lined up on the pitch beside the trophy",
 "DSC_6097": "A Division 0 player locks in with a controller at Pixels N Pints",
 "DSC_8186": "Fans with Spain and Argentina flags at the World Cup final watch party",
 "DSC_7731": "Supporters punch the air at the England v Argentina watch party",
 "DSC_7418": "Friends in Paris Saint-Germain shirts sit together at the Spain v France watch party",
 "DSC_2912": "Supporters leap up with their arms raised at the Norway v England watch party",
 "DSC_8722": "Players close in on the ball at night at 4 x 4 Series SZN 6",
 "DSC_8676": "Players race for the ball at dusk at 4 x 4 Series SZN 6",
 "DSC_9064": "Players talk on the pitch at night at 4 x 4 Series SZN 6",
 "DSC_8985": "Teammates high-five on the pitch under the floodlights at 4 x 4 Series SZN 6",
 "DSC_8388": "Two players chase the ball across the turf at 4 x 4 Series SZN 6",
 "DSC_8463": "A packed table of supporters waving flags at the World Cup final watch party",
 "DSC_8652": "Supporters laugh together at the World Cup final watch party",
 "DSC_8737": "Supporters cheer in front of the big screen at the World Cup final watch party",
 "DSC_7723": "Supporters laugh and cheer at the England v Argentina watch party",
 "DSC_7594": "A group of friends pose together at the England v Argentina watch party",
 "DSC_7604": "A packed Main Sports Bar during the England v Argentina watch party",
 "DSC_7610": "Supporters hold their heads in their hands at the England v Argentina watch party",
 "DSC_7749": "A supporter films the match on her phone at the England v Argentina watch party",
 "DSC_7436": "A supporter celebrates in a number 10 shirt at the Spain v France watch party",
 "DSC_7547": "Friends raise a toast at the Spain v France watch party",
 "DSC_7478": "Supporters watch the Spain v France match in a packed bar",
 "DSC_7339": "A supporter stands watching the Spain v France match",
 "DSC_2719": "A crowd cheers together at the Norway v England watch party",
 "DSC_2847": "Friends watch the Norway v England match at the bar",
 "DSC_2807": "A supporter cheers with a hand in the air at the Norway v England watch party",
 "DSC_2893": "Supporters in Argentina and England shirts talk at the Norway v England watch party",
 "51d84fbb069c308a49c8bc6c4776d980": "A player in an orange shirt strikes the ball at 4 x 4 Series SZN 5; photograph by ThePapare",
 "DSC_8305": "Friends watch the World Cup final from the terrace",
 "DSC_9009": "A player strikes the ball under the floodlights at 4 x 4 Series SZN 6",
 "DSC_7585": "Supporters watch England v Argentina in a packed bar",
 "DSC_7514": "A supporter takes a photo at the Spain v France watch party",
 "DSC_2721": "Supporters watch the Norway v England match from their table",
}

A32, A43, A45, A16, A169, STAGE = 3 / 2, 4 / 3, 4 / 5, 1.6, 16 / 9, 0.85

# path: (key, aspect, fx, fy, zoom, max width[, group])
SLOTS = {
 # --- page banners ---
 "/heroes/who.webp": ("DSC_8486", A32, .5, .55, 1.1, 2400),
 "/heroes/events.webp": ("DSC_8877", A32, .5, .55, 1.1, 2400),
 "/heroes/community.webp": ("DSC_7395", A32, .5, .4, 1, 2400),
 "/heroes/contact.webp": ("DSC_2817", A32, .55, .45, 1, 2400),
 "/heroes/collaborate.webp": ("DSC_7607", A32, .5, .45, 1, 2400),
 "/heroes/gallery.webp": ("DSC_8040", A32, .5, .5, 1, 2400),
 # --- home ---
 "/home/who-we-are.webp": ("DSC_8310", A32, .55, .62, 1.2, 2400),
 "/home/moment-crowd.webp": ("DSC_8480", A32, .4, .55, 1, 1600),
 "/home/moment-celebration.webp": ("DSC_9274", A32, .5, .42, 1, 1600),
 "/home/moment-strike.webp": ("DSC_8533", A32, .5, .6, 1.15, 1600),
 "/home/moment-trophy.webp": ("e6ccd632929a10a0001976a1436a927d", None, .5, .5, 1, 1600),
 "/home/moment-night.webp": ("DSC_9019", A32, .5, .55, 1, 1600),
 "/home/marker-1.webp": ("DSC_8308", None, .5, .5, 1, 600),
 "/home/marker-2.webp": ("DSC_8461", None, .5, .5, 1, 600),
 "/home/marker-3.webp": ("DSC_8128", None, .5, .5, 1, 600),
 "/home/marker-4.webp": ("DSC_9142", None, .5, .5, 1, 600),
 "/home/marker-5.webp": ("DSC_9054", None, .5, .5, 1, 600),
 "/home/marker-6.webp": ("DSC_8906", None, .5, .5, 1, 600),
 "/pages/competition-4x4.webp": ("DSC_8084", A43, .5, .62, 1, 1600),
 "/pages/competition-division-0.webp": ("DSC_6047", A43, .5, .5, 1, 1600),
 # --- home "Events" stage (desktop): tall crops, anchored so nothing important is cut ---
 "/pages/stage-ground-zero.webp": ("a7250da5259f21783b7d175e6814318f", STAGE, .5, .55, 1, 1200),
 "/pages/stage-turf-wars.webp": (TURF, STAGE, .555, .42, 1.45, 1200),
 "/pages/stage-4x4.webp": ("DSC_7926", STAGE, .5, .5, 1, 1200),
 "/pages/stage-division-0.webp": ("DSC_6070", STAGE, .66, .55, 1, 1200),
 "/pages/stage-watch-parties.webp": ("DSC_3035", STAGE, .45, .5, 1, 1200),
 # --- Who we are ---
 "/who/strip-1.webp": ("DSC_2707", A43, .5, .5, 1, 1600),
 "/who/strip-2.webp": ("DSC_2695", A43, .5, .45, 1.1, 1600),
 "/who/norway-england-fan.webp": ("DSC_2943", A43, .6, .5, 1.1, 1600),
 "/who/story.webp": ("DSC_8315", A43, .5, .55, 1, 1600),
 # --- timeline ("the run so far"): frame is 1.6:1 ---
 "/pages/run-ground-zero.webp": ("7aaf44b2325043b32863ae79266bf503", A16, .5, .65, 1, 1280),
 "/pages/run-4x4.webp": ("DSC_9292", A16, .5, .5, 1, 1200),
 "/pages/run-watch-parties.webp": ("DSC_2878", A16, .5, .5, 1, 1200),
 "/pages/run-division-0.webp": ("DSC_6038", A16, .6, .55, 1, 1200),
 # --- Events ---
 "/pages/events-strike.webp": ("DSC_8225", A43, .5, .6, 1, 1600),
 "/pages/events-keeper.webp": ("DSC_8212", A43, .55, .55, 1.1, 1600),
 "/pages/events-day-match.webp": ("DSC_8056", A43, .5, .6, 1, 1600),
 # --- Community ---
 "/pages/community-team.webp": ("DSC_8645", A43, .5, .62, 1, 1600),
 "/pages/community-final-table.webp": ("DSC_8471", A43, .55, .6, 1.1, 1600),
 "/pages/community-division-0.webp": ("DSC_8156", A43, .5, .5, 1, 1600),
 "/pages/story-4x4-1.webp": ("DSC_8242", A32, .5, .55, 1, 1600),
 "/pages/story-4x4-2.webp": ("DSC_8249", A32, .5, .55, 1, 1600),
 "/pages/story-4x4-3.webp": ("DSC_8370", A32, .5, .55, 1, 1600),
 "/pages/story-watch-1.webp": ("DSC_7358", A32, .5, .5, 1, 1600),
 "/pages/story-watch-2.webp": ("DSC_2896", A32, .5, .5, 1, 1600),
 "/pages/story-watch-3.webp": ("DSC_8492", A32, .5, .55, 1, 1600),
 "/pages/story-division-0-1.webp": ("DSC_6037", A32, .5, .5, 1, 1600),
 "/pages/story-division-0-2.webp": ("DSC_6078", A32, .5, .5, 1, 1600),
 "/pages/story-ground-zero-1.webp": ("64180eedf3609ee2af7a3963de801a1b", None, .5, .5, 1, 1600),
 "/pages/story-ground-zero-2.webp": ("5ad03adee47f63af37381581c1541f7b", None, .5, .5, 1, 1600),
 "/pages/story-ground-zero-3.webp": ("2e759a89f02dad23027364837500e0a5", None, .5, .5, 1, 1600),
 # --- Contact ---
 "/pages/contact-cheer.webp": ("DSC_2663", A43, .5, .5, 1, 1600),
 "/pages/contact-trophies.webp": ("DSC_9258", A43, .5, .55, 1, 1600),
 "/pages/contact-watching.webp": ("DSC_7603", A43, .4, .55, 1.1, 1600),
 # --- Collaborate ---
 "/pages/collab-venue.webp": ("DSC_6067", A43, .5, .26, 1, 1600),
 "/pages/collab-bar-crowd.webp": ("DSC_7669", A43, .55, .5, 1.1, 1600),
 "/pages/collab-celebration.webp": ("DSC_7853", A43, .55, .42, 1.1, 1600),
 "/pages/collab-partner-can.webp": ("DSC_6066", A45, .5, .55, 1, 1600),
 "/pages/collab-prizes.webp": ("DSC_9120", A43, .4, .6, 1, 1600),
 "/pages/collab-community.webp": ("DSC_8450", A43, .5, .55, 1.1, 1600),
 "/pages/offer-visibility.webp": ("DSC_8569", A43, .5, .55, 1, 1600),
 "/pages/offer-custom.webp": ("DSC_8849", A43, .5, .55, 1, 1600),
 "/pages/collab-talk.webp": ("51d84fbb069c308a49c8bc6c4776d980", A45, .5, .6, 1, 1600),
 # --- other ---
 "/pages/notfound.webp": ("DSC_7884", None, .5, .5, 1, 1400),
 "/pages/menu-home.webp": ("DSC_8274", A169, .5, .5, 1, 1920),
 "/pages/menu-who.webp": ("DSC_2702", A169, .5, .5, 1, 1920),
 "/pages/menu-events.webp": ("DSC_8333", A169, .5, .5, 1, 1920),
 "/pages/menu-gallery.webp": ("DSC_8355", A169, .5, .5, 1, 1920),
 "/pages/menu-community.webp": ("DSC_2821", A169, .5, .5, 1, 1920),
 "/pages/menu-collaborate.webp": ("DSC_3137", A169, .5, .5, 1, 1920),
 "/pages/menu-contact.webp": ("DSC_2866", A169, .5, .5, 1, 1920),
 # --- hall of fame / album cards. Group = the album: its card, cover and lead share a photo ---
 "/champions/szn-6.webp": ("DSC_9098", A32, .5, .55, 1, 1600, "card:szn-6"),
 "/champions/division-0.webp": ("DSC_6097", A32, .6, .55, 1.05, 1600, "card:division-0"),
 "/champions/wa-final-esp-arg.webp": ("DSC_8186", A32, .62, .5, 1.15, 1600, "card:wa-final-esp-arg"),
 "/champions/wa-semi-eng-arg.webp": ("DSC_7731", A32, .45, .45, 1.1, 1600, "card:wa-semi-eng-arg"),
 "/champions/wa-semi-esp-fra.webp": ("DSC_7418", A32, .5, .55, 1, 1600, "card:wa-semi-esp-fra"),
 "/champions/wa-norway-england.webp": ("DSC_2912", A32, .55, .45, 1.1, 1600, "card:wa-norway-england"),
 "/champions/ground-zero.webp": ("7b42c24563fa5141ef55d70774909ba5", None, .5, .5, 1, 1600),
 "/gallery/szn-5-hero.webp": ("65d008dc9230d161a481e6cd8b45550d", None, .5, .5, 1, 1600),
}

# Featured photos per album, lead first (the lead is also the album's card and cover).
HIGHLIGHTS = {
 "szn-6": ["DSC_9098", "DSC_8722", "DSC_8676", "DSC_9064", "DSC_8985", "DSC_8388"],
 "division-0": ["DSC_6097"],
 "wa-final-esp-arg": ["DSC_8186", "DSC_8463", "DSC_8652", "DSC_8737"],
 "wa-semi-eng-arg": ["DSC_7731", "DSC_7723", "DSC_7594", "DSC_7604", "DSC_7610", "DSC_7749"],
 "wa-semi-esp-fra": ["DSC_7418", "DSC_7436", "DSC_7547", "DSC_7478", "DSC_7339"],
 "wa-norway-england": ["DSC_2912", "DSC_2719", "DSC_2847", "DSC_2807", "DSC_2893"],
}
# The gallery's moving strip: one different photo per album (None = leave album out).
REEL = {
 "szn-6": "DSC_9009", "wa-final-esp-arg": "DSC_8305", "wa-semi-eng-arg": "DSC_7585",
 "wa-semi-esp-fra": "DSC_7514", "wa-norway-england": "DSC_2721", "division-0": None,
}
# Albums with no new photos keep their old files; their strip frame becomes another featured photo.
OLD_REEL_FROM = {"szn-1": 85, "szn-2": 609, "szn-3": 93, "szn-4": 40, "wa-ucl-final-night": 21}


def crop(im, aspect, fx, fy, zoom):
    if aspect is None:
        return im
    W, H = im.size
    w, h = (W, W / aspect) if W / H <= aspect else (H * aspect, H)
    w, h = w / zoom, h / zoom
    x0 = min(max(fx * W - w / 2, 0), W - w)
    y0 = min(max(fy * H - h / 2, 0), H - h)
    return im.crop((round(x0), round(y0), round(x0 + w), round(y0 + h)))


used = {}
def claim(key, group):
    if key in used and used[key] != group:
        raise SystemExit(f"REPEATED PHOTO: {key} feeds both {used[key]} and {group}")
    used[key] = group


records = []
def export(key, src, aspect, fx, fy, zoom, width, group=None, responsive=True):
    claim(key, group or src)
    out = REPO / "public" / src.lstrip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(file_for(key)) as source:
        im = crop(ImageOps.exif_transpose(source).convert("RGB"), aspect, fx, fy, zoom)
        if im.width > width:  # shrink only, never enlarge
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(out, format="WEBP", quality=86, method=6)
    for stale in out.parent.glob(out.stem + "-*.webp"):
        if re.fullmatch(re.escape(out.stem) + r"-(800|1200)\.webp", stale.name):
            stale.unlink()
    if responsive:
        for w in (800, 1200):
            if w < im.width:
                im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(out.with_name(f"{out.stem}-{w}.webp"), format="WEBP", quality=80, method=6)
    records.append(dict(key=key, src=src, source=file_for(key).name, w=im.width, h=im.height, alt=ALT[key]))
    return im.width, im.height


for src, spec in SLOTS.items():
    key, aspect, fx, fy, zoom, width = spec[:6]
    export(key, src, aspect, fx, fy, zoom, width, spec[6] if len(spec) > 6 else None)
by_src = {r["src"]: r for r in records}

# Highlights: whole frames, placed by each photo's slot in its Drive album.
ht = (REPO / "lib/highlights.ts").read_text(encoding="utf-8")
hs = json.loads(re.search(r"export const highlights: Record<string, Highlight\[\]> = (\{.*?\n\});", ht, re.S)[1])
reel = json.loads(re.search(r"export const reel: ReelFrame\[\] = (\[.*?\n\]);", ht, re.S)[1])
reel_by = {r["albumId"]: r for r in reel}


def drop_reel(album):
    global reel
    old = reel_by.get(album)
    if old:
        (REPO / "public" / old["src"].lstrip("/")).unlink(missing_ok=True)
        reel = [r for r in reel if r["albumId"] != album]


for album, keys in HIGHLIGHTS.items():
    manifest = [x["i"] for x in json.loads((REPO / "public/albums" / f"{album}.json").read_text())["items"]]
    old = [REPO / "public" / h["src"].lstrip("/") for h in hs.get(album, [])]
    hs[album] = []
    for i, key in enumerate(keys):
        drive_id = next(x["id"] for x in DRIVE if x["album"] == album and Path(x["name"]).stem == key)
        n = manifest.index(drive_id) + 1
        src = f"/gallery/highlights/{album}/{n}.webp"
        w, h = export(key, src, None, .5, .5, 1, 1600, f"card:{album}" if i == 0 else None)
        hs[album].append(dict(n=n, id=drive_id, src=src, w=w, h=h, alt=ALT[key]))
    keep = {REPO / "public" / h["src"].lstrip("/") for h in hs[album]}
    for f in old:
        if f not in keep:
            for g in (f, f.with_name(f.stem + "-800.webp"), f.with_name(f.stem + "-1200.webp")):
                g.unlink(missing_ok=True)
    export(keys[0], f"/gallery/cover/{album}.webp", None, .5, .5, 1, 800, f"card:{album}", responsive=False)
    drop_reel(album)
    if REEL.get(album):
        key = REEL[album]
        drive_id = next(x["id"] for x in DRIVE if x["album"] == album and Path(x["name"]).stem == key)
        n = manifest.index(drive_id) + 1
        src = f"/gallery/reel/{album}-{n}.webp"
        with Image.open(file_for(key)) as s:
            size = ImageOps.exif_transpose(s).size
        w, h = export(key, src, None, .5, .5, 1, round(420 * size[0] / size[1]), responsive=False)
        reel.append(dict(src=src, w=w, h=h, alt=ALT[key], albumId=album))

# Older albums (no new photos): the strip shows a different featured photo than the card.
for album, n in OLD_REEL_FROM.items():
    pick = next(h for h in hs[album] if h["n"] == n)
    drop_reel(album)
    src = f"/gallery/reel/{album}-{n}.webp"
    with Image.open(REPO / "public" / pick["src"].lstrip("/")) as s:
        s = s.convert("RGB")
        w = round(420 * s.width / s.height)
        s.resize((w, 420), Image.LANCZOS).save(REPO / "public" / src.lstrip("/"), format="WEBP", quality=82, method=6)
    reel.append(dict(src=src, w=w, h=420, alt=pick["alt"], albumId=album))
order = ["szn-6", "wa-final-esp-arg", "szn-1", "wa-semi-eng-arg", "szn-4", "wa-norway-england", "szn-3", "wa-ucl-final-night", "szn-2", "division-0"]
reel.sort(key=lambda r: order.index(r["albumId"]) if r["albumId"] in order else 99)
tail = ht[ht.index("/* The picture an album card"):]
ht = "/* Featured photos, refreshed 2026-10-20 from the owner's photo folder. Album positions/Drive IDs are provenance. */\n"
ht += "export type Highlight = { n: number; id: string; src: string; w: number; h: number; alt: string };\n"
ht += "export const highlights: Record<string, Highlight[]> = " + json.dumps(hs, indent=2) + ";\n"
ht += "export type ReelFrame = { src: string; w: number; h: number; alt: string; albumId: string | null };\n"
ht += "export const reel: ReelFrame[] = " + json.dumps(reel, indent=2) + ";\n" + tail
(REPO / "lib/highlights.ts").write_text(ht, encoding="utf-8")


def home(src):
    r = by_src[src]
    hit = [x for x in DRIVE if Path(x["name"]).stem == r["key"]]
    return dict(id=r["key"], src=src, sourceUrl=f"https://drive.google.com/file/d/{hit[0]['id']}/view" if hit else "", w=r["w"], h=r["h"], alt=r["alt"])


hp = "/* Photo refresh, 2026-10-20: cropped exports from the owner's photo folder, none repeated.\n   sourceUrl records provenance. The home hero is reserved for video. */\n"
hp += "export type HomePhoto = { id: string; src: string; sourceUrl: string; w: number; h: number; alt: string };\n"
hp += "/* The big frames that pan across the Moment act. */\n"
hp += "export const marqueePhotos: HomePhoto[] = " + json.dumps([home("/home/moment-" + n + ".webp") for n in ["celebration", "strike", "trophy", "night"]], indent=2) + ";\n"
hp += "/* The small tilted frames that drift round the headline: football and celebrations only. */\n"
hp += "export const markerPhotos: HomePhoto[] = " + json.dumps([home(f"/home/marker-{i}.webp") for i in range(1, 7)], indent=2) + ";\n"
hp += "export const statementPhoto: HomePhoto = " + json.dumps(home("/home/moment-crowd.webp"), indent=2) + ";\n"
hp += "export const competitionPhotos = " + json.dumps({"4 x 4 Series": home("/pages/competition-4x4.webp"), "Division 0": home("/pages/competition-division-0.webp")}, indent=2) + ";\n"
(REPO / "lib/home-photos.ts").write_text(hp, encoding="utf-8")

# Alt text everywhere a src is paired with one (object literals and JSX tags).
for p in list((REPO / "app").rglob("*.tsx")) + list((REPO / "components").rglob("*.tsx")) + [REPO / "content.js"]:
    text = old = p.read_text(encoding="utf-8")
    for src, r in by_src.items():
        text = re.sub(r'((?:src|photo): "' + re.escape(src) + r'",\s*(?:photoCredit: "[^"]*",\s*)?(?:alt|photoAlt): ")[^"]*(")', lambda m: m[1] + r["alt"] + m[2], text)
        text = re.sub(r'(src="' + re.escape(src) + r'"[^>]*?\balt=")[^"]*(")', lambda m: m[1] + r["alt"] + m[2], text, flags=re.S)
    if text != old:
        p.write_text(text, encoding="utf-8")

(ROOT / "applied-assets.json").write_text(json.dumps(records, indent=1), encoding="utf-8")
print("Exported", len(records), "files from", len(used), "source photos; no photo repeated")
