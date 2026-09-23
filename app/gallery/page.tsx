import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import raw from "@/content.js";
import { parseContent, seasonName } from "@/lib/content-data";
import { Tabs } from "@/components/motion/Tabs";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { BandedReveal } from "@/components/primitives/BandedReveal";

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
function Card({ entry, groupLabel, wide = false }: { entry: Entry; groupLabel?: string; wide?: boolean }) {
  const href = entry.albumId ? `/albums/${encodeURIComponent(entry.albumId)}` : entry.driveFolder;
  const body = (
    <>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink">
          {entry.photo ? (
            entry.albumId ? (
              <ViewTransition name={`album-cover-${entry.albumId}`} share="album-cover" default="none">
                <BandedReveal src={entry.photo} alt={entry.photoAlt ?? `${entry.title}.`} width={800} height={450} bands={4} className="gallery-cover absolute inset-0 size-full [&>img]:h-full" imgClassName={entry.photo.startsWith("/albums/") ? "object-contain" : "object-cover object-[center_25%]"} />
              </ViewTransition>
            ) : (
              <BandedReveal src={entry.photo} alt={entry.photoAlt ?? `${entry.title}.`} width={800} height={450} bands={4} className="gallery-cover absolute inset-0 size-full [&>img]:h-full" imgClassName={entry.photo.startsWith("/albums/") ? "object-contain" : "object-cover object-[center_25%]"} />
            )
          ) : (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center px-8 text-center font-display text-[clamp(2.5rem,4vw,4rem)] leading-none font-bold uppercase text-bone/45">
              {entry.title}
            </span>
          )}
        </div>
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
    </>
  );

  return (
    <li className="flex">
      {entry.albumId ? (
        <Link href={href!} className={`group canvas-ink flex w-full flex-col overflow-hidden border border-bone/25 ${wide ? "min-[700px]:grid min-[700px]:grid-cols-2" : ""}`}>{body}</Link>
      ) : href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`group canvas-ink flex w-full flex-col overflow-hidden border border-bone/25 ${wide ? "min-[700px]:grid min-[700px]:grid-cols-2" : ""}`}>{body}</a>
      ) : (
        <div className={`group canvas-ink flex w-full flex-col overflow-hidden border border-bone/25 ${wide ? "min-[700px]:grid min-[700px]:grid-cols-2" : ""}`}>{body}</div>
      )}
    </li>
  );
}

function Grid({ entries, groupLabel }: { entries: Entry[]; groupLabel?: string }) {
  return (
    <ul className={`frame grid gap-4 ${entries.length > 1 ? "min-[620px]:grid-cols-2 min-[1000px]:grid-cols-3" : ""}`}>
      {entries.map((entry) => (
        <Card key={entry.title} entry={entry} groupLabel={groupLabel} wide={entries.length === 1} />
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
  // Reserve the series and Watch Parties ids, so a competition named either
  // cannot take them first.
  const used = new Set(["series", "watch-parties"]);
  const competitionTabs = data.competitions.map((c, i) => {
    // "Division 0" and "Division-0" both appear in content.js history and slug
    // the same; de-duplicate so no two tabs share an id.
    let id = c.name!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!id || used.has(id)) id = `competition-${i}`;
    used.add(id);
    return { first: c.beforeSeries, id, label: c.name!, panel: <Grid entries={[{ title: c.name!, number: "01", champion: c.champion, ...pick(c) }]} /> };
  });
  // Competitions that ran before the series (Frontier Futsal Tournament, Turf
  // Wars) lead, then the series, then the rest, each in content.js order.
  groups.push(...competitionTabs.filter((t) => t.first));
  if (seasons.length > 0) groups.push({ id: "series", label: "4x4 Series", panel: <Grid entries={seasons} groupLabel="4x4 Series" /> });
  groups.push(...competitionTabs.filter((t) => !t.first));
  if (watch.length > 0) groups.push({ id: "watch-parties", label: "Watch Parties", panel: <Grid entries={watch} groupLabel="Watch Parties" /> });

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Gallery"
          eyebrow="Our stories"
          lines={["The", "gallery."]}
          photo={{ src: "/heroes/gallery.webp", alt: "Supporters with their arms up in front of the big screen at a Frontier watch-along", position: "center 30%" }}
        >
          Every photograph and clip Frontier has shared, pulled into one gallery.
        </PageHero>
      }
    >
      <section data-tone="bone" data-chapter="Albums" aria-label="Albums" className="canvas-ink pt-[clamp(3rem,10vh,6rem)] pb-12 sm:pb-20">
        {groups.length === 1 ? groups[0].panel : groups.length > 1 ? <Tabs label="Gallery sections" groups={groups} theme="night" /> : null}
      </section>
      <NextPage current="/gallery" />
    </PageShell>
  );
}
