import { CLOSED, closeLightbox, openLightbox, stepIndex } from "./gallery-data.js";

/* The lightbox, shared by both surfaces that show a photograph: the coverflow
   showcase on the home page (src/gallery.js) and the mosaic on the gallery page
   (src/gallery-page.js).

   It lived inside src/gallery.js until the mosaic needed it too. Copying it
   would have given the two pages two dialogs that drift; this is the same code,
   moved rather than rewritten. All of the index maths and the open/close
   transition still live in src/gallery-data.js, where they are tested in the
   node environment; this file is only the DOM.

   The item list is passed to open() rather than to initLightbox(), because the
   showcase filters its list at runtime and a lightbox holding a stale copy would
   arrow through photographs the filter had already removed. */

const reduceMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function media(item) {
  if (!item.isClip) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt ?? "A Frontier photograph.";
    return img;
  }

  const video = document.createElement("video");
  // Built here and never left in the markup: src/hero.js queries
  // document.querySelectorAll("video[data-src]") across the whole document at
  // import time, and a video sitting in the markup is the one element that query
  // could reach. No data-src is used here either, for the same reason.
  video.src = item.src;
  video.poster = item.poster;
  video.controls = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("aria-label", item.alt ?? "A Frontier clip.");
  if (!reduceMotion()) {
    video.muted = true;
    // Reduced motion means still, not merely quieter: the poster holds and the
    // controls are there for anyone who wants it to move. Otherwise autoplay,
    // with the same swallow the hero uses so a refused autoplay cannot surface
    // as an unhandled rejection.
    video.play().catch(() => {});
  }
  return video;
}

export function initLightbox(dialog) {
  const frame = dialog.querySelector("[data-lightbox-frame]");
  const status = dialog.querySelector("[data-lightbox-status]");

  let state = CLOSED;
  let items = [];

  function show(index) {
    const item = items[index];
    frame.replaceChildren(media(item));
    // Position is announced, never printed. A keyboard user arrowing through
    // needs to know when they have wrapped; nobody needs "3 / 15" stamped on
    // the picture.
    status.textContent = `${index + 1} of ${items.length}. ${item.alt ?? ""}`.trim();
  }

  function open(list, index, opener) {
    if (!list?.length) return;
    items = list;
    state = openLightbox(state, index, opener);
    show(index);
    dialog.showModal();
  }

  function step(delta) {
    if (!state.isOpen) return;
    state = { ...state, index: stepIndex(state.index, delta, items.length) };
    show(state.index);
  }

  function close() {
    const previous = state;
    state = closeLightbox(state);
    // replaceChildren before anything else: it drops the <video>, which stops
    // playback and releases the file rather than leaving it buffering behind a
    // closed dialog.
    frame.replaceChildren();
    status.textContent = "";
    if (dialog.open) dialog.close();
    // Explicit, rather than trusting the browser's own showModal restoration.
    // Plain focus(), not preventScroll: a card that scrolled out of view should
    // come back rather than take focus somewhere invisible.
    previous.opener?.focus();
  }

  // Escape fires cancel, then the dialog closes itself. Listening to close
  // rather than to keydown catches every route out: Escape, the button, and a
  // backdrop click all arrive here exactly once.
  dialog.addEventListener("close", close);
  dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  for (const button of dialog.querySelectorAll("[data-lightbox-step]")) {
    button.addEventListener("click", () => step(Number(button.dataset.lightboxStep)));
  }

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    // Otherwise the arrow also scrolls whatever is behind the dialog.
    event.preventDefault();
  });

  // A click that lands on the dialog itself rather than on the media or a
  // control is a click outside the picture.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return { open };
}
