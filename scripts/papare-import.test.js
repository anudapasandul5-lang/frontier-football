import { describe, it, expect } from "vitest";
import { parseListing, dedupe, applyPicks, buildManifest } from "./papare-import.mjs";

/* The pure half of the ThePapare import. The network and the WebP encode are
   not tested here; these are the parts that can be wrong quietly: a listing
   that mixes in the 2048px originals, a duplicate upload shown twice, a pick
   list that silently drops a typo, a manifest that loses its credit. */

const contents = (key, etag, size = 1000) =>
  `<Contents><Key>${key}</Key><LastModified>2024-10-22T02:42:37.000Z</LastModified><ETag>&quot;${etag}&quot;</ETag><Size>${size}</Size></Contents>`;

const listing = (...parts) =>
  `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult><Name>new-papare</Name>${parts.join("")}</ListBucketResult>`;

describe("parseListing", () => {
  it("lists the album's web-size photos", () => {
    const xml = listing(
      contents("uploads/albums/10932/", "d41d8cd98f00b204e9800998ecf8427e", 0),
      contents("uploads/albums/10932/aa11.jpg", "e1"),
      contents("uploads/albums/10932/originals/aa11.jpg", "e2", 2_000_000),
      contents("uploads/albums/10932/bb22.jpg", "e3"),
    );
    expect(parseListing(xml, 10932)).toEqual([
      { name: "aa11", etag: "e1", size: 1000 },
      { name: "bb22", etag: "e3", size: 1000 },
    ]);
  });

  // The folder marker and the originals/ copies are not photos to import: the
  // originals are the same frames at 2048px, still watermarked.
  it("skips the folder marker and the originals", () => {
    const xml = listing(
      contents("uploads/albums/10932/", "x", 0),
      contents("uploads/albums/10932/originals/aa11.jpg", "e2"),
    );
    expect(parseListing(xml, 10932)).toEqual([]);
  });

  // Keys are content hashes, so key order is random. Upload order follows the
  // day: group games, then knockouts, then the prize-giving.
  it("orders the photos by upload time, not by key", () => {
    const at = (key, etag, time) =>
      `<Contents><Key>${key}</Key><LastModified>${time}</LastModified><ETag>&quot;${etag}&quot;</ETag><Size>1</Size></Contents>`;
    const xml = listing(
      at("uploads/albums/10932/aa11.jpg", "e1", "2024-10-22T03:00:00.000Z"),
      at("uploads/albums/10932/bb22.jpg", "e2", "2024-10-22T02:00:00.000Z"),
    );
    expect(parseListing(xml, 10932).map((p) => p.name)).toEqual(["bb22", "aa11"]);
  });

  it("ignores another album's keys", () => {
    expect(parseListing(listing(contents("uploads/albums/13152/cc33.jpg", "e4")), 10932)).toEqual([]);
  });

  // A truncated listing would import part of an album and look complete.
  it("refuses a truncated listing", () => {
    const xml = listing("<IsTruncated>true</IsTruncated>", contents("uploads/albums/10932/aa11.jpg", "e1"));
    expect(() => parseListing(xml, 10932)).toThrow(/truncated/);
  });
});

describe("dedupe", () => {
  // Same bytes uploaded twice under two names: S3 gives both the same ETag.
  it("keeps the first of two identical uploads", () => {
    expect(
      dedupe([
        { name: "aa11", etag: "e1", size: 1 },
        { name: "bb22", etag: "e1", size: 1 },
        { name: "cc33", etag: "e3", size: 1 },
      ]).map((p) => p.name),
    ).toEqual(["aa11", "cc33"]);
  });

  it("keeps a name once even if it is listed twice", () => {
    expect(dedupe([{ name: "aa11", etag: "e1" }, { name: "aa11", etag: "e1" }])).toHaveLength(1);
  });
});

describe("applyPicks", () => {
  const photos = [{ name: "aa11" }, { name: "bb22" }, { name: "cc33" }];

  it("keeps the picked photos in album order", () => {
    expect(applyPicks(photos, ["cc33", "aa11"]).map((p) => p.name)).toEqual(["aa11", "cc33"]);
  });

  // A mistyped pick must fail the run, not quietly shrink the album.
  it("throws on a pick that is not in the album", () => {
    expect(() => applyPicks(photos, ["aa11", "zz99"])).toThrow(/zz99/);
  });
});

describe("buildManifest", () => {
  const manifest = buildManifest({
    id: "frontier-futsal",
    credit: "Photos: ThePapare",
    source: "https://www.thepapare.com/photos-frontier-futsal-tournament-2024/",
    photos: [{ name: "aa11", w: 1280, h: 853 }],
  });

  it("points each item at its full and thumbnail WebP", () => {
    expect(manifest.items).toEqual([
      { s: "/albums/frontier-futsal/aa11.webp", t: "/albums/frontier-futsal/aa11-400.webp", w: 1280, h: 853 },
    ]);
  });

  it("carries the credit, the full-set link and the watermark flag", () => {
    expect(manifest).toMatchObject({
      id: "frontier-futsal",
      credit: "Photos: ThePapare",
      source: "https://www.thepapare.com/photos-frontier-futsal-tournament-2024/",
      watermarked: true,
    });
  });

  it("rejects an id the album page would refuse", () => {
    expect(() => buildManifest({ id: "Frontier Futsal", credit: "x", source: "https://x", photos: [] })).toThrow();
  });
});
