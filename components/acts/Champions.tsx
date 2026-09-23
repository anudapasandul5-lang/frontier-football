import raw from "@/content.js";
import { championRows, parseContent, seasonName } from "@/lib/content-data";
import { BandedReveal } from "@/components/primitives/BandedReveal";
import { ResultsTable, Unrecorded } from "@/components/primitives/ResultsTable";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { TickRule } from "@/components/primitives/TickRule";

/* Act 6, United's World Champions: a condensed headline, one photograph in the
   trophy-art slot, then the results table. Every season in content.js gets a
   row; an unrecorded champion prints a muted dash (plan Q19). No score column:
   no score has ever been recorded.

   The photo is the newest season with both a champion and a picture, so it
   moves on by itself when the owner fills in a season. */
export function Champions() {
  const data = parseContent(raw);
  const rows = championRows(data);
  if (rows.length === 0) return null;
  const latest = data.seasons.find((s) => s.champion && s.photo);

  return (
    <section id="champions" data-tone="bone" aria-labelledby="champions-heading" className="canvas-ink py-[clamp(4rem,14vh,9rem)]">
      <div className="frame flex flex-col gap-[clamp(3rem,10vh,6rem)]">
        <TickRule />
        <div className="grid gap-10 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
            <SplitReveal
              id="champions-heading"
              lines={["Every season,", "and who won it."]}
              className="font-display text-[clamp(3rem,min(9vw,15svh),7.5rem)] leading-[0.88] font-bold uppercase"
            />
            {latest ? (
            <figure className="flex flex-col gap-3 md:mt-[clamp(3rem,12vh,8rem)]">
              <BandedReveal
                as="span"
                src={latest.photo!}
                alt={latest.photoAlt ?? ""}
                width={800}
                height={400}
                className="block"
                imgClassName="aspect-[2/1]"
              />
              <figcaption className="micro">
                {seasonName(latest.season)} champions, {latest.champion}
              </figcaption>
            </figure>
            ) : null}
        </div>
        <ResultsTable
          caption="4 x 4 Series champions, newest season first"
          columns={[
            { key: "season", label: "Season" },
            { key: "champion", label: "Champion" },
            { key: "venue", label: "Venue", className: "max-sm:text-[var(--tone-muted)]" },
            { key: "photos", label: "Photos", className: "text-right" },
          ]}
          rows={rows.map((row) => ({
            id: row.id,
            // A season’s photo follows the pointer over its row (opus55).
            preview: data.seasons.find((s) => `szn-${s.season}` === row.id)?.photo ?? undefined,
            cells: {
              season: row.name,
              champion: row.champion ?? <Unrecorded />,
              venue: row.venue ?? <Unrecorded />,
              photos: row.photos ? (
                <a href={row.photos} className="underline underline-offset-4 hover:no-underline">
                  {row.photos.startsWith("/") ? "Album" : "Drive"}
                  <span className="sr-only">, {row.name}</span>
                </a>
              ) : (
                <Unrecorded />
              ),
            },
          }))}
        />
      </div>
    </section>
  );
}
