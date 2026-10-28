# Hall of Fame proposal review

## 27 October: ongoing section animation added

Owner clarified that the discussed active animation must exist in the real Hall of Fame, not only as entrance effects. Added original trophy line art, drifting stadium arcs and a moving yellow light in the section header. Trophy floats/turns every3.5s, arcs drift over7s, light passes every2.6s. Existing dark one-surface winner cards from concurrent cleanup are preserved. Solid reading areas prevent strokes crossing the heading/copy.

Reused existing MarqueePause and its local data-paused contract; no new JavaScript or dependencies. Continuous effects are gated by MotionGate and prefers-reduced-motion:no-preference. Static/no-JS output retains all content and decoration without motion. Only app/events/page.tsx header/import and its scoped CSS changed in this slice; surrounding Events source assertion passes.

Production build and89 focused data/reveal/phone-image tests pass. Runtime verified all three transforms change; Pause sets all three to paused, their matrices remain identical across separate reads, and Play resumes all three. Evidence animation-proof.json. Desktop1440/phone400 screenshots: previews/animated-section-desktop.jpg and animated-section-phone.jpg. Nine winner records still present, no document overflow. No console errors observed. Physical phone and OS/browser reduced-motion emulation remain unchecked. No push/deploy.

## Final implementation: Hall of Fame only

Latest user instruction narrowed the work to 'just redesign the hall of fame section'. Applied the winner-poster treatment to the actual Events route, leaving the rest of the page untouched. Earlier whole-page direction choices are obsolete; their samples are reference material only.

Changed app/events/page.tsx Hall of Fame markup and added app/events/hall-of-fame.module.css. Nine equal poster cards use current bone/yellow/ink fields, full-frame colour photos, bold champion names and one-time photo/rule entrance motion. Reused MotionGate/wireReveal; no new client runtime or dependencies. Text stays visible before/after reveal. Existing data, links, alts, credits, unknown-winner and missing-photo branches remain wired to the existing parser.

Checked: production build succeeds;89 focused content/reveal/phone-image tests pass. A source assertion against sources/events-before-redesign.tsx confirms hero, photo strip, weekly session, Upcoming and NextPage are unchanged apart from the scoped CSS import. Production DOM matches all nine current winner names/order/photo URLs/available album hrefs and photographer credits. Desktop1440x1000 and phone400x900 checked; no document overflow and all nine phone text containers fit. New reveal animation names and is-revealed classes confirmed at runtime. Screenshots: previews/implemented-desktop.jpg and implemented-phone.jpg. Preview http://127.0.0.1:4173/events#hall-of-fame.

No commit/push/deploy. Other tasks' shared-source edits were preserved; the build includes their current working-tree state. Physical phone, browser-emulated no-JS/reduced motion, screen reader and formal performance audit not checked. CSS source and existing reveal tests cover static/reduced-motion gating.

Lead accepted this scoped redesign within the existing Frontier identity under the user's explicit section-redesign request; no whole-page changes were applied.

---

26 October 2026. Lead aggregation after specialist research and static samples. Production section unchanged by this job; unrelated concurrent edits exist in the checkout.

## Decision

Latest direction: Anuda requested an active Hall of Fame background behind the existing rows. New sample D is previews/background.html, original trophy SVG with stadium arcs and restrained yellow movement. This supersedes relying on layout changes alone. It is a proposal; production Hall of Fame remains unchanged by this job.

Current content.js changed concurrently to Ramadan FC for SZN 6. D and the comparison HTML now follow that value, then Panadura for SZN 5. Earlier A/B/C screenshots are historical captures with the earlier Spain value; do not treat them as current results evidence.

D checked: 1440px desktop and 400px phone screenshots (background-desktop.jpg, background-phone.jpg); no document/row overflow at320/400/768/~902/940/~1102/1440. Both photos preserve full3:2 framing. Runtime pause/resume clicks changed aria-pressed and CSS animation state correctly. Reduced-motion rules and worker pause-state self-check inspected; OS reduced-motion emulation and real phone not checked. Lead caught and worker fixed missing height:auto that stretched intrinsic image heights. Main section source/data untouched.

Research routing: new motif search gpt-6-luna, draft gpt-6-sol, lead source checks/aggregation. Lead directly read UEFA Kick of Light, Rishab Soni Trophy in Motion and Tektura Polish Cup creator descriptions; no claim of full video/artwork visual study. Original art only.

Recommend A, champion spreads. Larger colour team photos and larger winner names address the supplied screenshot directly. B is more compact; C keeps the archive/list feel. Direction selection remains with Anuda. User clarified that winners, results and order must stay unchanged.

## Tools and model routing

- Visual/reference research and art direction: gpt-6-sol. Evidence research and final reference search: gpt-6-luna. Lead: gpt-6-astra, checked and aggregated results. Lower models handled searching as requested.
- Research Chrome/browser-harness visual research was interrupted; its screenshot route also returned a truncated image. Only a directory-page capture survived. CUA Chrome was used for final local sample rendering.
- Lead reopened NN/g photo guidance, visual-design principles and W3C reduced-motion guidance. Removed FIFA/UEFA-PDF descriptions from accepted visual evidence because direct checks failed. Reused the visually inspected saved United reference rather than claiming unsupported reference breadth.
- Existing local photos and exported font files; no new dependency or generated imagery. Python's standard local HTTP server serves the comparison on 127.0.0.1:4184.

## Evidence

- Desktop screenshots at 1440 x 1000: previews/a-desktop.jpg, b-desktop.jpg, c-desktop.jpg.
- Phone screenshots at 400 x 900: previews/a-phone.jpg, b-phone.jpg, c-phone.jpg.
- All six sample image uses decoded; actual files are approximately 3:2, not 4:3. Full frames keep outer players and the SZN 5 ThePapare mark visible.
- Fonts loaded; filenames mapped to current export CSS. Preview winner weight adjusted to 700 to retain the existing bold emphasis.
- Document-width checks at 320, 375, 400, 414, 768 and 1440 px found no horizontal document overflow. Visual inspection covered 1440 and 400; other widths received geometry checks only.
- Compared sample names/order with content.js: Spain SZN 6, then Panadura SZN 5. No content.js changes. resultRows is seasons newest-first then competitions in source order; unknown dates do not permit a global chronological sort.

## Five criteria

| Criterion | Result | Evidence |
| --- | --- | --- |
| Message clarity | Pass for samples | Real winner and event labels in all six screenshots; no invented stats/ranks. |
| Visual hierarchy | Pass for recommendation A | A's photo and winner dominate; current screenshot's tiny desaturated photos are replaced by legible colour frames. |
| Brand consistency | Pass for samples | Current night/bone/yellow palette, existing fonts and round photo corners. No castle, gold frame, glow or new identity. |
| Format usability | Pass for proposal comparison; production not checked | Desktop and phone screenshots; no overflow. C's phone action should move after its result/photo in a later build. Static Photos labels deliberately are not working album links. |
| Editable-source reliability | Pass | concepts.html reopened in browser with local fonts/photos loading. Samples depend on current repository public/ and out/ asset paths. |

Not checked: full winner-list production rendering, long-name/unknown-state rendering, real phone, keyboard interactions, formal contrast audit or measured visitor response. These are proposal samples, not a shipped redesign. No build/test run was needed for unchanged production code.

Next: Anuda selects A, B or C, then implement only that treatment in the existing Events section.
