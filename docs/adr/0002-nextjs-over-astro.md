# ADR-0002: Next.js 16 over Astro for v2

Date: 2026-09-18 · Status: accepted (owner, interview Q13, Q15, Q16, Q20)

## Context

v1 is plain HTML/CSS/JS on Vite, with a "stack locked" rule (HOUSE-RULES
section 4 on `main`). United's choreography needs a component model and a
scroll engine. A research pass compared Astro 7, Next.js 16, SvelteKit and
staying on Vite: Astro ships roughly 40-65KB of JS for this kind of page,
Next roughly 150-250KB.

## Decision

Next.js 16 (App Router) + React 19 + TypeScript 7 + Tailwind v4, exported
statically (`output: "export"`, `images.unoptimized`). GSAP ScrollTrigger is
the one scroll engine (Lenis driven by `gsap.ticker`); Motion is allowed for
UI-level springs only. Chosen by the owner over the recommended Astro, with a
hard gate to pay for the heavier runtime:

- Lighthouse mobile performance >= 90 and accessibility >= 95 on the exported
  home page, measured after the hero (T3) and again at T8.
- Server Components by default; client code only in small motion leaves.
- A motion piece that breaks the gate is simplified, never shipped as-is.

TypeScript 7.0.2 was verified to build with Next 16.3.5 in T1, so the
pre-approved fallback to 5.x was not needed.

## Consequences

- The static export writes `about.html` etc., so every v1 URL still resolves.
- No rewrites, redirects, headers, route handlers or default image loader
  (unsupported by static export).
- `content.js` stays hand-edited at the repo root; `lib/content-data.ts` is
  the typed port of v1's parser and its tests passed unchanged.
