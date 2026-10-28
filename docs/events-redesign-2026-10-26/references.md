# Events redesign references — 2026-10-26

Search-only source pass for the two requested sample directions. No browser/CDP inspection was done. Search excerpts and catalog thumbnails are evidence; motion claims below come from page text, not live interaction. No new palette or font is proposed.

## Lead checks after the search pass

The lead opened the original BVB Tribute website, inspected its cover and a scroll transition in the in-app browser, and saved sources/bvb-desktop.jpg, bvb-story.jpg and bvb-figures.jpg. Observed: full yellow field with huge black title and central light circle, then a light reading field and asymmetric photo/body composition. The last filename is a mid-scroll story capture, not proof that the Key Figures section had settled. Do not adopt its acid-yellow palette, crest, claims or loading sequence. This supports expressive scale and field changes for B, not copying its composition.

The lead also directly read the GSAP Vault Sports Club product page and the BVB original page through web extraction. GSAP Vault's linked demo returned403; no live demo or exact motion timing was inspected. Vipers extraction returned no body; its visual/interaction behavior remains unverified. Research covered seven discovery candidates and one live visual reference, not twenty visually studied sites.

## Queries and discovery libraries

- Awwwards: `site:awwwards.com football club sports matchday website event design`; then `site:awwwards.com/sites football website soccer interactive`.
- Godly: `Godly website design football sports club matchday landing page` (no useful football-specific result surfaced).
- Pinterest: `Pinterest football club matchday website design sports event page`; then `site:pinterest.com/pin football event landing page matchday website design`.
- Behance: `site:behance.net/gallery football matchday event website UX design club`.
- Supplemental interaction catalog: `site:sitereel.com football club event website design` (no strong SiteReel-specific hit); broader results surfaced GSAP Vault.

## Candidates

| Candidate / source | What was observable | Useful pattern | Avoid / fit |
|---|---|---|---|
| [BVB Tribute — Awwwards](https://www.awwwards.com/sites/bvb-tribute) → [creator site](https://www.bvb-tribute.com/) | Awwwards entry text calls this a fan-made Dortmund 2010–13 tribute; tags include parallax, scrolling, single-page, microinteractions. Awwwards desktop and mobile thumbnails were returned by image search: yellow field, oversized black club lettering, circular motif, small “A GOLDEN ERA / TRIBUTE / 2010–2013” labels. I did not open/inspect the live creator site. | One strong cover composition and a restrained story sequence; club identity can carry a full-bleed first screen. | Strongest visual bridge to Frontier yellow + dark, but tribute page is a single nostalgic story, not an event/booking/archive IA. Do not copy Dortmund branding or assume its effects from tags. |
| [Sports Club Template — GSAP Vault](https://gsapvault.com/templates/sports-club-template) | Detailed page text describes full one-page fictional semi-pro club: fixed ticket bar, edge-to-edge kit-color hero over goal photo, results season scrubber, squad portrait swap, ground photo, membership bands and footer ticker. Listed effects: drag-scrub, SVG path draw, count-up, reveal, hover swap, marquee, parallax. Reduced-motion and keyboard behavior are documented. Live demo not opened. | Best whole-page motion/content reference for Direction A: hero → results/archive, one purposeful interaction, responsive story beats. Could borrow the score/result visual vocabulary only where its data truly exists. | Paid template and fictional-league assumptions include future fixture/opponent, attendance, league position and membership data. None may be transplanted to Frontier. Scrubber is extra complexity for a fixed winners archive. |
| [Football Club Landing Page — Behance / Prathamesh Ingale + Kaarwan](https://www.behance.net/gallery/191446077/Football-Club-Landing-Page-UI-Case-Study) | Search image metadata shows desktop/mobile responsive compositions, red/black palette, large CTA and training/facilities sections. Behance text confirms project, owners, responsive prototype tags; image returned. Page body is sparse, so labels/details are image metadata, not verified live UX. | Side-by-side desktop/mobile composition and clearly repeated, scannable content modules. | Academy signup page, not recurring event or winner archive; palette not reusable. |
| [Football Club - UI/UX Design — Behance / EarthyColor Agency + collaborators](https://www.behance.net/gallery/157058071/Football-Club-UIUX-Design) | Listing text/metadata says football-club landing page; author caption only says they designed the club site. Search surfaced it through football club design results; no detailed motion claims. | Candidate for football-specific visual references to inspect in the owner’s browser; use its image layouts only if they resolve quickly. | Evidence is thin and may just be static design work. Do not cite it as motion or a proven page flow. |
| [Football Event Landing Page pin — Pinterest](https://in.pinterest.com/pin/football-event-landing-page--334955291055257886/) | Pinterest title/category metadata only; no useful underlying creator/page content returned. | Discovery lead for a poster/playbill moodboard and alternate arrangement. | Weak evidence. No actual layout or animation claim; do not build from this pin alone. |
| [Football Club Website Design — Behance](https://www.behance.net/gallery/237586171/Football-Club-Website-Design) | Search excerpt describes hero/team photo, scores/fixtures, league table, news, sponsor area, shop/ticket CTA and highlights; generic prose, no convincing motion detail. | A compact club-information hierarchy can help keep an event page legible. | Generic template-like feature list; risks becoming a whole club homepage rather than a player-facing Events page. |
| [VIPERS FC](https://www.vipersfc.com.au/) | Original live club site could not be extracted by text open. Image search returned its trials banners: oversized white “VIPERS FC / 2026 CLUB TRIALS” text over a blue multi-photo action collage and an explicit Trials Registration CTA. | Good candidate for Direction B: real club uses one poster/collage + one direct action, instead of a sterile event card. | Actual site page, copy, responsive behavior and animation remain unverified; trial signup is not equivalent to a weekly session. Do not adopt its blue palette or registration terminology. |

## Two page directions

**A — Matchday broadcast.** Make the first screen feel like kickoff coverage: large real team photo, concise section headline, and a high-contrast next-action strip. Transition with a clear “session / what to do next” panel, then conditional upcoming events, then winners as repeated photo-led result spreads. Keep broadcast graphics as a narrow animated scoreline/field-line motif. The GSAP Vault page is the closest whole-page rhythm reference; BVB is a useful cover/title composition reference. Frontier facts do not include live match scores, dates or standings, so avoid simulated live data.

**B — Clubhouse poster.** Treat the page as a printed club playbill made from bold typographic slabs and a few cut-out rectangular real-photo panels. Open with the weekly session as the clear poster/action block; follow with upcoming events only when present; give the winners archive its own repeated poster/roster cadence, visually separate from the CTA. Vipers trials collage is a useful real-club composition reference; Pinterest/Behance are discovery prompts only. Keep the page legible at phone width and avoid an uncontrolled image mosaic.

## Practical motion rules for both samples

- Make motion obvious on first view or first scroll: a short, high-contrast entrance or a noticeable 1–2 second field/graphic sweep. Prior owner feedback specifically rejects motion that technically runs but looks static.
- Keep content and winner facts readable without waiting for animation. Use one clear transition per section, small image crop reveals, or a brief title/line sweep; do not animate the entire wall continuously.
- Use existing local fonts, night/bone/yellow colors, real photos and current facts. No fake ticker score, countdown, stats, fixture, ranking or urgency.
- Keep motion pausable and honor reduced-motion; preserve focus-visible states and no sideways page overflow. On mobile, reduce layers and overlap before reducing text size.

## Best three to inspect directly

1. [GSAP Vault Sports Club Template](https://gsapvault.com/templates/sports-club-template) — strongest full-page structure/motion detail, but paid and data assumptions must be stripped.
2. [BVB Tribute (Awwwards)](https://www.awwwards.com/sites/bvb-tribute) — strongest palette-adjacent cover/story reference; Awwwards supplied actual desktop/mobile screenshots and motion tags.
3. [VIPERS FC](https://www.vipersfc.com.au/) — actual club poster/collage and direct-registration reference; page behavior needs an owner browser check.

### Access limits

No browser/CDP visit was made, by assignment. GSAP page was opened and its text documentation read; Awwwards page was opened and its visible entry text read; Behance case study metadata was opened but its project embed/live interaction was not inspectable; Vipers text extraction returned empty, though image search supplied banner descriptions; Pinterest supplied only title metadata. I did not claim 20 live visual studies or verify any animation by watching it.
