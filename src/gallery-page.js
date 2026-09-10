import content from "../content.js";
import { parseContent, seasonName } from "./content-data.js";
import { stepIndex } from "./gallery-data.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { wireReveal } from "./reveal.js";

/* The gallery page: card grids behind a row of tabs. A card with an album opens
   it on this site at /album.html?album=<id>; the photographs are served from
   Google Drive rather than committed here, and a card links straight out to a
   Drive folder only if it has no album of its own (docs/HOUSE-RULES.md).

   ONE TAB PER COMPETITION, NOT ONE "ALBUMS" TAB. The 4x4 Series seasons, Turf
   Wars and Division 0 all have a champion, but they are three separate things
   (CONTEXT.md) and the owner asked for them split rather than pooled in one
   grid (2026-09-08): "4x4 Series", "Turf Wars", "Division 0", each its own tab.
   Turf Wars and Division 0 carry one card each today; a tab bar of them still
   beats folding them in with six SZN cards. Watch Parties covers nights Frontier
   watched football rather than ran it, so it stays its own tab too - a night
   with no champion never sits under a "Champion" heading a tournament card uses.

   Same ARIA tabs pattern the coverflow's own filter pills and this page's
   groups have always used: roving tabindex, arrow keys move and wrap, Home
   and End jump to the ends. */

const CARD_COLOURS = ["card--yellow", "card--orange", "card--red", "card--green"];

function albumLine(className, text) {
  const el = document.createElement("p");
  el.className = className;
  // textContent, never innerHTML: content.js names are hand-written and must
  // never need escaping by hand.
  el.textContent = text;
  return el;
}

function albumPhoto(entry) {
  if (!entry.photo) return null;
  const img = document.createElement("img");
  img.className = "album-card__photo";
  img.src = entry.photo;
  img.alt = entry.photoAlt ?? `${entry.title}.`;
  img.loading = "lazy";
  img.decoding = "async";
  img.width = 800;
  img.height = 450;
  return img;
}

/* `champion` is only present on a season or a competition. A watch party has
   no such field at all, so `"champion" in entry` is false for it rather than
   the card having to guess from a null it can't tell apart from "unrecorded". */
function albumCard(entry, index) {
  const li = document.createElement("li");
  li.className = "album-grid__cell";
  li.dataset.reveal = "";

  const card = document.createElement("div");
  card.className = `card ${CARD_COLOURS[index % CARD_COLOURS.length]} album-card`;
  if (!entry.photo) card.classList.add("album-card--textonly");

  const photo = albumPhoto(entry);
  if (photo) card.append(photo);

  card.append(albumLine("album-card__title", entry.title));

  if ("champion" in entry) {
    card.append(albumLine("album-card__champion", entry.champion ?? "Not recorded yet"));
    if (!entry.champion) card.lastElementChild.classList.add("album-card__champion--absent");
  }

  if (entry.note) card.append(albumLine("album-card__note", entry.note));

  // An album on this site first: the photographs are shown here rather than
  // handed off to Drive. driveFolder is kept as the secondary way out for
  // anyone who wants the original, full-resolution files, which the site never
  // serves.
  if (entry.albumId) {
    const link = document.createElement("a");
    link.className = "btn btn--secondary album-card__link";
    // Encoded even though every id in content.js is a plain slug: this value
    // goes into a URL, and the day one is not a slug is the day it silently
    // stops being one parameter.
    link.href = `/album.html?album=${encodeURIComponent(entry.albumId)}`;
    link.textContent = "View photos";
    card.append(link);
  } else if (entry.driveFolder) {
    const link = document.createElement("a");
    link.className = "btn btn--secondary album-card__link";
    link.href = entry.driveFolder;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View photos";
    card.append(link);
  } else {
    // Still shows, saying the photos are on the way, rather than a dead link
    // or a card that vanishes the moment a folder goes missing.
    card.append(albumLine("album-card__pending", "Photos are on the way."));
  }

  li.append(card);
  return li;
}

// `startAt` continues the CARD_COLOURS cycle across tabs. Each competition now
// builds a one-card grid on its own tab, and without this every one of them
// reset to index 0 - card--yellow for Turf Wars AND Division 0 - instead of
// picking up where the six SZN cards left off.
function albumGrid(entries, startAt = 0) {
  const ul = document.createElement("ul");
  ul.className = "album-grid";
  ul.append(...entries.map((entry, i) => albumCard(entry, startAt + i)));
  return ul;
}

/* One group, no tab bar. A tab bar with a single tab is a label pretending to
   be a control. */
function singleGroup(group) {
  return [group.build()];
}

/* The ARIA tabs pattern, built to the roles rather than merely styled to look
   like tabs: roving tabindex (the tab bar is one stop in the tab order),
   arrows move between tabs and wrap, Home and End jump to the ends, and each
   panel is labelled by the tab that opens it. */
function tabbedGroups(groups) {
  const tablist = document.createElement("div");
  tablist.className = "gallery-page__tabs";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Gallery sections");
  tablist.dataset.reveal = "";

  const tabs = [];
  const panels = [];

  for (const g of groups) {
    const tab = document.createElement("button");
    tab.className = "gallery-page__tab";
    tab.type = "button";
    tab.id = `gallery-tab-${g.id}`;
    tab.textContent = g.label;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `gallery-panel-${g.id}`);

    const panel = document.createElement("div");
    panel.className = "gallery-page__panel";
    panel.id = `gallery-panel-${g.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    // Focusable, so tabbing off the tab bar lands inside the grid rather than
    // skipping past every card in it.
    panel.tabIndex = 0;
    panel.append(g.build());

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
      // Roving tabindex: one stop for the whole bar. Without it a keyboard
      // user tabs through every tab before reaching a card, which is the
      // thing the arrow keys exist to avoid.
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
      // Wrapping at both ends, the same helper the coverflow and the
      // lightbox use for their own arrow keys.
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

export function renderGalleryPage(mount) {
  const data = parseContent(content);

  // content.js lists seasons newest first for the champions grid; the gallery
  // reads as a run and opens on SZN 1, same as the About page journey.
  const seasonEntries = [...data.seasons]
    .sort((a, b) => a.season - b.season)
    .map((season) => ({
      title: seasonName(season.season),
      champion: season.champion,
      note: season.note,
      photo: season.photo,
      photoAlt: season.photoAlt,
      driveFolder: season.driveFolder,
      albumId: season.albumId,
    }));

  // Turf Wars and Division 0 are not seasons of the 4x4 Series (CONTEXT.md), so
  // each becomes its own tab rather than being sorted among the seasons or with
  // each other. File order from content.js, the same order champions.js uses.
  const competitionEntries = data.competitions.map((competition) => ({
    title: competition.name,
    champion: competition.champion,
    note: competition.note,
    photo: competition.photo,
    photoAlt: competition.photoAlt,
    driveFolder: competition.driveFolder,
    albumId: competition.albumId,
  }));

  const watchPartyEntries = data.watchAlongs.map((watchAlong) => ({
    title: watchAlong.name,
    note: watchAlong.note,
    photo: watchAlong.photo,
    photoAlt: watchAlong.photoAlt,
    driveFolder: watchAlong.driveFolder,
    albumId: watchAlong.albumId,
  }));

  const groups = [];
  if (seasonEntries.length > 0) {
    groups.push({ id: "series", label: "4x4 Series", build: () => albumGrid(seasonEntries) });
  }
  const usedIds = new Set(groups.map((g) => g.id));
  competitionEntries.forEach((entry, index) => {
    // A readable id from the name ("Turf Wars" -> "turf-wars") for the tab and
    // panel element ids. Falls back to, then de-duplicates against, the index -
    // content.js has both written "Division 0" and "Division-0" elsewhere
    // (docs/HOUSE-RULES.md), which slugify the same and would otherwise hand
    // two tabs the same id and break aria-controls/aria-labelledby for one of
    // them.
    let id = entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!id || usedIds.has(id)) id = `competition-${index}`;
    usedIds.add(id);

    groups.push({
      id,
      label: entry.title,
      // Continues the card-colour cycle from the seasons rather than resetting
      // to card--yellow for every single-card competition tab.
      build: () => albumGrid([entry], seasonEntries.length + index),
    });
  });
  if (watchPartyEntries.length > 0) {
    groups.push({
      id: "watch-parties",
      label: "Watch Parties",
      build: () => albumGrid(watchPartyEntries),
    });
  }

  // No groups means no page content. The head stays static markup so a
  // failed bundle still reads as a labelled page rather than a blank gap,
  // but a mount that successfully rendered nothing is removed outright.
  if (groups.length === 0) {
    mount.replaceChildren();
    return;
  }

  mount.replaceChildren(...(groups.length === 1 ? singleGroup(groups[0]) : tabbedGroups(groups)));
  // A card in a hidden panel has a zero-height rect, which reveal.js reads as
  // already scrolled past and reveals at once. That is what we want here:
  // switching tabs must never expose a panel of invisible cards.
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

initSmoothScroll();

const section = document.querySelector(".gallery-page");
const mount = section?.querySelector("[data-gallery-page]");
if (mount) renderGalleryPage(mount);
