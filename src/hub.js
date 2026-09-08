import content from "../content.js";
import { parseContent } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The links hub: everywhere else Frontier lives.

   ICON TILES, NOT A SLAB. This was a full-width outlined slab with one
   display-scale handle per row. Two rows filled half the viewport for what is
   really the "follow us" tail of a scrolling page. The owner asked for the
   platform marks in boxes instead (2026-09-08). A tile is the .pill primitive
   squared - same ink outline, same paper fill, same hover - so it is the
   smallest version of a layout family the page already uses, not an eighth one.

   PAPER, NOT INK OR YELLOW. Unchanged from the slab: the marquee above and the
   footer below are both ink, and the nav and hero already spend yellow on this
   exact destination (HOUSE-RULES section 2). Outlined tiles on paper keep the
   site's language without stacking a third dark surface at the foot of the page.

   ONLY LINKS THAT GO SOMEWHERE - WITH ONE EXCEPTION. A link whose url is still
   TODO is normally absent: a tile that opens nothing is worse than no tile.
   `placeholder: true` in content.js overrides that for a named platform,
   drawing a greyed, unclickable tile before the address exists. Facebook and
   LinkedIn carry it today because the owner asked to see them in place;
   Sofascore and WhatsApp do not, so they stay hidden until a URL lands.
   Order is content.js's.

   A live platform with no glyph in ICONS falls back to its name as text in the
   tile, so a link is never lost for want of an icon. A placeholder needs a
   glyph - a greyed box with a word in it says nothing - so it is skipped
   without one. */

const SVG_NS = "http://www.w3.org/2000/svg";

// One path per mark, keyed by the lowercased link name. Each is a 24x24 glyph
// filled with currentColor so hub.css controls the colour. Traced from each
// platform's own brand mark; nothing invented.
const ICONS = {
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.35 3.92 3.86 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.28 2.69.08 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z",
  tiktok:
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49a6.47 6.47 0 012.58-4.96 6.7 6.7 0 016.15-1.72c.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  facebook:
    "M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  whatsapp:
    "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.43 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.42",
};

function tile(link) {
  const item = document.createElement("li");
  const path = ICONS[link.name.toLowerCase()];

  // A live link is an <a>; a placeholder is an inert <span> with the same look,
  // greyed by hub.css and left out of the tab order.
  const box = document.createElement(link.url ? "a" : "span");
  box.className = link.url ? "pill hub__tile" : "pill hub__tile hub__tile--soon";

  if (link.url) {
    box.href = link.url;
    box.target = "_blank";
    box.rel = "noopener noreferrer";
    // The tile shows a wordless glyph, so the accessible name has to come from
    // here - a screen reader gets nothing off an aria-hidden <svg>.
    box.setAttribute("aria-label", `Frontier Football on ${link.name} (opens in a new tab)`);
  } else {
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", `Frontier Football on ${link.name} - coming soon`);
  }

  if (path) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "hub__glyph");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const node = document.createElementNS(SVG_NS, "path");
    node.setAttribute("d", path);
    svg.append(node);
    box.append(svg);
  } else {
    const name = document.createElement("span");
    name.className = "hub__name";
    name.textContent = link.name;
    box.append(name);
  }

  item.append(box);
  return item;
}

export function renderHub(mount, data) {
  // A live link (name + url), or a placeholder the owner opted in that has a
  // glyph to show. content.js order, so Instagram and TikTok lead and the two
  // greyed tiles follow.
  const links = data.links.filter(
    (link) =>
      link.name && (link.url || (link.placeholder && ICONS[link.name.toLowerCase()])),
  );
  if (links.length === 0) {
    mount.replaceChildren();
    return;
  }

  const tiles = document.createElement("ul");
  tiles.className = "hub__tiles";
  tiles.append(...links.map(tile));
  mount.replaceChildren(tiles);
}

const section = document.querySelector(".hub");
const mount = section?.querySelector("[data-hub]");
if (mount) {
  renderHub(mount, parseContent(content));
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
