# Frontier website photo review — 2026-10-13

## Goal
Recommend the strongest original and backup for every website photo placement after the home hero, including page photos, thumbnails and album highlights. Photos only. Sharpness, clean detail, light, colour, framing and contextual accuracy take priority. Light colour/crop adjustments allowed. Preserve originals and do not change the website.

## Phases
1. Map current placements and inventory local/Drive sources — complete.
2. Review contact sheets and shortlisted original detail — complete.
3. Create 47 placement recommendations and crop guidance — complete; browser review blocked by declined local-preview access.
4. Apply approved photos locally, verify assets/build/tests and record results — complete. Actual browser layout/performance remains unverified.

## Risks and limits
Most uncertain assumption: folder labels correctly identify the event. Verify provenance before recommending identity-sensitive images.
Worst failure: wrong team/event represented, or low-resolution image enlarged into a full-screen placement. Preserve source context and measure actual originals.
Not covered: website implementation/deployment, videos, logo redesign, heavy retouching.

## Errors
Sandbox process startup failed repeatedly; approved outside-sandbox reads worked, then user enabled full access.
Composio returned transient Google Drive per-minute quota errors for szn6/szn3 curated folders. Retry sequentially after local review work.
System Python has no Pillow; use an isolated review environment.
