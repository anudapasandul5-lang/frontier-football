import content from "../content.js";
import { parseContent, partners } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The partner strip: one scrolling band of every brand or place that has
   appeared alongside Frontier, built from content.js so adding one is a
   content edit.

   PARTNER, never SPONSOR. A sponsor paid; a partner may or may not have
   (CONTEXT.md). Nobody recorded which of the eleven paid, so the page says
   partner about all of them and claims nothing about money.

   A MOVING LOGO BAND, not the ruled index it replaced. The index was fine as
   text but a wall of eleven names is not a credit anyone reads; the logos
   carry the recognition, and one ink band breaks the long run of paper this
   section sits in. This IS the site's one marquee now: the standalone tagline
   strip that used to sit below the section is gone, its line already stated
   still in .partners__lede above.

   TEXT WHERE THERE IS NO LOGO. @iodexsrilanka and @zone360.lk have no usable
   logo file online, so they ride the same band as their name set in the
   display face. The moment a file lands in public/partners/ and is named in
   content.js the name swaps for the picture and nothing else moves. */

function mark(partner) {
  if (partner.logo) {
    const logo = document.createElement("img");
    logo.className = "partners__logo";
    logo.src = partner.logo;
    // The name is the alt text because the name is what the logo says. A
    // partner with a logo file must still be readable to anyone who cannot
    // see it.
    logo.alt = partner.name;
    logo.loading = "lazy";
    logo.decoding = "async";
    return logo;
  }

  const name = document.createElement("span");
  name.className = "partners__wordmark";
  name.textContent = partner.name;
  return name;
}

function item(partner) {
  const li = document.createElement("li");
  li.className = "partners__item";
  li.append(mark(partner));
  return li;
}

/* One <ul> holding every partner mark in content order. */
function set(list, { hidden = false } = {}) {
  const ul = document.createElement("ul");
  ul.className = "partners__set";
  if (hidden) ul.setAttribute("aria-hidden", "true");
  ul.append(...list.map(item));
  return ul;
}

export function renderPartners(track, data) {
  const list = partners(data);
  // THREE identical sets, and the count is arithmetic not taste. The partners
  // keyframe (partners.css) shifts the track by a third of its width, so at any
  // moment two of the three sets cover the viewport while the third is off the
  // left waiting to reappear. One set only has to out-span half the widest
  // viewport, which eleven marks clear easily - so no empty ink ever sweeps
  // through, on any screen width. Only the first set is read; the other two are
  // aria-hidden, a rendering trick and not content to hear twice.
  track.replaceChildren(
    set(list),
    set(list, { hidden: true }),
    set(list, { hidden: true }),
  );
}

const section = document.querySelector(".partners");
const track = section?.querySelector("[data-partners]");
if (track) {
  renderPartners(track, parseContent(content));
  // The band reveals as one element. The loop and the hover/focus pause are
  // pure CSS (partners.css, components.css); this file only fills the track.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
