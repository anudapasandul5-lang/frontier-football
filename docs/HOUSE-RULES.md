# Frontier Football v2: house rules

Standing constraints for every v2 ticket. Read this before building. This file
lives on branch `v2` and **replaces v1's rules for v2**; `main` keeps v1's copy.
The decisions behind it are ADR-0001 (adopt United) and ADR-0002 (Next.js).
The plan is `Projects/Frontier Football/plans/v2-united-redesign.md` in the vault.

## 0. What v1 rules are retired, and why

| v1 rule (on `main`) | v2 status |
|---|---|
| s1 "cream poster", dark cinematic is a failure state | **Retired.** v2 is United: bone and ink, ink is the default canvas (ADR-0001). |
| s2 six colours, yellow is the primary CTA only | **Retired.** United's seven; yellow `#FABA2A` is the one hero mark. |
| s3 Anton + Space Grotesk | **Retired.** Instrument Serif + Oswald + Geist. The *method* (measure leading in-browser, cap display by viewport height) still applies. |
| s4 stack locked: vanilla + Vite, four deps | **Retired.** Next 16 + React + TS 7 + Tailwind v4 (ADR-0002). The npx finding and the "both classes" lesson still apply in spirit. |
| s5 one marquee, hero is the only showpiece | **Retired.** United choreography, bounded by the perf gate in section 5. Reduced-motion, transform/opacity-only and the reveal-must-never-strand-content rules are **kept**. |
| s6 media, s7 content | **Kept** verbatim below. |
| s9 "never add an events section" | **Replaced** by the empty-events rule: the act exists and is absent from the DOM while `events` is empty. |
| s9 "never ship a colour outside the six" | **Replaced** by section 2 below. |

## 1. The look

`docs/design/united/DESIGN.md` is the visual law. In short: one canvas per
act, edge to edge; ink is the default, bone the relief. 0px corners, no
shadows, no gradients, no tints. 11px letterspaced micro-labels above the
thing they label. The serif is never uppercased; Oswald is never sentence
case. Body measure 45-55 characters. Declarative headlines with a full stop.
No CTA language; the one action is following Instagram, as a micro-caps link.

## 2. Palette

Tokens live in `app/globals.css` under `@theme`.

| Token | Hex | Role |
|---|---|---|
| `bone` | `#EFEAE0` | relief canvas |
| `ink` | `#0A0A0A` | default canvas and type on bone |
| `yellow` | `#FABA2A` | Frontier's yellow. Hero display type only, once. |
| `green` | `#2BA662` | 4 x 4 Series colour field. Whole viewport only. |
| `blue` | `#4091DA` | Turf Wars colour field. Whole viewport only. |
| `red` | `#E84634` | Division 0 colour field. Whole viewport only. |
| `teal` | `#0C727E` | closing band. Whole viewport (or the closing band) only. |
| `muted` | `#A8A29A` | secondary text on ink |
| `label` | `#555350` | micro-labels on bone |

The Frontier crest keeps its own colours and is exempt. Real photographs are
exempt. Nothing else ships.

## 3. Typography

- `font-serif` Instrument Serif: emotional lines. `font-display` Oswald,
  uppercase always: structural lines, numerals. `font-sans` Geist: body,
  labels, table cells. All three via `next/font` in `app/layout.tsx`.
- Display leading 0.85-0.9, **verified per face in the browser** before it
  ships (v1 lost a day to Anton colliding at 0.8).
- Cap any giant headline by viewport height as well as width: 1900x780 has
  caught two below-the-fold bugs.

## 4. Stack

- Next.js 16 App Router, static export to `out/`. Server Components by
  default. `"use client"` only in `components/motion/` leaves.
- Tailwind v4 utilities; tokens in `@theme`. Radius and shadow scales are
  zeroed there on purpose. Do not re-add them.
- Scroll engine: GSAP ScrollTrigger via `useGSAP`, Lenis on `gsap.ticker`.
  Motion (motion.dev) for UI springs only, never for scroll.
- **`npx <cmd>` with two or more positional args misparses on this machine.**
  Use npm scripts, `node_modules/.bin/<tool>`, or a global binary.
- Logic lives in `lib/` with vitest tests beside it. `content.js` stays at the
  root, hand-edited, TODO strings meaning absent.
- `npm run build` then `npm run serve` serves `out/` on port 4173, LAN-visible,
  for Lighthouse and for the owner's phone.

## 5. Motion contract

- **Content renders on the server.** Every act's text and images are in the
  static HTML. A motion wrapper sets its pre-animation state from JS after
  hydration, and only under `prefers-reduced-motion: no-preference`. With JS
  off or reduced motion on, every act is fully visible and static.
- **`components/motion/MotionGate.tsx` is the one switch.** After hydration,
  and only under `no-preference`, it sets `<html data-motion="on">` and hands
  every `[data-reveal]` element to `wireReveal()`. Every CSS pre-state and
  every CSS animation is scoped under `:root[data-motion="on"]`, so JS off and
  reduced motion both get the static page by construction.
- The nav is **not fixed**: it would pass over bone, ink and four colour
  fields, and no one text colour reads on all six (T2 decision).
- Animate transform and opacity (and clip-path for reveals) only.
- No reveal may strand content: anything the page jumps past is revealed
  (v1's `shouldReveal`, ported to `lib/reveal.ts`, is the reference).
- Perf gate: Lighthouse mobile performance >= 90, accessibility >= 95 on the
  exported home page. A motion piece that breaks it is simplified.
- Easing tokens: `--ease-out`, `--ease-in-out`, `--ease-drawer`. Never ease-in.

## 6. Media (carried from v1, still true)

> Paths such as `src/styles/gallery.css` below refer to v1 on `main`. The
> findings about the media itself hold on v2 unchanged.


Video and heavy imagery use **opt-in loading**, established in the hero:

```html
<video data-src="/path.mp4" poster="/poster.webp" muted loop playsinline
       preload="none" aria-hidden="true"></video>
```

JS attaches `src` only when motion is allowed AND the viewport is at least
600px, then calls `.play().catch(() => {})` so a refused autoplay cannot
surface as an unhandled rejection. A phone on Sri Lankan mobile data gets
the poster and downloads no video at all. Keep this pattern.

Transcode with ffmpeg (installed). Budget: keep any single clip under
~500KB. Encode at 16:9 and let CSS `object-fit: cover` crop to shape —
pre-cropping to an extreme aspect throws away most of a vertical phone
frame. **Width and height must both be even** or libx264 refuses.

Source media lives in `Data and references/instagram-media/` (100 real
posts, 59 with video). It is gitignored and dev-only: copy what you use
into `public/` first, the same way `public/hero/` and `public/objects/`
were made.

Never hotlink Instagram CDN URLs. They are signed and they expire.

**The champions posts are posters, not photographs.** Every season's champions
announcement is a designed graphic: display type reading "CHAMPIONS" and
"4x4 SERIES SZN n", a sponsor bar, and a palette that is different every season
(SZN 3 orange/blue, SZN 4 lime/blue, SZN 5 yellow/orange). Dropping one whole
into a Frontier surface both duplicates whatever label the surface already
carries and ships colours outside the six. **Crop the team photo out of it** and
throw the poster away. HOUSE-RULES section 2 exempts real photography from the
palette; it does not exempt somebody else's graphic design. Files used in T5:

| Card | Source post | Crop |
|---|---|---|
| SZN 6 | `016-DbQkpyNCnHS.jpg` | `crop=960:490:75:745` |
| SZN 4 | `048-DYRL-IkCihf.jpg` | `crop=1080:570:0:600` |
| SZN 3 | `077-DW8Omc2Cj6p.jpg` | `crop=1040:530:20:585` |
| Turf Wars | `092-DNyEf-8VLpC.jpg` | `crop=480:330:295:545` |

**Gallery-page album thumbnails (2026-09-02), sourced from Google Drive, not Instagram.**
Unlike the champions-poster crops above, these are ordinary match/venue frames — no poster
to strip, just the same bottom-corner badge band as the home gallery. Bottom-crop fraction
applied before resizing to 1280px wide:

| Card | Source folder frame | Bottom crop |
|---|---|---|
| SZN 1 | `_DSC4661.png` | 17% (small crest + REIGNITE, matches the table above) |
| SZN 2 | `DSC_1622.jpg` | none — no badge on this folder's frames |
| Final: Spain vs Argentina | `DSC_8573.jpg` | none |
| Semi-final: England vs Argentina | `DSC_7643.jpg` | none |
| Semi-final: Spain vs France | `DSC_7436.jpg` | none |
| Norway vs England | `DSC_2912.jpg` | none |
| UCL Final Night | `DSC_4069.jpg` | 24% (large crest + MAIN, matches the table above) |

SZN 5 has a clean cover frame from Frontier's own `026-DaDIerCqF4H.mp4` event
video (24s, trophy table); `driveFolder` is still `TODO`. Its watermarked
ThePapare photographs stay in the credited album. Frontier Futsal Tournament
uses an already-imported ThePapare photograph as its cover by owner decision
on 2026-09-23: keep the Milinda Deshan/ThePapare watermark fully visible and
show the photographer credit beside it.

**SZN 5's champions post is not ours.** `025-DZsCdd6is2X.jpg` carries a
"©Ashan Senevirath… www.thepapare.com" watermark across the team. Cropping it
out would be stripping a photographer's copyright notice. Left unused, and
`content.js` says why. Clear it with ThePapare before reaching for it.

Manifest captions are **hard-truncated at exactly 120 characters**, mid-word.
Several champion names sit just past the cut, SZN 5's included. A truncated
caption is not a source: it tells you a post exists, not what it says.

**FINDING from T6's triage of all 100 posts — do not re-derive.** Of 100 source
posts, only 19 are usable as gallery photography. The rest fail for four reasons,
and three of them are invisible at thumbnail size:

- **Designed posters and announcement graphics: about half the feed.** Watch
  parties, fixture cards, "CHAMPIONS", "4x4 SERIES", "TURF WARS", giveaways,
  partner announcements. Already covered above; the point here is the proportion.
- **A second ThePapare watermark exists.** `024-DZT-KzxDM9K.jpg` carries the same
  "©Ashan Senevirathne / thepapare.com" mark as `025`, printed across a player in
  an orange kit. Both are unusable for the same reason: cropping it off is
  stripping a photographer's copyright notice. That is now **two** known files,
  not one. Clear either with ThePapare before reaching for it.
- **Reel covers carry the reel's own burned-in subtitle.** `006`, `009`, `035`,
  `051`, `059`, `068`, `075`, `078`, `079`, `083`, `084` and others print a line
  of caption across the middle of the frame. It cannot be cropped without cutting
  the subject, and it is not croppable at all when it sits mid-frame. Reject.
- **Many good photographs carry a burned-in Frontier or 4x4 badge in a corner.**
  `029` (a goalkeeper diving, the single best action frame in the set), `057`,
  `061` and `088`. **The badges are much taller than they look at thumbnail
  size:** trimming 100px off a 720px-tall frame does not clear them, and two
  rounds of guessing at crop depths cost T6 an hour for nothing. If a future
  ticket wants these, measure the badge in the full-size file first. T6 dropped
  all four rather than keep cropping, because every miss ships a logo nobody
  meant to publish.

**The badge depths are now measured — do not guess again.** The gallery photos
were re-sourced from Frontier's Google Drive on 2026-09-02, and most Drive
frames carry a mark in the *bottom* corners: a Frontier crest bottom-right, and
one of `4x4 SERIES` / `HYPE` / `REIGNITE` / `MAIN` bottom-left. Measured as a
percentage of frame height, from the bottom edge up:

| Mark | Reaches up to | Safe bottom crop |
|---|---|---|
| REIGNITE wordmark | ~9% | 12% |
| Frontier crest, small (SZN 1, SZN 3 sets) | ~14% | 17% |
| `4x4 SERIES` wordmark | ~17% | 20% |
| Frontier crest, large + HYPE / MAIN (SZN 4, watch-alongs) | ~21% | 24% |
| Frontier crest, oversized (occasional) | ~29% | reject |

T6's warning holds: the crest really is that tall. Crop the **whole bottom
band**, not a corner — both marks sit at the same height, so one horizontal cut
clears both and keeps the frame rectangular. A 24% cut turns a 3:2 frame into
roughly 2:1; the home deck then centre-crops that to a fixed 16:9 card
(`object-fit: cover`, see `src/styles/gallery.css`) and the gallery-page mosaic
keeps the frame's own ratio, so either way the extra width is spent, not shown
squashed. When the badge reaches past ~25%, drop the photograph: the subject is
always in the bottom third of an action frame, and cutting that deep is just
publishing a worse picture. The measuring trick is a contact sheet of only the
bottom 34% of each frame with 5% gridlines drawn on it — four images per sheet,
read the number straight off the line.

**Verify after cropping, not before.** Google Drive's `imageMediaMetadata`
width/height does not always match how the file actually renders — of 213
frames checked, 5 came back "landscape" in the metadata and portrait in the
pixels. Trust the decoded image, never the API's numbers.

**The triage method, which is worth reusing.** Do not open 100 files one at a
time. Build 5x5 contact sheets with ffmpeg and read four images instead:

```
# 1. normalise FIRST. ffmpeg's tile filter silently keeps only the last frame
#    when inputs differ in size, and these posts do. This is the whole trick.
ffmpeg -i NNN.jpg -vf "scale=320:320:force_original_aspect_ratio=increase,crop=320:320" norm/NNN.jpg
# 2. tile 25 at a time from their own directory. -start_number does NOT work
#    here: it produced four byte-identical sheets.
ffmpeg -i batch/%03d.jpg -vf "tile=5x5" -frames:v 1 sheet.jpg
```
Row-major order maps a tile's position back to its index, so no `drawtext`
labelling is needed. Then re-render the shortlist at 500px+ **padded, not
cropped**, so corner watermarks stay in frame, and confirm there. Three of T6's
calls changed between the 320px pass and the 500px pass.

**Files used by the T6 gallery** are listed with their sources in `content.js`.
Clips deviate from the 16:9 rule above on purpose: the strip sizes every tile
from its own media, so a vertical clip stays vertical rather than being cropped
to a shape the strip does not need.

## 7. Content: never invent (carried from v1, still true)

> v2 additions: the `stats` list (section 7a below) and the rule that the
> home page's events act renders nothing while `events` is empty.


Known and usable:
- Instagram **@frontierfootballl** — verified live. The brand guide's
  `@frontierfutsall` is the dead pre-rebrand handle. Never use it.
- TikTok **@frontierfootball** — `https://www.tiktok.com/@frontierfootball`,
  supplied by the owner 2026-08-28. **It ends in one `l`, not three.** The two
  handles genuinely differ; neither is a typo of the other, so do not
  "correct" either to match. Lives in `content.js`. Owner's call on
  2026-09-08: dropped from every page footer and from the "Also on" row on
  contact/collaborate/events - it now shows only as an icon tile in the home
  page's "Find Frontier" hub (`src/hub.js`).
- SZN 3 champion: Ramadan FC · SZN 4: Pantera FC · SZN 6: Spain
  (SZN 6 was a "World Cup Edition", teams named after countries)
- **Division 0** — a FIFA/FC26 tournament played on PS5, not on a pitch. A
  competition, not a season and not a watch-along: Frontier runs it and it has
  a champion. Announced as a "World Cup Edition" PS5 FC26 tournament with
  @seixed and @address.lk, recapped 2026-07-28. Frontier spell it both
  "Division 0" and "Division-0"; the site uses **Division 0**.
- Venues seen in posts: One Galle Face, Havelock City Mall, Pixels N Pints,
  Athlete 360, Club Fusion.
- Partners seen in posts: main.sportsbar, address.lk, iodexsrilanka,
  nutrimax.iso, Sofascore, shirtshack.lk, drinkhypebam, ThePapare,
  absystudios, zone360.lk, athlete360_sl.

**These eleven are PARTNERS, never "sponsors", and T7 settled the wording for
good.** A sponsor paid; a partner may or may not have (CONTEXT.md). Nobody has
recorded which of the eleven paid, so the site uses the one word it can stand
behind, for all of them. The count of eleven used to be printed twice — the T4
band carried the stat "11 Partners" — but that band was removed in T8, so this
section is now the only place the number appears and there is nothing left to
contradict. Two are known not to be plain sponsors
anyway. Do not sort them into two lists by guessing, and do not print a category
under a name.

**Their urls are deliberately unrecorded, and this is not laziness.** An Instagram
address can be derived from a handle, but the list above is the only surviving
source: the 120-character caption manifest is no longer on disk, so there is
nothing to check a spelling against. A mistyped handle does not 404, it resolves
to *a stranger's account* sitting under Frontier's name beside the word Partners.
Three of the eleven (`address.lk`, `shirtshack.lk`, `zone360.lk`) carry Sri
Lanka's TLD and may be websites rather than handles at all. Every `url` in
`content.js` stays `TODO` until a person opens it and confirms the business. The
rows render as plain text until then and link themselves the moment one is
pasted in.

**`content.js` at the repo root is the hand-edited content file, not
`content.json`.** JSON cannot carry a plain-English comment above each field,
which is the entire point for a non-technical editor. Every unknown is the
literal string `"TODO"`, optionally with a note after it (`"TODO: ask the
lads"`); `src/content-data.js` treats both as absent. The owner has said they
will supply every champion, runner-up, Golden Boot and Golden Glove later, so
fields exist as TODO placeholders ready to be overwritten and their rows render
themselves once filled.

Any grid driven by that file must survive a changing item count. A layout that
is exactly full at today's number of cards breaks the moment the owner adds a
season, which is the one thing the content file promises.

**Every season, competition and watch-along now carries `date` and `venue`.**
They were added for the About page's timeline. Anything unrecorded prints one
line shorter rather than being guessed at.

**The venue mapping is settled (owner, 2026-09-03) and is not a guess.** Every
season of the 4x4 Series was played at **Athlete 360**, Turf Wars at **Club
Fusion**, Division 0 at **Pixels N Pints**. The owner wrote the last one as
"pixels and pints"; the spelling above is the one this section already recorded
and the one that ships. The five watch-alongs still have no venue - One Galle
Face and Havelock City Mall are named above but nobody has said which night was
where, so do not assign them.

**Every `date` is still TODO, and Turf Wars' is a correction, not an omission.**
Its old `note: "Aug 2025"` was removed as wrong: the owner confirmed on
2026-09-03 that Frontier started in 2024 and that Turf Wars is where it started,
so August 2025 cannot be right. Still owed: that month, plus one for each of
SZN 1-6 and Division 0.

**`content.js` also carries a `people` list, and it ships empty on purpose.** The
About page's people section renders nothing at all - no heading, no placeholder
cards - until a name is typed in. Nobody has agreed to be named; do not fill it
in from a guess about who runs Frontier.

Still TODO — render cleanly around these, never fill them in:
SZN 5 champion · every Golden Boot · every Golden Glove · every runner-up ·
Turf Wars champion and runner-up · the domain · WhatsApp community link.
(The TikTok handle came in on 2026-08-28 and is no longer TODO.)

## 7a. The numbers act (v2)

`stats` in `content.js`: owner-supplied figures (2026-09-18), each with
`asOf`. Printed verbatim by `stats()` in `lib/content-data.ts`; never computed,
never rounded. "50+ Partners" is a count; the `partners` list is only the
names recorded, and both are true. "15+ Events" means every night Frontier has
hosted, not the `events` list (CONTEXT.md).

## 8. Workflow per ticket

- Load `design-taste-frontend` and state its Design Read and three dials
  before markup for any UI ticket.
- TDD for real logic only (lib/, the stats list, the empty-events path,
  album/gallery logic). No tests for static markup or CSS.
- Verify with `agent-browser` at 320, 390, 768, 1440 and 1900x780. Assert
  overflow (`scrollWidth` vs `clientWidth`) and reduced motion by computed
  style; do not eyeball.
- `/code-review` before any commit with logic in it. One commit per ticket on
  `v2`. Never push, never deploy, never commit to `main`.
- Mark deliberate corner-cuts with a `ponytail:` comment naming the ceiling.

## 9. Never

- Never use `@frontierfutsall`.
- Never invent a champion, score, count, sponsor, venue or date. Unknown
  champion prints a muted em dash.
- Never render a section that is empty. The events act is absent while
  `events` is empty.
- Never ship an AI-generated image, a colour outside section 2, a rounded
  corner, a shadow or a gradient.
- Never introduce a backend, database, CMS, or form that posts anywhere.
- Never commit `.env` or print a key.
