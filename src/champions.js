import content from "../content.js";
import { parseContent } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* Renders the Champions & Honours grid from content.js. No season data lives in
   index.html: a whole season swap is an edit to content.js and nothing else.

   ponytail: the colour order is a rule, not a list, so it survives the owner
   adding or removing a season. Two constraints are baked in.

   Green can never land in the top row, because T4's full-bleed green band sits
   directly above this section and green on green reads as a smudge. The lead
   card is yellow and the one after it is orange, which keeps the top row safe
   at every column count.

   The cycle is FOUR long, not three, and that is load-bearing rather than
   decorative. The grid is three columns wide at desktop and the lead tile eats
   two cells, so a three-long cycle puts the same colour in the same column on
   every row: at seven cards the grid turned into three vertical stripes of red,
   green and orange. Four is coprime with three, and works at two columns too.
   It costs a second yellow card once per cycle, which is what HOUSE-RULES
   section 2 describes; the thing reserved for the primary action is the yellow
   BUTTON, and this section has none. */
const LEAD_COLOUR = "card--yellow";
const CYCLE = ["card--orange", "card--red", "card--green", "card--yellow"];

const colourFor = (index) => (index === 0 ? LEAD_COLOUR : CYCLE[(index - 1) % CYCLE.length]);

function line(className, text) {
  const el = document.createElement("p");
  el.className = className;
  // textContent, never innerHTML: the owner hand-writes these names and a team
  // called "Ramadan FC & Co" must not have to be escaped by hand.
  el.textContent = text;
  return el;
}

/* The secondary honours. Absent ones are left out of the markup entirely rather
   than shown as placeholders: right now that would be thirteen empty rows
   against three real names, and a card that is mostly holes reads as a broken
   render. They appear on their own the moment content.js has values. */
function honourRows(entries) {
  const recorded = entries.filter(([, value]) => value);
  if (recorded.length === 0) return null;

  const list = document.createElement("ul");
  list.className = "champions__honours";
  for (const [label, value] of recorded) {
    const row = document.createElement("li");
    row.className = "champions__honour";
    row.append(line("champions__honour-label", label), line("champions__honour-name", value));
    list.append(row);
  }
  return list;
}

/* The champions photo. Absent for any card whose content.js entry has no photo,
   and the card is designed to read as complete without one rather than leaving a
   hole where a picture should be. */
function photo(src, alt, title) {
  const img = document.createElement("img");
  img.className = "champions__photo";
  img.src = src;
  // A generated fallback so adding a season needs one line, not two. Says only
  // what is certainly true of every one of these pictures.
  img.alt = alt ?? `The ${title} champions.`;
  img.loading = "lazy";
  img.decoding = "async";
  // Intrinsic size of the cropped files, so the card reserves its space before
  // the image arrives and the grid does not jump.
  img.width = 800;
  img.height = 450;
  return img;
}

/* One card shape for both a season and Turf Wars. The title slot carries "SZN 6"
   or "Turf Wars", and the note slot carries a season's note or Turf Wars' date. */
function card({ title, champion, note, honours, photoSrc, photoAlt }, index) {
  const cell = document.createElement("li");
  cell.className = "champions__cell";
  if (index === 0) cell.classList.add("champions__cell--lead");
  cell.dataset.reveal = "";

  const inner = document.createElement("div");
  inner.className = `card ${colourFor(index)} champions__card`;
  if (!photoSrc) inner.classList.add("champions__card--textonly");

  if (photoSrc) inner.append(photo(photoSrc, photoAlt, title));
  inner.append(
    line("champions__label", "Champion"),
    line("champions__title", title),
    // An unnamed champion gets a stated label, not an omitted line. Naming the
    // champion is the card's whole job, so a title with nothing under it would
    // read as a rendering bug rather than as an honest gap.
    line("champions__team", champion ?? "Not recorded yet"),
  );
  if (!champion) inner.querySelector(".champions__team").classList.add("champions__team--absent");
  if (note) inner.append(line("champions__note", note));

  const rows = honourRows(honours);
  if (rows) inner.append(rows);

  cell.append(inner);
  return cell;
}

export function renderChampions(mount, data) {
  const cards = data.seasons.map((season) => ({
    title: `SZN ${season.season}`,
    champion: season.champion,
    note: season.note,
    photoSrc: season.photo,
    photoAlt: season.photoAlt,
    honours: [
      ["Runner-up", season.runnerUp],
      ["Golden Boot", season.goldenBoot],
      ["Golden Glove", season.goldenGlove],
    ],
  }));

  // Turf Wars and Division 0 are not seasons of the 4x4 Series (CONTEXT.md), so
  // they are appended after the seasons rather than sorted among them. Same card
  // shape either way: the only difference is that a season's title is built from
  // its number and a competition's title is its name.
  for (const competition of data.competitions) {
    cards.push({
      title: competition.name,
      champion: competition.champion,
      note: competition.note,
      photoSrc: competition.photo,
      photoAlt: competition.photoAlt,
      honours: [["Runner-up", competition.runnerUp]],
    });
  }

  mount.replaceChildren(...cards.map(card));
}

const section = document.querySelector(".champions");
const mount = section?.querySelector("[data-champions]");
if (mount) {
  renderChampions(mount, parseContent(content));
  // Wired from the section, not the mount: the heading and the line under it
  // are static markup outside the grid and carry data-reveal too.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
