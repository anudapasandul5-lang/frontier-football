# D — active Hall of Fame background

Preview: [background.html](previews/background.html). Representative first two `resultRows` only. No production files changed.

## Composition

The present dark, bone and yellow palette and Bricolage/Geist type carry through. A large, simple trophy drawing makes the section read immediately as a hall of winners. Five long stadium/pitch arcs sit behind it, with one yellow orbit and replay-like line. The illustration is a section background, not a row badge: it cannot imply a rank or add a result. Copy, champion yellow and real photos stay in the foreground; the heading and rows have a quiet reading area. The familiar photo / event / champion / Photos row structure remains.

Sources are in [background-research.md](sources/background-research.md). UEFA's moving stadium-edge light, Soni's trophy silhouette and Tektura's broadcast overlays informed these *motifs*; no source artwork was copied or visually verified. The native SVG and CSS use only Frontier colours, without a third-party asset.

## Motion and access

Revision 2: owner reported motion was imperceptible. Trophy now drifts 32px and rotates2degrees over3.8s, opacity48–65%; orbit rotates once every12s; pitch arcs travel90px over8s. Yellow light passes every3s without the former idle period. Mobile art is brighter and more visible. Quiet solid reading areas protect the result labels from crossing lines. Only transform and opacity animate. Pause/resume was checked in the actual in-app browser, with two rendered frames confirming changed positions. Desktop1440/phone400 screenshots saved as background-visible-desktop.jpg and background-visible-phone.jpg; no phone document/row overflow. Reduced-motion CSS remains static; OS emulation not checked.

Latest steering supersedes this background-only study: Anuda selected a redesign and animation of the entire Events page. See [the new brief](../events-redesign-2026-10-26/brief.md). Do not keep refining this background as the main direction.

## Source and limits

Current `content.js` (26 October) says SZN 6 **Ramadan FC**, then SZN 5 **Panadura**. Older direction samples said Spain, but current source now controls. Actual image paths, SZN 5 ThePapare credit, and preview links to existing static-export album HTML are used. Both photo frames follow their actual 3:2 proportions, protecting outer players and marks. Preview links target `out/` so they work when the file is opened from this repository; production should keep `row.photos` unchanged.

This is a two-row visual proposal. It does not demonstrate all later results, unknown-winner or missing-photo states, and it has not been applied to `app/events/page.tsx`. Lead owns browser screenshot checks at desktop and 400 px.
