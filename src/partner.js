import content from "../content.js";
import { contactRoutes, parseContent, partners, record } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The partner page: what Frontier has run, and one way to answer.

   Its job is credentials, not advertising. There is no audience figure, no rate
   card and no "put your brand in front of" on this page, because the moment
   there is, Frontier stops sounding like Frontier and starts sounding like
   somebody selling space. What a brand gets is the record and a reply button.

   Built from content.js like every other surface, so a season the owner adds
   appears here without anyone touching this file. */

/* ---------- 2. THE RECORD ---------- */

function cover(entry) {
  const img = document.createElement("img");
  img.className = "record__cover";
  img.src = entry.photo;
  img.alt = entry.photoAlt ?? `${entry.title}.`;
  img.loading = "lazy";
  img.decoding = "async";
  img.width = 800;
  img.height = 450;
  return img;
}

/* Champion, then whichever of date and note is recorded. Nothing is drawn for a
   field that is absent: six of the nine have no champion, and a column of "not
   recorded yet" is what makes a real record read as an unfinished one. */
function facts(entry) {
  const row = document.createElement("div");
  row.className = "record__facts";

  if (entry.champion) {
    const champion = document.createElement("p");
    champion.className = "record__champion";
    const label = document.createElement("span");
    label.className = "record__label";
    label.textContent = "Champion";
    champion.append(label, document.createTextNode(entry.champion));
    row.append(champion);
  }

  // The date the owner types in, or failing that whatever the note already
  // says. Never a month worked out from a post date: HOUSE-RULES section 7.
  const meta = entry.date ?? entry.note;
  if (meta) {
    const line = document.createElement("p");
    line.className = "record__meta";
    line.textContent = meta;
    row.append(line);
  }

  return row.childElementCount > 0 ? row : null;
}

function drive(entry) {
  if (!entry.driveFolder) return null;

  const link = document.createElement("a");
  // Secondary, not primary. Yellow on this page is spent on the reply action.
  link.className = "btn btn--secondary record__drive";
  link.href = entry.driveFolder;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "See the photos";
  // Every one of these labels is identical, so the accessible name says which.
  link.setAttribute("aria-label", `See the photos from ${entry.title}`);
  return link;
}

function entryNode(entry) {
  const node = document.createElement("li");
  node.className = "record__node record__node--entry";
  node.dataset.reveal = "";

  const article = document.createElement("article");
  article.className = "record__entry";

  const title = document.createElement("h3");
  title.className = "record__title";
  title.textContent = entry.title;

  // The text is one child and the picture is the other, so the grid stays a
  // single row and the picture keeps its own aspect ratio.
  const body = document.createElement("div");
  body.className = "record__body";
  body.append(title);
  const detail = facts(entry);
  if (detail) body.append(detail);
  const photos = drive(entry);
  if (photos) body.append(photos);

  // Text first in source order on purpose, so a phone and a screen reader both
  // reach the name before the picture. CSS puts them side by side at 768.
  article.append(body, cover(entry));

  node.append(article);
  return node;
}

/* A run of entries carrying nothing but a title, drawn as one compact node on
   the spine rather than as one full row each. */
function clusterNode(entries) {
  const node = document.createElement("li");
  node.className = "record__node record__node--cluster";
  node.dataset.reveal = "";

  const list = document.createElement("ul");
  list.className = "record__cluster";
  for (const entry of entries) {
    const item = document.createElement("li");
    // An h3, the same as an entry that has a photograph. These four are part of
    // the record, not metadata about it, and as plain list items they would be
    // the only ones a screen reader user skips past when navigating by heading.
    const title = document.createElement("h3");
    title.className = "record__chip";
    title.textContent = entry.title;
    item.append(title);
    list.append(item);
  }

  node.append(list);
  return node;
}

export function renderRecord(mount, data) {
  const runs = record(data).map((group) => {
    const run = document.createElement("section");
    run.className = "record__run";

    const title = document.createElement("h2");
    title.className = "record__run-title";
    title.textContent = group.label;
    title.dataset.reveal = "";

    const nodes = document.createElement("ol");
    nodes.className = "record__nodes";
    nodes.append(
      ...group.nodes.map((node) =>
        node.kind === "entry" ? entryNode(node.entry) : clusterNode(node.entries),
      ),
    );

    run.append(title, nodes);
    return run;
  });

  mount.replaceChildren(...runs);

  // The first photograph sits above the fold on a laptop, so it is this page's
  // largest contentful paint. Lazy-loading it would deliberately delay the one
  // image the browser should be fetching first. Every other cover stays lazy.
  const first = mount.querySelector(".record__cover");
  if (first) {
    first.loading = "eager";
    first.fetchPriority = "high";
  }
}

/* ---------- 3. THE PARTNERS ---------- */

function partnerMark(partner) {
  if (partner.logo) {
    const logo = document.createElement("img");
    logo.className = "roll__logo";
    logo.src = partner.logo;
    logo.alt = partner.name;
    logo.loading = "lazy";
    logo.decoding = "async";
    return logo;
  }

  const name = document.createElement("span");
  name.className = "roll__name";
  name.textContent = partner.name;
  return name;
}

export function renderPartnerRoll(mount, data) {
  const list = partners(data);

  mount.replaceChildren(
    ...list.map((partner, index) => {
      const item = document.createElement("li");
      item.className = "roll__item";

      // Every url is TODO today, so this is the branch that runs. A mistyped
      // handle is not a dead link, it is a stranger's account sitting under
      // Frontier's name beside the word Partners.
      if (partner.url) {
        const link = document.createElement("a");
        link.className = "roll__link";
        link.href = partner.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${partner.name} (opens in a new tab)`);
        link.append(partnerMark(partner));
        item.append(link);
      } else {
        item.append(partnerMark(partner));
      }

      if (index < list.length - 1) {
        const separator = document.createElement("span");
        separator.className = "roll__sep";
        separator.setAttribute("aria-hidden", "true");
        // The spaces are load-bearing, not formatting. Without them the eleven
        // names and ten slashes are one unbroken word to the line-breaker, which
        // then has to break inside a name to fit the line at all: "@nutrimax.iso"
        // came out as "@nutrim / ax.iso". A space is the only legal break point.
        separator.textContent = " / ";
        item.append(separator);
      }

      return item;
    }),
  );
}

/* ---------- 4. THE REPLY ---------- */

export function renderReply(mount, data) {
  const { primary, secondary } = contactRoutes(data);

  const action = document.createElement("a");
  // The one yellow control on the page.
  action.className = "btn btn--primary";
  action.href = primary.href;
  if (primary.kind !== "email") {
    action.target = "_blank";
    action.rel = "noopener noreferrer";
  }
  action.textContent = primary.label;

  const actions = document.createElement("div");
  actions.className = "reply__actions";
  actions.append(action);

  // Co-present with the button, not a fallback rung: somebody opening the
  // WhatsApp link at a desk with no WhatsApp Web session lands on a download
  // page, and this is what saves that.
  if (secondary?.kind === "email") {
    const line = document.createElement("p");
    line.className = "reply__email";
    const link = document.createElement("a");
    link.href = secondary.href;
    link.textContent = secondary.address;
    line.append(document.createTextNode("or email "), link);
    actions.append(line);
  }

  mount.replaceChildren(actions);
  return primary;
}

/* ---------- wiring ---------- */

const page = document.querySelector(".partner-page");
if (page) {
  const data = parseContent(content);

  renderRecord(page.querySelector("[data-record]"), data);
  renderPartnerRoll(page.querySelector("[data-partner-roll]"), data);
  const primary = renderReply(page.querySelector("[data-reply]"), data);

  // The nav CTA is the contact action on this page and nothing else, so it
  // follows whatever contactRoutes() resolved rather than carrying its own
  // hardcoded address that could drift from the slab's.
  const navCta = document.querySelector("[data-contact-cta]");
  if (navCta) {
    navCta.href = primary.href;
    // One label for one intent: the nav button and the slab button say the same
    // thing because they are the same action.
    navCta.textContent = primary.label;
    if (primary.kind === "email") {
      navCta.removeAttribute("target");
      navCta.removeAttribute("rel");
    }
  }

  wireReveal(page.querySelectorAll("[data-reveal]"));
}
