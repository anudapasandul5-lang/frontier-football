# Events page direction review

SUPERSEDED: User narrowed scope back to Hall of Fame only. The whole-page choice is obsolete. Neither sample's hero/session/navigation/footer was applied. The winner-poster idea was adapted into app/events/page.tsx Hall of Fame only, with app/events/hall-of-fame.module.css. See ../hall-of-fame-2026-10-26/review.md for production build/test/UI evidence.

Job started26October2026. Stage: two full-page samples ready for direction choice. Neither replaces the main Events route yet. Other concurrent edits in app/, shared components and global styles are unrelated and preserved.

## Recommendation

B Clubhouse is the stronger response to the user's request for more presence: bold yellow cover, real-photo panels, field changes and winner posters carry the design throughout the page. A Matchday keeps a darker, quieter sports-broadcast feel with generous alternating champion spreads. Both are original compositions using Frontier's existing assets and identity, not copied template code.

Comparison: previews/index.html. Working pages: previews/matchday.html and previews/clubhouse.html. All nine actual records are included, not just a representative first pair.

## Model and tool use

- Source search: gpt-6-luna. Two independent sample builders: gpt-6-sol. Lead checked sources, data and rendered pages; retained decision/aggregation responsibility.
- Current facts snapshot generated through existing parseContent/resultRows/sessions/upcomingEvents/whatsappHref; assertions compare it with current content.js. Nine results, one weekly session, zero dated upcoming events. No fake scores, counts, fixtures, rankings or urgency.
- Lead opened BVB original site and inspected cover/scroll composition, saved captures in sources/. GSAP Vault product text was verified; its demo403 prevented live motion inspection. Seven discovery candidates across four libraries, one live visual reference. No claim of twenty inspected sites.
- Local fonts/photos, CSS motion and small native scripts. No new dependency, remote font, purchase or paid generation. Existing local preview server4184 used.

## Evidence and fixes

| Criterion | Status | Evidence |
| --- | --- | --- |
| Message clarity | Pass for samples | Both show actual Sunday7–10pm, ClubFusion/Borella, open-to-everyone line and unchanged WhatsApp message. Empty upcoming section omitted. |
| Visual hierarchy | Pass | Desktop covers/winner screenshots and400px phone views; B field changes/poster rhythm, A photo-led spreads. No arbitrary numbered rank badges. |
| Brand consistency | Pass for direction studies | Current night/bone/yellow, Bricolage/Geist, real assigned photos and credits. Removed gradients, shadows and excess font weight in review. Shared production navigation will be retained in implementation; sample navigation is simplified. |
| Format usability | Pass for checked views | A checked1280x720 and400x900; B1440x1000 and400x900. No document overflow at tested widths; all nine B winner names fit their phone text containers. Pause controls clicked in both, labels/aria state and CSS motion stop verified. Anchor actions retained. |
| Editable-source reliability | Pass | Saved HTML reopened with local fonts/photos. Builders checked local link/asset existence and JS syntax; lead current-facts/session/photo/credit/no-shadow/no-gradient assertions pass. |

Fixes bounded to two passes per sample: A removed gradients/shadows, source-order jargon and ordinal badges; restored the Hall of Fame hero action. B corrected preview route targets, removed shadows, added one-time poster-on-view motion and replaced clip-path animation with transform/opacity. No production source changes by these builders or lead.

Screenshots: matchday-desktop.jpg, matchday-winners.jpg, matchday-phone.jpg, matchday-phone-winners.jpg; clubhouse-desktop.jpg, clubhouse-winners.jpg, clubhouse-phone.jpg, clubhouse-phone-winners.jpg. Browser viewport changes initially produced a transient stale paint; final phone captures were taken after layout settled and runtime innerWidth was checked. A uses1280desktop, B1440desktop; do not label A as1440.

Motion evidence: A signal/rings/field/ticker CSS active; entrance and on-view image/line movement observed across renders. B header stripe/photo entrance and ticker positions inspected; first poster received in-view marker at Hall of Fame. Both pause controls checked. Reduced-motion and no-JS static visibility verified in source, not browser-emulated. No result text depends on animation completion.

Not checked: physical phone, Safari/Firefox, screen reader, formal contrast audit, reduced-motion OS emulation, no-JS browser emulation, live WhatsApp action or production performance. No npm build/test was required for unchanged production code. The chosen implementation must reuse current parsers, shared navigation/footer and existing motion infrastructure, then receive a production build and desktop/phone UI check.

## Approval boundary

The design-workflow skill requires the user to choose a new visual direction before full production. These concrete samples satisfy the review prerequisite. Await A or B; then implement the selected whole-page design in the actual Events route, without another generic permission check. No push/deploy is included.
