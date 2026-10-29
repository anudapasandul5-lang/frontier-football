import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, resultRows, upcomingEvents } from "@/lib/content-data";
import { Events as Upcoming } from "@/components/acts/Events";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { phoneSrcSet } from "@/lib/phone-image";
import { PhotoStrip } from "@/components/pages/PhotoStrip";

export const metadata: Metadata = { title: "Events" };

/* The player's page, in night mode (L6). The results wall leads: every season
   and competition Frontier has run, a muted dash for anything not recorded
   (plan Q19). Then the weekly nights and the dated one-offs, each printed only
   when content.js has them. The "Get a spot" slab is gone (owner, 2026-09-22);
   the Sunday League card goes on top of the wall when it is live. */
export default function EventsPage() {
  const data = parseContent(raw);
  const results = resultRows(data);

  return (
    <PageShell
      night
      hero={
        /* Source: owner, 2026-09-22 - the Sunday evening session (content.js
           sessions) backs "every week"; the monthly 4x4 Series is the bigger thing. */
        <PageHero
          chapter="Events"
          lines={["Join the", "action."]}
          photo={{ src: "/heroes/events.webp", alt: "A player strikes the ball towards goal as others chase on a sunlit futsal pitch", position: "center 26%" }}
          paragraphClassName="lg:-translate-y-[3px]"
        >
          {/* One short paragraph, worded from the Sunday Socials proposal deck
              until the owner's own events deck arrives (plan, 2026-10-28). */}
          From our high-octane tournament series to stadium-atmosphere watch parties, whenever Frontier organizes something, the energy is off the charts.
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/pages/events-strike.webp", alt: "A player in white strikes the ball along the fence as players in bibs close in" },
          { src: "/pages/events-keeper.webp", alt: "Players celebrate with a high-five under floodlights at a 4 x 4 Series match" },
          { src: "/pages/events-day-match.webp", alt: "Muusa, number 1, winds up to shoot as the goalkeeper crouches and the referee watches" },
        ]}
      />

      {/* Owner's line from the Sunday Socials deck (2026-10-28), sitting
          between the photos and the listings. */}
      <section aria-label="About Frontier events" className="frame pb-[clamp(2.5rem,8vh,5rem)]">
        <p className="max-w-[52ch] text-lead-l leading-snug text-bone">
          Over our journey, we have consistently packed venues, drawn over a thousand active football players, and thrown legendary, sold-out events that Colombo’s sports community looks forward to week after week.
        </p>
      </section>

      <Upcoming events={upcomingEvents(data)} />
      {results.length > 0 ? (
        /* Hall of Fame: a trophy wall, not a spreadsheet (owner, 2026-10-07:
           the castle-hall table read as tacky). One row per event, the
           champion in big yellow, the rest small and muted. Unknowns say so. */
        <section data-tone="bone" id="hall-of-fame" data-chapter="Hall of Fame" aria-labelledby="results-heading" className="frame scroll-mt-24 pt-[clamp(3rem,10vh,6rem)] pb-[clamp(4rem,14vh,9rem)]">
          <p aria-hidden="true" className="mb-4 flex gap-2 text-yellow">
            {[0, 1, 2].map((i) => (
              <svg key={i} viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21.1l1.6-7L2 9.3l7.1-.7z" />
              </svg>
            ))}
          </p>
          <SplitReveal
            id="results-heading"
            lines={["Hall of Fame"]}
            className="mb-4 font-display text-[clamp(3rem,min(9vw,15svh),7.5rem)] leading-[0.88] font-bold uppercase"
          />
          <p className="mb-[clamp(2rem,6vh,4rem)] max-w-[58ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-relaxed">The winners of every Frontier event, and the stats behind them.</p>
          <ol aria-labelledby="results-heading" className="border-t border-bone/25">
            {results.map((row, i) => {
              const meta = [row.venue, row.date, row.runnerUp ? `Runner-up ${row.runnerUp}` : null].filter(Boolean).join("  ·  ");
              return (
                <li
                  key={row.id}
                  data-reveal
                  className="hof-row group relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-bone/25 py-[clamp(1rem,2.5vh,1.75rem)] sm:grid-cols-[8rem_minmax(0,1fr)] md:grid-cols-[clamp(9rem,13vw,12rem)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-x-8"
                >
                  {/* A yellow edge grows in on hover: the row lifting out of the wall. */}
                  <span aria-hidden="true" className="absolute inset-y-0 -left-[clamp(0.5rem,1.5vw,1.25rem)] w-1 origin-bottom scale-y-0 bg-yellow transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-y-100 max-md:hidden" />
                  <div className="photo-frame relative row-span-3 self-start overflow-hidden md:row-span-1 md:self-center">
                    {row.photo ? (
                      <img
                        src={row.photo}
                        srcSet={phoneSrcSet(row.photo)}
                        sizes="(min-width: 768px) 12rem, 8rem"
                        alt={row.photoAlt ?? `${row.name}`}
                        width={1200}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-[4/3] w-full object-cover transition-[transform,filter] duration-500 ease-[var(--ease-out)] md:grayscale-[0.9] md:group-hover:scale-[1.06] md:group-hover:grayscale-0"
                      />
                    ) : (
                      <div aria-hidden="true" className="grid aspect-[4/3] w-full place-items-center bg-bone/[0.06] text-yellow/60">
                        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                          <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21.1l1.6-7L2 9.3l7.1-.7z" />
                        </svg>
                      </div>
                    )}
                    {row.photoCredit ? <p className="mt-1 text-xs text-bone/75">Photo: {row.photoCredit}</p> : null}
                    <span className="absolute top-0 left-0 bg-yellow px-1.5 py-0.5 font-display text-xs font-bold text-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-[clamp(1.125rem,1rem+1vw,1.875rem)] leading-none uppercase">{row.name}</h3>
                    {meta ? <p className="micro mt-2">{meta}</p> : null}
                  </div>
                  <div className="col-start-2 min-w-0 md:col-start-3">
                    <p className="micro">Champion</p>
                    {row.champion ? (
                      <p className="hof-champ mt-1 font-display text-[clamp(1.5rem,1.1rem+2.4vw,3.5rem)] leading-[0.9] font-bold text-yellow uppercase transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1.5">
                        {row.champion}
                      </p>
                    ) : (
                      <p className="mt-1 text-[15px] text-[var(--tone-muted)]">Not recorded yet</p>
                    )}
                  </div>
                  {row.photos ? (
                    <a
                      href={row.photos}
                      className="group/btn col-start-2 inline-flex min-h-11 w-fit items-center gap-2 border border-bone/40 px-4 font-display text-sm uppercase transition-[color,background-color,border-color,transform] duration-200 ease-[var(--ease-out)] hover:border-yellow hover:bg-yellow hover:text-ink active:scale-[0.97] md:col-start-4"
                    >
                      Photos <span aria-hidden="true" className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/btn:translate-x-1">&rarr;</span>
                      <span className="sr-only">, {row.name}</span>
                    </a>
                  ) : (
                    // Holds the button's width so the Champion column lines up
                    // with the rows that have one (owner, 2026-10-28).
                    <span aria-hidden="true" className="invisible inline-flex min-h-11 items-center gap-2 border px-4 font-display text-sm uppercase max-md:hidden md:col-start-4">
                      Photos <span>&rarr;</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <NextPage current="/events" />
    </PageShell>
  );
}
