import { describe, it, expect } from "vitest";
import {
  albumIdFromQuery,
  albumTitle,
  albumStory,
  albumIds,
  albumCredit,
  albumItems,
  lightboxItems,
  manifestUrl,
  thumbUrl,
  tileLabel,
} from "./album-data";

describe("albumStory", () => {
  const data = {
    seasons: [{ season: 5, albumId: "szn-5", champion: null, photo: "/gallery/szn-5-hero.webp", photoAlt: "SZN 5 trophies", venue: "Athlete 360", note: null, date: null }],
    competitions: [{ name: "Frontier Futsal Tournament", albumId: "frontier-futsal", champion: null, photo: "/albums/frontier-futsal/hero.webp", photoAlt: "Players contest the ball", photoCredit: "Milinda Deshan / ThePapare", venue: null, note: null, date: null }],
    watchAlongs: [{ name: "Final night", albumId: "final-night", photo: "/champions/final.webp", photoAlt: "Fans watching", venue: null, note: null, date: null }],
  };

  it("uses recorded cover and venue without inventing a result", () => {
    expect(albumStory(data, "szn-5")).toMatchObject({ title: "4 x 4 Series SZN 5", photo: "/gallery/szn-5-hero.webp", champion: null, venue: "Athlete 360" });
  });

  it("keeps the tournament photographer credit without inventing a result", () => {
    expect(albumStory(data, "frontier-futsal")).toMatchObject({ photoCredit: "Milinda Deshan / ThePapare", champion: null });
  });

  it("does not give a watch party a champion", () => {
    expect(albumStory(data, "final-night")).toMatchObject({ title: "Final night", champion: null });
  });
});

describe("albumIds", () => {
  it("returns one static path per recorded safe album id", () => {
    expect(albumIds({ seasons: [{ albumId: "szn-5" }], competitions: [{ albumId: "szn-5" }, { albumId: "frontier-futsal" }], watchAlongs: [{ albumId: "../bad" }, { albumId: null }] })).toEqual(["szn-5", "frontier-futsal"]);
  });
});

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
    expect(items).toEqual([{ id: "a", width: 400, height: 599, thumb: "https://drive.google.com/thumbnail?id=a&sz=w400", full: "https://drive.google.com/thumbnail?id=a&sz=w1600" }]);
  });

  // Portrait is the case a 3:2 assumption would have broken, and roughly a
  // third of these albums is portrait.
  it("keeps a portrait frame portrait", () => {
    const [item] = albumItems({ items: [{ i: "a", w: 400, h: 599 }] });
    expect(item.height).toBeGreaterThan(item.width);
  });

  it("falls back to a 3:2 slot when the sync could not read the header", () => {
    expect(albumItems({ items: [{ i: "a" }] })).toEqual([
      { id: "a", width: 1200, height: 800, thumb: "https://drive.google.com/thumbnail?id=a&sz=w400", full: "https://drive.google.com/thumbnail?id=a&sz=w1600" },
    ]);
  });

  it("drops an item with no file id rather than drawing a broken tile", () => {
    expect(albumItems({ items: [{ w: 1, h: 1 }, { i: "", w: 1, h: 1 }, { i: "a" }] })).toHaveLength(1);
  });

  // ThePapare albums are committed to public/albums/<id>/ as WebP, so an item
  // carries its own two paths instead of a Drive id.
  it("serves a self-hosted photo from its own files", () => {
    expect(albumItems({ items: [{ s: "/albums/ff/a.webp", t: "/albums/ff/a-400.webp", w: 1280, h: 853 }] })).toEqual([
      { id: "/albums/ff/a.webp", width: 1280, height: 853, thumb: "/albums/ff/a-400.webp", full: "/albums/ff/a.webp" },
    ]);
  });

  it("refuses a self-hosted path that is not under /albums/", () => {
    expect(albumItems({ items: [{ s: "https://evil.example/a.webp", t: "/albums/ff/a-400.webp" }] })).toEqual([]);
    expect(albumItems({ items: [{ s: "/albums/ff/a.webp", t: "javascript:alert(1)" }] })).toEqual([]);
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
    expect(lightboxItems(albumItems({ items: [{ i: "a", w: 400, h: 599 }] }), "SZN 4")).toEqual([
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
    const [item] = lightboxItems(albumItems({ items: [{ i: "a", w: 1, h: 1 }] }), "SZN 4");
    expect(item.alt).toBe("SZN 4");
    expect(item.alt).not.toMatch(/of 1/);
  });

  it("never marks an item a clip, so the lightbox never builds a video", () => {
    const items = lightboxItems(albumItems({ items: [{ i: "a", w: 1, h: 1 }] }), "SZN 1");
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

describe("albumCredit", () => {
  const papare = { credit: "Photos: ThePapare", source: "https://www.thepapare.com/photos-frontier-futsal-tournament-2024/", watermarked: true, items: [] };

  it("reads the credit, the full-set link and the watermark flag", () => {
    expect(albumCredit(papare)).toEqual({
      credit: "Photos: ThePapare",
      source: "https://www.thepapare.com/photos-frontier-futsal-tournament-2024/",
      watermarked: true,
    });
  });

  // Drive albums are Frontier's own photographs and carry no credit line.
  it("is empty for a Drive album", () => {
    expect(albumCredit({ id: "szn-4", items: [] })).toEqual({ credit: null, source: null, watermarked: false });
    expect(albumCredit(null)).toEqual({ credit: null, source: null, watermarked: false });
  });

  // The link is rendered as an href, so only a web address gets through.
  it("drops a source link that is not https", () => {
    expect(albumCredit({ ...papare, source: "javascript:alert(1)" }).source).toBe(null);
  });
});
