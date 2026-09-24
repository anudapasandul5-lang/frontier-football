import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { thumbUrl } from "@/lib/album-data";
import { competitionPhotos, type DrivePhoto } from "@/lib/home-photos";
import { MicroLabel } from "@/components/primitives/MicroLabel";

/* Act 5, one colour card per competition in time order: blue Turf Wars, green
   4 x 4 Series, red Division 0.

   2026-09-24, owner: the pinned sideways slider of full-screen panels looked
   empty and did not match its neighbours, through two restyles. Picked from
   three mocks: a bone section of three solid colour cards, photo on top, the
   same colour-block language as the Numbers bars just above. Cards are smaller
   than a viewport, which HOUSE-RULES section 2 forbids; the exception is
   recorded there. No section heading (owner), only the micro-label.

   Copy, all sourced: every 4 x 4 Series season at Athlete 360, Turf Wars at
   Club Fusion, Division 0 at Pixels N Pints (owner, 2026-09-03, HOUSE-RULES
   section 7); Turf Wars "where it started" (same); Division 0 on PS5
   (CONTEXT.md, content.js note). Names, venues, dates and the Turf Wars photo
   come from content.js, so a competition deleted there leaves the act and a
   "TODO" fact is left out. */
type Tone = "blue" | "green" | "red";
type Shot = { src: string; alt: string };
type Card = { tone: Tone; name: string; photo: Shot | null; facts: (string | null)[]; line: string };

// Literal class names, so Tailwind emits them and the --color-* they read.
const fill: Record<Tone, string> = { blue: "bg-blue", green: "bg-green", red: "bg-red" };

const drive = (p: DrivePhoto | undefined): Shot | null => (p ? { src: thumbUrl(p.id, 800), alt: p.alt } : null);
const landscape = (ps: DrivePhoto[]) => ps.find((p) => p.w >= p.h) ?? ps[0];

export function Competitions() {
  const data = parseContent(raw);
  const competition = (name: string) => data.competitions.find((c) => c.name === name);
  const turfWars = competition("Turf Wars");
  const divisionZero = competition("Division 0");

  const cards: Card[] = [];
  if (turfWars)
    cards.push({
      tone: "blue",
      name: "Turf Wars",
      photo: turfWars.photo ? { src: turfWars.photo, alt: turfWars.photoAlt ?? "" } : null,
      facts: [turfWars.venue, turfWars.date],
      line: "Where it started.",
    });
  cards.push({
    tone: "green",
    name: "4 x 4 Series",
    photo: drive(landscape(competitionPhotos["4 x 4 Series"].frames)),
    facts: [data.seasons[0]?.venue ?? null, data.seasons.length ? `${data.seasons.length} seasons` : null],
    line: "Six seasons. One venue.",
  });
  if (divisionZero)
    cards.push({
      tone: "red",
      name: "Division 0",
      photo: drive(landscape(competitionPhotos["Division 0"].frames)),
      facts: [divisionZero.venue, "PS5", divisionZero.date],
      line: "Played on PS5.",
    });

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="competitions" data-tone="ink" data-chapter="Events" aria-labelledby="competitions-label" className="canvas-bone py-[clamp(4rem,14vh,9rem)]">
      <div className="frame">
        <MicroLabel as="h2" id="competitions-label" className="text-(--tone-muted)">
          Competitions
        </MicroLabel>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((c, n) => (
            <li key={c.tone} className={`${fill[c.tone]} text-ink flex flex-col [--tone-muted:var(--color-ink)]`}>
              {c.photo ? (
                <img
                  src={c.photo.src}
                  alt={c.photo.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="aspect-[3/2] w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-4 p-6 pb-7">
                <p className="micro">
                  {pad(n + 1)} &middot; {c.name}
                </p>
                <h3 className="font-display text-[clamp(2.25rem,3.8vw,3.5rem)] leading-[0.9] font-bold text-balance uppercase">
                  {c.line}
                </h3>
                <p className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-6 text-sm">
                  {c.facts.filter(Boolean).map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
