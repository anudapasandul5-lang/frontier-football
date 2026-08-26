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
- Photography and video sit **behind a heavy cream wash**, so footage reads
  as texture and movement while the palette stays Frontier's.
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

**SZN 5's champions post is not ours.** `025-DZsCdd6is2X.jpg` carries a
"©Ashan Senevirath… www.thepapare.com" watermark across the team. Cropping it
out would be stripping a photographer's copyright notice. Left unused, and
`content.js` says why. Clear it with ThePapare before reaching for it.

Manifest captions are **hard-truncated at exactly 120 characters**, mid-word.
Several champion names sit just past the cut, SZN 5's included. A truncated
caption is not a source: it tells you a post exists, not what it says.

## 7. Content — never invent

Known and usable:
- Instagram **@frontierfootballl** — verified live. The brand guide's
  `@frontierfutsall` is the dead pre-rebrand handle. Never use it.
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

**`content.js` at the repo root is the hand-edited content file, not
`content.json`.** JSON cannot carry a plain-English comment above each field,
which is the entire point for a non-technical editor. Every unknown is the
literal string `"TODO"`, optionally with a note after it (`"TODO: ask the
lads"`); `src/champions-data.js` treats both as absent. The owner has said they
will supply every champion, runner-up, Golden Boot and Golden Glove later, so
fields exist as TODO placeholders ready to be overwritten and their rows render
themselves once filled.

Any grid driven by that file must survive a changing item count. A layout that
is exactly full at today's number of cards breaks the moment the owner adds a
season, which is the one thing the content file promises.

Still TODO — render cleanly around these, never fill them in:
SZN 5 champion · every Golden Boot · every Golden Glove · every runner-up ·
Turf Wars champion and runner-up · TikTok handle · the domain · WhatsApp
community link.

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
