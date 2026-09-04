import content from "../content.js";
import { parseContent, seasonName } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* Renders the Champions & Honours grid from content.js. No season data lives in
   index.html: a whole season swap is an edit to content.js and nothing else.

   ponytail: the colour order is a rule, not a list, so it survives the owner
   adding or removing a season.

   The cycle stays FOUR long now that this is a rail rather than a grid. In the
   grid it had to be coprime with three columns or one colour stacked into a
   vertical stripe; in a single row that pressure is gone, but four still beats
   three, because three puts two cards of the same colour within one
   screen-width of each other on a wide laptop.

   The lead card is yellow and the one after it is orange. That costs a second
   yellow card once per cycle, which is what HOUSE-RULES section 2 describes:
   the thing reserved for the primary action is the yellow BUTTON, and this
   section has none. */
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

/* One card shape for both a season and Turf Wars. The title slot carries a name
   or "Turf Wars", and the note slot carries a season's note or Turf Wars' date. */
function card({ title, champion, note, honours, photoSrc, photoAlt }, index) {
  const cell = document.createElement("li");
  cell.className = "champions__cell";
  // Read back by the nav's observer, so it never has to search the rail for a
  // cell's position. No data-reveal here: see the note in index.html for why
  // the reveal is wired to the rail instead of to each card.
  cell.dataset.index = String(index);

  const inner = document.createElement("div");
  inner.className = `card ${colourFor(index)} champions__card`;
  if (!photoSrc) inner.classList.add("champions__card--textonly");

  if (photoSrc) inner.append(photo(photoSrc, photoAlt, title));
  inner.append(
    // The reigning champion is first and says so. That is what the lead tile's
    // extra width used to communicate; in a rail every card is one width, so
    // the distinction moves into the type, where it costs no space at all.
    line("champions__label", index === 0 ? "Reigning champion" : "Champion"),
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

/* ============ RAIL NAV ============ */
/* Arrows and dots. Both are an addition to the rail, never the only way into
   it: the scrolling itself is CSS scroll-snap, so a swipe, a trackpad and the
   rail's own Left/Right keys all work whether or not this code runs. */

const prefersReducedMotion = () =>
  globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function arrowButton(direction, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `arrow arrow--${direction}`;
  button.setAttribute("aria-label", label);
  return button;
}

export function buildRailNav(rail, titles) {
  const nav = document.createElement("div");
  nav.className = "champions__nav";

  const previous = arrowButton("prev", "Previous season");
  const next = arrowButton("next", "Next season");

  function goTo(index) {
    // scrollIntoView, not a scrollLeft calculation: it already honours the
    // rail's scroll-padding-inline-start, so the card lands flush with the page
    // gutter without this file knowing what that gutter is. block: "nearest" is
    // load-bearing - without it the browser scrolls the PAGE to the rail too,
    // and pressing a dot yanks the viewport.
    rail.children[index]?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  const dotList = document.createElement("ul");
  dotList.className = "champions__dots";
  const dotItems = [];
  const dots = titles.map((title, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "champions__dot";
    // The visible dot is 10px of ink and says nothing on its own, so the name
    // is the season it goes to rather than "slide 3".
    button.setAttribute("aria-label", `Go to ${title}`);
    button.addEventListener("click", () => goTo(index));
    item.append(button);
    dotList.append(item);
    dotItems.push(item);
    return button;
  });

  /* One dot per SCROLL POSITION, not one per season, and the two are not the
     same number. A card can only sit at the rail's left edge if there is
     enough deck left to its right to fill the view; the last few never can.
     At 1440px four cards show at once, so the deck runs out of scroll at card
     five and dots six, seven and eight pointed at a position identical to
     five's - three buttons that looked live, moved nothing, and could not
     take the filled state.

     Measured rather than derived from a card count, because the answer changes
     with the viewport, with the gutter and with the gap, and a formula over
     those would have to be kept in step with champions.css by hand.

     offsetLeft is read against the FIRST cell rather than used raw: it is
     relative to whatever the rail's offsetParent happens to be, and the
     difference between two cells cancels that out whether or not the rail is
     positioned. */
  // The last card that can actually reach the rail's left edge. Recomputed by
  // trimDots() below; the Next arrow and the dot row are both driven by it, so
  // they can never disagree about where the deck ends.
  let lastReachable = titles.length - 1;

  function trimDots() {
    const cells = [...rail.children];
    if (cells.length === 0) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const origin = cells[0].offsetLeft;
    lastReachable = 0;
    for (const [index, cell] of cells.entries()) {
      // +1 for subpixel: a card needing 812.4px of scroll against a max of 812
      // is reachable, and the browser clamps it flush anyway.
      if (cell.offsetLeft - origin <= maxScroll + 1) lastReachable = index;
    }
    for (const [index, item] of dotItems.entries()) item.hidden = index > lastReachable;
    sync();
  }

  // ResizeObserver rather than a resize listener plus a call to prime it: it
  // fires once when observation starts, after layout, which removes the
  // question of whether this ran before the rail had been measured.
  new ResizeObserver(trimDots).observe(rail);

  // One element for both readers, the pairing src/lightbox.js already uses: a
  // sighted user reads the filled dot, a screen reader hears the season name.
  const status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("aria-live", "polite");

  // The cards currently on screen inside the rail, maintained by the observer
  // below. "Active" is the leftmost of them, which is the one the snap point
  // is actually holding.
  const onScreen = new Set();
  let active = 0;

  function sync() {
    // trimDots() calls this on first layout, which can land before the observer
    // has reported anything. Fall back to the current active index rather than
    // returning early, or the dot row paints with nothing filled in.
    if (onScreen.size > 0) active = Math.min(...onScreen);
    for (const [index, dot] of dots.entries()) {
      if (index === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    }
    previous.disabled = active === 0;
    // Against lastReachable, not against the last card. On a laptop four cards
    // show at once, so the deck runs out of scroll at card five and the last
    // three can never reach the left edge - an arrow measured against card
    // eight would stay enabled there and do nothing when pressed. Same value
    // the dot row is trimmed to, so the two cannot drift apart.
    next.disabled = active >= lastReachable;
    status.textContent = `${titles[active]}, ${active + 1} of ${titles.length}`;
  }

  previous.addEventListener("click", () => goTo(Math.max(0, active - 1)));
  next.addEventListener("click", () => goTo(Math.min(lastReachable, active + 1)));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const index = Number(entry.target.dataset.index);
        if (entry.isIntersecting) onScreen.add(index);
        else onScreen.delete(index);
      }
      sync();
    },
    // Root is the rail, so this measures against the deck and not the viewport.
    // 0.85 rather than 1: a snapped card can sit a subpixel short of fully
    // visible, and at a threshold of 1 the arrows then flicker while scrolling.
    { root: rail, threshold: 0.85 },
  );
  for (const cell of rail.children) observer.observe(cell);

  nav.append(previous, next, dotList, status);
  return nav;
}

export function renderChampions(mount, data) {
  const cards = data.seasons.map((season) => ({
    title: seasonName(season.season),
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
  // Nav after the cards, because it observes them. Inserted after the rail in
  // the document so the controls sit under the deck they drive, matching the
  // gallery's arrows on the section above.
  mount.after(buildRailNav(mount, cards.map((entry) => entry.title)));
}

const section = document.querySelector(".champions");
const mount = section?.querySelector("[data-champions]");
if (mount) {
  renderChampions(mount, parseContent(content));
  // Wired from the section, not the mount: the heading and the line under it
  // are static markup outside the grid and carry data-reveal too.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
