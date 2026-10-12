# scroll-craft enhancement brief (test-worktree)

Status: DRAFT, audit complete, awaiting owner decisions on peak and signature move.

## Constraints (owner, this session)

- Zero copy changes: every heading, paragraph, label, alt, link text, content.js value stays identical.
  Checked by a before/after text snapshot of /, /who-we-are, /events (text nodes, alt, aria-label, href, title).
- Scope: Home, Who We Are, Events. Look and feel, motion, depth, pacing, layout only.
- United is visual law (docs/design/united/DESIGN.md, docs/HOUSE-RULES.md). Palette tokens only.
- Stack: Next 16 + GSAP ScrollTrigger + Lenis (existing). scroll-craft METHOD only, not its engine.
- Visuals: photos and footage already in the repo or its Drive albums. No generation.
- Reduced motion = complete static page. Transform/opacity only. Reveals never strand content.
- Owner-decision comments in the code are history, not suggestions. Do not reverse them
  (e.g. Competitions index replaced a slider, deck, poster wall and split-screen).

## Baseline (before)

npm test 223/223, typecheck clean. Home = 12.7 viewports at 1440x900. Who We Are = 5.2. Events = 3.7.

## Audit: what each act is today

| Page / act | Device today | What it feels like now | Verdict |
|---|---|---|---|
| Home / Hero | Teal canvas, photo ring, two caps lines part on scroll | Confident, loud | Keep |
| Home / Who We Are | Full-bleed night photo, yellow wipe | Recognition | Keep |
| Home / Moment | Pinned 450%: markers scatter, aperture zoom, sideways photo pan | Awe. The existing peak | Keep, protect, give it more silence before it |
| Home / Numbers | WebGL court draws itself, figures count up | Confidence | Keep |
| Home / Competitions | Static index, hover fills colour (owner-locked) | Flat. A list | Motion only, look stays |
| Home / Community, Partners | Static card, marquee | Neutral | Light touch |
| Home / Closing | Flat teal block, serif line, icons | Ends by trailing off | Weakest ending. Needs to resolve |
| Who We Are / hero, strip | PageHero + three-photo strip | Recognition, then a static row | Strip is dead scroll |
| Who We Are / Our story | Pitch lines draw, quote lines glide, duel photo opens | Intimacy | Keep, deepen |
| Who We Are / The run so far | Scrapbook cards on drawn curves | Warmth | Keep |
| Events / hero, strip | PageHero + three-photo strip | Pulse, then a static row | Strip is dead scroll |
| Events / Join us | Plain text and one button | Nothing | Dead beat |
| Events / Hall of Fame | 9-row table, yellow champion names | A document | Biggest gap: reads as a spreadsheet |

## Journey (from existing copy order, no new copy)

Home: we exist (Hero) > we show up (Who We Are) > talent was never missing (Moment, PEAK)
> the proof (Numbers) > what we run (Competitions) > come join (Community, Partners) > follow us (Closing).
Who We Are: who we are > a platform > the run so far.
Events: join the action > come Sunday > the winners (Hall of Fame).

## Feeling curve (home, proposed)

1 Hero: confidence (loud teal, parted caps)
2 Who We Are: recognition (night photo, wipe)
3 Moment: awe, PEAK (scatter, aperture, pan). Largest span on the site
4 Numbers: certainty (court draws, figures count)
5 Competitions: appetite (index lights up row by row)
6 Community / Partners: belonging (calm)
7 Closing: resolve (lines close, crest settles, one action)

## Proposed changes (all motion/layout, no copy)

1. Closing resolves: the court/pitch lines from Numbers return and close around the existing crest.
2. Events strip and Who We Are strip: from a static row of three to a scroll-driven reveal (device family: pan / fan).
3. Events Join us: becomes the quiet beat before the Hall of Fame (spacing and a held single photo, no new content).
4. Hall of Fame: trophy wall. Sticky photo stage on desktop, champion names rise as each row arrives.
5. Competitions: keep look. Add row-by-row entrance only.
6. Moment: untouched logic. Add a quiet hold before it, nothing competing in the viewport above it.
7. Mobile: authored separately (shorter pins, no hover dependence).

## Open decisions

- Signature move (one bespoke interaction on this site alone).
- Confirm Moment stays the one peak, and Hall of Fame is NOT a second peak.
- Whether the Competitions index stays fully untouched.

## Verification plan

Desktop 1440x900, mobile 390x844, reduced motion. Contact sheets before/after. Copy snapshot diff must be empty.
npm test, typecheck, gate:placeholder. Report what was and was not verified (no real phone).
