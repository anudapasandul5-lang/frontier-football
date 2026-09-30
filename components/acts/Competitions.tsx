import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { thumbUrl } from "@/lib/album-data";
import { competitionPhotos, type DrivePhoto } from "@/lib/home-photos";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { phoneSrcSet } from "@/lib/phone-image";

/* Act 5, one row per competition in time order: blue Frontier Football
   Tournament, green 4 x 4 Series, red Division 0.

   History, all owner calls: a pinned sideways slider (rejected twice,
   2026-09-24), three solid colour cards (2026-09-24), a poster wall (rejected
   built, 2026-09-28), then the sticky "deck" (replaced 2026-09-30). Now the
   split-screen broadcast, picked from a static mock: a colour panel and a
   photo side by side, alternating sides, a score-bug tag on the panel. The
   mock's stat strip was cut by the owner, so a row is tag + name + photo.
   Plain server markup, no motion runtime. No section heading (owner), only
   the micro-label. A competition deleted from content.js leaves the act. */
type Tone = "blue" | "green" | "red";
type Shot = { src: string; alt: string; credit?: string };
type Row = { tone: Tone; name: string; line: string; photo: Shot | null };

// Literal class names, so Tailwind emits them and the --color-* they read.
const fill: Record<Tone, string> = { blue: "bg-blue", green: "bg-green", red: "bg-red" };

const drive = (p: DrivePhoto | undefined): Shot | null => (p ? { src: thumbUrl(p.id, 1600), alt: p.alt } : null);
const landscape = (ps: DrivePhoto[]) => ps.find((p) => p.w >= p.h) ?? ps[0];

export function Competitions() {
  const data = parseContent(raw);
  const competition = (name: string) => data.competitions.find((c) => c.name === name);
  const divisionZero = competition("Division 0");
  const tournament = competition("Frontier Football Tournament");
  const pad = (n: number) => String(n).padStart(2, "0");

  const rows: Row[] = [];
  // Owner-approved 2026-09-23 (HOUSE-RULES section 7, content.js): this
  // ThePapare frame carries its own watermark, so its credit shows on the row.
  if (tournament?.photo)
    rows.push({
      tone: "blue",
      name: tournament.name!,
      line: "Where it began",
      photo: { src: tournament.photo, alt: tournament.photoAlt ?? "", credit: tournament.photoCredit ?? undefined },
    });
  rows.push({
    tone: "green",
    name: "4 x 4 Series",
    line: "Six seasons. One venue.",
    photo: drive(landscape(competitionPhotos["4 x 4 Series"].frames)),
  });
  if (divisionZero)
    rows.push({
      tone: "red",
      name: "Division 0",
      line: "Played on PS5.",
      photo: drive(landscape(competitionPhotos["Division 0"].frames)),
    });

  return (
    <section id="competitions" data-tone="ink" data-chapter="Events" aria-labelledby="competitions-label" className="canvas-bone py-[clamp(4rem,14vh,9rem)]">
      <div className="frame">
        <MicroLabel as="h2" id="competitions-label" className="text-(--tone-muted) text-[clamp(0.875rem,0.7rem+0.6vw,1.25rem)]">
          Competitions
        </MicroLabel>
        <ul className="mt-10">
          {rows.map((r, i) => (
            <li key={r.tone} className="grid min-h-[min(72svh,560px)] grid-cols-1 md:grid-cols-2">
              <div className={`${fill[r.tone]} flex flex-col justify-between gap-12 p-[clamp(1.25rem,3.5vw,3rem)] text-ink ${i % 2 ? "md:order-2" : ""}`}>
                <p className="font-display inline-flex self-start bg-ink text-[0.8rem] leading-none font-bold tracking-[0.16em] text-bone uppercase">
                  <b className="bg-bone px-3 py-2 text-ink">{pad(i + 1)}</b>
                  <span className="px-3 py-2">{r.line}</span>
                </p>
                <h3 className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.86] font-bold text-balance uppercase [overflow-wrap:anywhere]">{r.name}</h3>
              </div>
              <figure className="relative aspect-[4/3] overflow-hidden bg-ink md:aspect-auto">
                {r.photo ? (
                  <img
                    src={r.photo.src}
                    srcSet={phoneSrcSet(r.photo.src)}
                    sizes="(min-width: 1140px) 553px, (min-width: 768px) 50vw, 100vw"
                    alt={r.photo.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 h-full w-full object-cover ${r.photo.credit ? "object-right" : ""}`}
                  />
                ) : null}
                {r.photo?.credit ? (
                  <figcaption className="absolute top-0 right-0 z-10 bg-ink px-3 py-1.5 text-xs text-bone">Photo: {r.photo.credit}</figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
