import { describe, it, expect } from "vitest";
import {
  albumIdFromQuery,
  albumTitle,
  albumItems,
  lightboxItems,
  manifestUrl,
  thumbUrl,
  tileLabel,
} from "./album-data";

describe("albumIdFromQuery", () => {
  it("reads the album id", () => {
    expect(albumIdFromQuery("?album=szn-4")).toBe("szn-4");
  });

  it("is null with no album parameter", () => {
    expect(albumIdFromQuery("?tab=photos")).toBe(null);
    expect(albumIdFromQuery("")).toBe(null);
    expect(albumIdFromQuery(undefined)).toBe(null);
  });

  // The id is interpolated straight into a fetch path, so this is the check
  // that stops "?album=../../something" reaching it.
  it("rejects anything that is not a plain slug", () => {
    expect(albumIdFromQuery("?album=../../etc/passwd")).toBe(null);
    expect(albumIdFromQuery("?album=szn 4")).toBe(null);
    expect(albumIdFromQuery("?album=SZN-4")).toBe(null);
    expect(albumIdFromQuery("?album=")).toBe(null);
  });

  it("builds the manifest path from it", () => {
    expect(manifestUrl("szn-4")).toBe("/albums/szn-4.json");
  });
});

describe("thumbUrl", () => {
  it("asks Drive for the grid size by default", () => {
    expect(thumbUrl("1AbC")).toBe("https://drive.google.com/thumbnail?id=1AbC&sz=w400");
  });

  it("asks for a bigger frame when the lightbox opens one", () => {
    expect(thumbUrl("1AbC", 1600)).toBe("https://drive.google.com/thumbnail?id=1AbC&sz=w1600");
  });
});

describe("albumItems", () => {
  it("keeps the recorded dimensions", () => {
    const items = albumItems({ items: [{ i: "a", w: 400, h: 599 }] });
    expect(items).toEqual([{ id: "a", width: 400, height: 599 }]);
  });

  // Portrait is the case a 3:2 assumption would have broken, and roughly a
  // third of these albums is portrait.
  it("keeps a portrait frame portrait", () => {
    const [item] = albumItems({ items: [{ i: "a", w: 400, h: 599 }] });
    expect(item.height).toBeGreaterThan(item.width);
  });

  it("falls back to a 3:2 slot when the sync could not read the header", () => {
    expect(albumItems({ items: [{ i: "a" }] })).toEqual([
      { id: "a", width: 1200, height: 800 },
    ]);
  });

  it("drops an item with no file id rather than drawing a broken tile", () => {
    expect(albumItems({ items: [{ w: 1, h: 1 }, { i: "", w: 1, h: 1 }, { i: "a" }] })).toHaveLength(1);
  });

  it("is empty for an empty or missing manifest", () => {
    expect(albumItems({ items: [] })).toEqual([]);
    expect(albumItems({})).toEqual([]);
    expect(albumItems(null)).toEqual([]);
  });
});

describe("tileLabel", () => {
  it("says what the tile does and where it sits", () => {
    expect(tileLabel(11, 869, "SZN 4")).toBe("Photo 12 of 869, SZN 4");
  });

  // The page heading says "1,038 photographs."; this must not say "of 1038".
  it("groups thousands the way the heading does", () => {
    expect(tileLabel(0, 1038, "SZN 2")).toBe("Photo 1 of 1,038, SZN 2");
  });

  it("leaves the album out when it has no title", () => {
    expect(tileLabel(0, 3, null)).toBe("Photo 1 of 3");
  });
});

describe("lightboxItems", () => {
  it("maps onto the shape src/lightbox.js takes", () => {
    expect(lightboxItems([{ id: "a", width: 400, height: 599 }], "SZN 4")).toEqual([
      {
        src: "https://drive.google.com/thumbnail?id=a&sz=w1600",
        alt: "SZN 4",
        isClip: false,
        width: 400,
        height: 599,
      },
    ]);
  });

  // The lightbox prints its own "3 of 869." before this, so repeating the
  // position here has a screen reader say the whole thing twice.
  it("does not repeat the position the lightbox already announces", () => {
    const [item] = lightboxItems([{ id: "a", width: 1, height: 1 }], "SZN 4");
    expect(item.alt).toBe("SZN 4");
    expect(item.alt).not.toMatch(/of 1/);
  });

  it("never marks an item a clip, so the lightbox never builds a video", () => {
    const items = lightboxItems([{ id: "a", width: 1, height: 1 }], "SZN 1");
    expect(items.every((item) => item.isClip === false)).toBe(true);
  });
});

describe("albumTitle", () => {
  const data = {
    seasons: [{ season: 4, albumId: "szn-4" }, { season: 5, albumId: null }],
    competitions: [{ name: "Division 0", albumId: "division-0" }],
    watchAlongs: [{ name: "World Cup", albumId: null }],
  };

  it("titles a season by its number", () => {
    expect(albumTitle(data, "szn-4")).toBe("4 x 4 Series SZN 4");
  });

  it("titles a competition by its name", () => {
    expect(albumTitle(data, "division-0")).toBe("Division 0");
  });

  // What makes an unknown ?album= read as "not found" rather than as an
  // untitled empty album.
  it("is null for an id nothing claims", () => {
    expect(albumTitle(data, "szn-9")).toBe(null);
    expect(albumTitle(data, null)).toBe(null);
  });

  // SZN 5 and Turf Wars have no Drive folder, so their albumId is null. A null
  // id must not match the null albumId of an entry that has no album.
  it("does not match an entry that has no album", () => {
    expect(albumTitle(data, "")).toBe(null);
  });

  it("survives content with collections missing", () => {
    expect(albumTitle({}, "szn-4")).toBe(null);
    expect(albumTitle(null, "szn-4")).toBe(null);
  });
});
