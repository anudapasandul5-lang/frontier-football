# T4 — What is Frontier

Paste the fenced block into a fresh Claude Code session opened in the
`Frontier Football` repo. Self-contained.

---

```
Ticket T4 of the Frontier Football v1 build: the "What is Frontier" section.
Build ONLY this section. Champions, Gallery, Sponsors and the footer are T5 onward.

Read docs/HOUSE-RULES.md first, in full. It carries the palette, the stack lock, the
motion budget, the Anton leading trap, the media pattern and the never-invent list.
Then look at the live hero (npm run dev) — it is the signed-off tone reference.

STATE OF THE REPO
- T0-T3 shipped and signed off. index.html currently holds: a nav (crest + Follow CTA),
  the hero (cream page, background video under an 86% cream wash, three-line Anton
  headline "Built by the futsal community", subtext, yellow follow CTA), and a
  temporary hardcoded three-card champions row.
- That champions row is a placeholder standing in for T5. Do not extend it, do not
  restyle it, and do not move it into content.json — T5 owns it.
- src/styles/hero.css holds nav + hero + the placeholder champions styles.
  Put this ticket's CSS in its own file, src/styles/story.css, and link it.
- Two dependencies (vite, vitest), unchanged.

WHAT THIS SECTION IS
The story of Frontier, told in the brand's own voice, plus a small set of real numbers
used as emotional beats rather than as a stats dashboard.

The line that sums the brand up, from the brand guide: talent was never missing, the
platform was. That is the spine of this section. Frontier is a Colombo small-sided
futsal and football-culture brand, ESTD 2024, built so local players had somewhere to
play and be seen.

Numbers you may use, because they are real and verifiable in this repo:
- 6 seasons run
- 100 posts in Data and references/instagram-media/manifest.json
- venue count and partner count — count them yourself from HOUSE-RULES section 7,
  do not assert a number you have not counted
Do NOT use follower counts, match counts, player counts, or anything else you cannot
point at a source for in this repo.

DESIGN DIRECTION
- Keep the cream ground. This section is the calm after the hero, so it should breathe.
- This is the right place for the first inverted band: a --color-green panel with paper
  text, per the .band--inverted primitive already in components.css. One panel, used
  once, is a scroll-rhythm beat. Two would be noise.
- The numbers are display-type moments, not a stat grid. Giant Anton numeral, small
  Space Grotesk label under it. Three at most.
- If you use photography, it goes behind a cream wash or inside an ink-outlined
  sticker card, consistent with the hero.
- Do NOT reuse the hero's centred-poster composition. This section needs a different
  layout family or the page reads as one idea repeated. Asymmetric or split is right.

MOTION
Calm. Reveal-on-scroll for the panel and the numbers via IntersectionObserver,
transform and opacity only. No parallax, no marquee (the site's one marquee is
reserved for T7's sponsor strip). Reduced motion must leave it genuinely static —
prove it by reading computed styles, not by looking.

WORKFLOW
- Load the design-taste-frontend skill FIRST and design this section with it. It
  drives the build, it is not a review step: state its Design Read, set its three
  dials with reasons, choose the layout family, and only then write markup and CSS.
  Do NOT use impeccable.
- No content.json yet (that is T5) and no real logic here, so no TDD surface. If you
  extract a pure function, leave one runnable assert behind; otherwise do not invent
  a test suite for static markup.
- Verify at 320, 390, 768, 1440 and 1900x780. Assert no horizontal scroll rather than
  eyeballing it.
- Screenshots cannot be sent to the owner — give them the localhost URL.

DONE WHEN
1. The section reads as Frontier: cream, ink, one green panel, giant Anton numerals.
2. It uses a different layout family from the hero.
3. Every number on screen traces to something real in this repo.
4. prefers-reduced-motion leaves it static, verified via computed styles.
5. 320px through 1900x780, no horizontal scroll, nothing below the fold that should
   not be.
6. Dependency count is still two.

Then STOP, give me the URL, and wait for sign-off before T5.

NEVER
- Never use @frontierfutsall — the live handle is @frontierfootballl.
- Never invent a number, date, champion, or quote.
- Never add events, fixtures, or a countdown.
- Never ship a colour outside the six.
- Never add a dependency without asking.
- Never touch the hero or the placeholder champions row this ticket.
```
