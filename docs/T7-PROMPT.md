# T7 — Sponsors, links hub, footer

Paste the fenced block into a fresh Claude Code session opened in the
`Frontier Football` repo. Self-contained.

Written 2026-08-26, after T6 shipped and the gallery page was added in the same
session. The STATE OF THE REPO, the spent layout families, the unspent marquee
and the content traps all come from what is actually on disk right now.

---

```
Ticket T7 of the Frontier Football v1 build: sponsors, the links hub and the
footer. This is the LAST content ticket. Build ONLY this. Polish, meta/OG and
go-live are T8.

Read docs/HOUSE-RULES.md first, in full. It carries the palette, the stack lock,
the motion budget, the Anton leading trap, the media rules, the T6 triage findings
and the never-invent list. Read CONTEXT.md too: it fixes this project's
vocabulary, and T7 touches the two words this project is most likely to get wrong.

STATE OF THE REPO
- T0-T6 shipped and were signed off. A gallery page was added straight after T6
  in the same session, at the owner's request, and is signed off with it.
- The site is now TWO pages, both built by Vite (`vite.config.js` has three
  entries: index, gallery, styleguide).
  - `index.html` — nav, hero, the T4 story section (`#about`), the T5 Champions
    & Honours grid (`#champions`), the T6 gallery strip (`#gallery`), and the
    lightbox `<dialog>`. T7 goes after the gallery strip, inside `<main>`.
  - `gallery.html` — the Gallery page. Nav, an Anton "GALLERY" headline, a
    two-tab bar (Tournaments / Watch-alongs) and a card grid per tab.
- **Neither page has a footer yet.** There is no `<footer>` element anywhere.
- `content.js` at the repo root is the hand-edited content file, commented in
  plain English for a non-technical owner. It currently holds four collections:
  `seasons`, `competitions`, `watchAlongs`, `gallery`. T7 adds more.
- `src/champions-data.js` parses it. The `recorded()` guard turns "TODO" and
  "TODO: anything" into null and is EXPORTED — import it, do not rewrite it. That
  file also holds `tournaments()`, `watchAlongs()` and `galleryGroups()`.
  It is misnamed for what it now does; there is a `ponytail:` comment in it
  proposing a rename to `content-data.js`. **You may do that rename in this
  ticket** now that T6 is signed off. If you do, it is a mechanical change across
  five files and the tests must stay green.
- `src/reveal.js` is THE reveal-on-scroll observer. There is exactly one and
  there must stay exactly one. Call `wireReveal(elements)` with an iterable. Do
  not write a second and do not change its rootMargin without reading the comment
  inside it: the enormous top margin and the zero bottom margin each fix a
  separate bug that left content permanently invisible, and both are covered by
  tests that fail if you undo them.
- `src/gallery-data.js` exports `stepIndex(current, delta, length)`, which wraps
  at both ends. The lightbox and the gallery tabs both use it. If T7 needs any
  wrapping index maths, use it rather than writing a third copy.
- 51 tests pass. Two dependencies (vite, vitest), unchanged.
- Styles: `tokens.css`, `base.css`, `components.css` (the signed-off design
  system), then `hero.css`, `story.css`, `champions.css`, `gallery.css`,
  `gallery-page.css`. `.nav`, `.nav__end` and `.nav__link` live in `hero.css`,
  which is why `hero.css` is linked from a page with no hero.

WHAT IS STILL UNSPENT, AND IS YOURS
- **The site's one marquee.** `.marquee` and `.marquee__track` exist in
  `components.css` and are demonstrated in `styleguide.html`, and are used
  nowhere else. BUILD-PROMPT is explicit: **one marquee ticker, for the tagline
  OR the sponsor strip, not both.** Choose, and say why in your handover.
- **The footer fill.** BUILD-PROMPT's palette table assigns ink `#0C2037` as
  "display type, all outlines, body text, **footer fill**".

  This collides with a standing rule and you must resolve it deliberately rather
  than stumble into it: HOUSE-RULES says never add a second inverted band, and
  T4's green band is described as the page's only inversion. An ink footer is a
  second dark surface. Decide whether a footer counts as a band or as chrome
  that sits outside the section rhythm, do it once, and justify it in your
  handover. Do not silently ship either reading.

THE CONTENT — this is the ticket's real difficulty, not the layout
Read HOUSE-RULES section 7 and CONTEXT.md before writing a single name.

**Sponsor and partner are different words and this ticket is where they get
confused.** CONTEXT.md: `sponsor` is a paying brand relationship; `partner` is
broader — a venue, a media outlet, or a collaborator that may or may not involve
payment. Eleven handles appear in Frontier's posts:

  main.sportsbar · address.lk · iodexsrilanka · nutrimax.iso · Sofascore ·
  shirtshack.lk · drinkhypebam · ThePapare · absystudios · zone360.lk ·
  athlete360_sl

**Which of those paid and which did not is NOT known, and calling a partner a
sponsor invents a commercial relationship.** Two are already known not to be
plain sponsors: ThePapare appears in a Frontier graphic captioned "OFFICIAL MEDIA
PARTNER", and Athlete 360 appears as both a venue and a partner. Do not sort the
eleven into two lists by guessing. Either use one honest word for the section, or
put the sorting in `content.js` as a field the owner fills in. Say which you did
and why.

**Sponsor logo files do not exist in this repo.** Only Frontier's own logo is in
`Data and references/Frontier Football Logo/`. Every sponsor mark in the source
media is baked into an Instagram poster at low resolution, and cropping a
trademark out of somebody else's graphic is both ugly and not ours to do.
BUILD-PROMPT already made this call, so do not re-litigate it: **render a
text-only sponsor treatment that upgrades gracefully when logo files arrive.**
Shape the `content.js` entries as `{ name, logo, url }` with `logo` as TODO, so
the day a real file lands it is a content edit and not a layout edit.

Beware the design-skill rule that a logo wall is logos and nothing else: it does
not apply to a wordmark treatment, but its sibling rule does — **no category
label under each name** ("Sofascore — scores", "Iodex — recovery"). And do not
write "Trusted by" or "Quietly in use at". Say what it is plainly or say nothing.

**The links hub is nearly empty and must not look broken.** CONTEXT.md defines it
as the section aggregating every outbound link in priority order, Instagram first
and largest. Of the four named links, exactly ONE is known:

  Instagram   @frontierfootballl        KNOWN, verified live
  TikTok      TODO                      handle never supplied
  Sofascore   TODO                      named in a post, no URL recovered
  WhatsApp    TODO                      community link never supplied

So the honest links hub today is one link and three absences. It has to read as
finished at one link and still be correct at four, the same problem the champions
grid solved. A row of three greyed placeholders is not the answer.

**The hardest design problem in this ticket is that Instagram already has two
CTAs.** The nav carries "Follow @frontierfootballl" on both pages and the hero
carries it again. A links hub with an Instagram link makes three, and three
controls with one intent is the duplicate-CTA-intent failure the design skill
names outright. You cannot drop it either: BUILD-PROMPT says the follow is THE
one action and wins every ambiguous layout argument. Resolve this explicitly.
Deciding the links hub is the place the follow finally gets room, and that
something above it gives way, is a legitimate answer. Shipping three identical
yellow pills is not.

**Still TODO across the whole project, render cleanly around these and never
fill them in:** SZN 5 champion · every Golden Boot · every Golden Glove · every
runner-up · Turf Wars champion and runner-up · Division 0 champion, runner-up and
month · TikTok handle · the domain · the WhatsApp community link · every Google
Drive folder link on the gallery page.

The domain being TODO matters here specifically: a footer usually prints the site
it belongs to. This one cannot yet.

THE LOGIC — this ticket has a real TDD surface, use it
Write the failing test first, then the minimal code. Test the pure parts in the
node environment the way `src/champions-data.test.js` and `src/gallery-data.test.js`
already do — no jsdom, it would be a third dependency.
- Whatever selects which outbound links are renderable from `content.js`, driven
  through the imported `recorded()` guard. A link with a TODO url must be absent
  from the markup, not present and disabled.
- Priority ordering: Instagram first, and still first when the others arrive.
- Whatever selects and orders the sponsor list, including the empty case.
Do NOT write tests for markup or CSS.

ACCESSIBILITY — non-negotiable
- Every outbound link opens with `rel="noopener noreferrer"`, and if it opens in
  a new tab, say so in the accessible name or leave it in the same tab. Pick one
  and be consistent with the gallery page, which uses `target="_blank"` plus an
  aria-label naming the destination.
- **A marquee duplicates its text to loop seamlessly. The duplicate must be
  `aria-hidden="true"`** or a screen reader reads the whole strip twice.
- The marquee must not be the only place a piece of information appears. Moving
  text cannot be read by someone who needs time, so anything that matters is also
  somewhere still.
- Colour contrast on the ink footer: paper on ink is fine, but any muted footer
  text must be computed, not eyeballed. HOUSE-RULES section 3 records why.
- The footer must be reachable and readable at 320px.

DESIGN DIRECTION
**Five layout families are now spent and none may be reused:**
  hero = centred poster
  · T4 = asymmetric editorial split, then one full-bleed colour band
  · T5 = mixed-size sticker grid with a wide lead tile
  · T6 = full-bleed horizontal scroll-snap contact strip
  · gallery page = tabbed card grid

You have three surfaces to build (sponsors, links hub, footer) and they must not
all be the same shape as each other either. A three-column card row is banned
outright: it is both the design skill's named cliché and a T5 repeat.

- Rounding is the site's: 20px cards, 40px elevated, fully pill buttons.
- Colour arrives as filled, ink-outlined surfaces, never as a timid accent.
- Yellow is reserved for the primary action. The follow is that action.
- The footer is the last thing on both pages and should feel like an ending, not
  like a sixth section. Chrome, not content.
- Whatever you build on `index.html`, **the footer also goes on `gallery.html`.**
  The links hub does not: it is part of the single-scroll home page scope in
  BUILD-PROMPT. Say so in your handover if you disagree and do it differently.

MOTION
Calm, except for the one marquee, which is the whole motion allowance for this
ticket. Reveal-on-scroll through `src/reveal.js`, hover on anything tappable. No
parallax, no scroll hijack, no `window.addEventListener("scroll")`.
`prefers-reduced-motion` must produce a genuinely static result — **including a
marquee that is stopped, not merely slower** — proven by computed styles.
`base.css` already kills animation and transition globally under that query;
verify it actually caught the marquee rather than assuming.

WORKFLOW
- Load the `design-taste-frontend` skill FIRST and design these surfaces with it.
  It drives the build, it is not a review step: state its Design Read, set its
  three dials with reasons, choose the layout families, and only then write markup
  and CSS. Do NOT use `impeccable`.
- Verify at 320, 390, 768, 900, 1100, 1440 and 1900x780, **on both pages**. Assert
  no horizontal scroll rather than eyeballing it.
- Re-run the whole site's regression checks after your changes land, not just
  yours: no horizontal scroll at all seven widths on both pages, no element left
  at opacity 0 after jumping to the bottom with the End key, the gallery tabs
  still switching, the T6 lightbox still opening and restoring focus, and T4, T5,
  T6 and the gallery page all still static under prefers-reduced-motion. If T7
  broke an earlier section, you own it.
- Screenshots cannot be sent to the owner — give them the localhost URL.

THINGS THAT WILL COST YOU AN HOUR IF YOU RE-DERIVE THEM
- **Every file in this repo is CRLF.** A multi-line find-and-replace written with
  `\n` fails silently and reports success. Normalise to LF in memory, replace,
  write back CRLF. Always assert the edit landed instead of trusting the write.
- **`/tmp` does not work inside `node -e` on this machine.** Node resolves it as
  `C:\tmp`. Use the session scratchpad with an absolute Windows path.
- **`npx <cmd> --flag value` misparses as `npm run`.** Use `npm run dev -- --port
  5173` or `./node_modules/.bin/vite`.
- A bash heredoc can choke on JS containing backticks and apostrophes. If `cat >
  file <<'EOF'` reports "unexpected EOF", stop fighting it and use the Write tool.

DONE WHEN
1. Sponsors render from `content.js` as a text-first treatment that upgrades to
   logos without a layout change, and no handle is described as a sponsor without
   evidence that it is one.
2. The links hub reads as finished with only Instagram present, and renders the
   other three the moment their values stop being TODO, with no code change.
3. The Instagram duplicate-CTA problem is resolved deliberately and the
   resolution is stated in the handover.
4. A footer exists on BOTH pages, and the ink-fill-versus-second-inversion
   question is answered in the handover.
5. Exactly one marquee exists on the whole site, its duplicated track is
   `aria-hidden`, and it is fully stopped under prefers-reduced-motion, proven by
   computed styles.
6. The link-selection and ordering logic is covered by tests that fail if the
   logic is removed.
7. Still exactly one IntersectionObserver in the codebase.
8. 320px through 1900x780 on both pages: no horizontal scroll, nothing stranded
   at opacity 0.
9. Dependency count is still two.

Then STOP, give me the URL, and wait for sign-off before T8.

NEVER
- Never call a partner a sponsor, or a sponsor a partner. They are different
  words in CONTEXT.md and this is the ticket that gets it wrong.
- Never invent a champion, score, date, venue, follower count, or a sponsorship
  that nobody has confirmed.
- Never crop a sponsor's logo out of an Instagram poster.
- Never print an Instagram caption. They are truncated at 120 characters and the
  tail is gone.
- Never use @frontierfutsall — the live handle is @frontierfootballl.
- Never invent the TikTok handle, the domain, or the WhatsApp link.
- Never add events, fixtures, or a countdown.
- Never introduce a backend, database, CMS, or a form that posts anywhere.
- Never add a second marquee.
- Never ship a colour outside the six.
- Never add a dependency without asking.
- Never touch the hero, the T4 story section, the T5 champions grid, the T6
  gallery strip or the gallery page, except to fix a regression this ticket
  caused or to carry out the `content-data.js` rename deliberately.
```
