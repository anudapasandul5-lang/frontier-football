# T3 — Hero

Paste the fenced block into a fresh Claude Code session opened in the `Frontier Football` repo.
Self-contained: assumes no memory of the T0/T1/T2 sessions.

---

```
Ticket T3 of the Frontier Football v1 build: the hero. This is the ticket the whole site is
judged on — spend the time here. Build ONLY the hero section this ticket. Do not build What is
Frontier, Champions & Honours, Gallery, Sponsors, or the footer — those are T4 onward.

Read docs/BUILD-PROMPT.md first, in full — section 2 (THE DESIGN LAW), section 3 (LOCKED),
section 4 (MOTION BUDGET), and the T3 entry in section 8 are the load-bearing parts. Then read
Frontier-Football-References.md, especially the Lazarev sports-concept reference — giant black
condensed headline with 3D objects tucked inside and between the letters, saturated card row
beneath. That is the hero this ticket is matching. Then read CONTEXT.md so you use this
codebase's vocabulary, not synonyms.

State of the repo: T0, T1, T2 shipped and signed off.
- src/styles/tokens.css, base.css, components.css exist. styleguide.html is the approved
  design-system reference — reuse its primitives (.display, .btn--primary, --font-display,
  motion tokens), don't reinvent them.
- Fonts are LOCKED: --font-display is Anton, --font-body is Space Grotesk. No licensed
  Super Squad/Telegraf files were supplied — leave the TODO comment in tokens.css alone.
- 8 hyper-realistic football sticker objects, already optimised to WebP, already committed at:
  public/objects/football-01.webp, boot-01.webp, keeper-glove-01.webp, trophy-01.webp,
  whistle-01.webp, scarf-01.webp, corner-flag-01.webp, captains-armband-01.webp.
  These are the "3D objects" the hero nests between letterforms — do not regenerate them,
  do not call kie.ai this ticket.
- A crest is NOT yet in a shippable location. Source PNGs (with transparency) live at
  Data and references/Frontier Football Logo/Logo-01.png and Logo-02.png — that folder is
  gitignored (dev-only), so pick the one that reads best small and copy it to public/ before
  referencing it in code, the same pattern already used for public/objects/.
- Two dependencies (vite, vitest), unchanged.
- index.html currently holds T0's placeholder ("Site in build."). This ticket is where that
  placeholder gets replaced with the real hero markup — that's expected, not a scope violation.

═══════════════════════════════════════════
WHAT THE HERO IS
═══════════════════════════════════════════
- Crest, then a giant crushed display headline (Anton, --leading-display 0.8, uppercase) built
  from the .display / .display--lg primitives already in components.css.
- The 8 WebP sticker objects nested between and around the letterforms — scattered with intent,
  collage logic, not grid-aligned, per DESIGN.md's collage rule.
- The Instagram follow CTA (@frontierfootballl — VERIFIED LIVE handle, never @frontierfutsall)
  is the unmistakable primary action above the fold. Use .btn--primary. When any layout
  decision here is ambiguous, the choice that makes the follow more obvious wins.
- Tagline: "Built by football. Powered by community." using the .tagline primitive.

═══════════════════════════════════════════
MOTION — hero is the one showpiece, budget it like one
═══════════════════════════════════════════
Hero gets three effects, no more:
1. Scroll-driven reveal on the display headline — letterforms arriving as sculptural blocks,
   not a fade. IntersectionObserver + CSS transforms, or scroll-linked transform math if you
   need finer control — your call, but justify it if you pick the more complex one.
2. The 3D sticker objects parallaxing at different rates between and behind the letters.
3. Magnetic hover on the primary Instagram CTA.

Hard limits, non-negotiable:
- prefers-reduced-motion produces a genuinely static hero (mirror base.css's existing
  `animation: none; transition: none;` approach) — not a faster version of the same motion.
- Animate transform and opacity only. Nothing that triggers layout or paint on every frame.
- Must stay smooth on a mid-range Android phone on Sri Lankan mobile data. If an effect costs
  more than it delivers, cut it — say what you cut and why.
- No animation library. Hand-rolled scroll math only, unless you can show it genuinely can't
  do this — and if so, ASK before adding a dependency. Two dependencies is the count to protect.

═══════════════════════════════════════════
WORKFLOW
═══════════════════════════════════════════
- This ticket has no content.json yet (that's T5) and no filter/lightbox logic, so there's
  still no real TDD surface for markup or CSS. If you extract a pure scroll-progress-to-offset
  calculation function (not DOM code), that's a small pure function worth one runnable
  assert-style check — ponytail's "non-trivial logic leaves one check behind" rule, not a full
  test suite.
- Run /impeccable for the visual pass.
- Run /web-design-engineer for browser acceptance at 320px, 390px, and 1440px. Confirm no
  horizontal scroll, confirm the reveal/parallax/magnetic-hover all work, confirm
  prefers-reduced-motion actually removes motion (check computed animation/transition, don't
  eyeball it).
- Mark any deliberate corner-cut with a "ponytail:" comment naming the ceiling.

═══════════════════════════════════════════
DONE WHEN
═══════════════════════════════════════════
1. index.html's hero reads unmistakably as Frontier: cream/ink/yellow/green/red/orange only,
   giant crushed Anton type, real 3D objects nested in the type — not a pastel Scandinavian
   fintech hero, not a dark cinematic football hero.
2. The Instagram follow is the single most obvious thing to do above the fold.
3. Scroll reveal, object parallax, and magnetic hover all work and feel considered, not janky.
4. prefers-reduced-motion gives a genuinely static, still-legible hero — verified via
   computed styles, not just visually.
5. Works cleanly at 320px through 1440px, no horizontal scroll at any width.
6. Dependency count is still two, or you asked before changing it.

Then STOP. Show me the hero (screenshot or a way to view it) and wait for sign-off before T4.

═══════════════════════════════════════════
NEVER
═══════════════════════════════════════════
- Never use @frontierfutsall — the live handle is @frontierfootballl.
- Never invent a follower count, a date, or any content not already in this repo.
- Never add an events, fixtures, or countdown element.
- Never introduce a backend, database, CMS, or form that posts anywhere.
- Never hotlink Instagram CDN URLs — they're signed and expire.
- Never ship a colour outside the six.
- Never add a dependency without asking first.
- Never regenerate or call kie.ai this ticket — the 8 objects are already done.
- Never build page sections beyond the hero this ticket.
```
