/* Writes phone-sized copies of the committed photos (mobile plan T1). Run:
 *   npm run images:phone
 *
 * For every WebP wider than 900px under the folders lib/phone-image.ts names,
 * writes <name>-800.webp and, when the original is wider still,
 * <name>-1200.webp, then records the widths in lib/phone-variants.json for
 * phoneSrcSet(). Also writes public/crest-sm.webp: the crest is shown at most
 * 144px tall but the original is 640px.
 *
 * Idempotent: a copy newer than its original is left alone. Re-run after
 * adding or replacing a photo; lib/phone-image.test.ts fails until you do.
 */

import { readdir, stat, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
// Keep in step with PHONE_DIRS in lib/phone-image.ts.
const DIRS = ["heroes", "home", "pages", "champions", "who"];
const SIZES = [800, 1200];
const MIN_WIDTH = 900;
const QUALITY = 72;
const isVariant = (name) => /-(800|1200)\.webp$/.test(name);

async function fresh(out, src) {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
}

const manifest = {};
let written = 0;
for (const dir of DIRS) {
  for (const name of (await readdir(join(PUBLIC, dir), { recursive: true })).sort()) {
    if (!name.endsWith(".webp") || isVariant(name)) continue;
    const file = join(PUBLIC, dir, name);
    const { width } = await sharp(file).metadata();
    if (width <= MIN_WIDTH) continue;
    const src = `/${dir}/${name.replaceAll("\\", "/")}`;
    const sizes = SIZES.filter((w) => w < width);
    for (const w of sizes) {
      const out = file.replace(/\.webp$/, `-${w}.webp`);
      if (await fresh(out, file)) continue;
      await sharp(file).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
      written++;
    }
    manifest[src] = [...sizes, width];
  }
}

const crest = join(PUBLIC, "crest.webp");
const crestSm = join(PUBLIC, "crest-sm.webp");
if (!(await fresh(crestSm, crest))) {
  // 144px tall at DPR 2.5 is ~360px; the menu and intro crests are the largest.
  await sharp(crest).resize({ height: 360 }).webp({ quality: 80 }).toFile(crestSm);
  written++;
}

await writeFile(join(ROOT, "lib/phone-variants.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`${Object.keys(manifest).length} photos, ${written} files written`);
