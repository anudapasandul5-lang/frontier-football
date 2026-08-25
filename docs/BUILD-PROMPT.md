# Frontier Football — v1 build prompt

Paste one of the fenced blocks below into a fresh Claude Code session opened in the
`Frontier Football` repo.

---

## LEAN VERSION

```
Build the Frontier Football v1 site in this repo. Everything you need is already here — do not re-research.

READ FIRST, in order:
- DESIGN.md — the form language we are copying (tokens, components, motion philosophy).
- Frontier-Football-References.md — brand guide extract + why we borrow structure, not palette.
- Data and references/FRONTIER FOOTBALL_BRANDGUIDE.pdf — visual source of truth.
- C:\Users\anuda\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-25 145506.png — the Lazarev hero we are matching.

THE RULE: Frontier's colours and voice, the references' form. Cream #FFF8DB paper base; #FABA2A yellow, #305552 green, #87292D red, #E97404 orange as the sticker rainbow; #0C2037 navy as ink and hand-cut outlines. Giant crushed display caps (line-height 0.78), 3D objects nested between letterforms, saturated filled cards at 24-40px radius, outlined pills. If it looks pastel it is wrong; if it looks like a dark cinematic football site it is wrong.

SCOPE (single scroll, in order): Hero, What is Frontier, Champions & Honours, Gallery, Sponsors, Links hub, Footer. No events section. No forms, no backend, no CMS.

THE ONE ACTION: follow @frontierfootballl on Instagram. It is the hero CTA and it wins every layout argument above the fold.

STACK: plain HTML/CSS/JS on Vite. All season content in one commented content.json. Vitest for logic, Playwright for the two interactive pieces. Deploy free on Vercel or Netlify.

MOTION: hero is the showpiece — scroll-driven letterform reveal, 3D objects parallaxing between letters, magnetic hover on the CTA. Everything below is CSS reveals, hover lift, one marquee. Honour prefers-reduced-motion everywhere.

IMAGES: generate 8-12 3D sticker objects (ball, boot, keeper glove, whistle, trophy, scarf, cone, bottle) via kie.ai — key in .env as KIE_API_KEY. POST https://api.kie.ai/api/v1/flux/kontext/generate then poll /api/v1/flux/kontext/record-info?taskId=. Costs 5 credits each, 75 left. Generate ONE first, look at it, then batch. Render each object on flat #FFF8DB so no alpha keying is needed.

BUILD ORDER — one ticket, then STOP and show me before the next:
0. Scaffold + git init + .gitignore (.env must be in it) + prove deploy on a live URL.
1. Design system + CONTEXT.md domain model.
2. Generate the sticker objects.
3. Hero.
4. What is Frontier.
5. Champions & Honours.
6. Gallery.
7. Sponsors + links hub + footer.
8. Polish, a11y, perf, meta/OG, go live.

Per ticket: mattpocock TDD for real logic only (never for static markup), /impeccable for the visual pass, /web-design-engineer for browser acceptance. Suggest I /clear between tickets.

KNOWN CONTENT: SZN 3 champion Ramadan FC. SZN 4 champion Pantera FC. SZN 6 (World Cup Edition) champion Spain. SZN 5 champion and every Golden Boot / Golden Glove are TODO — put them in content.json as TODO strings with comments, and make the layout render cleanly with them missing. TikTok handle and domain are also TODO. Never invent a value.

DONE WHEN: live on a URL, reads unmistakably as Frontier, Instagram follow is the obvious action, and a whole season can be swapped by editing content.json alone.
```

---

## FULL VERSION

```
You are building the v1 website for Frontier Football — a Colombo small-sided futsal and football-culture brand, ESTD 2024. Tagline: "Built by football. Powered by community."

Everything you need is already in this repo. Do NOT re-research, do NOT re-scope, do NOT relitigate the decisions listed under LOCKED.

===========================================
1. READ FIRST — source of truth, in this order
===========================================
1. DESIGN.md — a full style reference (Slush). This is the FORM LANGUAGE we are copying: token structure, type scale, component recipes, radius scale, motion philosophy, and the CSS custom-property block at the bottom. Read all of it before writing any CSS.
2. Frontier-Football-References.md — the brand-guide extract plus a 14-reference analysis. The section "The tension, spelled out" states the rule we are working to. Obey it.
3. Data and references/FRONTIER FOOTBALL_BRANDGUIDE.pdf — 6pp, visual source of truth for crest, lockups, doodles, paint splats, photo-strip framing.
4. C:\Users\anuda\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-25 145506.png — the Lazarev sports concept. Giant black condensed headline with photos and 3D objects tucked inside and between the letters, saturated program-card row beneath. This is the hero we are matching.
5. Data and references/instagram-media/manifest.json — 100 real posts (60 video, 25 image, 15 sidecar), Jul 2025 to Aug 2026, with shortCode/type/timestamp/caption/image/video. This is the gallery source.

===========================================
2. THE DESIGN LAW — the one rule everything else serves
===========================================
Frontier's colours and voice. The references' form.

DESIGN.md is a pastel sticker system. We keep its GRAMMAR and throw away its PALETTE.

Keep from DESIGN.md:
- Display type at 200-640px with crushed 0.75-0.80 line-height, so words become sculptural objects rather than sentences.
- Every brand colour appearing as a FILLED surface — a sticker, a card, a wash — never as a timid 4px accent.
- Hand-cut outline treatment: solid ink outlines on cards and pills, so elements read as physical stickers on paper.
- Generous rounding: 24-40px on cards, fully pill-shaped on nav and buttons.
- Collage logic: decorative objects scattered with intent, overlapping section boundaries.

Throw away from DESIGN.md:
- Every hex value in its token table. Sky wash, lavender, mint, electric blue, ember — none of them ship.

Substitute this palette (from the Frontier brand guide):
  Paper   #FFF8DB   Page canvas. The cream base everything sits on.
  Ink     #0C2037   Display type, all outlines, body text, footer fill.
  Yellow  #FABA2A   THE hero colour. Primary CTA fill, champion cards, paint-splat lockup.
  Green   #305552   Deep counterweight. Section panels, secondary cards, dark interludes.
  Red     #87292D   Hot accent. Badges, live-style pills, the chevron mark.
  Orange  #E97404   Fourth sticker colour. Alternating cards, hover states.

Rainbow rule: the honours grid and any card row must cycle yellow, green, red, orange as filled sticker surfaces with ink outlines. That row is the single most important borrowed device from the Lazarev reference.

Two failure states, both fatal:
- It looks pastel and Scandinavian. You copied DESIGN.md's palette. Wrong.
- It looks dark, cold and cinematic. You copied the ten dark references that Frontier-Football-References.md explicitly warns against. Wrong.

TYPOGRAPHY — read this carefully, there is a real blocker here.
The brand guide specifies Telegraf (body) and Super Squad (display). Neither font file is in this repo and both are commercial. Do not stall on it and do not silently pick something.
- Ask me once, in ticket 1, whether I can supply the licensed web fonts.
- Until I do, use Archivo Black (display) and Space Grotesk (body) from Google Fonts. Set the display face at line-height 0.78 with tight tracking to get the crushed sculptural effect.
- Put BOTH families behind CSS custom properties (--font-display, --font-body) so swapping in the real faces is a two-line change.
- Leave a "TODO: swap to Super Squad / Telegraf when licensed files land" comment at the definition site.

===========================================
3. LOCKED — decided, do not reopen
===========================================
- Scope, single scroll, in this order: Hero, What is Frontier, Champions & Honours, Gallery, Sponsors, Links hub, Footer.
- NO events section. Tournaments are currently on break and we are not putting a dormant block on the page. Do not add "upcoming events", a fixtures list, or a countdown.
- NO backend, NO database, NO CMS, NO registration form. If something feels data-like, it is either a hand-updated entry in content.json or a link-out.
- Light theme. This was an open question in the reference doc; both gold standards are light and the brand guide is light. It is settled.
- The ONE action a visitor should take is FOLLOW @frontierfootballl ON INSTAGRAM. When a layout decision is ambiguous above the fold, the choice that makes the follow more obvious wins.
- Stack: plain HTML + CSS + JS built with Vite. No framework. No Tailwind. No component library. No animation library unless ticket 3 proves hand-rolled scroll maths genuinely cannot do the hero.
- All season/content data lives in ONE commented content.json at the repo root. The owner is non-technical and will never touch code — a whole season swap must be a data edit, never a layout edit.
- Video is embedded or served from the local clips already in the repo. Never re-hosted from Instagram CDN, because those URLs are signed and expire.
- Deploy free on Vercel or Netlify.

===========================================
4. MOTION BUDGET
===========================================
The hero is the showpiece. Everything below it is calm.

Hero gets:
- A scroll-driven reveal on the display headline — letterforms arriving as sculptural blocks, not a fade.
- 3D sticker objects parallaxing at different rates between and behind the letters.
- Magnetic hover on the primary Instagram CTA.

Everything below gets only:
- Reveal-on-scroll (transform + opacity, IntersectionObserver, CSS transitions).
- Hover lift on cards.
- Exactly one marquee ticker — use it for the tagline or the sponsor strip, not both.

Hard limits:
- Every animation honours prefers-reduced-motion with a genuinely static fallback, not a faster animation.
- Animate transform and opacity only. Nothing that triggers layout.
- The site must stay usable on a mid-range Android phone on Sri Lankan mobile data. If a scroll effect costs more than it delivers, cut it.

===========================================
5. ASSETS ON DISK
===========================================
Data and references/
  FRONTIER FOOTBALL_BRANDGUIDE.pdf          6pp brand guide
  Frontier Football Logo/                   Logo-01..04 (png/jpg) + layered .ai
  4x4/SZn 4/, 4x4/Snz5/, 4x4/Szn6/          Award certificate PDFs. NOTE: these are
                                            blank templates. No team names in them.
                                            Useful as typography/layout reference only.
  4x4/SZn 4/APRIL.jpg, 4x4/SZn 4/Digitals/  Season graphics
  Turf Wars/Video/, Turf Wars/Video 2/      Turf Wars clips
  End Screens Szn 5/1..10.mp4               Season 5 end-screen clips
  instagram-media/ + manifest.json          100 posts, real downloaded media

Gallery source order: pull from instagram-media first (it is real, recent and on-brand), then Turf Wars clips, then End Screens.

===========================================
6. CONTENT — what is known and what is not
===========================================
Known:
- Instagram: @frontierfootballl — VERIFIED LIVE (896 followers, 141 posts, "Frontier Football"). The brand guide's @frontierfutsall is the dead pre-rebrand handle. Do not use it anywhere.
- SZN 3 champion: Ramadan FC (@ramadanfc.official)
- SZN 4 champion: Pantera FC
- SZN 6 champion: Spain. Season 6 was a "World Cup Edition" where teams were named after countries.
- Turf Wars had a champion and a runner-up (Aug 2025). Names not recovered.
- Venues seen in posts: One Galle Face, Havelock City Mall, Pixels N Pints, Athlete 360, Club Fusion.
- Sponsors/partners seen in posts: main.sportsbar, address.lk, iodexsrilanka, nutrimax.iso, Sofascore, shirtshack.lk, drinkhypebam, ThePapare, absystudios, zone360.lk, athlete360_sl.

TODO — put these in content.json as explicit TODO strings with comments, and make every layout render cleanly while they are missing. Do NOT invent values.
- SZN 5 champion
- Every Golden Boot winner
- Every Golden Glove winner
- Every runner-up
- Turf Wars champion and runner-up
- TikTok handle
- The domain
- WhatsApp community link, if one exists

content.json shape — design it so a season is one object in an array, with the honours grid rendering whatever is present and skipping whatever is TODO. Comment every field in plain English for a non-technical editor. Sponsors are a list of {name, logo, url}; hi-res sponsor logos are NOT in the repo yet, so render a text-only sponsor treatment that upgrades gracefully when logo files arrive.

===========================================
7. IMAGE GENERATION — kie.ai
===========================================
Key is in .env as KIE_API_KEY. .env is gitignored at the home level, but the new repo needs its OWN .gitignore with .env in it — do that in ticket 0 before the first commit. Never print the key, never commit it, never put it in client-side JS.

Verified working:
  POST https://api.kie.ai/api/v1/flux/kontext/generate     body {"prompt": "..."}  -> {data:{taskId}}
  GET  https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=...  -> {data:{response:{resultImageUrl}}}
  POST https://api.kie.ai/api/v1/jobs/createTask           body {"model":"google/nano-banana","input":{"prompt":"..."}}
  GET  https://api.kie.ai/api/v1/chat/credit               -> remaining credits
All return HTTP 200 with the real status in the JSON "code" field. Check "code", not the HTTP status.

Budget: 75 credits remain. flux-kontext-pro costs 5 credits per image. That is about 15 images total including re-rolls. Treat it as scarce.
- Generate ONE object first. Look at it. Show me. Only then batch the rest.
- Check /chat/credit before and after the batch and report the spend.
- If a generation comes back wrong, do not silently re-roll more than once. Show me and ask.

What to generate — 8 to 12 objects, in this priority order:
1. Football  2. Boot  3. Keeper glove  4. Trophy  5. Whistle  6. Tri-colour scarf  7. Traffic cone  8. Water bottle

Prompt each as: a single glossy inflated 3D object, thick soft rounded forms, studio lighting with a soft drop shadow, coloured in one of the Frontier palette hexes, centred, isolated, rendered on a flat #FFF8DB cream background.

Rendering on flat cream means NO alpha keying is needed — the objects sit on the cream page directly. Do not build a background-removal pipeline; that is the corner we are deliberately cutting.

===========================================
8. BUILD ORDER — one ticket at a time
===========================================
Build ONE ticket. Show me the result. STOP. Wait for my sign-off. Then suggest I /clear before the next.

T0  Scaffold + deploy proof
    Vite project, git init, .gitignore (MUST include .env, node_modules, dist),
    a placeholder index.html, deployed to a live Vercel or Netlify URL.
    Prove deploy works before any design exists.

T1  Design system + domain model
    CSS custom properties for the full palette, type scale, spacing and radius,
    structured the way DESIGN.md's Quick Start block structures its tokens, with
    Frontier's values. Base element styles. The core primitives: sticker card,
    outlined pill, filled CTA, display headline block, marquee.
    Write CONTEXT.md (mattpocock domain-modeling) naming the domain terms:
    season, champion, honour, fixture, turf war, watch-along, partner.
    Ask me about the fonts here.
    Ship a single styleguide page showing every primitive. That page is what I sign off on.

T2  Sticker objects
    Generate per section 7. Optimise to WebP. Report credit spend.

T3  Hero
    Crest, giant crushed display headline, 3D objects nested between letterforms,
    the Instagram follow CTA as the unmistakable primary action, scroll-driven
    reveal, object parallax, magnetic hover.
    This is the ticket the whole site is judged on. Spend the time here.

T4  What is Frontier
    The story, the tagline, a small set of real numbers used as emotional beats
    rather than as a stats dashboard.

T5  Champions & Honours
    Season grid from content.json, cycling the sticker rainbow, rendering cleanly
    around every TODO. Vitest covers the content loader and the missing-data path.

T6  Gallery
    Real media from instagram-media plus Turf Wars and End Screens clips.
    Lazy-loaded, poster frames on video, keyboard-accessible lightbox.
    Playwright covers open, close and keyboard nav.

T7  Sponsors + links hub + footer
    Text-first sponsor treatment. Links hub: Instagram first and largest, then
    TikTok, then Sofascore, then WhatsApp. Footer with crest and tagline.

T8  Polish and ship
    Responsive from 320px up. Lighthouse mobile: performance >= 90, accessibility >= 95.
    Real focus states. Reduced-motion path verified. Meta tags, OG image, favicon.
    Compress every image and video. Run mattpocock code-review over the full diff.
    Go live.

===========================================
9. PER-TICKET WORKFLOW
===========================================
- Re-read the relevant DESIGN.md section before writing that ticket's CSS.
- mattpocock TDD applies to REAL LOGIC ONLY: the content.json loader, the
  missing-data path, the gallery lightbox, any filter. Failing test first, minimal
  code to pass, refactor. Do NOT write tests for static markup or for CSS. That is
  ceremony and it will slow the build without catching anything.
- Run /impeccable for the visual pass on every ticket that produces UI.
- Run /web-design-engineer for browser acceptance before you call a ticket done.
- Ship the smallest thing that works. No abstraction with one caller. No config for
  a value that never changes. No dependency that a few lines of CSS or JS replaces.
- Mark any deliberate corner-cut with a "ponytail:" comment naming the ceiling and
  the upgrade path.

===========================================
10. DONE WHEN
===========================================
1. Live on a public URL.
2. A stranger sees cream, yellow, green, red and orange and giant crushed type. It
   reads as Frontier, not as a pastel Scandinavian fintech page and not as a dark
   cinematic football site.
3. The Instagram follow is the single most obvious thing to do above the fold.
4. The whole site works at 320px and on a mid-range Android on mobile data.
5. Lighthouse mobile: performance >= 90, accessibility >= 95.
6. prefers-reduced-motion gives a genuinely static, still-beautiful page.
7. A season can be swapped by editing content.json alone. No HTML, no CSS.
8. Every unknown is a visible TODO in content.json. Nothing is invented.

===========================================
11. NEVER
===========================================
- Never use @frontierfutsall. The live handle is @frontierfootballl.
- Never invent a champion, a score, a follower count, a sponsor, or a date.
- Never add an events, fixtures or countdown section.
- Never introduce a backend, a database, a CMS or a form that posts anywhere.
- Never hotlink Instagram CDN URLs. They are signed and they expire.
- Never commit .env or print the kie.ai key.
- Never ship a colour that is not in the Frontier palette.
```
