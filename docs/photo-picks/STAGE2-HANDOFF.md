# Stage 2 handoff (written at the end of Stage 1, 2026-10-09)

Phase: execution. Branch `pictures` (worktree `C:\Users\anuda\orca\workspaces\Frontier Football\pictures`). Anuda said "go" and asked for Stage 2 in a fresh session.

## What is decided
- Six pick sets are final: `docs/photo-picks/N-<set>.md` (source path, Drive file id or ThePapare name, event, file date, reason per photo) and `N-<set>-sheet.jpg` (cell number = # in the list).
- Set 1 Turf Wars = the 30 files in `D:\Frontier Football\Turf Wars\Event\Photos\Best 30 of the Album` (owner's instruction). Cells 20 and 21 (`DSC07388`, `DSC07389`) are cut off at the bottom: crop the bottom 25% and re-encode before upload. About 14 distinct moments, many near-duplicates; owner has not asked to thin them.
- Set 2 4 x 4 Series = SZN 2: 8, SZN 4: 8 (local), SZN 5: 7 (ThePapare), SZN 6: 7 (Drive folder `1CstLyLWgy79Yqp0d-NQ3Rnux1-MAbxeR`). Season 3 unchanged.
- Set 3 Watch Parties = 30 from `UCL Watch Party` (local). Every frame has a Frontier crest + MAIN logo bottom corners: crop the bottom 24% before upload (measured: crest reaches about 21%).
- Set 4 Road to World Cup = 30 from the four WC folders of Drive folder `1XZPWgovgi94rOaG460F1tP3NbBuwt7eV` (finals, two semis, Norway v England). Set 5 Division Zero = 13 (only about 16 distinct landscape frames exist), Drive folder `1fkDf7Igl7RtVIKxxxeuGikZqo6Eg7se1`. Set 6 Futsal Tournament 2024 = 30, ThePapare album 10932.
- ThePapare frames: watermark sits 26 to 36 percent up from the bottom, cannot be cropped, stays with the "Photos: ThePapare" credit. Papare picks files go in `scripts/papare-picks/` as arrays of the hash names shown in the lists (see the existing `szn-5.json`, `frontier-futsal.json`).

## Open questions to settle FIRST (ask Anuda in one message)
1. Stage 2 says "no photograph is committed except ThePapare WebP", but the current home, hero, heroes, pages and gallery slots are committed WebP files under `public/` (hero, home/moment-*, pages/*, gallery/p01..p19, heroes/*). My recommendation: slots that need a photo point at Drive album frames (via albumId and the Drive thumbnail URL, `referrerpolicy="no-referrer"`) or at ThePapare WebP; do not commit new photographs. Needs a yes before re-picking the slots.
2. Which Google Drive account the connected tool writes to. Must be `info.frontierfootball@gmail.com`. Check with a read-only call before any create. If the claude.ai Google Drive connector is a different account, use Composio (connected as info.frontierfootball, see memory `ref_composio_connections`). Stop and ask if neither is the Frontier account.
3. Where the new Drive folders go (the existing album folders are children of Drive folder `1XZPW...` and similar) and how they are shared (copy the sharing of an existing album folder via `get_file_permissions`).

## Stage 2 steps (from the original brief)
1. Delivery. Local picks (sets 1, 3, SZN 2 and 4): upload only the picks to new Drive folders, one per set. Create only, never overwrite, move or delete. Share like the existing album folders. Picks inside existing Drive folders (sets 4, 5, SZN 6): `copy_file` into a NEW picks folder, originals untouched. ThePapare (SZN 5, set 6): `npm run albums:papare -- <id>` with picks files in `scripts/papare-picks/`. The papare importer already knows `szn-5` and `frontier-futsal`; changing their pick files replaces the live albums, so say so and confirm.
2. Album pipeline: add each new folder to `ALBUMS` in `scripts/sync-albums.mjs` (slugs `^[a-z0-9-]+$`), `npm run albums:sync`, set `albumId` in `content.js`. Turf Wars `albumId` is `TODO` and the comment at about line 281 of `content.js` says to use slug `turf-wars`.
3. Slots: re-pick every photo slot (home hero, moment pin, events stage, scrapbook; gallery albums and covers; event and campaign pages; Who We Are; Community; Partner). Add a slot only where a section has room. No layout redesign, brand colours and fonts stay.
4. Words: captions and alt text only from folder and event names. Never invent a name, score, stat or claim.
5. Wrong-event guard: take the event from the folder path and Drive folder name, spot-check file dates, list every unsure photo in the slot report.

## Done when
tsc, `npm test`, `npm run build` pass; verify UI on `next build` + `next start` (not `next dev`: OneDrive drops CSS edits). agent-browser screenshots at 1440px and 400px of every changed page, no horizontal overflow, no broken images. Slot report (old photo, new photo, page, reason, flag any slot where the new photo is visibly weaker). Commit on `pictures`, push for a Vercel preview. Never touch main, never deploy to production.

## Gotchas learned in Stage 1
- Read `AGENTS.md` first: Next.js 16, read `node_modules/next/dist/docs/` before writing code. The worktree had no `node_modules` at the start of Stage 1 (run `npm install` or junction per the memory note; never junction `node_modules` into a worktree you will force-remove).
- Image `Read` calls can return "[media removed: request limit]" when more than 3 are sent in one turn. Send at most 3 per turn and never write notes about a sheet that did not render.
- Use plain `python`, not `python -I` (PIL lives in the user site). Drive thumbnails need `referrerpolicy="no-referrer"` in the browser; curl proves nothing.
- Stage 1 tooling is in the previous session's scratchpad `C:\Users\anuda\AppData\Local\Temp\claude\C--Users-anuda-orca-workspaces-Frontier-Football-pictures\ec53e480-1bf6-4f54-9cb1-53571a091d95\scratchpad\` (`tools/` has `spec.py` with all picks, `make_picks.py`, `build_short.py`, `drive_pull.mjs`, `papare_pull.mjs`; `short/<label>/` holds 1400px copies of every pick). `cand/<label>/_list.json` maps each pick to its Drive file id or local path. The pick lists in this folder carry the same ids, so the scratchpad is a convenience, not a dependency.
- On D: the `.Trashes` folders hold only old sorting copies; no better copy of any damaged Turf Wars file exists. 23 Turf Wars files are all zeros.
- Drive folders listed with `embeddedfolderview?id=<folder>`; thumbnails with `drive.google.com/thumbnail?id=<id>&sz=w1600` (no auth when link-shared).

## Existing album ids on the site (do not clobber)
`szn-1` to `szn-4`, `szn-6` (folder `1CstLyLWgy79Yqp0d-NQ3Rnux1-MAbxeR`), `division-0` (`1fkDf7Igl7RtVIKxxxeuGikZqo6Eg7se1`), `wa-final-esp-arg`, `wa-semi-eng-arg`, `wa-semi-esp-fra`, `wa-norway-england`, `wa-ucl-final-night`, plus ThePapare `szn-5` and `frontier-futsal`.

## Stage 2 delivery: DONE 2026-10-09 (session c414879c)
Decisions (Anuda): new photos reach slots through Drive albums + Drive thumbnail URLs, no new photographs committed; Drive writes go through Composio alias `frontier-football` (= info.frontierfootball@gmail.com; the claude.ai Drive connector is a different, view-only account); new folders sit under `1XZPW...` (ROAD TO WORLD CUP) and inherit its anyone-with-link reader sharing.

| Set | New Drive folder id | Files | `ALBUMS` id |
|---|---|---|---|
| Turf Wars (Best 30; DSC07388/89 cropped 25%) | `1gih-t2kIMq7Nx1y7oLlTvf2zrJObRLNW` | 30 | `turf-wars` |
| UCL Watch Party (bottom 24% cropped) | `1Nr5ZuBh-82emRoeYf0pgbXHWsELbIkZb` | 30 | `picks-ucl-watch-party` |
| 4x4 SZN 02 | `1gtT-u0RgyXtcS19to1gZTuVkL8PC6Uty` | 8 | `picks-szn-2` |
| 4x4 SZN 04 | `1wAZE5laQlMY6kzRTkwfTyANlGLvMpvrP` | 8 (+3 duplicates, see below) | `picks-szn-4` |
| 4x4 SZN 06 (copied) | `1p_xmnnJg3M2zlcsOQCOJwtapUDH7Rv3O` | 7 | `picks-szn-6` |
| Division 0 (copied) | `1_2FO1y8gBjY4yTHk4XBnvBIRFTYbPxi1` | 13 | `picks-division-0` |
| Road to World Cup (copied) | `1FUfaxcc0dHielxCqVJj5eZG586fpg-yT` | 30 | `picks-road-to-world-cup` |

- `npm run albums:sync -- <the 7 ids>` has run; `public/albums/<id>.json` exist. index.json NOT regenerated (targeted run).
- **OPEN: 3 duplicate uploads in `picks-szn-4`** (Composio calls timed out at 300 s but the uploads landed later, then were retried): DSC_2022 dup id `117RksZmi7q0ivC8Uu2DlHaQKiTxcH95F`, DSC_2125 dup id `12Sc3gXflk10AqFtIAOfZ698OrgzO3HZr`, DSC_2298 dup id `1PLQBZ49gLlwhA6TWNJ8hpzekkKmqlLxQ`. They are my own files, identical sizes. Trash them (recoverable) once Anuda OKs, then `npm run albums:sync -- picks-szn-4` (expect 8).
- ThePapare: live albums are curated subsets (szn-5 = 120 frames, frontier-futsal = 123). Did NOT replace them; appended the missing picks (+1 / +9) to `scripts/papare-picks/*.json`. `npm run albums:papare -- szn-5` / `frontier-futsal` NOT run yet (adds those frames to live albums; Anuda to confirm).
- Upload mechanics, if redone: Composio `GOOGLEDRIVE_UPLOAD_FROM_URL` fed by a token-gated local server + `cloudflared tunnel --url`. Shared Composio Drive quota returns 403 under load; use batches of <=6, then LIST the folder to reconcile (do not trust timed-out calls). Tunnel and server are stopped.
- Contact-sheet JPGs in this folder are deliberately NOT committed (they are photographs).

## Still to do (Stage 2 part 2, fresh session)
Steps 3-5 of the brief: re-pick every photo slot via Drive thumbnail URLs (`https://drive.google.com/thumbnail?id=<id>&sz=w1200`, `referrerpolicy="no-referrer"`), set Turf Wars `albumId: "turf-wars"` in content.js (~line 283), captions/alt from folder+event names only, slot report, tsc + test + `next build` + `next start` checks, agent-browser shots at 1440 and 400, push for preview. File ids per pick are in the pick lists; new-folder file ids come from `public/albums/<id>.json`.

## Stage 2 part 2: DONE 2026-10-10
Duplicates trashed, ThePapare picks imported (szn-5 121, frontier-futsal 132), slots re-picked. See `SLOT-REPORT.md`.
