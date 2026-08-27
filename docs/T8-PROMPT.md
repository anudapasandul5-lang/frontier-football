# T8 — Partner credentials page

Paste the fenced block into a fresh Claude Code session opened in the `Frontier Football` repo.
Self-contained: assumes no memory of the earlier ticket sessions.

> **This is the LEAN version.** The vault note for this ticket
> (`Prompts/2026-08-27 frontier-football-t8-partner-page.md`) describes a FULL version of roughly
> 300 lines and names this file as its home — but that full version was never written to disk.
> Only the lean text below survives. Before running this ticket, decide whether to rebuild the
> full version first: per that note it adds the design-skill exemption table (three skills assume
> React, Tailwind, an icon library, an animation library and dark mode — all forbidden here), the
> full repo state and one-observer rule, the eight spent layout families, the four machine traps
> (CRLF, `/tmp` under `node -e`, npx arg misparsing, heredocs choking on backticks), the motion
> budget, the `.is-pre` specificity trap, a 13-item DONE WHEN and a 15-item NEVER list.
>
> **Renumbering:** T8 is this page, T9 is the content showcase, T10 is the original T8
> (polish, a11y, perf, site-wide meta/OG, go-live).
>
> Two answers are still missing and block a clean run: the WhatsApp number with country code
> (plus any pre-filled message), and the owner's feared failure for this page in their own words.

---

```
Ticket T8 of the Frontier Football build: a partner credentials page. Build ONLY this.

Read docs/HOUSE-RULES.md in full and CONTEXT.md before writing anything.

SKILLS, in this order:
1. design-taste-frontend for direction. IGNORE its stack section: this project is plain
   HTML + CSS + JS on Vite with exactly two dependencies, no React, no Tailwind, no
   animation library, no icon library, and it is LIGHT ONLY. Its "dark mode is mandatory"
   rule does not apply — a dark Frontier page is a named failure state.
2. web-design-engineer for build discipline: five-dial Design Read, the four positioning
   questions, a v0 you show the owner before the full build. Skip its React/CDN/Tweaks
   sections and its Checkpoints 1 and 3 — the design system is already signed off.
3. web-design-guidelines as the audit gate on your changed files before you declare done.

Build a new unlisted page partner.html — nothing links to it. It is a URL the owner sends
to a brand. Add <meta name="robots" content="noindex"> with a comment on reversing it.

Its job: show a potential partner what Frontier has run, and give them one way to reply.
Frontier's own voice — no advertiser register, no "put your brand in front of".

Five surfaces:
1. Masthead. Anton headline flush-left, one line of sub-copy. NOT a centred poster.
2. The record. A vertical spine, one entry per tournament and per watch-along, from
   tournaments() and watchAlongs() in src/content-data.js. Two labelled runs on one spine,
   tournaments first — CONTEXT.md forbids merging them. Title, champion where recorded,
   thumbnail where a photo exists, Drive link where one exists. No venues, no invented
   dates.
   COMPOSE FOR THE REAL FILL RATE: 9 entries, 3 with a champion, 5 with a photo, and 4
   carrying nothing but a title (SZN 1, SZN 2, SZN 5, World Cup). The five with photos
   carry the page; the four bare ones group compactly. Do not design nine full rows.
3. The eleven partners, from partners(), as large Anton running text with separators. Not
   another ruled list. Still "partner", never "sponsor".
4. Contact slab. WhatsApp click-to-chat as the yellow primary and the only yellow on the
   page, with email beside it as plain text when both are recorded. wa.me on a desktop
   browser with no WhatsApp Web session lands on a download page, so email is co-present,
   not just a fallback rung.
5. LINK-PREVIEW META, and it is not optional. og:title, og:description, og:image,
   twitter:card. This page is unlisted and noindexed, so a WhatsApp message is its ONLY
   distribution channel and WhatsApp builds its preview card from OG tags. The site has
   zero og: tags today. Without them a brand receives a naked URL. Use an existing image
   from public/champions/.

Add to content.js: a `contact` object { whatsapp, whatsappMessage, email }, all TODO, and
an optional `date` on seasons/competitions/watch-alongs that renders only when filled.

On this page only, the nav CTA becomes the contact action and Instagram demotes to a plain
nav link. Do not touch the other two pages' navs.

Also fix: index.html line 9 and gallery.html carry an em-dash in the meta description.
Replace it. Zero em-dashes anywhere visible is a hard rule now.

TDD, real logic only, node env, no jsdom, through the exported recorded() guard:
- contactRoutes(data): returns { primary, secondary }. Primary priority whatsapp → email →
  Instagram DM. Secondary is email when whatsapp is primary, otherwise null. Primary NEVER
  null.
- whatsappHref(number, message): https://wa.me/<digits>[?text=...], strips spaces, plus
  signs and dashes, omits ?text when there is no message.
- record(data): the two labelled groups, empty groups dropped, each entry flagged for
  whether it has a photo.

Verify at 320/390/768/900/1100/1440/1900x780. Assert scrollWidth === clientWidth. Assert
nothing at opacity 0 after End. Prove reduced-motion static from computed styles. Run the
design-taste-frontend Pre-Flight Check, then web-design-guidelines, then the
web-design-engineer 5-dimension critique. Dependency count stays at two.

Then STOP and give me the localhost URL.
```
