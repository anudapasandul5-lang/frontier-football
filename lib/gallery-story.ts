/* The gallery as one story (owner, 2026-09-24: "story scroll"). Albums are
   grouped into chapters in the order things happened, without printing a
   single date: almost every date is still TODO, and a year on the page would
   suggest Frontier started whenever the first dated album happened.

   Pure: the page reads photo counts and watermark flags from public/albums/
   at build time and passes them in as `facts`. */

import { parseContent, type Raw } from "./content-data";

export type AlbumFacts = Record<string, { count: number; watermarked?: boolean }>;

export type StoryAlbum = {
  id: string;
  title: string;
  short: string | null; // "SZN 03" for a season, the name does the work otherwise
  count: number;
  champion: string | null;
  venue: string | null;
  note: string | null;
  photo: string | null;
  photoAlt: string | null;
  /* "photo": the band is the photograph. "type": the band is the name on
     colour, because the only photo is watermarked (ThePapare) or missing. */
  treatment: "photo" | "type";
  /* The picture on a "type" card: content.js's `photo`. That can be a
     ThePapare frame (under /albums/) with its watermark left in, when the
     owner has picked one for that album (owner, 2026-09-24). It never leads
     as a cover and never morphs; it only fills the card. */
  inset: string | null;
  /* A competition whose photos are not on the site yet (Turf Wars, owner
     2026-10-07): a card with its picture and no link, until its album syncs. */
  pending: boolean;
};

export type Chapter = { id: string; label: string; kind: "tournament" | "series" | "watch" | "feature"; albums: StoryAlbum[] };

type Entry = {
  albumId: string | null;
  champion?: string | null;
  venue: string | null;
  note: string | null;
  photo: string | null;
  photoAlt: string | null;
};

function album(entry: Entry, title: string, short: string | null, facts: AlbumFacts): StoryAlbum | null {
  const id = entry.albumId;
  const fact = id ? facts[id] : undefined;
  if (!id || !fact || !(fact.count > 0)) return null;
  const clean = entry.photo && !entry.photo.startsWith("/albums/") ? entry.photo : null;
  const treatment = fact.watermarked || !clean ? "type" : "photo";
  return {
    id,
    title,
    short,
    count: fact.count,
    champion: entry.champion ?? null,
    venue: entry.venue,
    note: entry.note,
    photo: clean,
    photoAlt: entry.photoAlt,
    treatment,
    inset: treatment === "type" ? entry.photo : null,
    pending: false,
  };
}

function pendingAlbum(entry: Entry, title: string): StoryAlbum | null {
  if (!entry.photo) return null;
  return {
    id: `pending-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title,
    short: null,
    count: 0,
    champion: entry.champion ?? null,
    venue: entry.venue,
    note: entry.note,
    photo: null,
    photoAlt: entry.photoAlt,
    treatment: "type",
    inset: entry.photo,
    pending: true,
  };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function galleryChapters(raw: Raw, facts: AlbumFacts): Chapter[] {
  const data = parseContent(raw);
  const keep = (a: StoryAlbum | null): a is StoryAlbum => a !== null;
  const competition = (c: (typeof data.competitions)[number]) => album(c, c.name!, null, facts) ?? (c.albumId ? null : pendingAlbum(c, c.name!));

  const chapters: Chapter[] = [
    { id: "origins", label: "Where it started", kind: "tournament", albums: data.competitions.filter((c) => c.beforeSeries).map(competition).filter(keep) },
    {
      id: "series",
      label: "4 x 4 Series",
      kind: "series",
      albums: [...data.seasons]
        .sort((a, b) => Number(a.season) - Number(b.season))
        .map((s) => album(s, `SZN ${s.season}`, `SZN ${String(s.season).padStart(2, "0")}`, facts))
        .filter(keep),
    },
    { id: "watch-parties", label: "Watch parties", kind: "watch", albums: data.watchAlongs.filter((w) => w.name).map((w) => album(w, w.name!, null, facts)).filter(keep) },
    ...data.competitions
      .filter((c) => !c.beforeSeries)
      .map((c): Chapter => ({ id: slug(c.name!) || "competition", label: c.name!, kind: "feature", albums: [competition(c)].filter(keep) })),
  ];
  return chapters.filter((c) => c.albums.length > 0);
}

export function nextAlbum(chapters: Chapter[], id: string): StoryAlbum | null {
  const all = chapters.flatMap((c) => c.albums).filter((a) => !a.pending);
  const i = all.findIndex((a) => a.id === id);
  return i < 0 ? null : all[(i + 1) % all.length];
}
