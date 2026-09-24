import { describe, it, expect } from "vitest";
import { galleryChapters, nextAlbum } from "./gallery-story";

const data = {
  seasons: [
    { season: 2, albumId: "szn-2", champion: "TODO", photo: "/champions/szn-2.webp", venue: "Athlete 360" },
    { season: 1, albumId: "szn-1", champion: "Reds", photo: "/champions/szn-1.webp" },
    { season: 5, albumId: "szn-5", photo: "/gallery/szn-5-hero.webp" },
  ],
  competitions: [
    { name: "Frontier Futsal Tournament", albumId: "frontier-futsal", beforeSeries: true, photo: "/albums/frontier-futsal/a.webp" },
    { name: "Turf Wars", albumId: "TODO", beforeSeries: true, photo: "/champions/turf-wars.webp" },
    { name: "Division 0", albumId: "division-0", note: "PS5 FC26 tournament", photo: "/champions/division-0.webp" },
  ],
  watchAlongs: [{ name: "Final: Spain vs Argentina", albumId: "wa-final", photo: "/champions/wa-final.webp" }, { name: "No photos", albumId: "wa-empty" }],
};
const facts = {
  "szn-1": { count: 502 },
  "szn-2": { count: 1038 },
  "szn-5": { count: 90, watermarked: true },
  "frontier-futsal": { count: 214, watermarked: true },
  "division-0": { count: 64 },
  "wa-final": { count: 257 },
  "wa-empty": { count: 0 },
};

describe("galleryChapters", () => {
  const chapters = galleryChapters(data, facts);

  it("tells the story in order: before the series, the series, watch parties, then later competitions", () => {
    expect(chapters.map((c) => c.id)).toEqual(["origins", "series", "watch-parties", "division-0"]);
  });

  it("orders seasons oldest first and gives each a short number", () => {
    expect(chapters[1].albums.map((a) => a.short)).toEqual(["SZN 01", "SZN 02", "SZN 05"]);
  });

  it("drops anything without an album or without photos (Turf Wars, an empty watch party)", () => {
    const ids = chapters.flatMap((c) => c.albums.map((a) => a.id));
    expect(ids).not.toContain("wa-empty");
    expect(chapters[0].albums.map((a) => a.title)).toEqual(["Frontier Futsal Tournament"]);
  });

  it("never prints an unrecorded champion", () => {
    const [s1, s2] = chapters[1].albums;
    expect(s1.champion).toBe("Reds");
    expect(s2.champion).toBeNull();
  });

  it("never leads with a watermarked album's photo; keeps a clean inset when there is one", () => {
    const futsal = chapters[0].albums[0];
    expect(futsal.treatment).toBe("type");
    expect(futsal.inset).toBeNull(); // its photo is a ThePapare frame
    const szn5 = chapters[1].albums[2];
    expect(szn5.treatment).toBe("type");
    expect(szn5.inset).toBe("/gallery/szn-5-hero.webp");
    expect(chapters[1].albums[0].treatment).toBe("photo");
  });

  it("carries the photo count", () => {
    expect(chapters[1].albums[1].count).toBe(1038);
  });
});

describe("nextAlbum", () => {
  const chapters = galleryChapters(data, facts);
  it("walks the story order and wraps round", () => {
    expect(nextAlbum(chapters, "frontier-futsal")?.id).toBe("szn-1");
    expect(nextAlbum(chapters, "szn-5")?.id).toBe("wa-final");
    expect(nextAlbum(chapters, "division-0")?.id).toBe("frontier-futsal");
  });
  it("returns null for an unknown album", () => {
    expect(nextAlbum(chapters, "nope")).toBeNull();
  });
});
