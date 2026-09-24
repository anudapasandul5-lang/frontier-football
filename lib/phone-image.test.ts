import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import variants from "./phone-variants.json";
import { PHONE_DIRS, phoneSrc, phoneSrcSet, variantPath } from "./phone-image";

const pub = (src: string) => join(process.cwd(), "public", src);
// Not /-\d+\.webp$/: that also matches originals like champions/szn-1.webp.
const isVariant = (name: string) => /-(800|1200)\.webp$/.test(name);

describe("phoneSrcSet", () => {
  it("lists the phone sizes first and the original last, at its real width", () => {
    const widths = (variants as Record<string, number[]>)["/heroes/events.webp"];
    expect(phoneSrcSet("/heroes/events.webp")).toBe(
      `/heroes/events-800.webp 800w, /heroes/events-1200.webp 1200w, /heroes/events.webp ${widths.at(-1)}w`,
    );
  });

  it("returns undefined for an image with no phone sizes", () => {
    expect(phoneSrcSet("/crest.webp")).toBeUndefined();
    expect(phoneSrcSet("https://drive.google.com/thumbnail?id=x")).toBeUndefined();
  });
});

describe("phoneSrc", () => {
  it("picks the smallest copy at least that wide, else the original", () => {
    expect(phoneSrc("/home/ring/keeper-slide.webp", 800)).toBe("/home/ring/keeper-slide-800.webp");
    expect(phoneSrc("/home/ring/keeper-slide.webp", 1000)).toBe("/home/ring/keeper-slide.webp");
    expect(phoneSrc("/crest.webp", 800)).toBe("/crest.webp");
  });
});

describe("phone-variants.json", () => {
  it("names only files that exist", () => {
    for (const [src, widths] of Object.entries(variants as Record<string, number[]>)) {
      expect(existsSync(pub(src)), src).toBe(true);
      for (const w of widths.slice(0, -1)) expect(existsSync(pub(variantPath(src, w))), variantPath(src, w)).toBe(true);
    }
  });

  // Fails when a new big photo lands without `npm run images:phone`.
  it("covers every photo wider than a phone needs", async () => {
    for (const dir of PHONE_DIRS) {
      for (const name of readdirSync(pub(dir), { recursive: true }) as string[]) {
        if (!name.endsWith(".webp") || isVariant(name)) continue;
        const src = `/${dir}/${name.replaceAll("\\", "/")}`;
        const { width = 0 } = await sharp(pub(src)).metadata();
        if (width > 900) expect(variants, src).toHaveProperty([src]);
      }
    }
  });
});
