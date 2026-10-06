# Who We Are scrapbook — Ticket 2

Owner approved the refined static mock and requested a smooth flow. The run-so-far record is now four large, tilted photo pins connected by a string: Ground Zero, 4 x 4 Series, Watch Parties, Division 0. The current bone/ink palette and condensed Bricolage typography are retained.

The Series pin opens `/who-we-are/4x4-series`, a chronological six-season photo archive. Each season links to its existing album. Dates, venues, champions and photos come from parsed `content.js`; unknown values stay absent. The other pins use existing album/gallery destinations. Ground Zero's complete credited photograph and watermark are preserved.

Cards rise in once as they enter the viewport, with a small photo drift on desktop and a hover lift for pointer users. CSS tilt, hover and scroll transforms use separate elements. Reduced motion shows the entire composition without movement. The season page has a keyboard-accessible return link to the scrapbook heading.

## Verification

- Four new rendering tests first failed because the component did not exist, then passed: approved event order/routes, missing-data handling, chronological season order without mutation, and unknown-fact suppression.
- Full suite: **222 tests across 15 files pass**.
- `npx tsc --noEmit`: pass.
- Production `npm run build`: pass, **45 static pages**, including the new series route.
- `npm run gate:placeholder`: clean, **145 files**.
- Production browser screenshots at **320, 400, 700, 1440 px** for both pages: no horizontal overflow or unloaded visible images. Fixed a tablet pin overlap by scaling board height with viewport width.
- Normal-motion checks at 400 and 1440: all four cards reveal, anchor jumps reveal skipped cards, switching to reduced motion removes transforms, keyboard Enter opens the series and returns to the scrapbook, all six album destinations return 200. Focus outline is 3 px.
- Existing Ground Zero, Division 0 and Watch Parties destinations also return 200.

Local preview: `http://localhost:4173/who-we-are#run-heading` and `http://localhost:4173/who-we-are/4x4-series`. The project uses static export; production output is served with `npm run serve` rather than unsupported `next start`.

Evidence (local, untracked): `.tmp/scrapbook-v1/production/{who,series,board}-{320,400,700,1440}.png`, `flow-{400,1440}.png`, `audit.json`, `flow.json`. QA helpers are adjacent under `.tmp/scrapbook-v1/`.

Limits: browser emulation, not physical-device testing. Tests/build ran against the shared working tree, which also contained concurrent edits to Events, Community, Collaborate, Our story, shared facts and their related styles/tests; those changes are outside this ticket's commit. The Who We Are page was staged by hunk to preserve the concurrent story redesign without including it. No new dependencies. Protected `.mcp.json`, `t3-numbers-1440.png` and `skills-lock.json` remain untouched. No push, merge or deployment.
