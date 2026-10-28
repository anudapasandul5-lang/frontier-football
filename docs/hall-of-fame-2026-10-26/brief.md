# Hall of Fame winner emphasis

Date: 2026-10-26. Stage: research and direction proposals.

Latest steering: after considering whole-page studies, Anuda said 'nah just redesign the hall of fame section'. Apply a scoped Hall of Fame redesign to the real Events route, preserving all other page sections. Use the winner-poster composition and purposeful entrance motion studied in the Clubhouse sample, within existing Frontier identity. No whole-page redesign or further trophy-wallpaper refinement.

Production scope: app/events/page.tsx Hall of Fame block plus app/events/hall-of-fame.module.css. Reuse MotionGate/wireReveal for one-time transform/opacity entrances, with fully visible static/reduced-motion content. No new dependencies or global/shared motion edits. Current content.js/results parser remain untouched. Worst failure: shared styling affecting other sections; prevent with CSS Modules. Finish: production build, focused data/reveal tests, exact rendered winner/order/link/credit comparison, desktop and400px screenshots. Unrelated shared-source changes are happening concurrently; do not revert them.

User request: use design-workflow and research agents to find ways to make the existing Hall of Fame section pop while preserving the existing results/ratings and overall style. Deliver concrete visual options and a recommendation before production changes.

Brand authority: docs/HOUSE-RULES.md with current tokens in app/globals.css and existing Events page. Root DESIGN.md and docs/design/united/DESIGN.md are reference extractions, not replacement brand authority. Preserve current dark Events canvas, yellow, bone, existing typefaces and football photography.

Scope: app/events/page.tsx Hall of Fame only. Preserve content.js, resultRows ordering, winners, runners-up, unknown values, existing photo identities/credits, photo links, accessibility and other sections. No push, deploy, publishing, generation spend or new dependencies.

Research: inspect current screenshot and code; explore sports winner archives, editorial image/type hierarchy and restrained celebration. Three independent roles: visual reference researcher, evidence researcher, art direction/reviewer. Only the visual researcher owns Research Chrome; others use web search/Scrapling or local files. Models: gpt-6-sol for visual study and art direction; gpt-6-luna for narrow evidence search; lead gpt-6-astra.

Acceptance: 2-3 distinct, credible section treatments grounded in inspected references, honest source coverage and small-screen treatment. One recommendation tied to this screenshot. No invented achievements or rankings. Show representative static samples before changing the live section, respecting the earlier rejection of literal castle/gold decoration.

User clarification: 'same ratings' means keep winners, results and order unchanged. No numerical design rating was supplied.
Worst failure: making chronology look like a rank, favoring one champion without reason, or cropping out team members/photographer marks.
Not covered: site-wide redesign, data corrections, production implementation or live deployment.
