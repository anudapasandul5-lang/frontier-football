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
/* content.js is hand-edited, so what arrives here is untyped: each parse*
   function below is the check, field by field. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Raw = any;

export function recorded(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "" || /^todo\b/i.test(trimmed)) return null;
  return trimmed;
}

function parseSeason(raw: Raw) {
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
    photoCredit: recorded(raw.photoCredit),
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

function parseCompetition(raw: Raw) {
  return {
    name: recorded(raw.name),
    note: recorded(raw.note),
    champion: recorded(raw.champion),
    runnerUp: recorded(raw.runnerUp),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
    photoCredit: recorded(raw.photoCredit),
    // The album on this site that this card's "View photos" button opens —
    // the key of a file in public/albums/, written by `npm run albums:sync`.
    // driveFolder stays as well: it is the escape hatch to the original,
    // full-resolution files, which the site never serves.
    albumId: recorded(raw.albumId),
    date: recorded(raw.date),
    venue: recorded(raw.venue),
    driveFolder: recorded(raw.driveFolder),
    // Ran before the 4x4 Series, so it leads the gallery tabs and the About
    // timeline. Strictly true, so a stray "TODO" never reorders either.
    beforeSeries: raw.beforeSeries === true,
  };
}

/* A watch-along is a community night in front of a screen, not a tournament
   Frontier runs (CONTEXT.md). It has no champion and no runner-up, which is
   exactly why it is a third collection rather than another competition: folding
   it in would put a "Champion" heading over an evening that never had one. */
function parseWatchAlong(raw: Raw) {
  return {
    name: recorded(raw.name),
    note: recorded(raw.note),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
    photoCredit: recorded(raw.photoCredit),
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

export type Content = ReturnType<typeof parseContent>;

export function parseContent(raw: Raw) {
  const source = raw ?? {};
  return {
    seasons: ((source.seasons ?? []) as Raw[]).map(parseSeason),
    // Division 0 and the like are not seasons of the 4x4 Series (CONTEXT.md),
    // so they are a sibling collection rather than entries in `seasons`. A list
    // and not two named keys: the second one is what turned the special case
    // into a collection, and a third costs the owner a copy-paste, not a code
    // change. Deleting the whole list from content.js must not throw.
    competitions: ((source.competitions ?? []) as Raw[])
      .map(parseCompetition)
      // A card's title is its name, so an unnamed competition has nothing to
      // render and is dropped rather than drawn as a headless card.
      .filter((competition) => competition.name),
    // Same rule as competitions: a card's title is its name, so an unnamed one
    // has nothing to render and is dropped rather than drawn headless.
    watchAlongs: ((source.watchAlongs ?? []) as Raw[])
      .map(parseWatchAlong)
      .filter((watchAlong) => watchAlong.name),
    // Parsed but deliberately NOT filtered here, unlike the three collections
    // above. What counts as a renderable partner or a renderable link is the
    // thing T7 was asked to prove with tests, and a selector that lives in
    // parseContent cannot be tested apart from it. partners() and
    // outboundLinks() below do the selecting.
    partners: ((source.partners ?? []) as Raw[]).map(parsePartner),
    links: ((source.links ?? []) as Raw[]).map(parseLink),
    people: ((source.people ?? []) as Raw[]).map(parsePerson),
    // How to reach Frontier. Always an object, even when content.js has no
    // `contact` key at all, so contactRoutes() never has to guard for its own
    // absence before guarding every field inside it.
    contact: parseContact(source.contact),
    // The collaborate page's own content. Always an object, like `contact`
    // above, so a content.js with no `collaborate` key at all still parses.
    collaborate: parseCollaborate(source.collaborate),
    // The weekly nights and the dated one-offs behind the events page. Parsed
    // but NOT filtered here, the same rule partners and links follow: what
    // counts as a renderable session is a decision worth testing on its own,
    // and sessions() and upcomingEvents() below make it.
    // The home page's numbers act: owner-supplied figures, same
    // figure/label/asOf shape as a reach row and the same both-halves rule.
    stats: ((source.stats ?? []) as Raw[]).map(parseReach),
    sessions: ((source.sessions ?? []) as Raw[]).map(parseSession),
    events: ((source.events ?? []) as Raw[]).map(parseEvent),
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
function parsePartner(raw: Raw) {
  return {
    name: recorded(raw.name),
    logo: recorded(raw.logo),
    url: recorded(raw.url),
  };
}

/* `handle` is what the hub prints big, so it is stored rather than pulled out of
   the url: parsing "@frontierfootballl" back out of an Instagram address works
   until the day a link is a WhatsApp invite or a Sofascore page, which have no
   handle in them at all. A link with no handle falls back to its name.

   `placeholder` lets the hub draw a greyed, unclickable tile for a platform
   before its URL exists - normally a link with no url is absent entirely. Only
   the owner opts a link into this, per link, in content.js. */
function parseLink(raw: Raw) {
  return {
    name: recorded(raw.name),
    handle: recorded(raw.handle),
    url: recorded(raw.url),
    placeholder: raw.placeholder === true,
  };
}

/* Somebody who runs Frontier. `people` ships as an empty list in content.js:
   nobody has been named yet, and a card standing in for a real person who has
   not agreed to be listed is worse than no section at all. Same TODO guard as
   every other field, so the section appears the day a name is typed in. */
function parsePerson(raw: Raw) {
  return {
    name: recorded(raw.name),
    role: recorded(raw.role),
    photo: recorded(raw.photo),
    photoAlt: recorded(raw.photoAlt),
  };
}

/* The ways to reach Frontier. Same TODO guard as every other field: the site
   ships with the number and the address unrecorded and must still work, so this
   file cannot assume any of them exist.

   Two messages rather than one because the contact page asks two different
   audiences - a brand and a player - and the pre-filled message is the only way
   to tell which one is typing before they type. */
function parseContact(raw: Raw) {
  const source = raw ?? {};
  return {
    whatsapp: recorded(source.whatsapp),
    partnerMessage: recorded(source.partnerMessage),
    playerMessage: recorded(source.playerMessage),
    email: recorded(source.email),
  };
}

/* What the collaborate page shows a brand: the numbers, and what a partner has
   really had.

   `offer` USED TO BE `contact.partnerOffer`. It moved here when the partner half
   of the contact page became its own page - the contact page now asks one
   question ("do you want to play?") and the brand conversation happens at
   /collaborate.html next to the reach figures a brand actually decides on. One
   list, one page, nothing printed twice.

   A reach row needs BOTH halves. A figure with no label is a number nobody can
   read and a label with no figure is a promise of one, so a half-recorded row is
   dropped rather than rendered with a gap. `asOf` is optional and prints beneath
   the figure when it is there: a follower count with no date on it is a claim
   that ages silently, and every one of these numbers is a claim a brand can
   check in ten seconds (HOUSE-RULES section 7). */
function parseReach(raw: Raw) {
  return {
    figure: recorded(raw.figure),
    label: recorded(raw.label),
    asOf: recorded(raw.asOf),
  };
}

/* One thing a partner gets: a short name for it and a line saying what it means.

   The title is what identifies the row, so a row without one is dropped by the
   caller - a body with nothing over it is a sentence floating in a ruled list.
   The body is optional and the row prints one line shorter without it, the same
   way a session with no venue does.

   A plain string is still accepted and becomes a title with no body. The owner
   hand-edits this file and the list was five plain strings until 2026-09-10;
   reverting one row to a string should not throw. */
function parseOffer(raw: Raw) {
  if (typeof raw === "string") return { title: recorded(raw), body: null };
  return {
    title: recorded(raw?.title),
    body: recorded(raw?.body),
  };
}

function parseCollaborate(raw: Raw) {
  const source = raw ?? {};
  return {
    reach: ((source.reach ?? []) as Raw[]).map(parseReach),
    // A list rather than a sentence so the page survives the owner adding a
    // fifth or deleting the lot (HOUSE-RULES section 7), and so nothing here is
    // phrased by this file - every claim is the owner's own.
    offer: ((source.offer ?? []) as Raw[]).map(parseOffer).filter((row) => row.title),
  };
}

/* A night that comes round every week. Thursday and Sunday today.

   `day` is the only field that identifies the block; everything else is a
   detail that may not be recorded yet. Same TODO guard as everywhere else, so a
   session whose venue is still unknown prints one line shorter. */
function parseSession(raw: Raw) {
  return {
    day: recorded(raw.day),
    name: recorded(raw.name),
    time: recorded(raw.time),
    venue: recorded(raw.venue),
    format: recorded(raw.format),
    price: recorded(raw.price),
    note: recorded(raw.note),
  };
}

/* A one-off with a date on it.

   NOTHING HERE FILTERS BY DATE, and that is deliberate rather than missing.
   `date` is free text the owner writes the way they say it out loud ("Sat 20
   Sep"), so there is no date to compare against today - parsing one would mean
   guessing a format and silently hiding a real event when the guess is wrong. A
   finished event is removed by deleting its block, which content.js says in as
   many words above the list. */
function parseEvent(raw: Raw) {
  return {
    name: recorded(raw.name),
    date: recorded(raw.date),
    venue: recorded(raw.venue),
    note: recorded(raw.note),
    url: recorded(raw.url),
  };
}

/* A wa.me click-to-chat link, or nothing.

   wa.me wants digits only. The owner types a number the way a human writes one
   ("+94 71 234 5678"), and a link built with the spaces or the plus sign still
   in it does not error - it opens a chat with nobody, which is the failure this
   strip exists to prevent. Punctuation with no digits behind it is not a number
   and returns null rather than "https://wa.me/".

   The message is optional and encoded. An empty ?text= is deliberately not the
   same as no ?text=: it reads as a message that was meant to be there and got
   lost on the way. */
export function whatsappHref(number: unknown, message: unknown) {
  const digits = (recorded(number) ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const text = recorded(message);
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/* What the contact page can actually offer, in the order it prefers to offer it.

   Priority is WhatsApp, then email, then whatever outbound link is first
   (Instagram today). WhatsApp wins because that is how this brand is already
   contacted; email is co-present rather than a fallback rung, because wa.me in a
   desktop browser with no WhatsApp Web session lands the visitor on a download
   page, and a brand reading this on a laptop is the whole point of the page.

   `secondary` exists ONLY for the WhatsApp case, where one number carries two
   audiences with two different pre-filled messages. Email cannot do that: two
   identical mailto buttons under two different labels is a lie about what
   pressing them does, so email falls back to a single action.

   `primary` can be null, and the renderer must handle it. The plan for this page
   said it never could, on the grounds that Instagram is always there - but every
   field in content.js is the owner's to blank, and a function that assumes one
   of them survives is the kind of assumption HOUSE-RULES section 7 keeps
   catching. With nothing recorded the slab is left off the page entirely. */
export function contactRoutes(data: Content, { only }: { only?: "partner" | "player" } = {}) {
  const { whatsapp, partnerMessage, playerMessage, email } = data.contact;
  const emailHref = email ? `mailto:${email}` : null;
  const channels = outboundLinks(data);

  // Branch on the BUILT link, never on the raw field. whatsappHref() returns
  // null for a recorded value with no digits in it - "TBA", "ask on Instagram",
  // anything the owner types that is not "TODO" and not a number - and a truthy
  // check on `whatsapp` would ship two buttons reading href="null", navigating
  // to /null, with the email fallback below never reached.
  // `only` narrows this to one audience, and the narrowing happens HERE rather
  // than in the renderer so the fallback chain below still runs. A page that
  // asks for the partner route on a content.js with no number does not get an
  // empty section - it falls through to email, then to Instagram, exactly as
  // the unnarrowed page does.
  const partnerHref = only === "player" ? null : whatsappHref(whatsapp, partnerMessage);
  const playerHref = only === "partner" ? null : whatsappHref(whatsapp, playerMessage);

  // Partner leads when both are on the table: that is the order the undivided
  // contact page shipped in. With `only` set, one of the two is already null and
  // this simply picks the survivor.
  const lead =
    (partnerHref && { kind: "whatsapp", audience: "partner", href: partnerHref }) ||
    (playerHref && { kind: "whatsapp", audience: "player", href: playerHref }) ||
    null;

  if (lead) {
    return {
      primary: lead,
      // Two audiences are worth two buttons only while the two buttons DO
      // something different. With both messages unrecorded - the state the file
      // ships in - the hrefs are byte-identical, and "I want to partner" beside
      // "I want to play" pointing at one bare link is the same lie about what
      // pressing them does that the email branch below collapses to avoid.
      // A narrowed page never gets a second button at all.
      secondary:
        lead.audience === "partner" && playerHref && playerHref !== partnerHref
          ? { kind: "whatsapp", audience: "player", href: playerHref }
          : null,
      email: emailHref,
      channels,
    };
  }

  if (emailHref) {
    return {
      primary: { kind: "email", audience: null, href: emailHref },
      secondary: null,
      email: emailHref,
      channels,
    };
  }

  const [fallback] = channels;
  return {
    primary: fallback
      ? { kind: "link", audience: null, href: fallback.url, name: fallback.name }
      : null,
    secondary: null,
    email: null,
    // Whatever became the headline action is dropped from the row beneath it.
    // Instagram as the big button and Instagram again in the list under it reads
    // as a bug rather than as two routes.
    channels: fallback ? channels.slice(1) : channels,
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
export function partners(data: Content) {
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
export function outboundLinks(data: Content) {
  return data.links.filter((link) => link.name && link.url);
}

/* The reach figures the collaborate page can actually print.

   Both halves or nothing: see parseReach above. Not sorted - content.js's order
   is the owner's running order and a "biggest number first" rule would quietly
   rearrange the page every time a figure was updated. */
export function reach(data: Content) {
  return data.collaborate.reach.filter(
    (row): row is typeof row & { figure: string; label: string } => Boolean(row.figure && row.label),
  );
}

/* The home page's numbers, verbatim and in content.js's order.

   Never computed from another list. "50+ Partners" is the owner's count while
   `partners` holds only the names somebody recorded; the stat and the strip are
   both true and neither is derived from the other (CONTEXT.md). */
export function stats(data: Content) {
  return data.stats.filter(
    (row): row is typeof row & { figure: string; label: string } => Boolean(row.figure && row.label),
  );
}

/* The weekly nights worth drawing.

   A DAY ON ITS OWN IS NOT A SESSION. "Thursday" with every other field still
   TODO tells a player nothing they did not already know, and a card carrying one
   word reads as a page that failed to load rather than as a night that is on.
   One real detail - a time, a venue, a format, a price, a note - and the card
   appears. This is the same judgement partners() and outboundLinks() make: what
   counts as renderable is a decision, and it lives here where it can be tested.

   Not sorted into week order either. content.js lists Thursday before Sunday
   because that is the week Frontier runs; re-sorting by a weekday table would
   hard-code a week that starts on Monday into a file about Colombo futsal. */
export function sessions(data: Content) {
  return data.sessions.filter(
    (session) =>
      session.day &&
      (session.name ||
        session.time ||
        session.venue ||
        session.format ||
        session.price ||
        session.note),
  );
}

/* The dated one-offs worth drawing. A row's title is its name, so an unnamed
   event has nothing to render and is dropped rather than drawn headless - the
   same rule competitions and watch-alongs already follow. */
export function upcomingEvents(data: Content) {
  return data.events.filter((event) => event.name);
}

/* A season's name, in one place.

   "4 x 4 Series SZN 6" is display copy; `season` is the number (CONTEXT.md).
   Four renderers print it - the champions rail, the About record, the gallery
   album cards and the album page's own title - and they must agree, so the
   wording lives here rather than in a template literal per file. */
export function seasonName(season: number | string) {
  return `4 x 4 Series SZN ${season}`;
}

/* The home page's champions table: every season, in content.js's order (newest
   first). Nothing is dropped for being unrecorded; a season with no champion
   still happened, and the table prints a muted dash for it (plan Q19).

   Photos go to the album on this site when one is synced, else out to the
   Drive folder, else nowhere: the same order the gallery cards use. */
export function championRows(data: Content) {
  return data.seasons.map((season) => ({
    id: `szn-${season.season}`,
    name: seasonName(season.season),
    champion: season.champion,
    venue: season.venue,
    photos: photosHref(season),
  }));
}

function photosHref(row: { albumId: string | null; driveFolder: string | null }) {
  return row.albumId ? `/albums/${encodeURIComponent(row.albumId)}` : row.driveFolder;
}

/* The Events page's results wall: every season (newest first), then every
   competition in content.js's order. Nothing is dropped for being unrecorded;
   the wall prints a muted dash for it (plan Q19). Watch-alongs are not here:
   nobody wins one.

   ponytail: seasons and competitions are not interleaved by date because no
   season has a date yet. Sort by date once they do. */
export function resultRows(data: Content) {
  return [
    ...data.seasons.map((s) => ({ id: `szn-${s.season}`, name: seasonName(s.season), ...s })),
    ...data.competitions.map((c) => ({ id: c.name!.toLowerCase().replace(/[^a-z0-9]+/g, "-"), ...c, name: c.name! })),
  ].map((row) => ({
    id: row.id,
    name: row.name,
    date: row.date,
    venue: row.venue,
    champion: row.champion,
    runnerUp: row.runnerUp,
    photos: photosHref(row),
  }));
}

/* The About page's timeline, told forwards.

   content.js lists seasons NEWEST first, because that is the order the champions
   grid wants. A journey runs the other way, so the reversal lives here rather
   than in the file the owner edits.

   Order: the competitions flagged `beforeSeries` open (the Frontier Football
   Tournament), the seasons run in the middle, and every other
   competition closes. Within each group, file order.

   ponytail: once every stop has a real `date`, sorting by date is strictly
   better and deletes this rule. Nothing can be sorted by date while every date
   in the file is still TODO. */
export function journey(data: Content) {
  const seasons = [...data.seasons]
    .sort((a, b) => a.season - b.season)
    // The stop carries a `name` like every other stop so the renderer never
    // branches on which collection something came from.
    .map((season) => ({ ...season, name: seasonName(season.season) }));

  return [
    ...data.competitions.filter((c) => c.beforeSeries),
    ...seasons,
    ...data.competitions.filter((c) => !c.beforeSeries),
  ];
}

/* The people who run Frontier, in the order content.js lists them.

   An entry with no name is dropped: a card's content is its name, the same rule
   competitions and watch-alongs already follow. With the list empty this returns
   nothing and the whole section is left off the page. */
export function people(data: Content) {
  return data.people.filter((person) => person.name);
}
