/* Reads the hand-edited gallery list into the shape the strip renders, and holds
   the lightbox's index maths and its open/close transition.

   Pure: no DOM, no browser globals, so the whole thing is testable in the node
   environment without pulling in jsdom as a third dependency. The DOM lives in
   src/gallery.js. */

import { recorded, type Raw } from "./content-data";

/* A 3:2 slot, used when an entry carries no usable dimensions. They exist only to
   hold the tile's space so the strip does not reflow as pictures arrive, which is
   a convenience for the owner rather than an obligation: swapping a photo and
   leaving these stale costs one frame of the wrong shape, not a broken tile. */
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

export type LightboxState = { isOpen: boolean; index: number; opener: unknown };

export const CLOSED: LightboxState = { isOpen: false, index: 0, opener: null };

/* Wraps at both ends, so Left from the first item lands on the last and Right
   from the last lands on the first. A zero-length gallery returns 0 rather than
   NaN: `x % 0` is NaN, and an index of NaN renders nothing at all. */
export function stepIndex(current: number, delta: number, length: number) {
  if (!(length > 0)) return 0;
  return (((current + delta) % length) + length) % length;
}

/* 1-indexed for a human reading it, sighted or by ear - "1 / 15", never
   "0 / 15". Blank rather than "1 / 0" when a filter combination legitimately
   matches nothing: printing a position inside a deck that holds nothing is a
   worse lie than showing no position at all. */
export function countLabel(active: number, total: number) {
  if (total === 0) return "";
  return `${active + 1} / ${total}`;
}

export function openLightbox(state: LightboxState, index: number, opener: unknown): LightboxState {
  return { isOpen: true, index, opener };
}

/* The opener is deliberately kept rather than cleared. Closing has to hand focus
   back to the thumbnail that opened the dialog, and a keyboard user who is
   returned to the top of the document instead has lost their place entirely.
   Closing something already closed returns the same state: Escape and a backdrop
   click can both arrive for one close. */
export function closeLightbox(state: LightboxState): LightboxState {
  if (!state.isOpen) return state;
  return { ...state, isOpen: false };
}

function dimensions(width: unknown, height: unknown) {
  const w = Number(width);
  const h = Number(height);
  if (w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
  return { width: FALLBACK_WIDTH, height: FALLBACK_HEIGHT };
}

/* Type comes from the extension rather than from a `type` field, so there is one
   less thing in content.js for the owner to get wrong. */
function parseItem(raw: Raw) {
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

  return {
    src,
    alt: recorded(entry.alt),
    // Optional. Powers the coverflow's filter pills; an entry with no tag still
    // renders, it just never matches a filter other than "all".
    tag: recorded(entry.tag),
    isClip,
    poster,
    ...dimensions(entry.width, entry.height),
  };
}

export type GalleryItem = NonNullable<ReturnType<typeof parseItem>>;

export function galleryItems(raw: Raw): GalleryItem[] {
  return (((raw ?? {}).gallery ?? []) as Raw[]).map(parseItem).filter((item) => item !== null);
}

/* Distinct tags, in the order they first appear in content.js — not sorted,
   for the same reason the partners list isn't: file order is the only order
   nobody has to agree on. Empty when nothing carries a tag, which is what lets
   the coverflow skip rendering a pill row rather than draw one dead control. */
export function galleryTags(items: GalleryItem[]) {
  return [...new Set(items.map((item) => item.tag).filter(Boolean))];
}

/* null means "every item" — the coverflow's default, unfiltered state. */
export function filterItems(items: GalleryItem[], tag: string | null | undefined) {
  if (tag == null) return items;
  return items.filter((item) => item.tag === tag);
}

/* Photos and clips as two separate lists, in the order content.js already
   lists them. Used by the gallery page to draw two stacked mosaics, and by the
   coverflow's own media filter — a plain boolean check either place could
   inline, but the split is common to both and worth naming once. */
export function splitByMedia(items: GalleryItem[]) {
  return {
    photos: items.filter((item) => !item.isClip),
    clips: items.filter((item) => item.isClip),
  };
}
