# ADR-0001: Adopt the United design system for v2

Date: 2026-09-18 · Status: accepted (owner, grill-with-docs interview Q-depth, Q5, Q9)

## Context

v1 is a cream poster: paper ground, ink outlines, sticker cards, generous
rounding, one marquee, one showpiece (docs/HOUSE-RULES.md on `main`). The owner
asked for Frontier to be rebuilt in the style of United
(https://united-in-football.framer.website/), extracted to
`docs/design/united/DESIGN.md`. That document's own appendix shows the
typographic half transfers with no rule changes, while the colour-field and
motion half contradicts v1 HOUSE-RULES sections 1, 2, 5 and 9.

## Decision

Full United on branch `v2`: bone and ink canvas, full-viewport colour fields,
0px corners, no shadows or gradients, Instrument Serif against Oswald caps,
scroll choreography. United's palette ships as-is except the single yellow,
which is Frontier's `#FABA2A`; the Frontier crest keeps its own colours.
Geist replaces Inter for body text.

Precedence when sources disagree: DESIGN.md wins on look, Emil Kowalski's
skills win on motion craft, the taste skills win on anything DESIGN.md leaves
open.

## Consequences

- v1 HOUSE-RULES sections 1-5 and parts of 9 are retired on `v2`. The v2
  `docs/HOUSE-RULES.md` says which, so a later session reading `main` cannot
  "fix" v2 back.
- United's own capture shows blank viewports where scroll reveals had not run.
  v2 forbids that: content renders on the server and motion only enhances it.
- The home page gets the full treatment first; the other seven pages are
  ported with v2 tokens and redesigned later.
