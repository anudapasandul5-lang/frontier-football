/* Reads the hand-edited content file into the shape the champions grid renders.
   Pure: no DOM, no imports, so it can be tested in the node environment without
   pulling in jsdom as a third dependency. */

/* Anything the repo does not actually know is the literal string "TODO" in
   content.js, sometimes with a note after it. Everything unrecorded becomes
   null here, and the renderer decides what absence looks like. Nothing is ever
   invented: see docs/HOUSE-RULES.md section 7. */
function recorded(value) {
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
  };
}
