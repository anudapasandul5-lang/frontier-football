import content from "../content.js";
import { parseContent, reach } from "./content-data.js";
import { renderContactRoutes, renderOffer } from "./contact-routes.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { wireReveal } from "./reveal.js";

/* The collaborate page: what a brand gets, and the numbers behind it.

   THIS IS THE HERO'S YELLOW BUTTON. The home page used to spend its primary
   action on the Instagram follow; it spends it here now, so this is the page a
   brand lands on cold and decides on. Everything above the offer list exists to
   survive that first four seconds - the numbers, then what they buy, then who
   has already done it.

   THE NUMBERS COME FIRST AND THEY ARE NOT PHRASED HERE. Every figure is typed
   into content.js by the owner with the date they measured it, and a row missing
   either half is dropped rather than rounded, guessed or averaged by this file
   (HOUSE-RULES section 7). A follower count is the one claim on this site a
   brand can check in ten seconds.

   ONE ACTION, AND IT IS THE PARTNER ONE. contactRoutes is narrowed to the
   partner audience, so the WhatsApp message that arrives says which page it came
   from before anyone reads it. The player route is not on this page at all -
   it is the whole of /contact.html.

   THE PARTNER BAND IS THE HOME PAGE'S, UNCHANGED. src/partners.js finds its own
   .partners section and fills it, so this page links that module and adds no
   partner code of its own. */

/* One reach figure: the number, what it counts, and when it was measured.

   The figure is a <strong> inside the row rather than a bare <span> - it is the
   emphasised half of a pair, and the label under it is what makes it mean
   anything. asOf is left out entirely when unrecorded rather than printed as an
   empty line, which is the same rule every other renderer in this repo follows. */
function reachItem(row) {
  const li = document.createElement("li");
  li.className = "reach__item";
  li.dataset.reveal = "";

  const figure = document.createElement("strong");
  figure.className = "reach__figure";
  // textContent, never innerHTML: content.js is hand-written and must never need
  // escaping by hand.
  figure.textContent = row.figure;
  li.append(figure);

  const label = document.createElement("span");
  label.className = "reach__label";
  label.textContent = row.label;
  li.append(label);

  if (row.asOf) {
    const asOf = document.createElement("span");
    asOf.className = "reach__asof";
    asOf.textContent = `As of ${row.asOf}`;
    li.append(asOf);
  }

  return li;
}

export function renderReach(mount, data) {
  const rows = reach(data);

  // No measurable number is the state this page ships in, and an inverted band
  // holding a heading over nothing is worse than no band. The section takes its
  // own heading with it, exactly as the contact page's offer list does.
  if (rows.length === 0) {
    mount.closest(".reach")?.remove();
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "reach__list";
  ul.append(...rows.map(reachItem));

  mount.replaceChildren(ul);
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

initSmoothScroll();

const data = parseContent(content);

const reachMount = document.querySelector("[data-reach]");
if (reachMount) renderReach(reachMount, data);

const offerMount = document.querySelector("[data-offer]");
if (offerMount) renderOffer(offerMount, data.collaborate.offer);

// only: "partner" - see contactRoutes. Without it this page would draw the
// partner button AND the player button, and the player button belongs to
// /contact.html now.
const routesMount = document.querySelector("[data-contact-routes]");
if (routesMount) renderContactRoutes(routesMount, data, { only: "partner" });
