import content from "../content.js";
import { outboundLinks, parseContent } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The links hub: everywhere else Frontier lives, in priority order.

   THE PROBLEM THIS SHAPE SOLVES. Not every link content.js names has an address,
   and a row of greyed placeholders would announce a Sofascore and a WhatsApp
   that nobody can open. So the section is one slab and only renderable links
   go in it.

   WHAT SPLITS THEM. A link with a handle earns a row inside the slab, set at
   display scale, because the handle is the thing people type and typing it is
   the point. A link without one (a WhatsApp invite, a Sofascore page) is a
   destination rather than a name, so it goes in the pill row underneath where a
   bare platform name is all there is to say anyway.

   WHY IT IS NOT "FIRST LINK WINS" ANY MORE. It was, while Instagram was the
   only address on file: the one link WAS the section. TikTok landing on
   2026-08-28 broke that shape rather than filling it, because the rule made the
   second real handle a pill reading "TikTok" with the handle dropped entirely.
   Two places Frontier genuinely lives were rendering as a monument and a
   footnote. Rows keep the hierarchy that content.js's ordering asks for (the
   first row is the largest, Instagram stays the thing we want pressed) without
   demoting the rest to afterthoughts.

   Still one object, not a list of cards: the slab is the seventh layout family
   and a stack of separate cards here would be an eighth, directly above a
   marquee and a footer. Rows divided by a hairline, the same ruled-index device
   the partners section uses, scaled up. One handle renders exactly as it did
   before, with no divider to draw. Four render finished too.

   THE FOLLOW IS NOT YELLOW HERE. Yellow is reserved for the primary action
   (HOUSE-RULES section 2), and the nav and the hero already spend it on this
   exact destination. Three yellow buttons with one intent is the duplicate-CTA
   failure. The slab is ink-outlined on paper instead: same destination, unmissable
   size, lower weight, and the follow still wins above the fold where the brief
   says it must. It also keeps the bottom of the page from becoming three stacked
   dark surfaces, since the marquee and the footer below it are both ink. */

function row(link) {
  const item = document.createElement("li");

  const anchor = document.createElement("a");
  anchor.className = "hub__row";
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.setAttribute("aria-label", `Frontier Football on ${link.name} (opens in a new tab)`);

  // The label names the platform, the statement is the handle people actually
  // type. With more than one row the label stops being decoration and starts
  // being the only thing that says which handle belongs to which platform.
  const label = document.createElement("span");
  label.className = "hub__label";
  label.textContent = link.name;
  anchor.append(label);

  const statement = document.createElement("span");
  statement.className = "hub__statement";
  statement.textContent = link.handle;
  anchor.append(statement);

  item.append(anchor);
  return item;
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

  const named = links.filter((link) => link.handle);
  const rest = links.filter((link) => !link.handle);
  const nodes = [];

  // Every link having an address but none having a handle is a real state:
  // Sofascore and WhatsApp both carry a url and no name to type. The slab is
  // skipped outright rather than drawn empty, and the pills stand alone.
  if (named.length > 0) {
    const slab = document.createElement("ul");
    slab.className = "hub__slab";
    slab.append(...named.map(row));
    nodes.push(slab);
  }

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
