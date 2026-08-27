/* Reads the hand-edited content file into the shapes the site's sections render:
   the champions grid, the gallery page's groups, the partner index and the links
   hub. Named for the file it parses rather than for any one section, after being
   called champions-data.js through T6.

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
    date: recorded(raw.date),
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
    date: recorded(raw.date),
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
    date: recorded(raw.date),
    driveFolder: recorded(raw.driveFolder),
  };
}

/* How a brand replies. Every field is TODO in content.js today, which is the
   whole reason contactRoutes() below is a priority list rather than one link:
   the page has to hand somebody an action whether or not a number has been
   written down yet. */
function parseContact(raw) {
  const source = raw ?? {};
  return {
    whatsapp: recorded(source.whatsapp),
    whatsappMessage: recorded(source.whatsappMessage),
    email: recorded(source.email),
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
    contact: parseContact(source.contact),
  };
}

/* Seasons and competitions as one list. CONTEXT.md keeps them as separate
   collections because a competition is not a season of the 4x4 Series, but the
   photos page is a door per tournament and does not care which kind it is.

   The order is seasons then competitions, matching the champions grid, whose
   colour cycle is keyed to index and is therefore not merely cosmetic.

   ponytail: src/champions.js still builds its own titles the same way. Converging
   the two is a refactor of a signed-off section and belongs in its own change
   with its own browser verification, not smuggled into a feature ticket. If the
   title format ever moves, both places have to move together until then. */
export function tournaments(data) {
  return [
    ...data.seasons.map((season) => ({ ...season, title: `SZN ${season.season}` })),
    ...data.competitions.map((competition) => ({ ...competition, title: competition.name })),
  ];
}

/* Watch-alongs, titled the same way a competition is. Kept apart from
   tournaments() rather than appended to it: the gallery shows the two as
   separate groups because one is football Frontier ran and the other is football
   Frontier watched, and the domain model has always said so. */
export function watchAlongs(data) {
  return data.watchAlongs.map((watchAlong) => ({ ...watchAlong, title: watchAlong.name }));
}

/* The gallery page as a set of switchable groups, one tab each.

   A group with nothing in it is filtered out here rather than in the renderer,
   because an empty group is not a rendering problem, it is a group that does not
   exist: a tab leading to an empty panel is worse than no tab. The renderer then
   only has to decide between "one group, no tab bar needed" and "more than one,
   draw the tabs".

   The ids are fixed strings rather than derived from the labels at render time.
   aria-controls and aria-labelledby point at them from both directions, and a
   label that gets reworded must not silently break that link. */
export function galleryGroups(data) {
  return [
    { id: "tournaments", label: "Tournaments", entries: tournaments(data) },
    { id: "watch-alongs", label: "Watch-alongs", entries: watchAlongs(data) },
  ].filter((group) => group.entries.length > 0);
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

/* ============ THE PARTNER PAGE ============ */

/* A click-to-chat address. wa.me takes digits and nothing else, and a phone
   number is written down as "+94 77 123-4567", so the separators come out here
   rather than being something a non-technical editor has to remember.

   The message parameter is omitted entirely when there is none. "?text=" with
   nothing after it opens WhatsApp on a blank draft, which reads as a link that
   half-worked. */
export function whatsappHref(number, message) {
  const digits = String(number ?? "").replace(/[\s+-]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/* Instagram is verified live (HOUSE-RULES section 7) and is already hardcoded in
   every page's nav, so it is the floor under the guarantee below. Only reached if
   content.js's links list is emptied, which would take the hub down with it. */
const INSTAGRAM_FALLBACK = { name: "Instagram", url: "https://www.instagram.com/frontierfootballl/" };

/* One way to reply, and a second one beside it when the first is WhatsApp.
   PRIMARY IS NEVER NULL. The partner page exists to be sent to a brand, and a
   contact slab with no action is the one outcome it cannot ship.

   WhatsApp first because it is how business is done here. Email SECOND AND
   CO-PRESENT rather than a fallback rung: wa.me opened in a desktop browser with
   no WhatsApp Web session lands on a download page, so somebody reading this at
   a desk needs the address visible without having to fail first. */
export function contactRoutes(data) {
  const { whatsapp, whatsappMessage, email } = data.contact;

  const emailRoute = email
    ? { kind: "email", label: "Email us", address: email, href: `mailto:${email}` }
    : null;

  if (whatsapp) {
    return {
      primary: {
        kind: "whatsapp",
        label: "Message us on WhatsApp",
        href: whatsappHref(whatsapp, whatsappMessage),
      },
      secondary: emailRoute,
    };
  }

  if (emailRoute) return { primary: emailRoute, secondary: null };

  const instagram =
    data.links.find((link) => link.name === "Instagram" && link.url) ?? INSTAGRAM_FALLBACK;
  return {
    primary: { kind: "instagram", label: "Message us on Instagram", href: instagram.url },
    secondary: null,
  };
}

/* Everything Frontier has run, then everything Frontier watched, as two labelled
   runs on one spine. Never merged, for the reason CONTEXT.md has given since the
   domain model was written: one is football Frontier ran and the other is
   football Frontier watched.

   Every entry is flagged for whether it carries a photograph, because the page
   is composed around the real fill rate rather than around nine identical rows.
   Five of the nine have a picture and carry the page; the other four are a title
   and nothing else. A run of those collapses into ONE compact node: four
   full-height rows built around four bare titles is exactly what makes a real
   record look thin.

   The order inside a group is never touched to do it. Partitioning into
   "has a photo" and "does not" would sort SZN 5 out of the middle of the
   seasons, and the seasons read newest first. */
export function record(data) {
  return [
    { id: "tournaments", label: "Tournaments", entries: tournaments(data) },
    { id: "watch-alongs", label: "Watch-alongs", entries: watchAlongs(data) },
  ]
    .filter((group) => group.entries.length > 0)
    .map((group) => {
      const entries = group.entries.map((entry) => ({
        ...entry,
        hasPhoto: Boolean(entry.photo),
      }));
      return { ...group, entries, nodes: collapseBareRuns(entries) };
    });
}

function collapseBareRuns(entries) {
  const nodes = [];
  for (const entry of entries) {
    if (entry.hasPhoto) {
      nodes.push({ kind: "entry", entry });
      continue;
    }
    const last = nodes.at(-1);
    if (last?.kind === "cluster") last.entries.push(entry);
    else nodes.push({ kind: "cluster", entries: [entry] });
  }
  return nodes;
}
