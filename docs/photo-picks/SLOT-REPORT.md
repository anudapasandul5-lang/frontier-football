# Slot report (Stage 2 part 2, 2026-10-10)

Method: every live photo slot was compared against the six pick sets (contact sheets in this folder). Most slots already hold frames from the same Drive albums, picked on 2026-09-23, so the new picks rarely beat them. A slot changed only where the new frame is clearly stronger. Photos stay on Drive (thumbnail URLs, `no-referrer`); no new photograph is committed.

## Changed

| Slot | Old | New | Why |
|---|---|---|---|
| Home, Events, 4 x 4 Series row | two soft SZN 6 night frames (400px sources) | `picks-szn-6` #7, trophies and medals lifted under the green tent (Drive `1vyz8MJf1X4MRf-M3kCVxhVMxhy0ArPzn`); #3 as spare | Sharp, a celebration moment, reads as an event |
| Home, Events, Division 0 row | gaming screen, dark | `picks-division-0` #2, green-lit FC screen with a player and controller (`1-kJAls0gofEaVr3EieTM3otoHEFW0GMl`); #3 as spare | Brighter, faces visible |
| Community page, third strip photo | `community-division-0.webp`, players with their backs to camera | `picks-division-0` #13, two men with a gold trophy and a prize box (`1lFA0m_tmcOa9wps9e0Oh_a-48Ut2T2aX`) | Faces and a clear subject. `public/pages/community-division-0*.webp` is now unused |
| Turf Wars photo (home row, gallery card, album hero, Who We Are pin, link preview) | `champions/turf-wars.webp`, 800px poster crop, blown up full-bleed on the new album page | `turf-wars` album #22, winners seated with trophies and medals under the banner (`1-XPBIHqU4dxudCRdUMej_PrAnIA9kZzA`, w1600) | Same group, sharp, banner readable. Alt text now says "winners ... trophies and medals" |
| Turf Wars `albumId` | `TODO` | `turf-wars` | The album is live (30 photos) |

Code to support Drive photos in these slots: `refPolicy()` in `lib/album-data.ts` sets `no-referrer` on the gallery Cover, `PageHero`, `AlbumView` hero, Scrapbook pin and `PhotoStrip`; `lib/og.tsx` fetches a Drive URL at build time and falls back to the home still if Drive is down.

## Kept (new picks not clearly better)

Home hero ring, moment pin (celebration, duel, strike, hands, flags, night, crowd), `heroes/*` (events, who, community, collaborate, contact, gallery), Events page strip (SZN 6 strike, keeper, day match), Collaborate strip and offer cards, Contact strip, Community team and final-table photos, gallery `p01`-`p19`, champion cards for SZN 1-4, SZN 6, Division 0, Watch Parties (`wa-*`; the UCL card is already the same moment as pick #14 at full size).

## Not used, and why

- **SZN 5 card** (`gallery/szn-5-hero.webp`, 720x1280 trophies, soft): the only better SZN 5 frames are ThePapare's, and the site rule is that ThePapare frames never lead as a cover (watermark inside the frame). Left as is; flagged as the weakest remaining slot.
- **Turf Wars picks #20 and #21** (winners hands on the trophy): the Drive files still carry a flat navy strip along the bottom (about 14% of the frame) from the damaged originals, so they cannot be used full-bleed. Re-cropping another ~15% off and re-uploading would make them usable.
- No new slots were added: no section had empty room.

## Unsure photos (wrong-event guard)

- Turf Wars #22: event from the folder path (`Turf Wars/Event/Photos/Best 30 of the Album`, file date 2025-07-26). That the seated group are the winners comes from the earlier pick list, not from a caption.
- Division 0 #13 and SZN 6 #7: event from the Drive folder names (Division 0, SZN 6). Neither names the people shown, so alt text describes only what is visible.

## Checks

`npx tsc --noEmit`, `npm test` (223 pass), `npm run build` (47 pages) pass. Built export served locally; agent-browser at 1440 and 400 on `/`, `/community`, `/gallery`, `/who-we-are`, `/albums/turf-wars`: no horizontal overflow, no broken images. Not checked: a real phone, and the Vercel preview.
