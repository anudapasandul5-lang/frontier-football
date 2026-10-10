
### 2026-10-07 - Ticket 2 scrapbook implemented and committed

Owner approved refined mock: "go for it have a nice flow to it". Implemented and committed 4fb1876 on copy-v1 (seven files). Who We Are run-so-far record replaced with four tilted photo pins connected by string; oversized Bricolage, bone/ink, paper outlines, hover lift and GSAP reveal/photo drift. Second pin opens /who-we-are/4x4-series, six seasons chronologically with known facts only, existing album links and a return anchor. Ground Zero credit/watermark preserved. Reduced motion is static and JS-off content is server-rendered.

Verification: 222 tests / 15 files pass, npx tsc --noEmit passes, production build 45 pages, placeholder gate clean (145 files). Both pages captured at 320/400/700/1440; no overflow or unloaded visible images. Tablet overlap corrected using fluid board height. Normal motion and keyboard checks at 400/1440 pass: all cards reveal, skipped cards reveal after anchor jumps, return navigation works, six album routes return 200, reduced-motion toggle restores static transforms, focus outline 3 px. Other pin destinations return 200. Final header wording matches approved All six seasons; count is checked against parsed facts.

Preview http://localhost:4173/who-we-are#run-heading and /who-we-are/4x4-series (production export). Report docs/scrapbook-v1-review.md. Evidence .tmp/scrapbook-v1/production/: who/series/board-{320,400,700,1440}.png, flow-{400,1440}.png, audit.json, flow.json. Browser emulation only; physical devices not verified.

Concurrent edits to Events, Community, Collaborate, globals, facts/tests and Our story were preserved outside this commit. Who We Are was staged by hunk to keep the independently edited Our story section uncommitted. QA used the shared working tree. Protected .mcp.json, t3-numbers-1440.png and skills-lock.json untouched. No push, merge or deploy. Ticket 2 complete locally.

---
Earlier mock history:
# Ticket 2 scrapbook mock checkpoint

Owner explicitly approved starting Ticket 2, including the clickable 4 x 4 Series season subpage. Plan requires each visual ticket to be mock-approved before implementation. This is a static HTML mock only; no scrapbook code is in app/ yet.

Story refinement is complete, production-built and committed as 3925d7b on copy-v1: bone background, ink text, 18–22 px story paragraphs. Protected files remain untouched.

Mock: http://localhost:4173/__scrapbook-mock (temporary generated out/ file; another build removes it). Recreate via rtk proxy python .tmp/copy-v1/scrapbook-mock.py. Canonical local prototype .tmp/scrapbook-v1/mock.html.

Screenshots: board-1440.png, seasons-1440.png, board-400.png, full mock-1440.png and mock-400.png in this directory. Desktop and phone inspected; all photos load, no phone horizontal overflow. Two repair passes: desktop bottom clearance, then phone pin overlap/credit clearance.

Mock direction: four numbered, tilted bone/ink photo pins, connected by an ink string, right/left/right/left. Ground Zero photo preserves ThePapare watermark and explicit credit. 4 x 4 Series pin should open a dedicated /who-we-are/4x4-series page in implementation, not the prototype anchor. Other pins go to existing album/gallery routes; verify exact gallery anchor before implementation. Six seasons chronological, photo + known venue/date/champion only, unknowns hidden. Every card links to its existing /albums/szn-N URL. Keep current fonts and palette; no dependencies or new facts.

Await owner approval of static mock before implementation. Once approved, read relevant Next routing docs, write meaningful rendering/navigation test first, implement only board and season page, adapt/remove obsolete row-motion selectors, run tests/typecheck/build/placeholder gate and production browser keyboard/link/desktop/phone checks. Commit on copy-v1 only. Do not push/merge/deploy. No Hall of Fame, Community collage, partner sticker/zigzag or gallery film-strip work.

### 2026-10-07 - Scrapbook mock refinement

Owner said first mock was okay but asked for more visual impact matching the website. Refined static mock: oversized condensed Bricolage heading, larger photographs, removed board enclosure, offset paper outlines, fluid connecting string, stronger captions and hover lift (reduced-motion safe). Season grid now uses larger photos/type and open rows. Existing bone/ink, factual content and photo credits preserved. Desktop 1440 and mobile 400 inspected; all images load and no mobile overflow. Latest screenshots .tmp/scrapbook-v1/refined-{1440,400}.png; preview remains http://localhost:4173/__scrapbook-mock. Mock only; awaiting design approval under plan before implementation.
