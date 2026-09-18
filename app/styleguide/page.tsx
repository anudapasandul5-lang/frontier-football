import type { Metadata } from "next";
import raw from "@/content.js";
import { thumbUrl } from "@/lib/album-data";
import { parseContent, partners, seasonName, stats } from "@/lib/content-data";
import { marqueePhotos } from "@/lib/home-photos";
import { BandedReveal } from "@/components/primitives/BandedReveal";
import { ColourField } from "@/components/primitives/ColourField";
import { CreditBody } from "@/components/primitives/CreditBody";
import { Marquee } from "@/components/primitives/Marquee";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { Nav } from "@/components/primitives/Nav";
import { Numeral } from "@/components/primitives/Numeral";
import { ResultsTable, Unrecorded } from "@/components/primitives/ResultsTable";
import { Stat } from "@/components/primitives/Stat";
import { TickRule } from "@/components/primitives/TickRule";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false } };

/* Every v2 primitive, drawn with real content.js data so nothing here is a
   stand-in. The design-system page, not a site page. */
export default function Styleguide() {
  const data = parseContent(raw);
  const figures = stats(data);
  const [lead, ...rest] = figures;

  return (
    <main>
      <div className="canvas-bone pb-16">
        <Nav />
        <div className="frame flex flex-col gap-10 pt-16">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[0.95]">Styleguide.</h1>
          <TickRule />
          <section className="flex flex-col gap-4">
            <MicroLabel>Micro label on bone</MicroLabel>
            <p className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] font-bold uppercase">
              Collision.
            </p>
            <p className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05]">
              Instrument Serif carries the emotional line. Oswald carries the structure.
            </p>
            <p className="max-w-[52ch] text-[15px] leading-relaxed">
              Geist sets the body. It holds a narrow measure even on a wide screen, and it never fills its column.
            </p>
          </section>
          <section className="grid gap-12 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <dl className="flex flex-col gap-8">
              {rest.map((s) => (
                <Stat key={s.label} label={s.label} figure={s.figure} />
              ))}
            </dl>
            {lead ? (
              <div className="md:mt-32">
                <Numeral figure={lead.figure} caption={lead.label} />
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <div className="canvas-ink py-16">
        <div className="frame flex flex-col gap-12">
          <TickRule />
          <MicroLabel>Results table</MicroLabel>
          <ResultsTable
            caption="4 x 4 Series champions"
            columns={[
              { key: "season", label: "Season" },
              { key: "champion", label: "Champion" },
              { key: "venue", label: "Venue", className: "max-sm:col-span-2 max-sm:text-[var(--tone-muted)]" },
            ]}
            rows={data.seasons.map((s) => ({
              id: String(s.season),
              cells: { season: seasonName(s.season), champion: s.champion ?? <Unrecorded />, venue: s.venue ?? <Unrecorded /> },
            }))}
          />
          <CreditBody credit="Credit + body pair">
            <p>
              A credit line in micro caps on the left, the body on the right, offset down so the two never share a
              baseline.
            </p>
          </CreditBody>
          <BandedReveal src="/gallery/p01.webp" alt="A Frontier match, from the gallery" width={1280} height={921} />
        </div>
      </div>

      <div className="canvas-ink pb-16">
        <Marquee label="Photographs" seconds={60} className="mb-12">
          {marqueePhotos.map((p) => (
            <img
              key={p.id}
              src={thumbUrl(p.id, 800)}
              alt={p.alt}
              width={p.w}
              height={p.h}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="mr-3 h-[clamp(12rem,32vw,22rem)] w-auto"
            />
          ))}
        </Marquee>
        <Marquee label="Partners" seconds={50}>
          {partners(data).map((p) => (
            <span key={p.name} className="font-display px-6 text-[clamp(2rem,5vw,4rem)] leading-none uppercase">
              {p.name}
            </span>
          ))}
        </Marquee>
      </div>

      {(["green", "blue", "red", "teal"] as const).map((tone) => (
        <ColourField key={tone} tone={tone}>
          <div className="frame flex flex-1 flex-col justify-end gap-4 pb-16">
            <MicroLabel>Colour field</MicroLabel>
            <p className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.88] font-bold uppercase">{tone}.</p>
          </div>
        </ColourField>
      ))}
    </main>
  );
}
