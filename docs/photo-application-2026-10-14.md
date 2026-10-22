# Applied Frontier photos

Applied locally on `photo-selection-2026-10-14`. The home hero remains reserved for video; its component, video and assets are unchanged.

44 reviewed source frames now provide 108 page, competition, featured-gallery, cover and reel exports. The site has 95 matching responsive copies for these exports. Camera originals remain untouched. Sources and dimensions are recorded in [the source map](photo-selection-2026-10-14.json).

The first photo after the hero uses daylight SZN4 action. Its 400px phone crop focuses at 75%, keeping both main players, their boots and the ball visible. Group shots and photographer marks use complete-frame presentation. Narrow portrait gallery cards became 4:3 frames. The SZN5 video still was replaced with a credited real ThePapare photograph. Alt text describes the replacement event; unknown winners remain unknown.

The large Moment community photo uses the cleaner SZN4 friendship frame instead of enlarging a noisy watch-party crowd. Brand visibility retains the crowd at a smaller display. Several event-specific night photos still have source noise; their original limitations are recorded in the selection report. No artificial retouching or invented photographic detail was introduced.

Checks passed:

- Production build, including TypeScript, and all 224 tests.
- All 108 exports and 95 responsive copies decode and match their recorded dimensions; no source enlargement or stale responsive copies.
- All 25 exported HTML pages have no missing local image references.
- Hero files have no diff; event names and photographer credit checked against the applied sources.
- Desktop and 400px phone framing simulations of the first after-hero photo inspected. These are image-crop simulations, not browser screenshots.

Actual browser layout, motion, accessibility and Lighthouse performance remain unverified. Browser access to the local selection preview was declined; no alternate browser workaround was attempted. No commit, push or deployment was made in the website repo.
