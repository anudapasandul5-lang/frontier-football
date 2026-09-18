import { describe, it, expect } from "vitest";
import {
  CLOSED,
  closeLightbox,
  countLabel,
  filterItems,
  galleryItems,
  galleryTags,
  openLightbox,
  splitByMedia,
  stepIndex,
} from "./gallery-data";
import content from "../content.js";

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

describe("countLabel", () => {
  it("is 1-indexed for a sighted or screen-reader deck position", () => {
    expect(countLabel(0, 15)).toBe("1 / 15");
  });

  it("reads the last item correctly, not off by one", () => {
    expect(countLabel(14, 15)).toBe("15 / 15");
  });

  it("blanks rather than printing 1 / 0 when a filter matches nothing", () => {
    expect(countLabel(0, 0)).toBe("");
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
      tag: null,
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

  it("keeps an entry's tag, for the coverflow's filter pills", () => {
    const [item] = galleryItems({
      gallery: [{ src: "/gallery/01.webp", tag: "On the pitch" }],
    });

    expect(item.tag).toBe("On the pitch");
  });

  it("treats a TODO tag as no tag, same as any other unrecorded field", () => {
    const [item] = galleryItems({
      gallery: [{ src: "/gallery/01.webp", tag: "TODO" }],
    });

    expect(item.tag).toBeNull();
  });

  it("defaults to no tag when the field is absent", () => {
    const [item] = galleryItems({ gallery: [{ src: "/gallery/01.webp" }] });

    expect(item.tag).toBeNull();
  });
});

describe("galleryTags", () => {
  it("lists distinct tags in the order they first appear", () => {
    const items = galleryItems({
      gallery: [
        { src: "/gallery/01.webp", tag: "On the pitch" },
        { src: "/gallery/02.webp", tag: "Watch-alongs" },
        { src: "/gallery/03.webp", tag: "On the pitch" },
      ],
    });

    expect(galleryTags(items)).toEqual(["On the pitch", "Watch-alongs"]);
  });

  it("returns an empty list when nothing is tagged, so no pill row renders", () => {
    const items = galleryItems({ gallery: [{ src: "/gallery/01.webp" }] });

    expect(galleryTags(items)).toEqual([]);
  });

  it("skips untagged entries mixed in with tagged ones", () => {
    const items = galleryItems({
      gallery: [
        { src: "/gallery/01.webp", tag: "On the pitch" },
        { src: "/gallery/02.webp" },
      ],
    });

    expect(galleryTags(items)).toEqual(["On the pitch"]);
  });
});

describe("filterItems", () => {
  const items = galleryItems({
    gallery: [
      { src: "/gallery/01.webp", tag: "On the pitch" },
      { src: "/gallery/02.webp", tag: "Watch-alongs" },
      { src: "/gallery/03.webp", tag: "On the pitch" },
    ],
  });

  it("returns every item when the tag is null", () => {
    expect(filterItems(items, null)).toEqual(items);
  });

  it("keeps only items carrying the given tag", () => {
    expect(filterItems(items, "On the pitch").map((item) => item.src)).toEqual([
      "/gallery/01.webp",
      "/gallery/03.webp",
    ]);
  });

  it("returns an empty list for a tag nothing carries", () => {
    expect(filterItems(items, "Nope")).toEqual([]);
  });
});

describe("splitByMedia", () => {
  it("separates photographs from clips, each keeping content.js's order", () => {
    const items = galleryItems({
      gallery: [
        { src: "/gallery/01.webp" },
        { src: "/gallery/02.mp4", poster: "/gallery/02.webp" },
        { src: "/gallery/03.webp" },
        { src: "/gallery/04.mp4", poster: "/gallery/04.webp" },
      ],
    });

    const { photos, clips } = splitByMedia(items);

    expect(photos.map((item) => item.src)).toEqual(["/gallery/01.webp", "/gallery/03.webp"]);
    expect(clips.map((item) => item.src)).toEqual(["/gallery/02.mp4", "/gallery/04.mp4"]);
  });

  it("returns an empty clips list when nothing is a clip", () => {
    const items = galleryItems({ gallery: [{ src: "/gallery/01.webp" }] });

    expect(splitByMedia(items)).toEqual({ photos: items, clips: [] });
  });

  it("returns an empty photos list when everything is a clip", () => {
    const items = galleryItems({
      gallery: [{ src: "/gallery/01.mp4", poster: "/gallery/01.webp" }],
    });

    expect(splitByMedia(items)).toEqual({ photos: [], clips: items });
  });
});

// The home deck shows landscape photographs only; clips are the one place an
// upright frame is allowed, and they sit behind their own pill. A portrait
// photograph slipping into content.js is the regression this guards.
describe("content.js gallery shape", () => {
  it("has no portrait photographs", () => {
    const upright = galleryItems(content)
      .filter((item) => !item.isClip)
      .filter((item) => item.width / item.height <= 1.15);

    expect(upright.map((item) => item.src)).toEqual([]);
  });
});
