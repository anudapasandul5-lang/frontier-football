import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { coverFor, highlights, reel } from "./highlights";

const onDisk = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

describe("highlights", () => {
  it("every picked frame is a committed file with real dimensions and alt text", () => {
    for (const [album, frames] of Object.entries(highlights)) {
      expect(frames.length, album).toBeGreaterThan(0);
      for (const f of frames) {
        expect(onDisk(f.src), f.src).toBe(true);
        expect(f.w > 0 && f.h > 0, f.src).toBe(true);
        expect(f.alt.length, f.src).toBeGreaterThan(10);
      }
    }
  });

  it("never picks from a watermarked ThePapare album", () => {
    for (const album of Object.keys(highlights)) {
      const m = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "albums", `${album}.json`), "utf8"));
      expect(m.watermarked === true, album).toBe(false);
    }
  });

  it("every album with highlights has its card cover copy", () => {
    for (const album of Object.keys(highlights)) expect(onDisk(`/gallery/cover/${album}.webp`), album).toBe(true);
  });

  it("the reel resolves every frame and repeats none", () => {
    expect(reel.length).toBe(10);
    expect(new Set(reel.map((f) => f.src)).size).toBe(reel.length);
    for (const f of reel) expect(onDisk(f.src), f.src).toBe(true);
  });
});

describe("coverFor", () => {
  it("keeps the winners photo when a champion is recorded", () => {
    expect(coverFor({ id: "szn-3", champion: "Ramadan FC", photo: "/champions/szn-3.webp", photoAlt: "x" })?.src).toBe("/champions/szn-3.webp");
  });
  it("uses the lead highlight when no champion is recorded", () => {
    const album = { id: "szn-1", champion: null, photo: "/champions/szn-1.webp", photoAlt: "x" };
    expect(coverFor(album, "full")?.src).toBe(highlights["szn-1"][0].src);
    expect(coverFor(album)?.src).toBe("/gallery/cover/szn-1.webp");
  });
  it("falls back to the stored photo when an album has no highlights, else null", () => {
    expect(coverFor({ id: "szn-5", champion: null, photo: "/gallery/szn-5-hero.webp", photoAlt: "x" })?.src).toBe("/gallery/szn-5-hero.webp");
    expect(coverFor({ id: "none", champion: null, photo: null, photoAlt: null })).toBeNull();
  });
});
