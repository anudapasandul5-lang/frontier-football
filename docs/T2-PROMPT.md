# T2 — Sticker objects

Paste the fenced block into a fresh Claude Code session opened in the `Frontier Football` repo.
Self-contained: assumes no memory of the T0/T1 sessions.

---

```
Ticket T2 of the Frontier Football v1 build: generate the 3D sticker objects via kie.ai. Do NOT build any page sections this ticket. Do NOT touch index.html or styleguide.html.

Read docs/BUILD-PROMPT.md first, section 7 (IMAGE GENERATION) and section 8's T2 entry — they are the locked brief for this ticket.

State of the repo: T0 and T1 shipped and signed off. src/styles/tokens.css, base.css, components.css exist. styleguide.html is the approved design-system reference. Fonts are LOCKED: --font-display is Anton (fallback chain Anton, Archivo Black, Bebas Neue), --font-body is Space Grotesk. No licensed Super Squad/Telegraf files were supplied — the "TODO: swap when licensed files land" comment in tokens.css stays as-is, do not remove it. Two dependencies (vite, vitest), unchanged.

Generation is already partway done from the T1 session's own follow-on work:
- Object 1/8, Football, is DONE and approved: generated/checked in at generated-images/football-01.jpg. Prompt used: "A single glossy inflated 3D football, thick soft rounded pentagon-panel forms, studio lighting with a soft drop shadow, coloured in yellow #FABA2A with navy #0C2037 panel outlines, centred, isolated, rendered on a flat #FFF8DB cream background."
- Credit balance after that generation: 70 (started at 75; one generate call failed server-side with a 500 before the successful retry — failed calls did not consume credit).
- Remaining priority order, 7 objects: Boot, Keeper glove, Trophy, Whistle, Tri-colour scarf, Traffic cone, Water bottle. (8 total meets the BUILD-PROMPT floor of "8 to 12" — stop at 8 unless there's clear budget and reason to go further.)

═══════════════════════════════════════════
SECURITY — read before touching .env
═══════════════════════════════════════════
A prior session accidentally leaked the literal KIE_API_KEY value into a chat transcript by
running `grep -c` on .env through a shell proxy hook that ignored the -c flag and printed the
full matching line. Treat that key as compromised:
1. Before spending any more credits, ask the user whether they rotated the kie.ai key yet.
   If not, tell them to rotate it now (kie.ai dashboard) and update .env before you proceed.
2. NEVER run grep, cat, sed, awk, type, or any command that could print .env's contents,
   directly or as a side effect of a wrapper/hook. The only safe pattern: source it into
   shell env vars (`set -a && . ./.env && set +a`) and reference `$KIE_API_KEY` in a curl
   header — never echo it, never pass -v/-i to curl, never let it appear in a file you then
   cat back.
3. Never print the key, never commit it, never put it in client-side JS.

═══════════════════════════════════════════
ENDPOINTS — verified working
═══════════════════════════════════════════
  POST https://api.kie.ai/api/v1/flux/kontext/generate     body {"prompt": "..."}  -> {data:{taskId}}
  GET  https://api.kie.ai/api/v1/flux/kontext/record-info?taskId=...  -> {data:{successFlag, response:{resultImageUrl}}}
  GET  https://api.kie.ai/api/v1/chat/credit               -> remaining credits

All return HTTP 200 with the real status in the JSON "code" field — check "code", not the
HTTP status. Poll record-info until successFlag is 1 (done) or 3 (error) — this session saw
successFlag stay 0 for 60-90 seconds on a normal successful generation, so don't give up
early; also saw one immediate successFlag:3 / errorCode:500 that cost no credit and cleared
on a plain retry. Do not silently re-roll more than once per object — if a second attempt
also comes back wrong or erroring, stop, show the user, and ask.

═══════════════════════════════════════════
PROMPT TEMPLATE
═══════════════════════════════════════════
"A single glossy inflated 3D {OBJECT}, thick soft rounded forms, studio lighting with a soft
drop shadow, coloured in {ONE FRONTIER PALETTE HEX} {+ a second palette hex for outline/trim
if the object reads better with one}, centred, isolated, rendered on a flat #FFF8DB cream
background."

Rendering on flat cream means NO alpha keying is needed — the objects sit on the cream page
directly. Do not build a background-removal pipeline; that is the corner deliberately cut.

Rotate the fill colour through the four sticker colours (yellow #FABA2A, green #305552, red
#87292D, orange #E97404) across the 7 remaining objects so the eventual gallery/hero doesn't
read as monochrome. Ink #0C2037 is fair game as a trim/outline colour on any of them.

═══════════════════════════════════════════
WORKFLOW
═══════════════════════════════════════════
- Check /chat/credit before this batch and after it. Report the spend.
- Generate the remaining 7 in the priority order above. You do NOT need to stop after each
  one now that the single-object checkpoint has already been cleared (Football) — batch them,
  but still re-roll at most once per failed/wrong object before stopping to ask.
- Save each to generated-images/{name}-01.jpg (gitignored — this folder is dev-only raw
  output, matching how football-01.jpg landed).
- Optimise every kept object to WebP before it ships anywhere real (gallery, hero). No image
  optimisation tool exists in this repo yet — decide and say which you used: a platform-native
  CLI if one is already on the machine (e.g. cwebp), or ask the user before adding a new
  dependency (e.g. sharp). Do not silently add a dependency; that breaks the "two dependencies"
  rule this build has held since T0.
- Mark any deliberate corner-cut with a "ponytail:" comment naming the ceiling.

═══════════════════════════════════════════
DONE WHEN
═══════════════════════════════════════════
1. 8 total sticker objects exist (Football already done + 7 more), each on a flat cream
   background, each a distinct object from the priority list.
2. Colours cycle across the four sticker colours — not all one hex.
3. Every generated file is optimised to WebP, or you've stopped and asked about the tooling
   decision above.
4. Credit spend reported: starting balance, ending balance, cost per image.
5. Dependency count is still two, or you asked before changing it.

Then STOP. Show me all 8 objects. Wait for sign-off before T3 (Hero).

═══════════════════════════════════════════
NEVER
═══════════════════════════════════════════
- Never print, echo, or grep/cat the KIE_API_KEY.
- Never commit .env.
- Never re-roll a bad generation more than once without asking.
- Never build a background-removal pipeline.
- Never add a dependency without asking first.
- Never build page sections this ticket.
```
