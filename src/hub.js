import content from "../content.js";
import { outboundLinks, parseContent } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The links hub: everywhere else Frontier lives, in priority order.

   THE PROBLEM THIS SHAPE SOLVES. Of the four links content.js names, exactly one
   has an address. A row of three greyed placeholders would announce a TikTok and
   a WhatsApp that nobody can open. So the first renderable link becomes the
   section itself, drawn as one slab with the handle set at display scale, and
   the rest append as pills beneath it as their addresses arrive. One link reads
   finished because the one link IS the section; four will read finished too.

   THE FOLLOW IS NOT YELLOW HERE. Yellow is reserved for the primary action
   (HOUSE-RULES section 2), and the nav and the hero already spend it on this
   exact destination. Three yellow buttons with one intent is the duplicate-CTA
   failure. The slab is ink-outlined on paper instead: same destination, unmissable
   size, lower weight, and the follow still wins above the fold where the brief
   says it must. It also keeps the bottom of the page from becoming three stacked
   dark surfaces, since the marquee and the footer below it are both ink.

   The slab is given to whatever comes back first rather than to Instagram by
   name, so a handle blanked while it is re-checked degrades to the next link
   instead of leaving a headless section. */

function slab(link) {
  const anchor = document.createElement("a");
  anchor.className = "hub__slab";
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.setAttribute("aria-label", `Frontier Football on ${link.name} (opens in a new tab)`);

  // The label names the platform, the statement is the handle people actually
  // type. A link with no handle (a WhatsApp invite, a Sofascore page) prints its
  // name once as the statement and drops the label rather than saying it twice.
  if (link.handle) {
    const label = document.createElement("span");
    label.className = "hub__label";
    label.textContent = link.name;
    anchor.append(label);
  }

  const statement = document.createElement("span");
  statement.className = "hub__statement";
  statement.textContent = link.handle ?? link.name;
  anchor.append(statement);

  return anchor;
}

function pill(link) {
  const item = document.createElement("li");

  const anchor = document.createElement("a");
  anchor.className = "pill hub__pill";
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.setAttribute("aria-label", `Frontier Football on ${link.name} (opens in a new tab)`);
  anchor.textContent = link.name;

  item.append(anchor);
  return item;
}

export function renderHub(mount, data) {
  const links = outboundLinks(data);
  if (links.length === 0) {
    mount.replaceChildren();
    return;
  }

  const [first, ...rest] = links;
  const nodes = [slab(first)];

  if (rest.length > 0) {
    const more = document.createElement("ul");
    more.className = "hub__more";
    more.append(...rest.map(pill));
    nodes.push(more);
  }

  mount.replaceChildren(...nodes);
}

const section = document.querySelector(".hub");
const mount = section?.querySelector("[data-hub]");
if (mount) {
  renderHub(mount, parseContent(content));
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
