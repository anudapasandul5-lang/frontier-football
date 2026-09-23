import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { thumbUrl } from "@/lib/album-data";
import { competitionPhotos, type DrivePhoto } from "@/lib/home-photos";
import { ColourField, type FieldTone } from "@/components/primitives/ColourField";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { CompetitionsMotion } from "@/components/motion/CompetitionsMotion";

/* Act 5, United's three consecutive colour panels, one per competition (plan
   Q22): blue Turf Wars, green 4 x 4 Series, red Division 0, pinned into one
   sideways slider by CompetitionsMotion. Each is one viewport of its colour
   with one condensed line.

   2026-09-23, owner: "plain colour blocks", make the photos bigger and blend
   them in. So each panel now carries a full-bleed photo, greyscaled and
   multiplied into the panel colour (a duotone in blue, green or red), fading
   to solid colour at the bottom where the headline sits, plus up to two larger
   framed photos (lib/home-photos.ts). The background is alt="": it is a tinted
   texture, and the framed photos carry the descriptions.

   Copy, all sourced: every 4 x 4 Series season at Athlete 360, Turf Wars at
   Club Fusion, Division 0 at Pixels N Pints (owner, 2026-09-03, HOUSE-RULES
   section 7); Turf Wars "where it started" (same); Division 0 on PS5
   (CONTEXT.md, content.js note). Names, venues and the Turf Wars photo come
   from content.js, so a competition deleted there leaves the act. */
type Shot = { src: string; alt: string; w: number; h: number };
type Panel = { tone: FieldTone; name: string; venue: string | null; bg: string | null; frames: Shot[]; before: string; after: string };

const drive = (p: DrivePhoto, width: number): Shot => ({ src: thumbUrl(p.id, width), alt: p.alt, w: p.w, h: p.h });

export function Competitions() {
  const data = parseContent(raw);
  const competition = (name: string) => data.competitions.find((c) => c.name === name);
  const turfWars = competition("Turf Wars");
  const divisionZero = competition("Division 0");
  const series = competitionPhotos["4 x 4 Series"];
  const div0 = competitionPhotos["Division 0"];

  // Time order (owner, 2026-09-23): Turf Wars, where it started in 2024, then
  // the 4 x 4 Series, then Division 0.
  const panels: Panel[] = [];
  if (turfWars)
    panels.push({ tone: "blue", name: "Turf Wars", venue: turfWars.venue, bg: turfWars.photo, frames: [], before: "Where", after: "it started." });
  panels.push({
    tone: "green",
    name: "4 x 4 Series",
    venue: data.seasons[0]?.venue ?? null,
    bg: thumbUrl(series.bg.id, 1600),
    frames: series.frames.map((f) => drive(f, 800)),
    before: "Six seasons.",
    after: "One venue.",
  });
  if (divisionZero)
    panels.push({
      tone: "red",
      name: "Division 0",
      venue: divisionZero.venue,
      bg: thumbUrl(div0.bg.id, 1600),
      frames: div0.frames.map((f) => drive(f, 800)),
      before: "Played",
      after: "on PS5.",
    });

  return (
    <div id="competitions" className="relative overflow-hidden">
      <div className="competitions-track">
        {panels.map((p) => (
          <ColourField key={p.tone} tone={p.tone} labelledBy={`field-${p.tone}`} className="relative isolate overflow-hidden">
            {p.bg ? (
              <>
                <img
                  src={p.bg}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="comp-bg absolute inset-0 -z-10 size-full object-cover opacity-90 mix-blend-multiply grayscale"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{ background: "linear-gradient(to top, var(--canvas) 22%, transparent 78%)" }}
                />
              </>
            ) : null}
            <div className="frame relative flex flex-1 flex-col justify-end gap-6 pt-28 pb-[clamp(3rem,12svh,7rem)]">
              {p.frames.length ? (
                <div className="flex items-start gap-3 md:absolute md:top-[14svh] md:right-[var(--gutter,1.5rem)] md:gap-5">
                  {p.frames.map((f, i) => (
                    <img
                      key={f.src}
                      src={f.src}
                      alt={f.alt}
                      width={f.w}
                      height={f.h}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={`comp-frame h-auto object-cover shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] ${
                        f.h > f.w ? "w-[30vw] md:w-[clamp(8rem,17vw,18rem)]" : "w-[50vw] md:w-[clamp(12rem,28vw,30rem)]"
                      } ${i === 1 ? "md:mt-[14svh]" : ""}`}
                    />
                  ))}
                </div>
              ) : null}
              <MicroLabel>
                {p.name}
                {p.venue ? <> &middot; {p.venue}</> : null}
              </MicroLabel>
              <h2
                id={`field-${p.tone}`}
                className="font-display text-[clamp(2.75rem,min(13vw,19svh),9.5rem)] leading-[0.88] font-bold text-balance uppercase"
              >
                {p.before} <span className="whitespace-nowrap">{p.after}</span>
              </h2>
            </div>
          </ColourField>
        ))}
      </div>
      <CompetitionsMotion count={panels.length} />
    </div>
  );
}
