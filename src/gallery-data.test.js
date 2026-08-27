import { describe, it, expect } from "vitest";
import { CLOSED, closeLightbox, galleryItems, openLightbox, stepIndex } from "./gallery-data.js";

describe("stepIndex", () => {
  it("wraps forward off the end", () => {
    expect(stepIndex(4, 1, 5)).toBe(0);
  });

  it("wraps backward off the start", () => {
    expect(stepIndex(0, -1, 5)).toBe(4);
  });

  it("steps normally in the middle", () => {
    expect(stepIndex(2, 1, 5)).toBe(3);
    expect(stepIndex(2, -1, 5)).toBe(1);
  });

  it("cannot navigate off a one-item gallery", () => {
    // Both arrow keys have to be safe when there is nothing to move to.
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 1)).toBe(0);
  });

  it("returns 0 for an empty gallery rather than NaN", () => {
    // A modulo by zero is NaN, which would land as index NaN and render nothing.
    expect(stepIndex(0, 1, 0)).toBe(0);
    expect(stepIndex(0, -1, 0)).toBe(0);
  });
});

describe("the lightbox open and close transition", () => {
  it("opens at an index and remembers the element that opened it", () => {
    const thumb = { name: "tile-3" };
    const state = openLightbox(CLOSED, 3, thumb);

    expect(state.isOpen).toBe(true);
    expect(state.index).toBe(3);
    expect(state.opener).toBe(thumb);
  });

  it("closes and still carries the opener, so focus can go back to it", () => {
    // This is the whole point of storing it. Drop the opener on close and a
    // keyboard user is returned to the top of the document instead of to the
    // thumbnail they were on.
    const thumb = { name: "tile-3" };
    const state = closeLightbox(openLightbox(CLOSED, 3, thumb));

    expect(state.isOpen).toBe(false);
    expect(state.opener).toBe(thumb);
  });

  it("treats closing an already-closed lightbox as a no-op", () => {
    // Escape and a backdrop click can both arrive for the same close.
    expect(closeLightbox(CLOSED)).toBe(CLOSED);
  });
});

describe("galleryItems", () => {
  it("reads a photograph, keeping its own dimensions", () => {
    const [item] = galleryItems({
      gallery: [{ src: "/gallery/01.webp", alt: "A tackle.", width: 1080, height: 782 }],
    });

    expect(item).toEqual({
      src: "/gallery/01.webp",
      alt: "A tackle.",
      isClip: false,
      poster: null,
      width: 1080,
      height: 782,
    });
  });

  it("reads a clip from its extension, not from a type field", () => {
    const [item] = galleryItems({
      gallery: [
        { src: "/gallery/03.mp4", poster: "/gallery/03.webp", alt: "A clip.", width: 960, height: 540 },
      ],
    });

    expect(item.isClip).toBe(true);
    expect(item.poster).toBe("/gallery/03.webp");
  });

  it("drops a clip with no poster, because a posterless clip tile is an empty box", () => {
    const items = galleryItems({
      gallery: [{ src: "/gallery/03.mp4", alt: "A clip." }, { src: "/gallery/01.webp" }],
    });

    expect(items.map((item) => item.src)).toEqual(["/gallery/01.webp"]);
  });

  it("drops an entry the owner has left as TODO", () => {
    const items = galleryItems({
      gallery: [{ src: "TODO" }, { src: "TODO: pick one" }, { src: "/gallery/01.webp" }],
    });

    expect(items).toHaveLength(1);
  });

  it("drops an entry with no src at all", () => {
    expect(galleryItems({ gallery: [{ alt: "Orphaned caption." }] })).toEqual([]);
  });

  it("falls back to a 3:2 slot when the owner swaps a photo and leaves no size", () => {
    // The dimensions only hold the tile's space so the strip does not jump.
    // A missing one must not collapse the tile to nothing.
    const [item] = galleryItems({ gallery: [{ src: "/gallery/01.webp" }] });

    expect(item.width / item.height).toBeCloseTo(1.5);
  });

  it("falls back when a dimension is present but not a number", () => {
    const [item] = galleryItems({
      gallery: [{ src: "/gallery/01.webp", width: "wide", height: 782 }],
    });

    expect(item.width / item.height).toBeCloseTo(1.5);
  });

  it("survives content with no gallery key at all", () => {
    expect(galleryItems({ seasons: [] })).toEqual([]);
    expect(galleryItems({})).toEqual([]);
    expect(galleryItems(undefined)).toEqual([]);
  });
});
