# T5 — Champions & Honours (and content.json)

Paste the fenced block into a fresh Claude Code session opened in the
`Frontier Football` repo. Self-contained.

Revised 2026-08-25, after T4 shipped. The STATE OF THE REPO, the shared-reveal
debt, the colour-adjacency constraint and the regression widths are all new and
come from what T4 actually left on disk.

---

```
Ticket T5 of the Frontier Football v1 build: Champions & Honours, and the content.json
that drives it. Build ONLY this. Gallery is T6, sponsors and footer are T7.

Read docs/HOUSE-RULES.md first, in full. It carries the palette, the stack lock, the
motion budget, the Anton leading trap and the never-invent list.

This is the ticket that decides whether the owner can run this site. He is
non-technical and will never touch code. A whole season swap must be a data edit.

STATE OF THE REPO
- T0-T4 shipped. index.html holds, in order: nav, hero, the T4 story section, and a
  TEMPORARY hardcoded three-card champions row (SZN 3 Ramadan FC, SZN 4 Pantera FC,
  SZN 6 Spain) with styles in src/styles/hero.css under .champions*.
- T4 added src/styles/story.css, src/story.js and public/story/pitch.webp. Its
  section ends in a full-bleed --color-green band carrying three numerals.
- THIS TICKET REPLACES THE CHAMPIONS ROW. Delete the hardcoded markup, move the
  styles out of hero.css into src/styles/champions.css, and render the row from
  content.json. That replacement is expected, not a scope violation.
- Two dependencies (vite, vitest), unchanged.

THE GREEN SEAM — a real constraint, not a nicety
T4's full-bleed green band sits directly above this row, and the current placeholder's
middle card is that same --color-green. Green band into green card reads as a smudge.
Whatever colour cycle you choose must break that adjacency: do not let a green card be
the first thing under the band, and check it in the browser rather than reasoning about
it. This is the one composition constraint T5 inherits from T4.

CONTENT.JSON — the real deliverable
One commented content.json at the repo root. Design it so a season is one object in an
array and the honours grid renders whatever is present while skipping whatever is
missing. Comment every field in plain English for a non-technical editor.

Known, and the only values you may write:
- SZN 3 champion: Ramadan FC
- SZN 4 champion: Pantera FC
- SZN 6 champion: Spain, and SZN 6 was a "World Cup Edition" where teams were named
  after countries
- Turf Wars ran in Aug 2025 and had a champion and a runner-up, names not recovered

Explicit TODO strings with comments, rendered cleanly as absent, never invented:
SZN 5 champion, every Golden Boot, every Golden Glove, every runner-up, Turf Wars
champion and runner-up.

JSON has no comment syntax. Decide and state your approach: either a "_comment" key
convention, or ship it as content.js exporting a commented object. Pick one, say why,
and make sure the editor experience is honestly plain-English either way.

THE LOGIC — this ticket has a real TDD surface, use it
Write the failing test first, then the minimal loader.
- The loader parses content.json and returns seasons.
- The missing-data path: a season with a TODO champion, or with no Golden Boot, must
  render the season without inventing a value and without throwing.
- A season with every field present renders every field.
Vitest, in src/. Test the pure loader and the missing-data path. Do NOT write tests
for markup or CSS.

THE SHARED REVEAL — debt T4 deliberately left for you
src/story.js carries a ponytail: comment saying the IntersectionObserver in it is a
second copy of the one in src/hero.js, and that it should be extracted once a third
section needs it. This ticket is that third section. Extract it now, to a single
src/reveal.js, and rewire hero.js and story.js to use it. Touching hero.js is
explicitly allowed here and only here; T4 was forbidden from doing it, which is why
the duplication exists.

Two things must survive the extraction, and a test is the honest way to prove it:
- The observer reveals an element that is entirely ABOVE the viewport, not only one
  that is intersecting. story.js does this with
  `entry.boundingClientRect.bottom <= 0`. Without it, an element the page jumped past
  (the #about deep link, browser scroll restoration on reload) stays at opacity 0
  forever, and an invisible section on a cream page does not look broken, it looks
  unbuilt. hero.js does NOT have this fix. Do not extract hero.js's version.
- The pre-state (.is-pre, opacity 0) is added by JS and never sits in a stylesheet, so
  a script failure leaves content visible rather than blank. Hide and observe in the
  same step, with the observer already built.
Note that .is-pre / .is-revealed are currently scoped under .story in story.css and
under .hero__stage in hero.css. Decide how the shared version handles scoping and say
why. Extracting the JS while leaving three divergent copies of the CSS is not an
extraction.

DESIGN DIRECTION
- The honours grid is the single most important borrowed device from the Lazarev
  reference: filled sticker cards cycling yellow, green, red, orange, with ink
  outlines and 40px radius. The .card, .card--yellow/green/red/orange primitives in
  components.css already do this — reuse them.
- Yellow is the primary-CTA colour. Using it as the first card in the cycle is fine;
  do not add a yellow button anywhere in this section that could compete with the
  hero's follow CTA.
- A season with missing honours must not look broken or half-empty. Design the card
  so absence reads as "not recorded yet" rather than as a rendering bug — decide
  whether that is an omitted line or an explicit quiet label, and justify it.
- Use a different layout family from the hero (centred poster) and from T4 (asymmetric
  editorial split, then full-bleed colour block). Those two are spent.
- Do NOT add a second inverted band. T4's green panel is the page's one inversion, by
  design. A second one turns a rhythm beat into a stripe pattern.

MOTION
Calm. Reveal-on-scroll via the shared observer, hover lift on cards (the .card hover
already exists — check the styleguide before writing new CSS). No marquee here; the
site's one marquee is reserved for T7. Reduced motion must leave it static, proven by
computed styles.

WORKFLOW
- Load the design-taste-frontend skill FIRST and design this section with it. It
  drives the build, it is not a review step: state its Design Read, set its three
  dials with reasons, choose the layout family, and only then write markup and CSS.
  Do NOT use impeccable.
- Verify at 320, 390, 768, 900, 1100, 1440 and 1900x780. Assert no horizontal scroll
  rather than eyeballing it. 900 and 1100 are in the list because T4's grid collapse
  sits between them and every layout since has inherited that breakpoint.
- T4 has no test and therefore no regression guard. Re-run its assertions after your
  changes land: no horizontal scroll at all seven widths, and .story__panel plus
  .story__stat still static under prefers-reduced-motion. If the reveal extraction
  broke T4, you own it.
- Screenshots cannot be sent to the owner — give them the localhost URL.

DONE WHEN
1. Every champion on screen comes from content.json. No season data in the HTML.
2. Adding a season, or filling in a TODO, is a content.json edit alone — prove it by
   actually doing it in a scratch copy and showing the row change.
3. The missing-data path is covered by a test that fails if the guard is removed.
4. The grid cycles the sticker rainbow with ink outlines, and no green card sits
   directly under T4's green band.
5. One reveal observer in the codebase, not three, and the above-viewport case is
   covered by a test that fails if the boundingClientRect guard is removed.
6. prefers-reduced-motion leaves both this section AND T4 static, verified via
   computed styles.
7. 320px through 1900x780, no horizontal scroll, T4 included.
8. Dependency count is still two.

Then STOP, give me the URL, and wait for sign-off before T6.

NEVER
- Never invent a champion, runner-up, Golden Boot, Golden Glove, score, or date.
  If it is not in HOUSE-RULES section 7, it is a TODO.
- Never use @frontierfutsall — the live handle is @frontierfootballl.
- Never add events, fixtures, or a countdown.
- Never introduce a backend, database, or CMS — content.json is hand-edited.
- Never add a second inverted band.
- Never ship a colour outside the six.
- Never add a dependency without asking.
- Never touch the hero's markup or the T4 story section's design. The ONLY permitted
  edit to hero.js is rewiring it to the shared reveal module.
```
