/* Imports a ThePapare photo album into public/albums/. Run:
 *   npm run albums:papare -- frontier-futsal
 *
 * Unlike the Drive albums (scripts/sync-albums.mjs), these photographs are
 * committed: ThePapare's S3 bucket is theirs, not Frontier's, and the owner has
 * their OK to self-host. Each photo becomes two WebP files, the full frame
 * (ThePapare's own 1280px web size) and a 400px grid thumbnail, plus one
 * manifest in the shape lib/album-data.ts reads.
 *
 * Every frame is watermarked. The manifest says so, and carries the
 * "Photos: ThePapare" credit and a link to ThePapare's full set.
 *
 * Curation is a human step. The run downloads the whole album into a cache,
 * then imports only the names in scripts/papare-picks/<id>.json. With no pick
 * file it stops after the download so the contact-sheet skill can be run over
 * the cache and the picks written.
 */

import { mkdir, readFile, writeFile, rm, access, stat, readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "https://new-papare.s3.ap-southeast-1.amazonaws.com/";

/* id → ThePapare album. The id is the albumId content.js carries. */
const ALBUMS = {
  "frontier-futsal": {
    papareId: 10932,
    source: "https://www.thepapare.com/photos-frontier-futsal-tournament-2024/",
  },
};

const CREDIT = "Photos: ThePapare";
const THUMB_WIDTH = 400;
const QUALITY = 72;

/* The bucket's own ListObjectsV2 answer for one album. Only the top-level
   JPEGs: `originals/` holds the same frames at 2048px, also watermarked, and
   the bare prefix key is S3's folder marker. Keys are content hashes, so the
   list is put in upload order, which follows the day's play. */
export function parseListing(xml, papareId) {
  if (/<IsTruncated>true<\/IsTruncated>/.test(xml)) {
    throw new Error(`album ${papareId}: listing truncated, paginate before importing`);
  }
  const prefix = `uploads/albums/${papareId}/`;
  const photos = [...xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)].flatMap(([, entry]) => {
    const key = /<Key>([^<]*)<\/Key>/.exec(entry)?.[1] ?? "";
    const file = key.startsWith(prefix) ? key.slice(prefix.length) : "";
    const match = /^([a-z0-9]+)\.jpe?g$/i.exec(file);
    if (!match) return [];
    return [{
      name: match[1].toLowerCase(),
      etag: /<ETag>(?:&quot;|")?([^<&"]*)/.exec(entry)?.[1] ?? "",
      size: Number(/<Size>(\d+)<\/Size>/.exec(entry)?.[1] ?? 0),
      uploaded: /<LastModified>([^<]*)<\/LastModified>/.exec(entry)?.[1] ?? "",
    }];
  });
  // ISO timestamps sort as strings; the sort is stable, so ties keep key order.
  return photos.sort((a, b) => a.uploaded.localeCompare(b.uploaded)).map(({ uploaded, ...p }) => p);
}

/* An ETag is the object's MD5, so the same bytes uploaded twice share one.
   The first upload is kept, so album order holds. */
export function dedupe(photos) {
  const seen = new Set();
  return photos.filter((p) => {
    const keys = [`n:${p.name}`, p.etag && `e:${p.etag}`].filter(Boolean);
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  });
}

export function applyPicks(photos, picks) {
  const names = new Set(photos.map((p) => p.name));
  const missing = picks.filter((n) => !names.has(n));
  if (missing.length) throw new Error(`picks not in the album: ${missing.join(", ")}`);
  const wanted = new Set(picks);
  return photos.filter((p) => wanted.has(p.name));
}

export function buildManifest({ id, credit, source, photos }) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`album id "${id}" is not a plain slug`);
  return {
    id,
    credit,
    source,
    watermarked: true,
    items: photos.map((p) => ({ s: `/albums/${id}/${p.name}.webp`, t: `/albums/${id}/${p.name}-${THUMB_WIDTH}.webp`, w: p.w, h: p.h })),
  };
}

const exists = (path) => access(path).then(() => true, () => false);

async function download(papareId, photos, dir) {
  await mkdir(dir, { recursive: true });
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (cursor < photos.length) {
        const { name } = photos[cursor++];
        const file = resolve(dir, `${name}.jpg`);
        if (await exists(file)) continue;
        // S3 drops the odd connection mid-body; a re-run also skips what landed.
        for (let attempt = 1; ; attempt++) {
          try {
            const res = await fetch(`${BUCKET}uploads/albums/${papareId}/${name}.jpg`);
            if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
            await writeFile(file, Buffer.from(await res.arrayBuffer()));
            break;
          } catch (error) {
            if (attempt === 3) throw error;
          }
        }
      }
    }),
  );
}

async function main() {
  const id = process.argv[2];
  const album = ALBUMS[id];
  if (!album) throw new Error(`usage: npm run albums:papare -- <${Object.keys(ALBUMS).join("|")}>`);

  const res = await fetch(`${BUCKET}?list-type=2&prefix=uploads/albums/${album.papareId}/`);
  if (!res.ok) throw new Error(`listing: HTTP ${res.status}`);
  const photos = dedupe(parseListing(await res.text(), album.papareId));
  const cache = resolve(ROOT, "node_modules/.cache/papare", id);
  await download(album.papareId, photos, cache);
  console.log(`${photos.length} photos in ThePapare album ${album.papareId}, cached in ${cache}`);

  const picksFile = resolve(ROOT, "scripts/papare-picks", `${id}.json`);
  if (!(await exists(picksFile))) {
    console.log(`No ${picksFile}. Curate the cache with the contact-sheet skill, write the picks, run again.`);
    return;
  }
  const picked = applyPicks(photos, JSON.parse(await readFile(picksFile, "utf8")));

  // Imported here so the tests and the download step run without sharp.
  const { default: sharp } = await import("sharp");
  const out = resolve(ROOT, "public/albums", id);
  await rm(out, { recursive: true, force: true }); // a dropped pick leaves no orphan file
  await mkdir(out, { recursive: true });
  const measured = [];
  for (const p of picked) {
    const src = resolve(cache, `${p.name}.jpg`);
    const full = await sharp(src).rotate().webp({ quality: QUALITY }).toFile(resolve(out, `${p.name}.webp`));
    await sharp(src).rotate().resize({ width: THUMB_WIDTH }).webp({ quality: QUALITY }).toFile(resolve(out, `${p.name}-${THUMB_WIDTH}.webp`));
    measured.push({ name: p.name, w: full.width, h: full.height });
  }
  await writeFile(
    resolve(ROOT, "public/albums", `${id}.json`),
    JSON.stringify(buildManifest({ id, credit: CREDIT, source: album.source, photos: measured })),
  );

  let bytes = 0;
  for (const f of await readdir(out)) bytes += (await stat(resolve(out, f))).size;
  console.log(`${measured.length} photos written, ${(bytes / 1e6).toFixed(1)} MB in public/albums/${id}/`);
}

// Importable for the tests without running the import.
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
