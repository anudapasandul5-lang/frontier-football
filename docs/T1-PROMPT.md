# T1 — Design system + domain model

Paste the fenced block into a fresh Claude Code session opened in the `Frontier Football` repo.
Self-contained: assumes no memory of the T0 session.

---

```
Ticket T1 of the Frontier Football v1 build: the design system, the domain model, and a styleguide page. Do NOT build any real page sections this ticket. Do NOT touch index.html beyond what is listed under DELIVERABLES.

Read docs/BUILD-PROMPT.md first — it is the locked brief for the whole build. Then read DESIGN.md in full. Then read Frontier-Football-References.md.

State of the repo: T0 shipped. Vite, two dependencies (vite, vitest), a holding page at index.html, src/main.js importing src/style.css, deployed on Vercel. package.json scripts: dev, build, preview, test, test:watch.

═══════════════════════════════════════════
THE ONE RULE
═══════════════════════════════════════════
Frontier's colours and voice. The references' form.

DESIGN.md documents a pastel sticker system called Slush. We are copying its GRAMMAR — token structure, crushed display type, filled sticker surfaces, hand-cut outlines, heavy rounding, collage logic — and discarding every hex value in it.

Palette, and nothing outside it ships:
  --color-paper   #FFF8DB   page canvas, the cream everything sits on
  --color-ink     #0C2037   display type, every outline, body text
  --color-yellow  #FABA2A   THE hero colour. Primary CTA fill.
  --color-green   #305552   deep counterweight. Inverted section bands.
  --color-red     #87292D   hot accent. Badges, live-style pills.
  --color-orange  #E97404   fourth sticker colour. Alternating cards.

═══════════════════════════════════════════
FOUR PLACES DESIGN.md IS WRONG FOR US — override these
═══════════════════════════════════════════
DESIGN.md is a faithful description of a different brand. These four rules in it must NOT carry over, and if you follow them the ticket is wrong:

1. "CTAs are black-fill or outlined-black only. Do not use [the brand colour] as a CTA fill."
   → FOR US: the primary CTA is YELLOW fill (#FABA2A), ink text, ink outline. Yellow is the
   hero colour of this brand and it is the action colour. The secondary CTA is outlined:
   paper fill, ink outline, ink text.

2. "No photography appears anywhere."
   → FOR US: photography is core. There are 100 real Instagram posts in
   Data and references/instagram-media/. The gallery is a locked section. The hero's own
   mechanic (T3, per BUILD-PROMPT) is 3D generated objects nested between letterforms, NOT
   photo-mask — that technique is borrowed from a different reference (QClay) and is a
   candidate for the Gallery or "What is Frontier" section, not a stated fact about the hero.
   Build a photo-tile primitive and a letterform-mask primitive regardless; where each one
   ends up landing is a later-ticket decision.

3. "The site reads as a printed collage, not a kinetic experience. Motion is restricted to
   the marquee and minimal hover transitions."
   → FOR US: the hero is a motion showpiece in T3 (scroll-driven letterform reveal, object
   parallax, magnetic hover). Everything below stays calm. This ticket must therefore ship
   the motion primitives — reveal-on-scroll, hover lift, marquee — and a real
   prefers-reduced-motion path, not a static-only system.

4. "Alternate section backgrounds across [three pale neutrals]."
   → FOR US: section bands alternate --color-paper, then a white-ish lift, then an INVERTED
   band on --color-green with paper-coloured text. The green band is the scroll rhythm's
   dark beat. Work out the exact rotation and show it on the styleguide.

Everything else in DESIGN.md's Do's and Don'ts carries over unchanged. In particular, these
stay hard rules: no gradients anywhere, no box-shadows anywhere (elevation comes from colour
bands and outlines), no radius under 16px on cards, pill radius on anything button-shaped,
and display line-height never above 0.85.

═══════════════════════════════════════════
TOKENS — mirror DESIGN.md's structure, substitute our values
═══════════════════════════════════════════
Follow DESIGN.md's Quick Start CSS custom property block for naming and organisation. Keep
its scales where they are sound and adapt where our content differs.

- Base unit 4px. Take DESIGN.md's spacing scale as-is.
- Radius: pills and anything button-shaped fully rounded; cards 20px; elevated/feature
  cards 40px. Nothing under 16px.
- Type scale: DESIGN.md's steps are caption 12 / body-lg 15 / subheading 24 / heading-sm 30 /
  heading 64 / display 200 / display-lg 640. Keep the intent, but every step must be FLUID —
  clamp() from a 320px floor to a 1440px ceiling. A 640px display step that does not collapse
  on a phone is a bug, and most of this brand's traffic is on a phone.
- Layout: page max-width 1440px, section gap 48px, card padding 24px.
- Outline weight: DESIGN.md specifies 1px hairlines on pure white. Against cream at our sizes
  that reads thin. Use a token (--outline-width) and show 1px, 1.5px and 2px on the
  styleguide so the weight can be chosen by eye rather than guessed.

═══════════════════════════════════════════
TYPOGRAPHY — a decision I need to make, so render it
═══════════════════════════════════════════
The brand guide specifies Super Squad (display) and Telegraf (body). Neither file is in this
repo and both are commercial. Do not stall and do not silently pick one.

Ship BOTH families behind --font-display and --font-body so a swap is two lines.

For the display face, the references are giant CONDENSED black caps. Put THREE candidates on
the styleguide page, each setting the same word at the same size so they can be compared
directly: Anton, Archivo Black, and Bebas Neue — all free on Google Fonts. Say which you
recommend and why. Body face: Space Grotesk unless you can argue for better.

Leave "TODO: swap to Super Squad / Telegraf when licensed files land" at the definition site.

Load fonts with a Google Fonts link, not a dependency. Preconnect, and use font-display: swap.

Also ask me directly, in your sign-off message: can I supply the licensed Super Squad / Telegraf
web font files? This is a standing question from BUILD-PROMPT that the fallback bake-off above
does not answer on its own.

═══════════════════════════════════════════
DELIVERABLES
═══════════════════════════════════════════
1. src/styles/tokens.css — the full custom property block. Colour, type scale, spacing,
   radius, outline, layout, motion durations and easings. Comment each group in plain English.

2. src/styles/base.css — resets, document defaults, body on paper, focus-visible styling that
   is genuinely visible against cream, and the global prefers-reduced-motion block.

3. src/styles/components.css — the primitives. At minimum:
     - sticker card (filled, ink outline, 20px radius) in all four rainbow colours
     - elevated feature card (40px radius)
     - primary CTA (yellow fill) and secondary CTA (outlined)
     - pill nav item and pill tag/badge
     - display headline block (crushed leading, fluid)
     - tagline subhead
     - marquee band
     - photo tile
     - letterform mask (type filled with an image) — prove the technique works
     - inverted section band (green ground, paper text)
   Each primitive gets a class, not a utility soup. No Tailwind, no framework.

4. styleguide.html — a real page at /styleguide, wired into Vite as a second entry via
   build.rollupOptions.input. It renders every token and every primitive with its name and
   its token values visible. This page IS the deliverable I sign off on, so make it legible
   and complete rather than pretty-but-partial. Include: the full palette with hexes, every
   type step at its real rendered size, the three display-font candidates side by side, the
   three outline weights, every card colour, both CTAs with hover and focus states shown,
   the marquee running, a letterform mask with a real photo from the Instagram media, and
   the section-band rotation.

5. CONTEXT.md at repo root — the domain model, in the mattpocock domain-modeling sense.
   Name and define the vocabulary this codebase uses so later tickets and later sessions do
   not invent synonyms: season, SZN, champion, runner-up, honour, Golden Boot, Golden Glove,
   4x4 Series, Turf Wars, watch-along, partner vs sponsor, links hub, reigning. State which
   terms are user-facing copy and which are data keys. Note that tournaments are currently
   on break and that the site therefore has no events surface.

═══════════════════════════════════════════
WORKFLOW
═══════════════════════════════════════════
- Run /impeccable for the visual pass before you call this done.
- Run /web-design-engineer for browser acceptance on styleguide.html at 320px, 390px and
  1440px. Confirm the page body does not scroll horizontally at any of them.
- No tests this ticket. There is no real logic in a token file, and a test asserting that a
  CSS variable equals a hex is ceremony. TDD starts at T5 with the content loader.
- Ponytail applies: no abstraction with one caller, no build step a plain CSS file replaces,
  no dependency added. Two dependencies is the current count and this ticket should not
  change it.
- Mark any deliberate corner-cut with a "ponytail:" comment naming the ceiling.

═══════════════════════════════════════════
DONE WHEN
═══════════════════════════════════════════
1. npm run build succeeds and emits both index.html and styleguide.html.
2. styleguide.html shows every token and every primitive listed above.
3. Nothing on the page uses a colour outside the six.
4. Every type step is fluid and legible at 320px.
5. prefers-reduced-motion produces a still page with no motion, not a faster one.
6. Focus states are clearly visible against cream on every interactive primitive.
7. CONTEXT.md exists and defines every term above.
8. Dependency count is still two.

Then STOP. Show me the styleguide, your font recommendation, and ask whether licensed
Super Squad / Telegraf files can be supplied. Wait for sign-off before T2.

═══════════════════════════════════════════
NEVER
═══════════════════════════════════════════
- Never ship a colour outside the six.
- Never use a DESIGN.md hex.
- Never add a gradient or a box-shadow.
- Never build page sections this ticket.
- Never add a dependency.
- Never commit .env.
```
