/* Regenerates public/albums/*.json from Google Drive. Run: npm run albums:sync
 *
 * Drive stores the photographs, the site presents them (docs/HOUSE-RULES.md).
 * Nothing here downloads a photograph; it records file ids and the shape of
 * each frame so the album grid can reserve the right space before the pixels
 * arrive.
 *
 * No API key, no OAuth, no Google Cloud project. `embeddedfolderview` returns
 * the complete listing of a link-shared folder to an anonymous request —
 * verified against SZN 3 (463) and SZN 4 (869), both matching the Drive API's
 * own counts exactly, and SZN 2 at 1,038, which rules out a 1,000-item cap.
 *
 * That endpoint carries no image dimensions, so each frame's width and height
 * are read from the first 4 KB of its own w400 thumbnail — enough to reach a
 * PNG's IHDR or a JPEG's SOF marker on every one of the 3,140 files. It costs
 * one small ranged request per photograph, once, at build time, and it is real
 * per-photo data rather than an assumed 3:2, which 589 of these frames are not.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/albums");

/* id → Drive folder. The id is the same key content.js carries as `albumId`
   and the same one album.html reads from its query string.

   Deliberately absent: SZN 5 and Turf Wars have no photo folder in Drive at
   all. SZN 5's album is ThePapare's, imported by scripts/papare-import.mjs;
   Turf Wars keeps the "Photos are on the way." line rather than linking at an
   empty page. Also absent: `4x4 Photos` (1HGXOPq8HVLiX7bg1WXkzT7IJwdeIrpJs,
   88 files), pending the owner confirming which card it belongs to, and
   `Frontier Watch Along @ Main - Man City vs Arsenal`
   (1PCXYIZOqqoCEZtUHtnjvnIH_b3aYx6Tv), which holds only voice notes and
   videos, no photographs (audited 2026-09-23). Adding a line here is all a
   folder needs once its mapping is settled. */
const ALBUMS = {
  "szn-1": "18fxPlbuFWK1KWtKPedgNnm3DbIxw4VKW",
  "szn-2": "1G5VcXwTNeIMI_K7eSrRf0ndZalg_8S66",
  "szn-3": "1n3WeRh87N8bBVia1gQJ5pafeCrXkc9Bn",
  "szn-4": "1aqiStgYq6IRnL-Ev2GdEDWDu4HgzrpZu",
  "szn-6": "1CstLyLWgy79Yqp0d-NQ3Rnux1-MAbxeR",
  "division-0": "1fkDf7Igl7RtVIKxxxeuGikZqo6Eg7se1",
  // Watch parties. Asked for by the owner on 2026-09-10: these open on the
  // site like every other card rather than sending a visitor out to Drive.
  "wa-final-esp-arg": "1hOfEz1uHcPT0fx8Ca4Dv86bhcj7WMMsU",
  "wa-semi-eng-arg": "1MFdyJn1AwLtSq_Flkg8PB_EqFX1a15CV",
  "wa-semi-esp-fra": "15y_x5dnOdsGQvmjPm0JaIqeLpoGWB5BM",
  "wa-norway-england": "1CZXXR7ZNFmPaOFudf8wDXNlPFlaKnxlh",
  "wa-ucl-final-night": "1LI43OOBwg14x5l5h-E3OTw5f2z-kGyXe",
};

const CONCURRENCY = 24;
const HEADER_BYTES = 4096;
const IMAGE = /\.(jpe?g|png|webp|gif|heic)$/i;

/* Width and height out of an image header. Both formats are needed: Drive
   transcodes a thumbnail into the source file's own format, and this archive is
   mixed — SZN 1 was exported as PNG and every other album as JPEG. A
   JPEG-only reader silently measured nothing for all 502 SZN 1 frames, which
   looked exactly like a permissions failure and was not one.

   Returns null rather than guessing when the header is truncated or the format
   is neither: one frame without dimensions falls back to a 3:2 slot in the
   browser, while one frame with invented dimensions is a permanently misshapen
   tile that nothing will ever correct. */
export function imageSize(b) {
  // PNG: 8-byte signature, then IHDR's length and type, then width and height
  // at a fixed offset. Always within the first 24 bytes.
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  // JPEG: walk the marker chain to the SOF segment rather than scanning for the
  // bytes, because the 0xFFC0 pattern occurs inside EXIF and ICC payloads too
  // and a scan finds those first.
  let o = 2;
  while (o + 9 < b.length) {
    if (b[o] !== 0xff) { o++; continue; }
    const marker = b[o + 1];
    // SOF0..SOF15, minus DHT (c4), JPG (c8) and DAC (cc), which share the range
    // but are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { w: b.readUInt16BE(o + 7), h: b.readUInt16BE(o + 5) };
    }
    o += 2 + b.readUInt16BE(o + 2);
  }
  return null;
}

/* Split on the id attribute rather than matching ids and titles in two passes
   and zipping the results: splitting bounds each chunk at the next entry, so a
   file whose title is missing yields an empty name instead of silently
   borrowing the next file's name and shifting every pair after it by one. */
export function parseFolder(html) {
  return html
    .split('id="entry-')
    .slice(1)
    .map((chunk) => {
      const title = /flip-entry-title">([^<]*)</.exec(chunk);
      return { id: chunk.slice(0, chunk.indexOf('"')), name: title ? title[1] : "" };
    });
}

async function listFolder(folderId) {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${folderId}#list`);
  if (!res.ok) throw new Error(`folder ${folderId}: HTTP ${res.status}`);
  const html = await res.text();
  const entries = parseFolder(html);
  // An empty listing from a 200 means the folder is not shared to anyone with
  // the link. Loud here rather than an album page of broken tiles later, which
  // is what that failure looks like in the browser: Drive answers an unshared
  // thumbnail with an HTML error page served under an image URL.
  if (entries.length === 0) throw new Error(`folder ${folderId}: 200 but no entries — not link-shared?`);
  return entries;
}

async function measure(id) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://drive.google.com/thumbnail?id=${id}&sz=w400`, {
        headers: { Range: `bytes=0-${HEADER_BYTES - 1}` },
      });
      if (!res.ok) continue;
      const size = imageSize(Buffer.from(await res.arrayBuffer()));
      if (size) return size;
    } catch { /* retried once, then the frame ships without dimensions */ }
  }
  return null;
}

/* A fixed pool of workers pulling from one cursor, rather than chunking the
   list into batches of 24: a batch runs only as fast as its slowest member, so
   3,400 files in batches spend most of the run waiting on stragglers. */
async function mapPool(items, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        results[i] = await worker(items[i]);
      }
    }),
  );
  return results;
}

async function syncAlbum(id, folderId) {
  const entries = (await listFolder(folderId)).filter((e) => IMAGE.test(e.name));
  const sizes = await mapPool(entries, (e) => measure(e.id));
  const items = entries.map((e, i) => ({ i: e.id, ...(sizes[i] ?? {}) }));
  const missing = sizes.filter((s) => !s).length;
  await writeFile(resolve(OUT, `${id}.json`), JSON.stringify({ id, items }));
  return { id, folderId, count: items.length, missing };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const albums = [];
  // `npm run albums:sync -- szn-1` re-syncs one album; no argument does all of
  // them. index.json is only rewritten on a full run, so a targeted re-sync
  // cannot leave the index describing albums it did not just measure.
  const only = process.argv.slice(2);
  const wanted = Object.entries(ALBUMS).filter(([id]) => only.length === 0 || only.includes(id));
  if (wanted.length === 0) throw new Error(`no album matches ${only.join(", ")}`);
  for (const [id, folderId] of wanted) {
    process.stdout.write(`${id} ... `);
    const r = await syncAlbum(id, folderId);
    albums.push({ id: r.id, folderId: r.folderId, count: r.count });
    console.log(`${r.count} photos${r.missing ? `, ${r.missing} without dimensions` : ""}`);
  }
  if (only.length > 0) {
    console.log("\nTargeted re-sync; index.json left alone.");
    return;
  }
  await writeFile(
    resolve(OUT, "index.json"),
    JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), albums }, null, 2) + "\n",
  );
  console.log(`\n${albums.reduce((n, a) => n + a.count, 0)} photos across ${albums.length} albums.`);
}

// Importable for the tests without running the sync.
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
