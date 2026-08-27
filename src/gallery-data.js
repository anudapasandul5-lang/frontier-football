/* Reads the hand-edited gallery list into the shape the strip renders, and holds
   the lightbox's index maths and its open/close transition.

   Pure: no DOM, no browser globals, so the whole thing is testable in the node
   environment without pulling in jsdom as a third dependency. The DOM lives in
   src/gallery.js. */

import { recorded } from "./content-data.js";

/* A 3:2 slot, used when an entry carries no usable dimensions. They exist only to
   hold the tile's space so the strip does not reflow as pictures arrive, which is
   a convenience for the owner rather than an obligation: swapping a photo and
   leaving these stale costs one frame of the wrong shape, not a broken tile. */
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

export const CLOSED = { isOpen: false, index: 0, opener: null };

/* Wraps at both ends, so Left from the first item lands on the last and Right
   from the last lands on the first. A zero-length gallery returns 0 rather than
   NaN: `x % 0` is NaN, and an index of NaN renders nothing at all. */
export function stepIndex(current, delta, length) {
  if (!(length > 0)) return 0;
  return (((current + delta) % length) + length) % length;
}

export function openLightbox(state, index, opener) {
  return { isOpen: true, index, opener };
}

/* The opener is deliberately kept rather than cleared. Closing has to hand focus
   back to the thumbnail that opened the dialog, and a keyboard user who is
   returned to the top of the document instead has lost their place entirely.
   Closing something already closed returns the same state: Escape and a backdrop
   click can both arrive for one close. */
export function closeLightbox(state) {
  if (!state.isOpen) return state;
  return { ...state, isOpen: false };
}

function dimensions(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
  return { width: FALLBACK_WIDTH, height: FALLBACK_HEIGHT };
}

/* Type comes from the extension rather than from a `type` field, so there is one
   less thing in content.js for the owner to get wrong. */
function parseItem(raw) {
  const entry = raw ?? {};
  // Same TODO guard the champions grid uses, imported rather than rewritten. A
  // src of "TODO" would make the browser request a file that is not there and
  // draw a broken-image icon in the middle of the strip.
  const src = recorded(entry.src);
  if (!src) return null;

  const isClip = /\.mp4$/i.test(src);
  const poster = recorded(entry.poster);
  // A clip is rendered as its poster until the lightbox opens it, so a clip with
  // no poster has nothing to draw and is dropped rather than shown as a hole.
  if (isClip && !poster) return null;

  return { src, alt: recorded(entry.alt), isClip, poster, ...dimensions(entry.width, entry.height) };
}

export function galleryItems(raw) {
  return ((raw ?? {}).gallery ?? []).map(parseItem).filter(Boolean);
}
