# T6 — Gallery

Paste the fenced block into a fresh Claude Code session opened in the
`Frontier Football` repo. Self-contained.

Written 2026-08-26, after T5 shipped and was signed off. The STATE OF THE REPO,
the reveal-module contract, the spent layout families and the media findings all
come from what T5 actually left on disk.

---

```
Ticket T6 of the Frontier Football v1 build: the Gallery. Build ONLY this.
Sponsors, the links hub and the footer are T7.

Read docs/HOUSE-RULES.md first, in full. It carries the palette, the stack lock, the
motion budget, the Anton leading trap, the media rules and the never-invent list.
Read CONTEXT.md too: it fixes this project's vocabulary, and T6 must not invent a
synonym for a word that already has a data key.

STATE OF THE REPO
- T0-T5 shipped and signed off. index.html holds, in order: nav, hero, the T4 story
  section, and the T5 Champions & Honours grid. T6 goes after champions.
- src/reveal.js is THE reveal-on-scroll observer. There is exactly one and there must
  stay exactly one. Call `wireReveal(elements)` with an iterable. Do not write a second
  observer and do not change its rootMargin without reading the comment inside it: the
  enormous top margin and the zero bottom margin each fix a separate bug that left
  content permanently invisible, and both are covered by tests that fail if you undo
  them.
- content.js at the repo root is the hand-edited content file, commented in plain
  English for a non-technical owner. src/champions-data.js parses it; the `recorded()`
  guard turns "TODO" and "TODO: anything" into null. Reuse that guard, do not rewrite it.
- src/styles/champions.css is the T5 section. public/champions/ holds five cropped
  photos. Two dependencies (vite, vitest), unchanged.

THE MEDIA — read this before designing, it changes what is possible
Source media lives in `Data and references/instagram-media/`: 100 real posts as
`NNN-<shortCode>.jpg` plus 59 `.mp4`, and a `manifest.json` with `shortCode`, `type`,
`timestamp`, `caption`. It is gitignored and dev-only. Copy what you use into `public/`.

Three findings from T5 that will cost you an hour if you re-derive them:
- **Captions are hard-truncated at exactly 120 characters, mid-word.** A truncated
  caption is not a source. Do not print one on the site, do not complete one, and do
  not infer a fact from the half that survived.
- **Many posts are designed posters, not photographs** — display type, sponsor bars,
  and a palette that changes every season. A gallery of posters is a gallery of other
  people's typography fighting yours. Sort the real photographs from the graphics by
  LOOKING at them, and say in your handover which files you rejected and why.
- **At least one post carries a third-party watermark** (`025-DZsCdd6is2X.jpg`,
  "©Ashan Senevirathne / thepapare.com"). Cropping a watermark out is stripping a
  copyright notice. If you find more, leave them out and say so.

Video: keep the opt-in pattern from HOUSE-RULES section 6 exactly. Budget under ~500KB
per clip, both dimensions even or libx264 refuses. A phone on Sri Lankan mobile data
must download no video at all.

THE LOGIC — this ticket has a real TDD surface, use it
The lightbox is real logic. Write the failing test first, then the minimal code.
Test the pure parts in the node environment, the way src/champions-data.js and
src/reveal.js already do — no jsdom, it would be a third dependency.
- Index maths: next/previous wrap at both ends, and a single-item gallery cannot
  navigate off itself.
- The open/close state transition, and that closing returns focus to the thumbnail
  that opened it.
- Whatever selects which items are renderable from content.js.
Do NOT write tests for markup or CSS.

ACCESSIBILITY — non-negotiable, and the reason the lightbox is not a two-hour job
A lightbox is a modal dialog. It must:
- Trap focus while open and restore focus to the opening element on close.
- Close on Escape and on a click outside the image.
- Move with Left/Right arrows.
- Be announced: a labelled `role="dialog"` with `aria-modal="true"`.
- Not be reachable by keyboard while closed.
Prove each of these in the browser, by assertion, not by eyeballing.

DESIGN DIRECTION
Four layout families are now spent and none may be reused:
  hero = centred poster · T4 = asymmetric editorial split, then full-bleed colour band
  · T5 = mixed-size sticker grid with a wide lead tile.
A plain three-column image grid is BOTH a repeat of T5 and the single most generic
gallery on the internet. Pick something else and justify it from the brief.

- Photography here is full colour in ink-outlined frames, like the T5 champion cards
  and the T4 photo tile. The heavy cream wash in HOUSE-RULES section 1 is for footage
  running BEHIND type in the hero, not for content photographs. Do not wash these.
- Rounding is the site's: 20px cards, 40px elevated. Outline every frame.
- A gallery is the one place on this site where the media is the content, so the
  surrounding chrome should get quieter, not louder. No section headline competing
  with the hero.
- Decide whether the gallery is driven by content.js like the champions grid, or by a
  hardcoded manifest, and justify it. The owner swapping the gallery should be as easy
  as swapping a season, unless you can argue otherwise.

MOTION
Calm. Reveal-on-scroll through src/reveal.js, hover on thumbnails. No marquee here:
the site's one marquee is reserved for T7. No parallax, no scroll hijack.
prefers-reduced-motion must produce a genuinely static result, including inside the
lightbox, proven by computed styles.

WORKFLOW
- Load the design-taste-frontend skill FIRST and design this section with it. It drives
  the build, it is not a review step: state its Design Read, set its three dials with
  reasons, choose the layout family, and only then write markup and CSS.
  Do NOT use impeccable.
- Verify at 320, 390, 768, 900, 1100, 1440 and 1900x780. Assert no horizontal scroll
  rather than eyeballing it.
- Re-run the whole page's regression checks after your changes land, not just yours:
  no horizontal scroll at all seven widths, no element left at opacity 0 after jumping
  to the bottom of the page with the End key, and T4 plus T5 still static under
  prefers-reduced-motion. If T6 broke an earlier section, you own it.
- Screenshots cannot be sent to the owner — give them the localhost URL.
- `npx <cmd> --flag value` misparses as `npm run` on this machine. Use `npm run dev --
  --port 5173`.

DONE WHEN
1. The gallery renders real Frontier media, and every file used is a photograph or a
   clip rather than a poster, with the rejects named in your handover.
2. The lightbox opens, closes, wraps in both directions, traps focus, restores focus,
   and answers Escape and the arrow keys — each proven by assertion.
3. The index maths and the open/close transition are covered by tests that fail if the
   logic is removed.
4. Video is opt-in: a 320px viewport with reduced motion downloads no .mp4 at all,
   proven from the network log.
5. Still exactly one IntersectionObserver in the codebase.
6. prefers-reduced-motion leaves the gallery, its lightbox, T5 and T4 static.
7. 320px through 1900x780, no horizontal scroll, nothing stranded at opacity 0.
8. Dependency count is still two.

Then STOP, give me the URL, and wait for sign-off before T7.

NEVER
- Never print an Instagram caption. They are truncated at 120 characters and the tail
  is gone.
- Never invent a champion, score, date, venue, sponsor or follower count.
- Never use a post carrying someone else's watermark.
- Never hotlink Instagram CDN URLs. They are signed and they expire.
- Never use @frontierfutsall — the live handle is @frontierfootballl.
- Never add events, fixtures, or a countdown.
- Never introduce a backend, database, or CMS.
- Never add a second inverted band, or a second marquee.
- Never ship a colour outside the six.
- Never add a dependency without asking.
- Never touch the hero, the T4 story section, or the T5 champions grid, except to fix
  a regression this ticket caused.
```
