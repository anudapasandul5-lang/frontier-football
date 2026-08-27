import content from "../content.js";
import { parseContent, partners } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The partner index: one row per brand or place that has appeared alongside
   Frontier, built from content.js so adding one is a content edit.

   PARTNER, never SPONSOR. A sponsor paid; a partner may or may not have
   (CONTEXT.md). Nobody recorded which of the eleven paid, so the page says
   partner about all of them and claims nothing about money.

   A ruled index rather than a card grid or a logo wall. The five layout families
   above it are spent, a three-column card row is both a cliche and a repeat of
   the champions grid, and there are no logo files to build a logo wall out of.
   Two columns from 768px up: eleven rows in one column is a spec sheet, and a
   hairline under every row of a long single list is the laziest layout there is.

   TEXT FIRST, LOGO LATER. Each row draws its name today and swaps that name for
   an <img> the day a file lands in public/partners/ and is named in content.js.
   The row, the rule under it and the grid do not change, so the upgrade is a
   content edit and not a layout one. */

function mark(partner) {
  if (partner.logo) {
    const logo = document.createElement("img");
    logo.className = "partners__logo";
    logo.src = partner.logo;
    // The name is the alt text because the name is what the logo says. A partner
    // with a logo file must still be readable to anyone who cannot see it.
    logo.alt = partner.name;
    logo.loading = "lazy";
    logo.decoding = "async";
    return logo;
  }

  const name = document.createElement("span");
  name.className = "partners__name";
  name.textContent = partner.name;
  return name;
}

/* No category line under the name. "Sofascore, scores" or "Iodex, recovery"
   tells a visitor nothing they cannot work out and turns a credit into a
   sales sheet. The name is the whole row. */
function row(partner) {
  const item = document.createElement("li");
  item.className = "partners__row";

  // Every url is TODO today, so this is the branch that runs: a plain name, no
  // link. Nobody has checked the addresses, and a wrong Instagram address is not
  // a dead link, it is a stranger's account sitting under Frontier's name.
  if (!partner.url) {
    item.append(mark(partner));
    return item;
  }

  const link = document.createElement("a");
  link.className = "partners__link";
  link.href = partner.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${partner.name} (opens in a new tab)`);
  link.append(mark(partner));
  item.append(link);
  return item;
}

export function renderPartners(mount, data) {
  mount.replaceChildren(...partners(data).map(row));
}

const section = document.querySelector(".partners");
const mount = section?.querySelector("[data-partners]");
if (mount) {
  renderPartners(mount, parseContent(content));
  // The list reveals as one element, not eleven. A ripple down eleven hairlines
  // is noise on a section this quiet, and each observed element is another
  // chance for something to strand at opacity 0.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}
