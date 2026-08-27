import content from "../content.js";
import { CLOSED, closeLightbox, galleryItems, openLightbox, stepIndex } from "./gallery-data.js";
import { wireReveal } from "./reveal.js";

/* Renders the contact strip from content.js and drives the lightbox. All of the
   index maths and the open/close transition live in src/gallery-data.js, where
   they are tested in the node environment; this file is only the DOM. */

const reduceMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function thumbnail(item) {
  const img = document.createElement("img");
  // A clip shows its poster. No <video> element goes into the strip at all, so a
  // phone cannot download an .mp4 it did not ask for: there is nothing in the
  // document capable of requesting one until the lightbox builds it.
  img.src = item.isClip ? item.poster : item.src;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  // Intrinsic size, so the tile knows its shape before the file arrives and the
  // strip does not reflow as pictures load.
  img.width = item.width;
  img.height = item.height;
  return img;
}

function tile(item, index, onOpen) {
  const cell = document.createElement("li");
  cell.className = "gallery__tile";
  // The tile takes its shape from the picture rather than from its position in
  // the list, so the owner reordering content.js cannot change what gets cropped.
  cell.style.setProperty("--gallery-ratio", `${item.width} / ${item.height}`);

  const button = document.createElement("button");
  button.className = "gallery__frame";
  button.type = "button";
  // The picture's alt sits on the button rather than on the img: the img is
  // decorative inside a control, and a screen reader should hear one thing here,
  // not the description twice.
  const description = item.alt ?? (item.isClip ? "A Frontier clip." : "A Frontier photograph.");
  button.setAttribute("aria-label", item.isClip ? `Play clip. ${description}` : description);
  button.append(thumbnail(item));

  if (item.isClip) {
    const mark = document.createElement("span");
    mark.className = "gallery__play";
    mark.setAttribute("aria-hidden", "true");
    button.append(mark);
  }

  button.addEventListener("click", () => onOpen(index, button));
  cell.append(button);
  return cell;
}

function media(item) {
  if (!item.isClip) {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt ?? "A Frontier photograph.";
    return img;
  }

  const video = document.createElement("video");
  // Built here and never left in index.html: src/hero.js queries
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

export function initGallery(section, dialog) {
  const mount = section.querySelector("[data-gallery]");
  const frame = dialog.querySelector("[data-lightbox-frame]");
  const status = dialog.querySelector("[data-lightbox-status]");
  const items = galleryItems(content);

  // No items means no section. The lede is static markup so a failed bundle
  // still reads as a labelled section, but a strip that successfully rendered
  // nothing is just an empty band and is removed outright.
  if (items.length === 0) {
    section.remove();
    return;
  }

  let state = CLOSED;

  function show(index) {
    const item = items[index];
    frame.replaceChildren(media(item));
    // Position is announced, never printed. A keyboard user arrowing through
    // needs to know when they have wrapped; nobody needs "3 / 15" stamped on
    // the picture.
    status.textContent = `${index + 1} of ${items.length}. ${item.alt ?? ""}`.trim();
  }

  function open(index, opener) {
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
    // Plain focus(), not preventScroll: a tile that scrolled out of the strip
    // should come back into view rather than take focus somewhere invisible.
    previous.opener?.focus();
  }

  mount.replaceChildren(...items.map((item, index) => tile(item, index, open)));

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

  // The track and the lede, never the tiles. src/reveal.js observes against the
  // viewport with zero horizontal insets on its rootMargin, so a tile scrolled
  // off to the right of this scroller would never intersect and would sit at
  // opacity 0 for good.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}

const section = document.querySelector(".gallery");
const dialog = document.querySelector("[data-lightbox]");
if (section && dialog) initGallery(section, dialog);
