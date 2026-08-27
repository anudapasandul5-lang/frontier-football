# CONTEXT.md — Frontier Football domain model

Vocabulary for this codebase. Use these exact words in code and copy — do not invent
synonyms in a later ticket.

## Terms

**Season / SZN**
A season is one edition of the 4x4 Series. "SZN" is the user-facing shorthand that appears
in captions and graphics (e.g. "SZN 5"). Data key: `season` (a number or id like `"szn-5"`) —
never store the literal string `"SZN"` as a key, only as display copy.

**4x4 Series**
Frontier's core recurring competition format (4-a-side). This is what a "season" is a season
*of* — "SZN 5" means the 5th edition of the 4x4 Series. Data key: implicit; the top-level
seasons collection *is* the 4x4 Series.

**Champion**
The winning team of a season. User-facing copy and data key both: `champion`.

**Runner-up**
The second-place team of a season. Data key: `runnerUp`.

**Honour**
Umbrella term for any award tied to a season: champion, runner-up, Golden Boot, Golden Glove.
The Champions & Honours section renders honours as sticker cards cycling the four rainbow
colours (yellow, green, red, orange).

**Golden Boot**
Top-scorer award for a season. User-facing copy exactly "Golden Boot". Data key: `goldenBoot`.

**Golden Glove**
Best-goalkeeper award for a season. User-facing copy exactly "Golden Glove". Data key:
`goldenGlove`.

**Competition**
Umbrella term for a Frontier tournament that is NOT a season of the 4x4 Series. Data key:
`competitions`, a sibling collection to `seasons` in content.js. Each entry carries a
`name`, an optional `note`, and the same champion/runner-up/photo fields a season has. It
is a list rather than one key per competition because there are already two; a third costs
a copy-paste, not a code change. An entry with no `name` is dropped, since a card's title
is its name.

**Turf Wars**
A non-seasonal competition, played on turf. Ran Aug 2025. Not a season of the 4x4 Series
and not folded into the SZN honours grid.

**Division 0**
A FIFA/FC26 console tournament played on PS5, not on a pitch. Frontier's own posts spell it
both "Division 0" and "Division-0", and once as "Frontier: Division-0"; the site uses
**Division 0**. Announced as a "World Cup Edition" PS5 FC26 tournament, run with @seixed
and @address.lk, recapped 2026-07-28. It is a competition, not a season and not a
watch-along: Frontier organises it and it has a champion.

**Watch-along**
A community event where people gather to watch football together (e.g. a World Cup match) —
a social/content event Frontier hosts, not a match Frontier organizes or officiates.

**Tournament**
Umbrella for a season of the 4x4 Series or a competition. Added when the gallery
needed both as one list. It is a genuine umbrella and not a synonym for either:
`competition` is already defined above as "a Frontier tournament that is NOT a
season", so this word was already doing that job informally. Code: `tournaments()`
in `src/content-data.js`. No data key of its own, since it is a view over
`seasons` and `competitions`, in that order.

**Gallery**
The gallery is a **page** (`gallery.html`), reached from the nav on every page. It
holds one card per tournament and per watch-along, each linking out to that
thing's full photo folder on Google Drive. User-facing copy: "Gallery".

The scrolling row of pictures near the bottom of the home page is a **gallery
preview**, not "the gallery". It carries no visible name and exists to show what
Frontier looks like without making anyone click. Its code still uses the shorter
`gallery` prefix (`src/gallery.js`, `.gallery__*`, `src/styles/gallery.css`) while
the page uses `gallery-page` (`src/gallery-page.js`, `.gallery-page__*`). If a
later ticket touches either, keep that split: the page is the gallery, the row is
the preview.

**Drive folder**
A link to a Google Drive folder holding every photo from one tournament or
watch-along. Data key: `driveFolder`, a field on each season, competition and
watch-along rather than a collection of its own. The site never hosts a full
archive: hundreds of files per tournament would have to be resized and committed
by hand, and Drive's own image links are not dependable enough to lay out inside
the page. So the gallery links out rather than embedding, and the owner adds a
tournament's photos by pasting one link. `TODO` until pasted, and a card with no
link says "Photos are on the way." rather than being hidden, because every
tournament is expected to get one.

**Watch-along** (data key added)
Defined above as a social event Frontier hosts rather than a match it runs. It now
has a data key: `watchAlongs`, a sibling collection to `seasons` and
`competitions`. It carries `name`, `note`, `photo`, `photoAlt` and `driveFolder`,
and deliberately has **no** `champion` or `runnerUp`: nobody wins a watch-along,
and that absence is the whole reason it is a third collection instead of another
competition. The gallery renders tournaments and watch-alongs as two groups that
are never merged.

**Partner vs Sponsor**
`sponsor` is a paying brand relationship. `partner` is broader — a venue, media outlet, or
collaborator that may or may not involve payment. Keep them as separate fields/lists if both
exist in content.js; do not use the words interchangeably in copy.

**Links hub**
The section aggregating every outbound link (Instagram, TikTok, Sofascore, WhatsApp) in
priority order — Instagram first and largest, per BUILD-PROMPT. Data key: `links`, a list
of `{ name, handle, url }` at the root of content.js, in priority order. Order lives in the
file rather than in code so the owner can reorder without a developer. A link whose `url` is
TODO is **absent** from the markup, never present and disabled: a control that announces a
TikTok and then refuses to open it is worse than no control. Code: `outboundLinks()` in
`src/content-data.js`.

The hub gives its statement slab to the **first renderable link** rather than to Instagram
by name, so a handle blanked while somebody re-checks it degrades to the next link instead
of leaving a headless section. `handle` is stored rather than parsed out of the url: a
WhatsApp invite and a Sofascore page have no handle in them at all. A link with no handle
falls back to its name.

Home page only. The footer repeats on both pages; the hub does not.

**Partner list**
Data key: `partners`, a list of `{ name, logo, url }` at the root of content.js, in the
order the names were recorded. Deliberately not sorted: alphabetising, or floating the ones
with logos, would imply a ranking nobody set. An entry with no `name` is dropped, since a
row's content is its name. An entry with no `url` is **kept** and drawn as plain text, which
is what makes it different from a link: a partner is a name Frontier wants to credit whether
or not anyone has checked its address. Code: `partners()` in `src/content-data.js`.

Names are printed **verbatim** as they appear in HOUSE-RULES section 7 — `@main.sportsbar`,
and `Sofascore` / `ThePapare` without an `@` because they were recorded as company names
rather than handles. Tidying `drinkhypebam` into "Hype Bam" would be inventing a brand name
nobody supplied. No category label goes under a name.

**Marquee**
The site's one moving strip, spent in T7 on the brand tagline. See HOUSE-RULES section 5.
Not a data key: its copy is in the markup, because it is brand copy rather than content the
owner edits.

**Reigning**
Describes the champion of the most recent *completed* season — i.e. the most recent season
whose `champion` field is filled in, never a season still marked TODO.

## User-facing copy vs data keys

Use "SZN", "Golden Boot", "Golden Glove", "Turf Wars", "Division 0", "reigning" freely as
display copy. Their data keys are the plain English forms above (`season`, `goldenBoot`,
`goldenGlove`, `competitions`) — the copy word and the key are deliberately not always
spelled the same. Turf Wars and Division 0 have no keys of their own: they are entries in
`competitions`, named by their `name` field.

## No events surface

Tournaments are currently on break. The site has no events, fixtures, or countdown surface,
and this build does not introduce a "fixture" concept in code or copy. If match-by-match
scheduling returns later, that is a future ticket's decision, not assumed here.

## Known vs TODO content

Known: SZN 3 champion Ramadan FC, SZN 4 champion Pantera FC, SZN 6 (World Cup Edition)
champion Spain. TODO — represented as explicit TODO strings in content.js, never invented:
SZN 1, 2 and 5 champions, every Golden Boot / Golden Glove winner, every runner-up, Turf
Wars champion and runner-up, Division 0 champion and runner-up and month, TikTok handle,
the domain.

Two claims are sourced but unconfirmed and are deliberately NOT on the site. Instagram
captions name Ramadan FC as the SZN 1 and SZN 2 champion ("@ramadanfc.official have taken
both SZN 1 and 2", 2026-03-17). And the SZN 6 champions post is captioned
"…@ramadanfc.official c…" even though section 7 of HOUSE-RULES records SZN 6's champion as
Spain — both can be true, since SZN 6 was a country-named edition, but nobody has said so.
Owner confirmation turns either into a one-word edit.
