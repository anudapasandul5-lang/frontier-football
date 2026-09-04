import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import content from "../content.js";
import { journey, parseContent, people } from "./content-data.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { wireReveal } from "./reveal.js";

gsap.registerPlugin(ScrollTrigger);

/* The About page: a masthead, the record, and the people.

   The record is an archive, not a timeline. It was alternating cards threaded on
   a generated SVG curve until 2026-09-03; the owner called it basic, and it was.
   Alternating cards on a centre line is the timeline everybody builds, the thin
   line lost against the saturated cards, and half of every row was empty. It is
   now one row per entry: the season number set large, the photograph running
   wide, and what is actually known in a data column. A hairline says "next
   entry" without a decorative rail to maintain.

   The watch parties are an inset row rather than a section of their own, because
   they happened DURING the run - in the middle of SZN 4, 5 and 6 per the owner -
   and content.js's `watchAlongsAfter` says which season they sit behind. */

const data = parseContent(content);

function line(className, text) {
  const el = document.createElement("p");
  el.className = className;
  // textContent, never innerHTML: content.js is hand-written by the owner and
  // must never need escaping by hand.
  el.textContent = text;
  return el;
}

/* The left column. A season prints "SZN" small over a large numeral; anything
   that is not a season of the 4x4 Series has a name rather than a number, so it
   takes the slot as words. Turf Wars and Division 0 are the two today. */
function rowIdent(stop) {
  const ident = document.createElement("div");
  ident.className = "record__ident";

  if (typeof stop.season === "number") {
    ident.append(line("record__kicker", "SZN"));
    const num = document.createElement("p");
    num.className = "record__num";
    num.textContent = String(stop.season);
    ident.append(num);
  } else {
    ident.classList.add("record__ident--named");
    ident.append(line("record__name", stop.name));
  }

  return ident;
}

/* The right column: what the repo can actually prove about this entry.

   `champion` prints "Not recorded yet" rather than vanishing, which is the
   wording content.js itself promises and the champions grid already uses. That
   is not the same as inventing one: this is a record, and a record with a silent
   gap reads as though nobody ever won it. Venue, date and note simply disappear
   when unrecorded - none of them is a field a reader is expecting. */
function rowData(stop) {
  const box = document.createElement("div");
  box.className = "record__data";

  if ("champion" in stop) {
    box.append(line("record__label", "Champion"));
    const value = line("record__value", stop.champion ?? "Not recorded yet");
    if (!stop.champion) value.classList.add("record__value--unknown");
    box.append(value);
  }

  if (stop.venue) box.append(line("record__meta", stop.venue));
  if (stop.date) box.append(line("record__meta", stop.date));
  if (stop.note) box.append(line("record__note", stop.note));

  return box;
}

function recordRow(stop) {
  const li = document.createElement("li");
  li.className = "record__row";
  li.dataset.reveal = "";

  li.append(rowIdent(stop));

  const media = document.createElement("figure");
  media.className = "record__media";

  // SZN 5 has no photograph and never will from the source we have: its only
  // champions picture carries ThePapare's photographer copyright notice across
  // the team, and cropping that off is not ours to do (HOUSE-RULES section 6).
  // The row keeps its slot rather than collapsing, so the columns stay aligned
  // down the whole record.
  if (stop.photo) {
    const img = document.createElement("img");
    img.className = "record__photo";
    img.src = stop.photo;
    // The alt describes the picture, not the row. Falling back to the entry's
    // name would announce "SZN 4" and describe nothing.
    img.alt = stop.photoAlt ?? `A photograph from ${stop.name}.`;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 1200;
    img.height = 675;
    media.append(img);
  } else {
    media.classList.add("record__media--empty");
  }

  li.append(media);
  li.append(rowData(stop));
  return li;
}

/* One watch party, carrying the night's own photograph. These were text pills
   until the owner pointed out that content.js has a picture for every one of
   them and the pills were showing none. Each links out to that night's Drive
   folder where one is recorded. */
function partyCard(watchAlong) {
  const li = document.createElement("li");
  li.className = "party";

  const inner = watchAlong.driveFolder
    ? document.createElement("a")
    : document.createElement("div");
  inner.className = "party__card";

  if (watchAlong.driveFolder) {
    inner.href = watchAlong.driveFolder;
    inner.target = "_blank";
    inner.rel = "noopener noreferrer";
    inner.setAttribute(
      "aria-label",
      `${watchAlong.name} photos on Google Drive (opens in a new tab)`,
    );
  }

  if (watchAlong.photo) {
    const img = document.createElement("img");
    img.className = "party__photo";
    img.src = watchAlong.photo;
    img.alt = watchAlong.photoAlt ?? `A photograph from ${watchAlong.name}.`;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 400;
    img.height = 300;
    inner.append(img);
  }

  inner.append(line("party__name", watchAlong.name));
  if (watchAlong.date) inner.append(line("party__meta", watchAlong.date));

  li.append(inner);
  return li;
}

function partiesRow(watchAlongs) {
  const li = document.createElement("li");
  li.className = "record__row record__row--parties";
  li.dataset.reveal = "";

  const head = document.createElement("div");
  head.className = "record__ident record__ident--named";
  head.append(line("record__name", "Watch parties"));
  head.append(line("record__kicker", "Alongside the run"));
  li.append(head);

  const list = document.createElement("ul");
  list.className = "parties";
  for (const watchAlong of watchAlongs) list.append(partyCard(watchAlong));

  const wrap = document.createElement("div");
  wrap.className = "record__parties";
  wrap.append(list);
  li.append(wrap);

  return li;
}

function renderPeople(root, list) {
  // Empty list, empty page. No heading and no placeholder card: the section does
  // not exist yet rather than existing in an unfinished state.
  if (list.length === 0) return;

  const section = document.createElement("section");
  section.className = "people";

  const headline = document.createElement("h2");
  headline.className = "people__headline";
  headline.textContent = "The people";
  section.append(headline);

  const grid = document.createElement("ul");
  grid.className = "people__grid";

  for (const person of list) {
    const cell = document.createElement("li");
    cell.className = "people__cell";
    cell.dataset.reveal = "";

    const card = document.createElement("div");
    card.className = "person";

    if (person.photo) {
      const figure = document.createElement("figure");
      figure.className = "frame person__frame";
      const core = document.createElement("div");
      core.className = "frame__core";
      const img = document.createElement("img");
      img.src = person.photo;
      img.alt = person.photoAlt ?? `${person.name}.`;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 600;
      img.height = 750;
      core.append(img);
      figure.append(core);
      card.append(figure);
    }

    card.append(line("person__name", person.name));
    if (person.role) card.append(line("person__role", person.role));

    cell.append(card);
    grid.append(cell);
  }

  section.append(grid);
  root.append(section);
}

/* ============ BUILD ============ */

const recordRoot = document.querySelector("[data-journey]");
const peopleRoot = document.querySelector("[data-people]");

if (recordRoot) {
  const stops = journey(data);
  const anchor = data.watchAlongsAfter;

  for (const stop of stops) {
    recordRoot.append(recordRow(stop));

    // The parties row goes in immediately after the season content.js names.
    if (anchor !== null && stop.season === anchor && data.watchAlongs.length > 0) {
      recordRoot.append(partiesRow(data.watchAlongs));
    }
  }

  // No anchor recorded, or one naming a season that is not in the file: the
  // parties fall to the end of the record, which is where they sat before
  // anybody said when they happened. Never dropped.
  const placed = recordRoot.querySelector(".record__row--parties");
  if (!placed && data.watchAlongs.length > 0) {
    recordRoot.append(partiesRow(data.watchAlongs));
  }
}

if (peopleRoot) renderPeople(peopleRoot, people(data));

// Reveal-on-scroll through the site's single observer (HOUSE-RULES section 5).
// After the rows exist so the query finds them, and BEFORE the GSAP block below,
// which clears the pre-state from the rows it takes over. The other way round,
// `.is-pre` is re-applied to rows GSAP is already animating.
wireReveal(document.querySelectorAll("[data-reveal]"));

// Lenis owns the scroll position, so ScrollTrigger has to be told when it moves.
//
// ponytail: GSAP's docs prefer handing the rAF loop to gsap.ticker outright.
// That would mean smooth-scroll.js importing GSAP, which would pull it onto
// index.html and gallery.html for nothing. Two rAF loops doing different jobs is
// the cheaper trade.
const lenis = initSmoothScroll();
lenis?.on?.("scroll", ScrollTrigger.update);

/* gsap.matchMedia and not a hand-rolled check: it reverts everything it created
   the moment the query stops matching, so a reader switching on reduced motion
   mid-visit unwinds every tween with no teardown code of our own. Under that
   setting nothing here is created at all - not a slower entrance, none
   (HOUSE-RULES section 5). */
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", (context) => {
  const rows = [...document.querySelectorAll(".record__row")];

  for (const row of rows) {
    row.classList.remove("is-pre");
    row.classList.add("is-revealed");
  }

  // A row's three columns arrive a beat apart. Motivated, not decoration: the
  // stagger runs left to right, which is the order the row is meant to be read
  // in - which season, what it looked like, what is known about it.
  for (const row of rows) {
    gsap.from(row.children, {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 85%", once: true },
    });
  }

  // Parallax inside each photograph's own frame. Desktop only: the effect is a
  // few pixels of travel and on a phone it buys nothing for a scrubbing
  // ScrollTrigger per row.
  context.add("(min-width: 900px)", () => {
    for (const photo of document.querySelectorAll(".record__photo")) {
      gsap.fromTo(
        photo,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  });
});
