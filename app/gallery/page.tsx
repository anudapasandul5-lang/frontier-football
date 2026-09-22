import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import raw from "@/content.js";
import { parseContent, seasonName } from "@/lib/content-data";
import { Tabs } from "@/components/motion/Tabs";
import { PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Gallery" };

type Entry = {
  title: string;
  number: string;
  champion?: string | null; // absent on a watch party: it has no champion at all
  note: string | null;
  photo: string | null;
  photoAlt: string | null;
  driveFolder: string | null;
  albumId: string | null;
};

/* The poster card (owner picked "Season Posters", 2026-09-15). v1 laid its text
   over a gradient scrim; v2 has no gradients, so the photo sits above a solid
   ink panel carrying the number and title. An album opens on this site; a card
   with no album links out to Drive; neither shows "Photos are on the way". The
   whole card is the link, and its visible text is its accessible name. */
function Card({ entry, groupLabel }: { entry: Entry; groupLabel?: string }) {
  const href = entry.albumId ? `/album?album=${encodeURIComponent(entry.albumId)}` : entry.driveFolder;
  // L0 SPIKE: on-site albums are client-side <Link>s so the card photo can
  // morph into the album hero (React <ViewTransition>, shared name).
  const Tag = entry.albumId ? Link : href ? "a" : "div";
  const external = href && !entry.albumId ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <li className="flex">
      <Tag
        {...((href ? { href } : {}) as { href: string })}
        {...external}
        className="group canvas-ink flex w-full flex-col overflow-hidden"
      >
        <ViewTransition name={entry.albumId ? `album-${entry.albumId}` : undefined} share="morph" default="none">
        <div className="relative aspect-[16/10] overflow-hidden bg-ink">
          {entry.photo ? (
            <img
              src={entry.photo}
              alt={entry.photoAlt ?? `${entry.title}.`}
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-[center_25%] transition-transform duration-250 ease-[var(--ease-out)] group-hover:scale-[1.045]"
            />
          ) : null}
        </div>
        </ViewTransition>
        <div className="flex flex-1 flex-col gap-2 p-5">
          {groupLabel ? <p className="micro border-b border-bone/30 pb-2">{groupLabel}</p> : null}
          <p aria-hidden="true" className="mt-2 font-display text-[clamp(3.5rem,7vw,5.75rem)] leading-none font-bold">
            {entry.number}
          </p>
          <p className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] uppercase [text-wrap:balance]">
            {entry.title}
          </p>
          {"champion" in entry ? (
            <p className={`text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-tight ${entry.champion ? "font-bold" : "text-muted"}`}>
              {entry.champion ?? "Not recorded yet"}
            </p>
          ) : null}
          {entry.note ? <p className="text-[12px] text-muted">{entry.note}</p> : null}
          <p className="micro mt-auto pt-4 text-right">{href ? "View photos" : <i>Photos are on the way.</i>}</p>
        </div>
      </Tag>
    </li>
  );
}

function Grid({ entries, groupLabel }: { entries: Entry[]; groupLabel?: string }) {
  return (
    <ul className="frame grid gap-4 min-[620px]:grid-cols-2 min-[1000px]:grid-cols-3">
      {entries.map((entry) => (
        <Card key={entry.title} entry={entry} groupLabel={groupLabel} />
      ))}
    </ul>
  );
}

/* One tab per competition (owner, 2026-09-08), plus Watch Parties: nights
   Frontier watched football rather than ran it. Seasons open on SZN 1. */
export default function Gallery() {
  const data = parseContent(raw);
  const pick = ({ note, photo, photoAlt, driveFolder, albumId }: Omit<Entry, "title" | "number">) => ({
    note,
    photo,
    photoAlt,
    driveFolder,
    albumId,
  });

  const seasons: Entry[] = [...data.seasons]
    .sort((a, b) => a.season - b.season)
    .map((s) => ({ title: seasonName(s.season), number: String(s.season).padStart(2, "0"), champion: s.champion, ...pick(s) }));
  const watch: Entry[] = data.watchAlongs.filter((w) => w.name).map((w, i) => ({ title: w.name!, number: String(i + 1).padStart(2, "0"), ...pick(w) }));

  const groups: { id: string; label: string; panel: React.ReactNode }[] = [];
  if (seasons.length > 0) groups.push({ id: "series", label: "4x4 Series", panel: <Grid entries={seasons} groupLabel="4x4 Series" /> });
  // Reserve Watch Parties' id too, so a competition named "Watch Parties"
  // cannot take it first.
  const used = new Set([...groups.map((g) => g.id), "watch-parties"]);
  data.competitions.forEach((c, i) => {
    if (!c.name) return; // a card with no name has nothing to say
    // "Division 0" and "Division-0" both appear in content.js history and slug
    // the same; de-duplicate so no two tabs share an id.
    let id = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!id || used.has(id)) id = `competition-${i}`;
    used.add(id);
    groups.push({ id, label: c.name, panel: <Grid entries={[{ title: c.name, number: "01", champion: c.champion, ...pick(c) }]} /> });
  });
  if (watch.length > 0) groups.push({ id: "watch-parties", label: "Watch Parties", panel: <Grid entries={watch} groupLabel="Watch Parties" /> });

  return (
    <PageShell>
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20">
        <div className="frame pb-8 sm:pb-12 min-[900px]:flex min-[900px]:items-end min-[900px]:justify-between min-[900px]:gap-10">
          <div>
            <p className="micro mb-4">Our stories</p>
            <h1 className="font-display text-[clamp(3rem,9vw,8.75rem)] leading-[0.88] font-bold uppercase">Gallery</h1>
          </div>
          <p className="mt-4 max-w-[46ch] text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.35] min-[900px]:mt-0 min-[900px]:text-right">
            Every photograph and clip Frontier has shared, pulled into one gallery.
          </p>
        </div>
        {groups.length === 1 ? groups[0].panel : groups.length > 1 ? <Tabs label="Gallery sections" groups={groups} /> : null}
      </section>
    </PageShell>
  );
}
