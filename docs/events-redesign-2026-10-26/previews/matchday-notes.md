# Direction A — Matchday Broadcast

## What changes

The page opens like live club coverage: a full football photo, oversized Frontier display type, moving field marks, and direct jumps to the Sunday session and Hall of Fame. A narrow facts ticker carries only verified session details. The bone session act answers where and when to play. Three existing Events photos bridge into the night archive, where each result has its own full-frame photo, event label, champion, known venue/date, credit, and album link.

The archive uses photo-led spreads and alternating sides. It carries all nine results in the exact order in `facts.json`. There is no upcoming section because the current array is empty. The WhatsApp action uses the current session-specific message. It does not describe Sunday play as League registration.

## Motion and access

The title arrives immediately. Yellow pitch circles pulse, the field shifts, and the verified session ticker moves. The active winner spread draws a short yellow line and slides its photo into place on first view. The archive text is never hidden behind motion. Pause motion stops CSS animations; reduced-motion makes them static. Without JavaScript, all content and links remain visible. Keyboard focus has an explicit yellow outline; links and the toggle meet a 44 px touch target.

Timing: title entrance 0.85 s; signal pulse 1.25 s; pitch circle pulse 5 s; field shift 9 s; ticker loop 19 s; winner line/photo entrance 0.8 s at 18% viewport intersection. JavaScript only toggles the pause class and marks seen result rows. The pause class freezes all CSS keyframes; reduced-motion disables them. No JavaScript tween or scrolling engine runs.

## Assets and integration

Brand: current night, bone, yellow, Bricolage Grotesque width 75, Geist. Uses the four existing Events images (hero plus three page frames) and each winner photo once. Champion photos use full frames to retain groups and any photographer marks. Font and media links point to the current local `out/` and `public/` files so the saved HTML opens directly. Next and footer destinations mirror `NextPage.tsx` and `Footer.tsx`; Instagram and TikTok destinations come from `content.js`, and the 2026 copyright matches the current dynamic footer year. Album links use the static export files. No dependencies, runtime data fetch, generated imagery, new results, or production route edit.

## Review

Static checks passed: nine results match source order; session text and exact WhatsApp URL match `facts.json`; every known credit is shown; all 33 local media and page links resolve; inline JavaScript parses. Lead owns desktop and 400 px render, visible-motion comparison, pause/reduced-motion, keyboard, and overflow review. This is a direction sample for selection before production implementation.
