import content from "../content.js";
import { galleryGroups, parseContent } from "./content-data.js";
import { stepIndex } from "./gallery-data.js";
import { wireReveal } from "./reveal.js";

/* The gallery page: one card per thing Frontier has photographed, each a door to
   that thing's full photo folder on Google Drive.

   The site deliberately does not host the whole archive. Hundreds of files would
   have to be resized and committed by hand for every tournament, and the owner
   can drop a folder into Drive without a developer. Drive's own image links are
   not dependable enough to lay out inside the page, so the honest shape is a
   link out: the page stays Frontier and Drive stays the stockroom.

   Two groups behind two tabs, never one list. A tournament is football Frontier
   ran and it has a champion; a watch-along is football Frontier watched.
   CONTEXT.md has drawn that line since the domain model was written. */

/* Yellow is not in this cycle. HOUSE-RULES section 2 reserves it for the primary
   action, which on this page is the button on every card that has a folder. */
const EMPTY_COVER_COLOURS = ["card--green", "card--red", "card--orange"];

function cover(entry, plate) {
  if (entry.photo) {
    const img = document.createElement("img");
    img.className = "gallery-page__cover";
    img.src = entry.photo;
    img.alt = entry.photoAlt ?? `${entry.title}.`;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 800;
    img.height = 450;
    return img;
  }

  // No photograph supplied for this one yet. A filled sticker block rather than
  // a grey placeholder: an empty slot on a cream page reads as an image that
  // failed, and colour is what the rest of the site puts on a surface with no
  // picture. Counted across the whole page rather than per group, so two plates
  // never land on the same colour side by side.
  const block = document.createElement("div");
  block.className = `gallery-page__cover gallery-page__cover--empty card ${
    EMPTY_COVER_COLOURS[plate.drawn++ % EMPTY_COVER_COLOURS.length]
  }`;
  block.setAttribute("aria-hidden", "true");
  return block;
}

function action(entry) {
  if (entry.driveFolder) {
    const link = document.createElement("a");
    link.className = "btn btn--primary gallery-page__action";
    link.href = entry.driveFolder;
    // Google Drive is a different site, so it opens in its own tab and cannot
    // reach back into this one.
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "See all photos";
    // Every card's visible label is identical, so the accessible name has to say
    // which one this is.
    link.setAttribute("aria-label", `See all photos from ${entry.title}`);
    return link;
  }

  const pending = document.createElement("p");
  pending.className = "gallery-page__pending";
  pending.textContent = "Photos are on the way.";
  return pending;
}

function card(entry, plate) {
  const cell = document.createElement("li");
  cell.className = "gallery-page__cell";
  cell.dataset.reveal = "";

  const inner = document.createElement("article");
  inner.className = "gallery-page__card";

  const title = document.createElement("h3");
  title.className = "gallery-page__title";
  title.textContent = entry.title;

  inner.append(cover(entry, plate), title);
  if (entry.note) {
    const note = document.createElement("p");
    note.className = "gallery-page__note";
    note.textContent = entry.note;
    inner.append(note);
  }
  inner.append(action(entry));

  cell.append(inner);
  return cell;
}

function grid(entries, plate) {
  const list = document.createElement("ul");
  list.className = "gallery-page__grid";
  list.append(...entries.map((entry) => card(entry, plate)));
  return list;
}

/* One group and no tab bar. A tab bar with a single tab is not a control, it is
   a label pretending to be one, so the group gets a plain heading instead. */
function singleGroup(group, plate) {
  const heading = document.createElement("h2");
  heading.className = "gallery-page__group-title";
  heading.textContent = group.label;
  heading.dataset.reveal = "";

  const wrap = document.createElement("div");
  wrap.className = "gallery-page__group";
  wrap.append(heading, grid(group.entries, plate));
  return [wrap];
}

/* The ARIA tabs pattern, built to the roles rather than merely styled to look
   like tabs. A tab that only answers a click is broken for anyone not using a
   mouse, so: roving tabindex (the tab bar is one stop in the tab order), arrows
   move between tabs and wrap, Home and End jump to the ends, and each panel is
   labelled by the tab that opens it. */
function tabbedGroups(groups, plate) {
  const tablist = document.createElement("div");
  tablist.className = "gallery-page__tabs";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Gallery sections");
  tablist.dataset.reveal = "";

  const tabs = [];
  const panels = [];

  for (const group of groups) {
    const tab = document.createElement("button");
    tab.className = "gallery-page__tab";
    tab.type = "button";
    tab.id = `gallery-tab-${group.id}`;
    tab.textContent = group.label;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `gallery-panel-${group.id}`);

    const panel = document.createElement("div");
    panel.className = "gallery-page__panel";
    panel.id = `gallery-panel-${group.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    // Focusable, so tabbing off the tab bar lands inside the group rather than
    // skipping past every card in it.
    panel.tabIndex = 0;
    panel.append(grid(group.entries, plate));

    tabs.push(tab);
    panels.push(panel);
    tablist.append(tab);
  }

  let selected = 0;

  function select(index, { focus = false } = {}) {
    selected = index;
    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute("aria-selected", String(isSelected));
      // Roving tabindex: one stop for the whole bar. Without it a keyboard user
      // tabs through every tab before reaching a card, which is the thing the
      // arrow keys exist to avoid.
      tab.tabIndex = isSelected ? 0 : -1;
      panels[i].hidden = !isSelected;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
  });

  tablist.addEventListener("keydown", (event) => {
    const moves = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in moves) {
      // Wrapping at both ends, the same rule and the same helper the lightbox
      // uses for its arrow keys.
      select(stepIndex(selected, moves[event.key], tabs.length), { focus: true });
    } else if (event.key === "Home") {
      select(0, { focus: true });
    } else if (event.key === "End") {
      select(tabs.length - 1, { focus: true });
    } else {
      return;
    }
    // Otherwise the arrow scrolls the page underneath the tab bar as well.
    event.preventDefault();
  });

  select(0);
  return [tablist, ...panels];
}

export function renderGalleryPage(mount, data) {
  // One counter for the whole page, so the colour plates keep cycling across the
  // group boundary instead of each group starting on the same colour.
  const plate = { drawn: 0 };
  const groups = galleryGroups(data);

  if (groups.length === 0) {
    mount.replaceChildren();
    return;
  }

  mount.replaceChildren(
    ...(groups.length === 1 ? singleGroup(groups[0], plate) : tabbedGroups(groups, plate)),
  );
}

const section = document.querySelector(".gallery-page");
const mount = section?.querySelector("[data-gallery-page]");
if (mount) {
  renderGalleryPage(mount, parseContent(content));
  // A card in a hidden panel has a zero-height rect, which reveal.js reads as
  // already scrolled past and reveals at once. That is what we want here:
  // switching tabs must never expose a panel of invisible cards.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
