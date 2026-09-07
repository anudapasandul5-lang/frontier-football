import content from "../content.js";
import { parseContent, sessions, upcomingEvents } from "./content-data.js";
import { renderContactRoutes } from "./contact-routes.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { wireReveal } from "./reveal.js";

/* The events page: the nights that come round every week, then the ones with a
   date on them.

   THIS IS THE HERO'S SECOND BUTTON. A player arriving cold wants one thing -
   when can I turn up - and the weekly nights answer it above the fold. The dated
   one-offs sit under them because a season announcement is news and a Thursday
   is a standing invitation, and the standing invitation is true more often.

   TWO SHAPES, NOT ONE LIST. A card per weekly night, a ruled row per one-off.
   Folding them together would make the reader work out which is which from the
   wording, and "Thursday" and "Sat 20 Sep" do not sort into one order anyway.

   EVERY LINE IS content.js's. Nothing here phrases a time, a price or a venue,
   and a field the owner has not filled in prints one line shorter rather than
   being guessed at (HOUSE-RULES section 7). A night carrying nothing but its day
   name is not drawn at all - see sessions() in src/content-data.js.

   THE ACTION IS THE PLAYER ROUTE. Same slab as the contact page, narrowed the
   same way, so a message from this page arrives already saying what it is
   about. */

/* The recorded facts of one night, in a fixed order, skipping the unrecorded.

   A <dl> because these rows are terms and definitions - "Time" is the term,
   "8pm - 10pm" is what it means. A table would promise columns that line up
   between cards, and they do not: each night prints only what it has. */
const SESSION_FACTS = [
  ["time", "Time"],
  ["venue", "Venue"],
  ["format", "Format"],
  ["price", "Price"],
];

function factList(session) {
  const recordedFacts = SESSION_FACTS.filter(([key]) => session[key]);
  if (recordedFacts.length === 0) return null;

  const dl = document.createElement("dl");
  dl.className = "session__facts";

  for (const [key, label] of recordedFacts) {
    const dt = document.createElement("dt");
    dt.className = "session__label";
    dt.textContent = label;

    const dd = document.createElement("dd");
    dd.className = "session__value";
    // textContent, never innerHTML: content.js is hand-written and must never
    // need escaping by hand.
    dd.textContent = session[key];

    dl.append(dt, dd);
  }

  return dl;
}

function sessionCard(session) {
  const li = document.createElement("li");
  li.className = "session";
  li.dataset.reveal = "";

  const day = document.createElement("h3");
  day.className = "session__day";
  day.textContent = session.day;
  li.append(day);

  // The night's own name, when it has one. Not a fallback for the day above it:
  // both print when both are recorded, because "Thursday" is when and
  // "Frontier Fridays" is what.
  if (session.name) {
    const name = document.createElement("p");
    name.className = "session__name";
    name.textContent = session.name;
    li.append(name);
  }

  const facts = factList(session);
  if (facts) li.append(facts);

  if (session.note) {
    const note = document.createElement("p");
    note.className = "session__note";
    note.textContent = session.note;
    li.append(note);
  }

  return li;
}

export function renderSessions(mount, data) {
  const nights = sessions(data);

  // No night with a single recorded detail is the state this page ships in. The
  // section removes its own heading rather than standing an empty grid under it.
  if (nights.length === 0) {
    mount.closest(".sessions")?.remove();
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "sessions__list";
  ul.append(...nights.map(sessionCard));

  mount.replaceChildren(ul);
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

/* One dated event. The name is the link when there is a url and plain text when
   there is not - never a disabled-looking control, which would tell a visitor
   there is something to open and then refuse to open it. */
function eventRow(event) {
  const li = document.createElement("li");
  li.className = "upcoming__item";
  li.dataset.reveal = "";

  // The date leads the row visually but is written as free text by the owner, so
  // there is no <time datetime> to emit: a machine-readable attribute built from
  // "Sat 20 Sep" would mean guessing a year, and a wrong one is worse than none.
  if (event.date) {
    const date = document.createElement("span");
    date.className = "upcoming__date";
    date.textContent = event.date;
    li.append(date);
  }

  const name = document.createElement("span");
  name.className = "upcoming__name";
  if (event.url) {
    const anchor = document.createElement("a");
    anchor.href = event.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = event.name;
    anchor.setAttribute("aria-label", `${event.name} (opens in a new tab)`);
    name.append(anchor);
  } else {
    name.textContent = event.name;
  }
  li.append(name);

  // Venue and note on one line under the name. Joined with a middot rather than
  // printed as two rows: either one alone is a fragment, and a card's worth of
  // structure around ten words would out-weigh the event it describes.
  const meta = [event.venue, event.note].filter(Boolean).join(" · ");
  if (meta) {
    const p = document.createElement("p");
    p.className = "upcoming__meta";
    p.textContent = meta;
    li.append(p);
  }

  return li;
}

export function renderUpcoming(mount, data) {
  const events = upcomingEvents(data);

  // The list ships empty, and an empty "What's coming up" heading reads as a
  // Frontier that has stopped running. The weekly nights above carry the page on
  // their own until the owner adds a block.
  if (events.length === 0) {
    mount.closest(".upcoming")?.remove();
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "upcoming__list";
  ul.append(...events.map(eventRow));

  mount.replaceChildren(ul);
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

initSmoothScroll();

const data = parseContent(content);

const sessionsMount = document.querySelector("[data-sessions]");
if (sessionsMount) renderSessions(sessionsMount, data);

const upcomingMount = document.querySelector("[data-upcoming]");
if (upcomingMount) renderUpcoming(upcomingMount, data);

const routesMount = document.querySelector("[data-contact-routes]");
if (routesMount) renderContactRoutes(routesMount, data, { only: "player" });
