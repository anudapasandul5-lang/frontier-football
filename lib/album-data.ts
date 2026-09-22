/* The album page's logic: which album was asked for, where each photograph's
   pixels come from, and what a screen reader is told about a tile.

   Pure: no DOM, no browser globals, so the whole thing is testable in the node
   environment without pulling in jsdom as a third dependency — the same split
   src/gallery.js and src/gallery-data.js already use. The DOM lives in
   src/album-page.js. */

import { seasonName, type Raw } from "./content-data";

/* Drive stores the photographs, the site presents them (docs/HOUSE-RULES.md).
   For a Drive album, public/albums/<id>.json is a list of Drive file ids and
   the shape of each frame. The one exception is a ThePapare import, whose
   WebP files are committed under public/albums/<id>/ (albumItems below). Both sizes were probed against real files and both
   return image bytes, with Drive doing the downscaling from the ~38 MB
   originals. Not always JPEG: Drive answers in the source file's own format, and
   SZN 1 is a PNG album. */
const GRID_WIDTH = 400;
const LIGHTBOX_WIDTH = 1600;

/* The same 3:2 slot src/gallery-data.js falls back to, and for the same reason:
   it holds the tile's space so the grid does not reflow as pictures arrive.
   Reached only by a frame whose thumbnail header could not be read during the
   sync, which is currently none of the 3,140. It is a last resort rather than
   something the grid leans on: 589 of these frames are portrait, so a 3:2 slot
   is the wrong shape for nearly a fifth of the archive. */
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

export function thumbUrl(id: string, width = GRID_WIDTH) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${width}`;
}

/* Read from the query string rather than from the path, so the page needs no
   server rewrite rule and works the same on `vite dev`, on `vite preview` and
   on a static host.

   Anything that is not a plain slug returns null and the page says the album
   was not found. The id is interpolated into a fetch path, so a value like
   "../../secret" must never reach it; a whitelist of characters is the check
   that cannot be got round, rather than stripping the sequences known today. */
export function albumIdFromQuery(search: string | null | undefined) {
  const raw = new URLSearchParams(search ?? "").get("album");
  if (!raw || !/^[a-z0-9-]+$/.test(raw)) return null;
  return raw;
}

export function manifestUrl(id: string) {
  return `/albums/${id}.json`;
}

function dimensions(item: Raw) {
  const w = Number(item.w);
  const h = Number(item.h);
  if (w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
  return { width: FALLBACK_WIDTH, height: FALLBACK_HEIGHT };
}

/* An item with no id is dropped rather than rendered: its <img> would request
   the page itself and draw a broken-image icon in the middle of the grid, the
   same guard galleryItems() applies to content.js's "TODO".

   Two sources share one shape. A Drive item is `i` (a file id) and its pixels
   are Drive thumbnails. A self-hosted item, written by
   scripts/papare-import.mjs, is `s` (full WebP) and `t` (400px WebP), both
   under /albums/; anything else in those fields is refused, because they end
   up in an <img src>. */
const LOCAL = /^\/albums\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/;

function source(item: Raw) {
  if (typeof item?.i === "string" && item.i !== "") {
    return { id: item.i as string, thumb: thumbUrl(item.i), full: thumbUrl(item.i, LIGHTBOX_WIDTH) };
  }
  if (typeof item?.s === "string" && typeof item?.t === "string" && LOCAL.test(item.s) && LOCAL.test(item.t)) {
    return { id: item.s as string, thumb: item.t as string, full: item.s as string };
  }
  return null;
}

export function albumItems(manifest: Raw) {
  return ((manifest ?? {}).items ?? []).flatMap((item: Raw) => {
    const src = source(item);
    return src ? [{ id: src.id, ...dimensions(item), thumb: src.thumb, full: src.full }] : [];
  });
}

/* Who took the photographs and where the full set lives, for an album that is
   not Frontier's own (a ThePapare import). `watermarked` is carried so nothing
   ever picks one of these frames as a hero or a full-bleed image. */
export function albumCredit(manifest: Raw) {
  const m = manifest ?? {};
  return {
    credit: typeof m.credit === "string" && m.credit ? (m.credit as string) : null,
    source: typeof m.source === "string" && m.source.startsWith("https://") ? (m.source as string) : null,
    watermarked: m.watermarked === true,
  };
}

/* These photographs have no captions and never will — there are over three
   thousand of them. An empty alt is wrong, because they are the content of the
   page rather than decoration, and one invented sentence repeated 869 times is
   worse than nothing to anyone listening to it. Each tile is a button that
   opens the lightbox, so it is labelled by what it does and where it sits,
   which is true, useful for navigating, and claims nothing about what is in the
   frame. */
export function tileLabel(index: number, total: number, title?: string | null) {
  const where = title ? `, ${title}` : "";
  // Grouped the same way the page's own "1,038 photographs." is. Announcing
  // "of 1038" under a heading that reads 1,038 is one number written two ways.
  return `Photo ${(index + 1).toLocaleString("en")} of ${total.toLocaleString("en")}${where}`;
}

/* The shape src/lightbox.js takes. It is handed the list per call precisely so
   a surface can pass its own, so the album page passes this rather than the
   coverflow's. isClip is always false: Drive's thumbnail endpoint serves a
   still for a video, so a clip could only ever be a frozen frame here, and the
   two mp4s in the archive are deliberately out of these albums. */
export type AlbumItem = {
  id: string;
  width: number;
  height: number;
  thumb: string;
  full: string;
};

export function lightboxItems(items: AlbumItem[], title?: string | null) {
  return items.map((item) => ({
    src: item.full,
    // The album's name alone, not tileLabel's "Photo 3 of 869". The lightbox
    // announces the position itself and appends this after it, so passing the
    // position here has it read out twice: "3 of 869. Photo 3 of 869, SZN 4".
    // Still not a description of the frame, because nothing here knows one.
    alt: title ?? "",
    isClip: false,
    width: item.width,
    height: item.height,
  }));
}

/* The card's own words for this album, looked up rather than derived from the
   id: a season renamed in content.js must not silently start showing a title
   that no longer matches the card the reader clicked. Seasons are titled by
   number the same way gallery-page.js titles them; everything else carries its
   own name. Null when nothing claims the id, which is what makes an unknown
   ?album= read as "not found" rather than as an untitled empty album. */
export function albumTitle(data: Raw, id: string | null) {
  if (!id) return null;
  const season = ((data ?? {}).seasons ?? []).find((s: Raw) => s.albumId === id);
  if (season) return seasonName(season.season);
  const other = [...((data ?? {}).competitions ?? []), ...((data ?? {}).watchAlongs ?? [])].find(
    (e: Raw) => e.albumId === id,
  );
  return other?.name ?? null;
}
