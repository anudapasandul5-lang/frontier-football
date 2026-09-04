import content from "../content.js";
import { parseContent } from "./content-data.js";
import {
  albumIdFromQuery,
  albumItems,
  albumTitle,
  lightboxItems,
  manifestUrl,
  thumbUrl,
  tileLabel,
} from "./album-data.js";
import { initLightbox } from "./lightbox.js";
import { wireReveal } from "./reveal.js";

/* One album, every photograph in it, in a masonry grid. Reached from a card on
   gallery.html as /album.html?album=szn-4.

   The pixels come from Google Drive, not from this repo: the archive is roughly
   130 GB of 6000x4000 originals and public/albums/*.json holds only Drive file
   ids and each frame's shape (docs/HOUSE-RULES.md). The trade is stated there —
   if a folder moves or stops being shared, an album page empties.

   All of the logic lives in src/album-data.js, where it is tested in the node
   environment without jsdom. This file is only the DOM, the same split
   src/gallery.js and src/gallery-data.js already use. */

/* CSS multi-column does the masonry, so there is no JS layout pass and nothing
   to re-run on resize. The one thing it needs is every tile's aspect ratio
   known before the pixels arrive, which is exactly what the sync script's
   width and height are for — without them the browser would have to decode
   3,140 images to balance the columns.

   Every tile is in the DOM from the start; what is deferred is the request for
   its pixels, not the element. `loading="lazy"` alone was measured doing
   neither: on SZN 3 it let all 463 images ask Drive for bytes in one burst and
   462 of them came back empty, while the same URL requested on its own loaded
   fine. So src is withheld until the tile is near the viewport and set by the
   observer below.

   Deliberately not the other way round — appending tiles in chunks as the plan
   first had it — because appending to a multi-column container re-balances
   every column, so photographs the reader has already scrolled past visibly
   jump to a different column as more arrive. Holding the whole grid still and
   releasing only the requests fixes the load without that. */

const LOAD_MARGIN = "600px 0px";

/* One observer for the whole grid rather than one per tile. Sets src on
   approach and stops watching that tile: an album is a fixed list, so a tile
   whose pixels have been asked for is finished with. */
function wireLazyLoad(grid) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    },
    // A screenful of margin either way, so a photograph is requested before it
    // is needed rather than arriving after the reader has already looked at
    // the space where it should be.
    { rootMargin: LOAD_MARGIN },
  );
  for (const img of grid.querySelectorAll("img[data-src]")) observer.observe(img);
  return observer;
}

function tile(item, index, total, title) {
  const li = document.createElement("li");
  li.className = "album-page__cell";

  // A button, not a link: it opens the lightbox in place rather than
  // navigating. Delegated to one listener on the grid below, so a 1,038-photo
  // album adds one listener rather than 1,038.
  const button = document.createElement("button");
  button.className = "album-page__tile";
  button.type = "button";
  button.dataset.albumTile = String(index);

  const img = document.createElement("img");
  // Held back until wireLazyLoad sees the tile approach. Not img.src, and not
  // src plus loading="lazy": that combination was measured firing all 463 SZN 3
  // requests at once, and Drive answered almost none of them.
  img.dataset.src = thumbUrl(item.id);
  // The label describes what the control does and where it sits, never what is
  // in the frame. See tileLabel in src/album-data.js for why.
  img.alt = "";
  button.setAttribute("aria-label", tileLabel(index, total, title));
  img.width = item.width;
  img.height = item.height;
  // Explicit rather than left to the width and height attributes above. Those
  // give an <img> an implicit ratio, but this one has no src yet, and a
  // src-less image is not reliably sized from them — the tile would collapse to
  // nothing, the columns would re-balance as each photograph arrived, and the
  // whole grid would shuffle while the reader was looking at it.
  img.style.aspectRatio = `${item.width} / ${item.height}`;
  img.decoding = "async";
  // Load-bearing, and the single least obvious line on this page. Drive refuses
  // a thumbnail whose request carries a Referer from another site: measured on
  // SZN 3, 1 of 12 images loaded with the default policy and 12 of 12 with this
  // one. It reads as intermittent rather than as a refusal, because the first
  // few requests of a session succeed before the rest stop coming — which is
  // indistinguishable from a slow network until you compare the two policies
  // side by side. Do not remove it to "tidy up".
  img.referrerPolicy = "no-referrer";

  button.append(img);
  li.append(button);
  return li;
}

function message(text) {
  const p = document.createElement("p");
  p.className = "album-page__message";
  p.textContent = text;
  return p;
}

function back() {
  const a = document.createElement("a");
  a.className = "btn btn--secondary album-page__back";
  a.href = "/gallery.html";
  a.textContent = "All albums";
  return a;
}

function head(title, count) {
  const wrap = document.createElement("div");
  wrap.className = "album-page__head";
  wrap.dataset.reveal = "";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow album-page__eyebrow";
  eyebrow.textContent = "Gallery";

  const h1 = document.createElement("h1");
  h1.className = "album-page__headline";
  h1.textContent = title;

  wrap.append(eyebrow, h1);

  if (count > 0) {
    const lede = document.createElement("p");
    lede.className = "album-page__lede";
    // Singular is not worth a branch anywhere else on this site; here the
    // smallest album is 64 photographs and the largest is 1,038.
    lede.textContent = `${count.toLocaleString("en")} photographs.`;
    wrap.append(lede);
  }

  wrap.append(back());
  return wrap;
}

function grid(items, title, onOpen) {
  const ul = document.createElement("ul");
  ul.className = "album-page__grid";
  ul.append(...items.map((item, i) => tile(item, i, items.length, title)));

  ul.addEventListener("click", (event) => {
    const button = event.target.closest("[data-album-tile]");
    if (!button) return;
    onOpen(Number(button.dataset.albumTile), button);
  });

  return ul;
}

export async function renderAlbumPage(mount, dialog, search = globalThis.location?.search) {
  const data = parseContent(content);
  const id = albumIdFromQuery(search);
  const title = albumTitle(data, id);

  // An id nothing in content.js claims. Says so plainly and offers the way
  // back, rather than fetching a manifest that will 404 into a blank page.
  if (!title) {
    document.title = "Album not found - Frontier Football";
    mount.replaceChildren(head("Album not found", 0), message("That album is not on the site."));
    return;
  }

  document.title = `${title} - Frontier Football`;

  let items = [];
  try {
    const res = await fetch(manifestUrl(id));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    items = albumItems(await res.json());
  } catch {
    // The honest failure. Drive being unreachable, a manifest not deployed and
    // a network that blocks Google all land here, and all three mean the same
    // thing to a reader: not right now.
    mount.replaceChildren(
      head(title, 0),
      message("These photographs could not be loaded just now. Try again in a moment."),
    );
    return;
  }

  if (items.length === 0) {
    mount.replaceChildren(head(title, 0), message("Photos are on the way."));
    return;
  }

  const lightbox = initLightbox(dialog);
  const list = lightboxItems(items, title);

  const tiles = grid(items, title, (index, opener) => lightbox.open(list, index, opener));
  mount.replaceChildren(head(title, items.length), tiles);
  // After the grid is in the document: an observer over detached elements sees
  // nothing intersect and no photograph would ever be requested.
  wireLazyLoad(tiles);

  // The head only. Observing 3,140 tiles would put every photograph on an
  // IntersectionObserver to fade it in, which is a lot of work for an effect
  // nobody asked the archive to have.
  wireReveal(mount.querySelectorAll("[data-reveal]"));
}

const mount = document.querySelector("[data-album-page]");
const dialog = document.querySelector("[data-lightbox]");
if (mount && dialog) renderAlbumPage(mount, dialog);
