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

**Partner vs Sponsor**
`sponsor` is a paying brand relationship. `partner` is broader — a venue, media outlet, or
collaborator that may or may not involve payment. Keep them as separate fields/lists if both
exist in content.js; do not use the words interchangeably in copy.

**Links hub**
The section aggregating every outbound link (Instagram, TikTok, Sofascore, WhatsApp) in
priority order — Instagram first and largest, per BUILD-PROMPT.

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
