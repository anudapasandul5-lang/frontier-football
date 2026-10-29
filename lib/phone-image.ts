import variants from "./phone-variants.json";

/* Phone-sized copies of the committed photos (mobile plan T1). The site is a
   static export with next/image unoptimized, so nothing resizes on request:
   scripts/phone-variants.mjs writes <name>-800.webp and <name>-1200.webp next
   to every photo wider than 900px in these folders, and records the widths in
   phone-variants.json. A 390px phone at DPR 3 wants ~1200px, DPR 2 ~800px;
   desktop still gets the original. */
export const PHONE_DIRS = ["heroes", "home", "pages", "champions", "who", "community"] as const;

const widths = variants as Record<string, number[]>;

export const variantPath = (src: string, width: number) => src.replace(/\.webp$/, `-${width}.webp`);

/* srcSet for a committed photo, or undefined when it has no phone sizes (small
   files, Drive URLs), which React then leaves off the <img>. The last width is
   the original's real width. */
export function phoneSrcSet(src: string | null | undefined) {
  if (!src || !widths[src]) return undefined;
  const list = widths[src];
  return list.map((w, i) => `${i === list.length - 1 ? src : variantPath(src, w)} ${w}w`).join(", ");
}

/* The smallest copy at least `min` px wide, for code that loads one file
   rather than letting the browser pick (the WebGL ring's textures). */
export function phoneSrc(src: string, min: number) {
  const w = (widths[src] ?? []).slice(0, -1).find((x) => x >= min);
  return w ? variantPath(src, w) : src;
}
