import { contactRoutes } from "./content-data.js";
import { wireReveal } from "./reveal.js";

/* The green action slab, and the ruled list that sits under it.

   THIS FILE WAS THE WHOLE OF src/contact.js until the contact page split in
   three. Three pages now draw the same slab - /contact.html asks a player,
   /collaborate.html asks a brand, /events.html asks a player again from the
   other end - and a second copy of a WhatsApp button is a second place for a
   dead link to hide. The page entries below it are thin on purpose: each one
   picks an audience and mounts.

   NO FORM, AND THAT IS THE DESIGN. HOUSE-RULES section 9 forbids a backend, a
   CMS and anything that posts, so a form here would mean a fifth dependency and
   a spam story to go with it. What a visitor actually wants is to reach a human
   on the app they already have open, which a wa.me link does in one press and a
   form does in five fields and a hope.

   ONE NUMBER, TWO MESSAGES. A brand and a player want different conversations,
   and the pre-filled message is the only way to know which arrived before
   reading it. Same number, two `?text=` values, and now two pages.

   THE YELLOW IS SPENT ON THE PRIMARY BUTTON. Yellow is reserved for the primary
   action (HOUSE-RULES section 2) and each page gets exactly one. A second route,
   where a page has one, sits beside it at the same size, ink-outlined: lower
   weight, not lower priority, and never hidden behind the other.

   EMAIL IS CO-PRESENT, NOT A FALLBACK RUNG. wa.me in a desktop browser with no
   WhatsApp Web session lands on a download page. A brand reading this on a
   laptop is exactly who /collaborate.html is for, so the address is on screen
   next to the buttons rather than behind them. */

const ROUTE_COPY = {
  partner: {
    label: "I want to partner",
    hint: "Brands, venues and anyone bringing something to the night.",
  },
  player: {
    label: "I want to play",
    hint: "Teams and players after a spot in the next season.",
  },
};

function routeButton(route, { primary }) {
  const anchor = document.createElement("a");
  anchor.className = `btn ${primary ? "btn--primary" : "btn--secondary"} contact-route__btn`;
  anchor.href = route.href;

  // A wa.me link opens WhatsApp, an outbound profile opens a site: both leave
  // this page and both say so. A mailto does not - it hands off to a mail
  // client, and target="_blank" on one leaves an empty tab behind.
  if (route.kind !== "email") {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  const copy = ROUTE_COPY[route.audience];
  if (copy) {
    anchor.textContent = copy.label;
    anchor.setAttribute("aria-label", `${copy.label} (opens WhatsApp in a new tab)`);
    return { anchor, hint: copy.hint };
  }

  // No audience means there is one route for everybody: either the email
  // address, or whatever outbound link content.js has. Neither can carry two
  // different pre-filled messages, so labelling one of them "I want to partner"
  // would be a lie about what pressing it does.
  if (route.kind === "email") {
    anchor.textContent = "Email us";
    return { anchor, hint: "The fastest way we have until a number is listed." };
  }

  anchor.textContent = `Message us on ${route.name}`;
  anchor.setAttribute(
    "aria-label",
    `Message Frontier Football on ${route.name} (opens in a new tab)`,
  );
  return { anchor, hint: "A DM reaches us the same day, most days." };
}

function routeCell(route, { primary }) {
  const cell = document.createElement("li");
  cell.className = "contact-route";
  cell.dataset.reveal = "";

  const { anchor, hint } = routeButton(route, { primary });
  cell.append(anchor);

  const note = document.createElement("p");
  note.className = "contact-route__hint";
  note.textContent = hint;
  cell.append(note);

  return cell;
}

/* The address, written out. A mailto rather than plain text, because on the
   desktop where wa.me fails this is the thing that has to work - but the address
   itself is the link text, so it stays readable and copyable on a machine where
   pressing a mailto does nothing at all. */
function emailRow(href) {
  const p = document.createElement("p");
  p.className = "contact-email";
  p.dataset.reveal = "";

  const label = document.createElement("span");
  label.className = "contact-email__label";
  label.textContent = "Or email";
  p.append(label, " ");

  const anchor = document.createElement("a");
  anchor.className = "contact-email__link";
  anchor.href = href;
  // "mailto:".length
  anchor.textContent = href.slice(7);
  p.append(anchor);

  return p;
}

/* The one other place worth following Frontier, minus whatever became the
   button above (contactRoutes() drops that). Capped at one at the call site:
   this row is a nudge to the account that matters, not a directory of every
   profile - "message us on TikTok" is not a thing anyone does. Plain text and
   a link, not a second button; the page has one action and this row is not it. */
function channelRow(channels) {
  const p = document.createElement("p");
  p.className = "contact-channels";
  p.dataset.reveal = "";

  const label = document.createElement("span");
  label.className = "contact-channels__label";
  label.textContent = "Also on";
  p.append(label, " ");

  channels.forEach((link, index) => {
    if (index > 0) p.append(" ");
    const anchor = document.createElement("a");
    anchor.className = "contact-channels__link";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    // The handle is what people type, so it is what gets printed. A link with
    // no handle (a Sofascore page, a WhatsApp invite) falls back to its name,
    // the same rule the home page's links hub follows.
    anchor.textContent = link.handle ?? link.name;
    anchor.setAttribute(
      "aria-label",
      `Frontier Football on ${link.name} (opens in a new tab)`,
    );
    p.append(anchor);
  });

  return p;
}

/* `only` names the one audience this page asks, and is passed straight through
   to contactRoutes rather than filtered out of the result here. Narrowing after
   the fact would drop the primary button on a page whose audience has no
   recorded message, instead of falling through to email the way every other
   missing field on this site does. */
export function renderContactRoutes(mount, data, { only } = {}) {
  const routes = contactRoutes(data, { only });

  // Nothing recorded anywhere: no number, no address, and every outbound link
  // blanked. The section removes itself rather than drawing an empty slab with
  // a heading over it. HOUSE-RULES section 7 - the layout survives whatever the
  // owner does to content.js.
  if (!routes.primary) {
    mount.closest(".contact-routes")?.remove();
    return;
  }

  const slab = document.createElement("div");
  slab.className = "card card--green contact-slab";

  const list = document.createElement("ul");
  list.className = "contact-slab__routes";
  list.append(routeCell(routes.primary, { primary: true }));
  if (routes.secondary) {
    list.append(routeCell(routes.secondary, { primary: false }));
  } else {
    // One route means one column AND a narrower card. Without the first the
    // two-column grid leaves the right half of the slab empty and the single
    // button reads as the first of a pair whose other half failed to load;
    // without the second the card itself stays full width and the button sits
    // in the corner of a green field. Every narrowed page is in this state by
    // design, and the unnarrowed page is in it before a number is pasted in.
    list.classList.add("contact-slab__routes--single");
    slab.classList.add("contact-slab--single");
  }
  slab.append(list);

  // Not when email IS the button: the address would then be printed twice, once
  // as the thing to press and once underneath it.
  if (routes.email && routes.primary.kind !== "email") slab.append(emailRow(routes.email));
  if (routes.channels.length > 0) slab.append(channelRow(routes.channels.slice(0, 1)));

  mount.replaceChildren(slab);
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

/* A ruled list of the owner's own lines. "What a partner gets" on the
   collaborate page today; nothing about it is partner-specific, which is why it
   takes its lines as an argument and its section as whatever wraps the mount. */
export function renderOffer(mount, lines) {
  // An empty list takes the heading with it. A "What a partner gets" heading
  // over nothing is worse than no section.
  if (lines.length === 0) {
    mount.closest(".offer")?.remove();
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "offer__list";
  ul.append(
    ...lines.map((row) => {
      // NOT .pill. components.css says in as many words that a pill's outline
      // and fill read as a clickable chip, which is why .eyebrow exists as a
      // label instead. These lines are statements, not controls: a ruled row,
      // the same device the partners index uses.
      const li = document.createElement("li");
      li.className = "offer__item";
      li.dataset.reveal = "";

      // A <strong> rather than a heading: five headings inside one list under
      // an existing <h2> would put five more entries in a screen reader's
      // heading outline for what is one section of five short statements.
      const title = document.createElement("strong");
      title.className = "offer__title";
      // textContent, never innerHTML: content.js is hand-written and must never
      // need escaping by hand.
      title.textContent = row.title;
      li.append(title);

      // Left out entirely when unrecorded rather than printed as an empty
      // line, the same rule every other renderer in this repo follows.
      if (row.body) {
        const body = document.createElement("span");
        body.className = "offer__body";
        body.textContent = row.body;
        li.append(body);
      }

      return li;
    }),
  );

  mount.replaceChildren(ul);
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}
