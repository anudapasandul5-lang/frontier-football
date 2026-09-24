import fs from "node:fs";
import path from "node:path";
import type { AlbumFacts } from "./gallery-story";

/* Build time only: how many photographs each album holds and whether they are
   someone else's watermarked frames, read from the manifests `albums:sync` and
   `albums:papare` write. A missing or unreadable manifest counts as empty, so
   its album drops out of the gallery instead of showing a dead band. */
export function albumFacts(ids: string[]): AlbumFacts {
  const facts: AlbumFacts = {};
  for (const id of ids) {
    try {
      const m = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "albums", `${id}.json`), "utf8"));
      facts[id] = { count: Array.isArray(m.items) ? m.items.length : 0, watermarked: m.watermarked === true };
    } catch {
      facts[id] = { count: 0 };
    }
  }
  return facts;
}
