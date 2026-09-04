/* Reads the hand-edited content file into the shapes the site's sections render:
   the champions grid, the partner index and the links hub. Named for the file it
   parses rather than for any one section, after being called champions-data.js
   through T6. The gallery (both the home page coverflow and the gallery page
   mosaic) reads content.js through src/gallery-data.js instead, since a gallery
   item's own shape - src, alt, tag, clip poster - never needed the TODO-guard
   parsing this file exists for beyond what gallery-data.js's parseItem already
   does on its own.

   Pure: no DOM, no imports, so it can be tested in the node environment without
   pulling in jsdom as a third dependency. */

/* Anything the repo does not actually know is the literal string "TODO" in
   content.js, sometimes with a note after it. Everything unrecorded becomes
   null here, and the renderer decides what absence looks like. Nothing is ever
   invented: see docs/HOUSE-RULES.md section 7. */
export function recorded(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "" || /^todo\b/i.test(trimmed)) return null;
  return trimmed;
}

function parseSeason(raw) {
  return {
    season: raw.season,
    champion: recorded(raw.champion),
    runnerUp: recorded(raw.runnerUp),
    goldenBoot: recorded(raw.goldenBoot),
    goldenGlove: recorded(raw.goldenGlove),
    note: recorded(raw.note),
    // A photo path runs through the same guard as every other field. A "TODO"
    // or empty src would make the browser request the page itself and draw a
    // broken-image icon inside the card.
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
    // When it ran and where. Both were added for the About page's journey and
    // both are TODO across the whole file today, so every stop renders one or
    // two lines shorter rather than printing a guess.
    date: recorded(raw.date),
    venue: recorded(raw.venue),
    // The album on this site that this card's "View photos" button opens —
    // the key of a file in public/albums/, written by `npm run albums:sync`.
    // driveFolder stays as well: it is the escape hatch to the original,
    // full-resolution files, which the site never serves.
    albumId: recorded(raw.albumId),
    // A link out to this season's full photo folder on Google Drive. The site
    // never hosts the whole archive: hundreds of files would have to be resized
    // and committed by hand, and the owner can drop a folder into Drive without
    // a developer. Runs through the same TODO guard as everything else, so a card
    // can never link nowhere.
    driveFolder: recorded(raw.driveFolder),
  };
}

function parseCompetition(raw) {
  return {
    name: recorded(raw.name),
    note: recorded(raw.note),
    champion: recorded(raw.champion),
    runnerUp: recorded(raw.runnerUp),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
    // The album on this site that this card's "View photos" button opens —
    // the key of a file in public/albums/, written by `npm run albums:sync`.
    // driveFolder stays as well: it is the escape hatch to the original,
    // full-resolution files, which the site never serves.
    albumId: recorded(raw.albumId),
    date: recorded(raw.date),
    venue: recorded(raw.venue),
    driveFolder: recorded(raw.driveFolder),
  };
}

/* A watch-along is a community night in front of a screen, not a tournament
   Frontier runs (CONTEXT.md). It has no champion and no runner-up, which is
   exactly why it is a third collection rather than another competition: folding
   it in would put a "Champion" heading over an evening that never had one. */
function parseWatchAlong(raw) {
  return {
    name: recorded(raw.name),
    note: recorded(raw.note),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
    // The album on this site that this card's "View photos" button opens —
    // the key of a file in public/albums/, written by `npm run albums:sync`.
    // driveFolder stays as well: it is the escape hatch to the original,
    // full-resolution files, which the site never serves.
    albumId: recorded(raw.albumId),
    date: recorded(raw.date),
    venue: recorded(raw.venue),
    driveFolder: recorded(raw.driveFolder),
  };
}

export function parseContent(raw) {
  const source = raw ?? {};
  return {
    seasons: (source.seasons ?? []).map(parseSeason),
    // Turf Wars and Division 0 are not seasons of the 4x4 Series (CONTEXT.md),
    // so they are a sibling collection rather than entries in `seasons`. A list
    // and not two named keys: the second one is what turned the special case
    // into a collection, and a third costs the owner a copy-paste, not a code
    // change. Deleting the whole list from content.js must not throw.
    competitions: (source.competitions ?? [])
      .map(parseCompetition)
      // A card's title is its name, so an unnamed competition has nothing to
      // render and is dropped rather than drawn as a headless card.
      .filter((competition) => competition.name),
    // Same rule as competitions: a card's title is its name, so an unnamed one
    // has nothing to render and is dropped rather than drawn headless.
    watchAlongs: (source.watchAlongs ?? [])
      .map(parseWatchAlong)
      .filter((watchAlong) => watchAlong.name),
    // Parsed but deliberately NOT filtered here, unlike the three collections
    // above. What counts as a renderable partner or a renderable link is the
    // thing T7 was asked to prove with tests, and a selector that lives in
    // parseContent cannot be tested apart from it. partners() and
    // outboundLinks() below do the selecting.
    partners: (source.partners ?? []).map(parsePartner),
    links: (source.links ?? []).map(parseLink),
    people: (source.people ?? []).map(parsePerson),
    // Which season the watch parties ran alongside. A positive whole number or
    // nothing: anything else (the literal "TODO", a stray string, 0) means
    // unrecorded, and the renderer hangs the branch off the end of the run
    // instead of guessing a point in the middle of it.
    watchAlongsAfter:
      typeof source.watchAlongsAfter === "number" && source.watchAlongsAfter > 0
        ? source.watchAlongsAfter
        : null,
  };
}

/* A brand or a place that has appeared alongside Frontier. CONTEXT.md keeps
   `partner` and `sponsor` as different words: a sponsor paid, a partner may or
   may not have. Nobody has recorded which of the eleven paid, so the site says
   partner about all of them and claims nothing about money.

   `logo` and `url` both run through the TODO guard, which is what lets the row
   render as plain text today and as a linked logo the day either arrives. */
function parsePartner(raw) {
  return {
    name: recorded(raw.name),
    logo: recorded(raw.logo),
    url: recorded(raw.url),
  };
}

/* `handle` is what the hub prints big, so it is stored rather than pulled out of
   the url: parsing "@frontierfootballl" back out of an Instagram address works
   until the day a link is a WhatsApp invite or a Sofascore page, which have no
   handle in them at all. A link with no handle falls back to its name. */
function parseLink(raw) {
  return {
    name: recorded(raw.name),
    handle: recorded(raw.handle),
    url: recorded(raw.url),
  };
}

/* Somebody who runs Frontier. `people` ships as an empty list in content.js:
   nobody has been named yet, and a card standing in for a real person who has
   not agreed to be listed is worse than no section at all. Same TODO guard as
   every other field, so the section appears the day a name is typed in. */
function parsePerson(raw) {
  return {
    name: recorded(raw.name),
    role: recorded(raw.role),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
  };
}

/* The partners that can actually be drawn, in the order content.js lists them.

   Not sorted. Alphabetising, or moving the ones with logos to the front, would
   imply a ranking nobody set; file order is simply the order they were recorded
   in and carries no claim.

   A partner with no url is KEPT. That is the path every one of them takes today,
   and it is the difference between this and outboundLinks(): a partner is a name
   Frontier wants to credit whether or not anyone has checked its address, while
   a link with no address is not a link. */
export function partners(data) {
  return data.partners.filter((partner) => partner.name);
}

/* Everywhere else Frontier lives, in priority order, and only the ones that go
   somewhere.

   A link whose url is still TODO is ABSENT rather than present-and-disabled. A
   greyed control that can never be pressed tells a visitor Frontier has a TikTok
   and then refuses to open it, which is worse than not mentioning it.

   Order is content.js's, so Instagram is first today and stays first when the
   other three are filled in. The hub gives its statement slab to whatever comes
   back first rather than to Instagram by name, so a blanked handle degrades to
   the next link instead of leaving the section headless. */
export function outboundLinks(data) {
  return data.links.filter((link) => link.name && link.url);
}

/* A season's name, in one place.

   "4 x 4 Series SZN 6" is display copy; `season` is the number (CONTEXT.md).
   Four renderers print it - the champions rail, the About record, the gallery
   album cards and the album page's own title - and they must agree, so the
   wording lives here rather than in a template literal per file. */
export function seasonName(season) {
  return `4 x 4 Series SZN ${season}`;
}

/* The About page's timeline, told forwards.

   content.js lists seasons NEWEST first, because that is the order the champions
   grid wants. A journey runs the other way, so the reversal lives here rather
   than in the file the owner edits.

   Order: the first competition opens, the seasons run in the middle, and any
   remaining competition closes. File order carrying meaning is the convention
   this file already uses for `partners` and `links`, and it puts Turf Wars at
   the front because Turf Wars is where Frontier started.

   ponytail: once every stop has a real `date`, sorting by date is strictly
   better and deletes this rule. Nothing can be sorted by date while every date
   in the file is still TODO. */
export function journey(data) {
  const [opener, ...rest] = data.competitions;
  const seasons = [...data.seasons]
    .sort((a, b) => a.season - b.season)
    // The stop carries a `name` like every other stop so the renderer never
    // branches on which collection something came from.
    .map((season) => ({ ...season, name: seasonName(season.season) }));

  return [...(opener ? [opener] : []), ...seasons, ...rest];
}

/* The people who run Frontier, in the order content.js lists them.

   An entry with no name is dropped: a card's content is its name, the same rule
   competitions and watch-alongs already follow. With the list empty this returns
   nothing and the whole section is left off the page. */
export function people(data) {
  return data.people.filter((person) => person.name);
}
