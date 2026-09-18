import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { BandedReveal } from "@/components/primitives/BandedReveal";
import { ColourField, type FieldTone } from "@/components/primitives/ColourField";
import { MicroLabel } from "@/components/primitives/MicroLabel";

/* Act 5, United's three consecutive colour panels, one per competition (plan
   Q22): green 4 x 4 Series, blue Turf Wars, red Division 0. Each is exactly
   one viewport of flat colour with one condensed line, a photo set inside the
   line the way United sets its crowd shots.

   Copy, all sourced: every 4 x 4 Series season at Athlete 360, Turf Wars at
   Club Fusion, Division 0 at Pixels N Pints (owner, 2026-09-03, HOUSE-RULES
   section 7); Turf Wars "where it started" (same); Division 0 on PS5
   (CONTEXT.md, content.js note). "Six" matches the hero's hard-coded count.

   An inline photo is an inline-block with overflow hidden, so its bottom edge
   is its baseline and it sits on the line; at 2:1 and 1.5em wide it stands
   0.75em, about Oswald's cap height, so it never reaches the line above.

   The inline photos are alt="": inside a heading, alt text would become part
   of the heading's name. Names, venues and photos come from content.js, so a
   competition deleted there leaves the act; one with no photo keeps its line. */
type Panel = { tone: FieldTone; name: string; venue: string | null; photo: string | null; before: string; after: string };

export function Competitions() {
  const data = parseContent(raw);
  const competition = (name: string) => data.competitions.find((c) => c.name === name);
  const turfWars = competition("Turf Wars");
  const divisionZero = competition("Division 0");

  const panels: Panel[] = [
    {
      tone: "green",
      name: "4 x 4 Series",
      venue: data.seasons[0]?.venue ?? null,
      photo: data.seasons.find((s) => s.photo)?.photo ?? null,
      before: "Six seasons.",
      after: "One venue.",
    },
  ];
  if (turfWars) panels.push({ tone: "blue", name: "Turf Wars", venue: turfWars.venue, photo: turfWars.photo, before: "Where", after: "it started." });
  if (divisionZero) panels.push({ tone: "red", name: "Division 0", venue: divisionZero.venue, photo: divisionZero.photo, before: "Played", after: "on PS5." });

  return (
    <div id="competitions">
      {panels.map((p) => (
        <ColourField key={p.tone} tone={p.tone} labelledBy={`field-${p.tone}`}>
          <div className="frame flex flex-1 flex-col justify-center gap-6 py-16">
            <MicroLabel>
              {p.name}
              {p.venue ? <> &middot; {p.venue}</> : null}
            </MicroLabel>
            <h2
              id={`field-${p.tone}`}
              className="font-display text-[clamp(2.75rem,min(13vw,19svh),9.5rem)] leading-[0.88] font-bold text-balance uppercase"
            >
              {p.before}{" "}
              {/* Photo and second phrase break as one, so no width strands a
                  lone word ("VENUE.") on a line of its own. */}
              <span className="whitespace-nowrap">
                {p.photo ? (
                  <BandedReveal
                    as="span"
                    src={p.photo}
                    alt=""
                    width={800}
                    height={533}
                    bands={4}
                    cover="var(--canvas)"
                    className="mr-[0.18em] inline-block w-[1.5em]"
                    imgClassName="aspect-[2/1]"
                  />
                ) : null}
                {p.after}
              </span>
            </h2>
          </div>
        </ColourField>
      ))}
    </div>
  );
}
