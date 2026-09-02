# Frontier Football — house rules

Standing constraints and hard-won findings for every remaining ticket.
Each ticket prompt tells you to read this first. It replaces the per-ticket
boilerplate, so keep it current: if a ticket discovers something that would
have saved the previous session an hour, it belongs here.

---

## 1. The look, as signed off after T3

The site is a **cream poster**, not a dark cinematic football site and not a
pastel Scandinavian one. Both of those are named failure states.

- Page ground is `--color-paper` (#FFF8DB) everywhere.
- Display type is giant, centred, crushed, ink-coloured.
- Colour arrives as **filled, ink-outlined surfaces** — sticker cards, pills,
  panels — never as a timid 4px accent.
- Photography and video sit **behind a cream wash**, so footage reads
  as texture and movement while the palette stays Frontier's. The hero wash is
  `color-mix(... --color-paper 60%, transparent)` (was 86%, pulled down
  2026-09-02 - the video was invisible); floor is ~55% before dark-ink type
  starts losing frames without a local scrim.
- Rounding is generous: 20px cards, 40px elevated cards, fully pill buttons.

The hero is the reference for tone. Match its confidence and its restraint.

## 2. Palette — six colours, nothing else ships

| Token | Hex | Role |
|---|---|---|
| `--color-paper` | `#FFF8DB` | page ground |
| `--color-ink` | `#0C2037` | type, every outline |
| `--color-yellow` | `#FABA2A` | THE hero colour — primary CTA only |
| `--color-green` | `#305552` | deep counterweight, panels |
| `--color-red` | `#87292D` | hot accent, badges |
| `--color-orange` | `#E97404` | fourth sticker colour |

Card rows cycle yellow → green → red → orange as filled surfaces.
**Yellow is reserved for the primary action.** Do not dilute it by using it
for decoration; that is why the follow CTA is unmissable.

**T4's green stats band is gone, deliberately, as of 2026-08-28.** T8 removed it
and the owner confirmed the removal when a later session restored it. The home
page now carries *no* inversion in its section rhythm at all — it runs paper and
paper-lift from the hero to the marquee. Do not "restore" the band, and do not
add a replacement inversion on the grounds that the page needs one. Anything
that used to lean on it is stale: see section 7 on the "11 Partners" stat.

**Ink is also the footer fill, and that is NOT an inversion.** The footer sits
outside `<main>`, repeats on every page and carries no section content, exactly
as the nav does: it is chrome, and BUILD-PROMPT's palette table says "footer
fill" in as many words. What this rule still forbids is a *stack* of dark
surfaces: T7 kept
the links hub ink-outlined on paper rather than ink-filled, because the marquee
and footer beneath it are both ink and three in a row turns a cream page dark.

Real photography carries its own colours and is exempt.

## 3. Typography — and the leading trap

- `--font-display` is **Anton**. `--font-body` is **Space Grotesk**.
- No licensed Super Squad / Telegraf files were ever supplied. Leave the
  TODO comment in `tokens.css` alone.

**FINDING — do not re-derive:** opacity on a filled sticker card is a
contrast change, not a styling choice. Ink at 0.75 over `--color-orange`
composites to 3.95:1, which clears AA only while the text is large; the same
line is 18px on a phone, where it fails. Muted text on a filled card stays at
**0.85 or above**, and caption-scale muted text at **0.9**. Compute it, do not
look at it.

**FINDING, measured in-browser — do not re-derive:**
Anton's uppercase ink is **0.88em** tall (ascent 0.87, descent 0.01), but
its content area is 1.5em. `--leading-display` is `0.8`, which the brand
guide specified for Super Squad. **At 0.8, Anton's lines physically
collide.** Use `line-height: 0.92` on any multi-line Anton display block.
0.92 still reads crushed against a normal 1.2.

If you ever set a giant headline, also cap it by viewport height, not just
width — three lines at 0.9 leading cost ~2.7x the font size, and a
maximised short laptop (1900x780) will push your CTA below the fold.

## 4. Stack — locked, do not reopen

- Plain HTML + CSS + JS on Vite. No framework, no Tailwind, no component
  library, no animation library.
- **Exactly two dependencies: `vite` and `vitest`. Ask before adding any.**
- `src/styles/tokens.css`, `base.css`, `components.css` are the signed-off
  design system from T1. Reuse their primitives (`.card`, `.card--yellow`,
  `.btn--primary`, `.pill`, `.band`, `.marquee`). Do not reinvent them and
  do not edit the tokens without saying so.
- **`npx <cmd> --flag value` misparses on this machine.** npm 11 reinterprets
  any `npx` call carrying two or more positional args as `npm run`, so
  `npx vite --port 5173 --strictPort` dies with `Missing script: "vite"`. Use
  `npm run dev -- --port 5173` or `./node_modules/.bin/vite`.
- `styleguide.html` renders every primitive. Check there before writing new
  CSS — the thing you need probably exists.

## 5. Motion budget

The hero is the only showpiece. Everything below it is calm:
reveal-on-scroll (transform + opacity, IntersectionObserver), hover lift on
cards, and at most **one** marquee across the whole site.

**The marquee is SPENT as of T7.** It carries the brand tagline as a seam between
the links hub and the footer, on `index.html` only. Two identical `.marquee__run`
spans inside one `.marquee__track` translated to -50%, the second one
`aria-hidden="true"` so a screen reader does not read the strip twice. It is on
the home page rather than inside the footer precisely because the footer repeats
on both pages and that would render the site's one marquee twice.
`styleguide.html` also draws it: that is the design-system page, not a site page.
Whatever a marquee carries must also sit still somewhere, since moving text
cannot be read by anyone who needs time. The tagline's still copy is the partners
section's lede. **Do not add a second marquee.**

Hard rules:
- Animate `transform` and `opacity` only. Nothing that triggers layout.
- **No `window.addEventListener("scroll")`.** Use IntersectionObserver or
  native CSS scroll-driven animation (`animation-timeline: scroll()`).
- `prefers-reduced-motion` must produce a genuinely static result, not a
  faster one. `base.css` already kills animation and transition globally
  under that query; anything JS-driven must check `matchMedia` itself.

**There is exactly ONE reveal observer: `src/reveal.js`.** Do not write a
second. It takes an iterable of elements rather than a root, so a section with
`data-reveal` attributes passes `root.querySelectorAll("[data-reveal]")` and the
hero passes `stage.children`. Two things in it are load-bearing:

- It reveals an element whose `boundingClientRect.bottom <= 0`, not only an
  intersecting one. Without that, anything the page jumps past (a deep link,
  scroll restoration on reload) stays at opacity 0 forever, and an invisible
  section on a cream page does not look broken, it looks unbuilt.
- It reads `matchMedia` inside the function, never at module scope. A top-level
  call makes the module unimportable in vitest's node environment.

`.is-pre` / `.is-revealed` live unscoped in `components.css`. That puts them at
the same specificity as any `.block__element` rule, so **an element that reveals
must not also carry its own `transition` shorthand** — a later stylesheet wins
and the reveal's opacity snaps while its transform eases. Give the reveal and
the hover separate elements, as `.champions__cell` and `.champions__card` do.

## 6. Media — the pattern that is already working

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

SZN 5 stays text-only: `driveFolder` is `TODO` (no folder to pull a frame from) and its only
champions-post photo carries ThePapare's watermark (section above). Nothing to crop until one
of those changes.

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

## 7. Content — never invent

Known and usable:
- Instagram **@frontierfootballl** — verified live. The brand guide's
  `@frontierfutsall` is the dead pre-rebrand handle. Never use it.
- TikTok **@frontierfootball** — `https://www.tiktok.com/@frontierfootball`,
  supplied by the owner 2026-08-28. **It ends in one `l`, not three.** The two
  handles genuinely differ; neither is a typo of the other, so do not
  "correct" either to match. Lives in `content.js` and in both footers.
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

Still TODO — render cleanly around these, never fill them in:
SZN 5 champion · every Golden Boot · every Golden Glove · every runner-up ·
Turf Wars champion and runner-up · the domain · WhatsApp community link.
(The TikTok handle came in on 2026-08-28 and is no longer TODO.)

## 8. Workflow per ticket

- **Load the `design-taste-frontend` skill FIRST and design the UI with it.**
  It is not a review step and not a visual pass at the end — it drives the
  build. Before writing any markup or CSS: state its one-line Design Read,
  set its three dials (VARIANCE / MOTION / DENSITY) with reasons from the
  brief, pick the layout family, and only then build. Running it after the
  fact is using it wrong.
  **Do not use `impeccable`** — it was dropped from this project.
- TDD applies to **real logic only**: the content loader, the missing-data
  path, the gallery lightbox, any filter. Failing test first. Do **not**
  write tests for static markup or CSS.
- Verify in a real browser with `agent-browser` at **320, 390, 768, 1440**
  and at one wide-but-short window (**1900x780** — it has caught two
  separate below-the-fold bugs).
- **Assert, do not eyeball.** Check `document.documentElement.scrollWidth`
  vs `clientWidth` for overflow, and read computed styles to prove
  reduced-motion actually removed motion.
- **Screenshots cannot be sent to the owner.** Run `npm run dev` and give
  them the localhost URL to look at themselves.
- Mark any deliberate corner-cut with a `ponytail:` comment naming the
  ceiling and the upgrade path.
- Build one ticket, then STOP and wait for sign-off.

## 9. Never

- Never use `@frontierfutsall`.
- Never invent a champion, score, follower count, sponsor, or date.
- Never add an events, fixtures, or countdown section — tournaments are on
  break and a dormant block is worse than none.
- Never introduce a backend, database, CMS, or form that posts anywhere.
- Never ship a colour outside the six.
- Never add a dependency without asking.
- Never commit `.env` or print the kie.ai key.
