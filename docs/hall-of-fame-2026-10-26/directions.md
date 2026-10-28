# Hall of Fame: three section directions

26 October 2026 · Direction proposal only. [Static comparison](previews/concepts.html) uses the first two actual result rows, SZN 6 Spain then SZN 5 Panadura. It changes no live page or result data.

## Checked current section

The desktop screenshot shows a strong Hall of Fame heading and yellow winner names, but each photograph is only about 240 × 180 px, rendered nearly grey. A generous four-column row leaves more empty space than image or winner. The top-left `01`/`02` badge reads like a place or score although the list is simply in `content.js` order. Three decorative stars also suggest a rating, but no rating exists. The screenshot's condensed type cannot establish its font; checked current `app/layout.tsx` uses Bricolage Grotesque at width 75 plus Geist. Keep those current fonts and the current night/bone/yellow tokens. Photo corners remain rounded by the owner's site-wide decision.

## A — Champion spread (recommended)

Each winner gets a full-width horizontal spread: a much larger 3:2 photograph beside an event label, a large yellow champion name, venue, any recorded runner-up, and the existing Photos action. All rows have the same dimensions and hierarchy. Keep photos in colour at rest; restrained hover may give the photo a small scale change but must not carry the information. At 400 px the photo sits above its copy, still 3:2, with no clipped players or photographer marks. The first two source photos are both 3:2; SZN 5's visible ThePapare mark and credit must stay. This makes the real winners the visual event while retaining the site's existing night canvas and display type. Cost: a longer page.

## B — Equal trophy cards

Two equal cards across desktop, each with an equally sized 3:2 photo, season title, winner, venue and action. Reading order stays SZN 6 then SZN 5; on phone they stack in that same order. Thin bone rules separate them; there are no gold frames, trophies, podiums or decorated borders. This is the fastest scan and most compact option. Risk: the familiar card grid feels less like a distinctive Hall of Fame, and future odd item counts leave an incomplete last row.

## C — Editorial result rows

Keep the existing list rhythm, but give the champion most of the row, then a mid-size photo on the right and the event/venue on a narrow rail. The first and second rows are identical in status, separated by one hairline. At 400 px the event label leads, champion follows, then a full-width photo and action. This is the smallest visual change and preserves the current archive feel. Risk: imagery still feels secondary relative to A.

## Recommendation and guardrails

Choose **A**. It directly fixes the photograph's weak presence in the supplied screenshot without inventing rankings or adding a new graphic language. Implement the repeated spread for *every* `resultRows` entry, including missing-photo and unknown-winner states. Keep the array order; never convert it into a true date order while dates are `TODO`. Replace ordinal badges with event/season names. Preserve current links, alt text, photo credits, runner-up text when known, and the exact champions. Spain remains as the current unresolved source value until Anuda confirms the correction. Use only the photos already assigned to those entries; protect complete team frames and ThePapare marks.

The first two decoded source frames were checked: both are 3:2, and the SZN 5 photographer mark crosses the players near the bottom. A 4:3 crop risks trimming outer players; preserve the full 3:2 frame. Assumption most likely wrong: every later winner image also supports this frame. Worst failure: enlarged crops remove a player or photographer mark. Not covered: data corrections, site-wide redesign, animation work, or production changes.

## Acceptance checks for the later build

1. Compare all rendered row names/champions/order against `resultRows`, including unknown values.
2. Inspect actual desktop and 400 px exports: legible photos, all team members and marks retained, no horizontal overflow, long names such as **Yashen Caldera** and **Panthera FC** wrap cleanly.
3. Verify keyboard focus, Photos links, alt text and photo credits; reduced motion and no-JS retain full content.

Preview status: source sample built for visual comparison. Browser render evidence is pending the lead's shared browser review.
