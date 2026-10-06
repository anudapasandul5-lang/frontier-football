# Ticket 1 copy pass review

Source: `C:\Users\anuda\Downloads\Frontier_Football_Website_Copy.pdf`.
Binding decisions: `C:\Users\anuda\.claude\plans\c-users-anuda-downloads-frontier-footba-lazy-fern.md`, stress-test decisions and Ticket 1, with the owner's current instructions taking precedence.
Branch: `copy-v1`, based on `main`. Hero screenshots approved by the owner with “perfect continue”.

## Changes by page

| Page | Result |
| --- | --- |
| Home | Signed-off hero label, two wrapping yellow uppercase sentences, `/events` action and location; platform introduction; earlier Moment reveal; Milestones paragraph including Turf Wars; four existing event rows with Watch Parties photo; teaser copy; partners label/button without oversized count/word; closing sentence. |
| Who We Are | Since Ground Zero, signed-off introduction with the owner's Two years correction, platform story and quote; run-so-far paragraph removed. Existing timeline, watch-party block and people behavior retained. |
| Events | Join the action intro; Join us then conditional Our events then Hall of Fame; working `#join` and `#hall-of-fame` links; exact weekly session sentence from content.js; existing results table retained. |
| Community | More than a game introduction; Register team / Join solo player labels with unchanged WhatsApp drafts; known Sunday facts; four signed-off stories as plain text in the existing visual language. Old record album links and omitted email prompt removed. Collages remain a later ticket. |
| Collaborate | Signed-off intro and five offer bodies from content.js; Already alongside us without the 50+ Partners headline; closing sentence; omitted supporting contact text removed. Existing offer rows and logo marquee retained. |
| Contact | Signed-off introduction with links to `/community#sunday-league` and `/collaborate`; existing contact details and sections absent from the PDF retained. |
| Gallery | The experience / What it feels like, replacing the intro count sentence. Existing reel and album sections retained; film strip deferred. |
| 404 | Signed-off Offside sentence and existing home/gallery actions. |
| Shared | Existing menu already had the required seven-item order and Menu/Close labels. Description updated in lib/og.tsx and used by both layout metadata and Open Graph description. Ground Zero display name/lookup rename throughout source; album identity and URLs preserved. |

No new components, dependencies, scrapbook, castle hall, collages, sticker frame, zigzag offers or film strip.

## Verification

- `npm test`: 14 files, 218 tests pass. Registration copy assertions updated; existing message/placeholder/logic assertions retained. Upcoming-event copy assertions added to its existing rendering test.
- `npx tsc --noEmit`: pass.
- `npm run build`: pass, 44 static pages generated.
- `node scripts/placeholder-gate.mjs`: clean, 139 files checked.
- `git diff --check`: pass.
- Exact source-card audit: 77 PDF blocks at 1440 and 400 px; 150 matches, four expected absences (Our events heading and sentence at both widths), zero unintended wording mismatches. The approved Three years → Two years exception is normalized explicitly.
- All eight screens have full-page desktop/phone captures; no horizontal page overflow. Reduced motion used for the complete-page captures so pinned stages and reveals remain reviewable; normal-motion behavior checked separately.
- Normal motion: second Moment line was opacity 0 after a 500 px scroll before the change, and opacity 1 after the same step on desktop and 390 px phone after the change.
- Both Events anchors clicked and land approximately 96 px below the viewport top. Our events stays absent with an empty events list; its existing empty/unnamed/recorded-event unit checks pass.
- Fourth home event: keyboard focus selects the Watch Parties photo, other stage photos hide, selected image loads.
- Menu labels verified in order; Close exists and Escape closes the dialog.
- Compared content.js with main: all contact data and WhatsApp drafts, seasons/champions/TODOs, album IDs, image paths, Drive URLs, watch-alongs, stats, partners, people and upcoming-event data unchanged except the approved display-name/alt rename.

## Screenshot and audit paths

Evidence stays local in `.tmp/copy-v1/` and is not staged in the copy commit.

- Hero approval: `hero/hero-320.png` (320×740), `hero/hero-390.png` (390×844), `hero/hero-1440.png` (1440×1000).
- Complete pages: `pages/{home,who-we-are,events,gallery,community,collaborate,contact,404}-{1440,400}.png`.
- Exact PDF-card comparison: `pages/pdf-copy-audit.json`.
- Extracted page text and metadata: `pages/{page}-{width}.txt`, corresponding `.json`, and `pages/browser-audit.json`.
- Additional-string inventory: `pages/visible-string-diff.md`. This records preserved interface/accessibility text, facts, credits, and sections outside the PDF copy cards rather than treating them as approved new wording.
- Normal-motion/menu/anchor checks: `smoke-checks.json`; fourth-photo capture: `watch-parties-focus.png`.
- Fact/identity checks: `invariants.json`.

## Differences and verification limits

- The PDF says Three years in; the owner's binding correction is Two years in.
- Our events heading and paragraph do not appear with zero upcoming events, as required.
- Preserved strings beyond the PDF cards include the shared PageHero identity/location/Scroll row, Next navigation and chapter indicator; facts and photo credits; existing timeline/result table labels and missing-value indicators; gallery album titles/metadata; Contact's existing activity record; footer/accessibility labels. The complete additional-string inventory is linked above.
- New visual directions are intentionally deferred. The existing timeline, results table, offer rows and gallery album sections remain visible.
- This repository uses `output: "export"`. After a successful production build, `npx next start -p 4178` explicitly fails with “next start does not work with output: export”. Browser QA used the generated production `out/` files through the repository's `npm run serve` at `http://localhost:4173`; no next dev.
- Some logos outside the horizontal marquee viewport remain lazy/unloaded in browser snapshots. Their requested local files returned HTTP 200. Visible copy/layout and the fourth event photo were checked; physical-device GPU/performance testing was not performed.
- No push, merge, deployment or external message. `.mcp.json`, `t3-numbers-1440.png`, and the pre-existing modified `skills-lock.json` are excluded from staging and commit.
