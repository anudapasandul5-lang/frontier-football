import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { thumbUrl } from "@/lib/album-data";
import { competitionPhotos, type DrivePhoto } from "@/lib/home-photos";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { phoneSrcSet } from "@/lib/phone-image";
import { SplitReveal } from "@/components/primitives/SplitReveal";

/* Act 5, one row per competition in time order: blue Ground Zero, teal Turf
   Wars, green 4 x 4 Series, red Division 0.

   History, all owner calls: a pinned sideways slider (rejected twice,
   2026-09-24), three solid colour cards (2026-09-24), a poster wall (rejected
   built, 2026-09-28), then the sticky "deck" (replaced 2026-09-30). Now the
   index, picked from a static mock (2026-09-30, after the split-screen was
   tried and dropped as generic): huge names in a list beside one photo stage.
   Hover or focus a row and it fills with its colour and the stage swaps to
   its photo. Below md each row carries its own photo. Row number dropped
   (numbered tags read as template).
   Plain server markup, CSS-only swap. No section heading (owner), only
   the micro-label. A competition deleted from content.js leaves the act. */
type Tone = "blue" | "teal" | "green" | "red" | "yellow";
type Shot = { src: string; alt: string; credit?: string };
type Row = { tone: Tone; name: string; line: string; photo: Shot | null };

// Literal class names, so Tailwind emits them and the --color-* they read.
const hoverFill: Record<Tone, string> = {
  blue: "hover:bg-blue focus-visible:bg-blue",
  // Teal is dark, so its row's name turns bone while filled.
  teal: "hover:bg-teal hover:text-bone focus-visible:bg-teal focus-visible:text-bone",
  green: "hover:bg-green focus-visible:bg-green",
  red: "hover:bg-red focus-visible:bg-red",
  yellow: "hover:bg-yellow focus-visible:bg-yellow",
};

const drive = (p: DrivePhoto | undefined): Shot | null => (p ? { src: thumbUrl(p.id, 1600), alt: p.alt } : null);
const landscape = (ps: DrivePhoto[]) => ps.find((p) => p.w >= p.h) ?? ps[0];

export function Competitions() {
  const data = parseContent(raw);
  const competition = (name: string) => data.competitions.find((c) => c.name === name);
  const divisionZero = competition("Division 0");
  const tournament = competition("Ground Zero");
  const turfWars = competition("Turf Wars");

  const rows: Row[] = [];
  // Owner-approved 2026-09-23 (HOUSE-RULES section 7, content.js): this
  // ThePapare frame carries its own watermark, so its credit shows on the row.
  if (tournament?.photo)
    rows.push({
      tone: "blue",
      name: tournament.name!,
      line: "Where it all began.",
      photo: { src: tournament.photo, alt: tournament.photoAlt ?? "", credit: tournament.photoCredit ?? undefined },
    });
  if (turfWars?.photo)
    rows.push({
      tone: "teal",
      name: turfWars.name!,
      line: "On turf, at Club Fusion.",
      photo: { src: turfWars.photo, alt: turfWars.photoAlt ?? "" },
    });
  rows.push({
    tone: "green",
    name: "4 x 4 Series",
    line: "Six seasons. One venue. A new standard.",
    photo: drive(landscape(competitionPhotos["4 x 4 Series"].frames)),
  });
  if (divisionZero)
    rows.push({
      tone: "red",
      name: "Division 0",
      line: "Played on the virtual pitch.",
      photo: drive(landscape(competitionPhotos["Division 0"].frames)),
    });

  const party = data.watchAlongs.find((event) => event.photo?.startsWith("/champions/wa-"));
  if (party)
    rows.push({
      tone: "yellow",
      name: "Watch Parties",
      line: "The big games, watched together.",
      photo: { src: party.photo!, alt: party.photoAlt ?? "" },
    });

  const shot = (r: Row, sizes: string, className: string) =>
    r.photo ? (
      <img
        src={r.photo.src}
        srcSet={phoneSrcSet(r.photo.src)}
        sizes={sizes}
        alt={r.photo.alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${className} ${r.photo.credit ? "object-right" : ""}`}
      />
    ) : null;
  const credit = (r: Row) =>
    r.photo?.credit ? <figcaption className="absolute top-0 right-0 z-10 bg-ink px-3 py-1.5 text-xs text-bone">Photo: {r.photo.credit}</figcaption> : null;

  return (
    <section id="competitions" data-tone="ink" data-chapter="Events" aria-labelledby="competitions-label" className="canvas-bone py-[clamp(4rem,14vh,9rem)]">
      <div className="frame">
        <MicroLabel as="h2" id="competitions-label" className="text-(--tone-muted) text-[clamp(0.875rem,0.7rem+0.6vw,1.25rem)]">
          Events
        </MicroLabel>
        {/* Index: the names are the interface. On a pointer screen, hovering
            (or tabbing to) a row fills it with its colour and swaps the photo
            on the stage (CSS only, .comp in globals.css). Below md each row
            carries its own photo and the stage is not rendered. */}
        <div data-comp className="comp mt-10 grid border-t-2 border-ink md:min-h-[560px] md:grid-cols-[1.1fr_1fr]">
          <ul className="flex flex-col">
            {rows.map((r, i) => (
              <li
                key={r.tone}
                data-i={i}
                tabIndex={0}
                className={`comp__item flex flex-col justify-center gap-4 border-b-2 border-ink py-6 outline-none transition-colors duration-200 md:flex-1 md:py-4 md:pr-6 ${hoverFill[r.tone]}`}
              >
                <div className="comp__name flex flex-col gap-3">
                  <p className="font-display self-start bg-ink px-3 py-2 text-[0.8rem] leading-none font-bold tracking-[0.16em] text-bone uppercase md:hidden">{r.line}</p>
                  <SplitReveal
                    as="h3"
                    lines={[r.name]}
                    className="font-display text-[clamp(2.25rem,5.6vw,5.5rem)] leading-[0.86] font-bold text-balance uppercase"
                  />
                </div>
                <figure className="photo-frame relative aspect-[4/3] overflow-hidden bg-ink md:hidden">
                  {shot(r, "100vw", "absolute inset-0 h-full w-full object-cover")}
                  {credit(r)}
                </figure>
              </li>
            ))}
          </ul>
          <div className="comp__stage relative hidden overflow-hidden bg-ink md:block">
            {rows.map((r, i) => (
              <figure key={r.tone} data-i={i} aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-(--ease-out) first:opacity-100">
                {shot(r, "(min-width: 1140px) 520px, 45vw", "absolute inset-0 h-full w-full object-cover")}
                {credit(r)}
                <p className="font-display absolute bottom-0 left-0 z-10 bg-ink px-3 py-2 text-[0.8rem] leading-none font-bold tracking-[0.16em] text-bone uppercase">{r.line}</p>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
