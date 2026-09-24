import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, resultRows, sessions, upcomingEvents, whatsappHref } from "@/lib/content-data";
import { Events as Upcoming } from "@/components/acts/Events";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { ResultsTable, Unrecorded } from "@/components/primitives/ResultsTable";

export const metadata: Metadata = { title: "Events" };

const FACTS = [
  ["time", "Time"],
  ["venue", "Venue"],
  ["format", "Format"],
  ["price", "Price"],
] as const;

const recorded = (value: string | null) => value ?? <Unrecorded />;

/* A question about the weekly session, not a League registration: whether the
   Sunday session and the Sunday Football League are one offer is unconfirmed
   (UX audit T1, 2026-09-24), so the two drafts stay separate. */
const sessionMessage = "Hi Frontier, I'd like to ask about this Sunday's football session and venue.";

/* The player's page, in night mode (L6). The results wall leads: every season
   and competition Frontier has run, a muted dash for anything not recorded
   (plan Q19). Then the weekly nights and the dated one-offs, each printed only
   when content.js has them. The "Get a spot" slab is gone (owner, 2026-09-22);
   the Sunday League card goes on top of the wall when it is live. */
export default function EventsPage() {
  const data = parseContent(raw);
  const nights = sessions(data);
  const results = resultRows(data);
  const askHref = whatsappHref(data.contact.whatsapp, sessionMessage);

  return (
    <PageShell
      night
      hero={
        /* Source: owner, 2026-09-22 - the Sunday evening session (content.js
           sessions) backs "every week"; the monthly 4x4 Series is the bigger thing. */
        <PageHero
          chapter="Events"
          eyebrow="For players"
          lines={["Come and", "play."]}
          photo={{ src: "/heroes/events.webp", alt: "A 4 x 4 Series SZN 06 match under the floodlights at night", position: "center 40%" }}
          actions={
            <>
              <a href="#results-heading" className={`${heroButton} bg-yellow text-ink`}>
                <Roll>Every result</Roll>
              </a>
              {nights.length > 0 ? (
                <a href="#sessions-heading" className={`${heroButton} border-2 border-bone hover:bg-bone hover:text-ink`}>
                  <Roll>Every week</Roll>
                </a>
              ) : null}
            </>
          }
        >
          Frontier runs every week, and there is usually something bigger on the way. Here is when we play and what is
          coming up.
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/pages/events-strike.webp", alt: "A player strikes the ball at a 4 x 4 Series SZN 06 match" },
          { src: "/pages/events-keeper.webp", alt: "A goalkeeper dives on the ball under the lights at SZN 06" },
          { src: "/pages/events-day-match.webp", alt: "Two players chase the ball on the Athlete 360 pitch" },
        ]}
      />

      {results.length > 0 ? (
        <section data-tone="bone" data-chapter="Results" aria-labelledby="results-heading" className="frame scroll-mt-24 pb-[clamp(4rem,14vh,9rem)]">
          <SplitReveal
            id="results-heading"
            lines={["Every result."]}
            className="mb-[clamp(2rem,6vh,4rem)] font-display text-[clamp(3rem,min(9vw,15svh),7.5rem)] leading-[0.88] font-bold uppercase"
          />
          <ResultsTable
            labelled
            caption="Results of every Frontier season and competition, newest season first"
            columns={[
              { key: "name", label: "Event", className: "max-sm:col-span-2" },
              { key: "date", label: "Date" },
              { key: "venue", label: "Venue" },
              { key: "champion", label: "Champion", className: "text-yellow" },
              { key: "runnerUp", label: "Runner-up" },
              { key: "photos", label: "Photos", className: "sm:text-right" },
            ]}
            rows={results.map((row) => ({
              id: row.id,
              cells: {
                name: row.name,
                date: recorded(row.date),
                venue: recorded(row.venue),
                champion: recorded(row.champion),
                runnerUp: recorded(row.runnerUp),
                photos: row.photos ? (
                  <a href={row.photos} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline">
                    {row.photos.startsWith("/") ? "Album" : "Drive"}
                    <span className="sr-only">, {row.name}</span>
                  </a>
                ) : (
                  <Unrecorded />
                ),
              },
            }))}
          />
        </section>
      ) : null}

      {nights.length > 0 ? (
        <section data-tone="bone" data-chapter="Every week" aria-labelledby="sessions-heading" className="frame scroll-mt-24 py-[clamp(4rem,12vh,8rem)]">
          <h2 id="sessions-heading" className="mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
            Every week
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(17rem,100%),1fr))] gap-6">
            {nights.map((night, i) => (
              <li key={`${night.day}-${i}`} className="flex flex-col gap-3 border-2 border-current p-6">
                <h3 className="font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">{night.day}</h3>
                {night.name ? <p className="text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-tight font-bold">{night.name}</p> : null}
                {FACTS.some(([key]) => night[key]) ? (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px] leading-snug">
                    {FACTS.filter(([key]) => night[key]).map(([key, label]) => (
                      <div key={key} className="contents">
                        <dt className="micro self-center">{label}</dt>
                        <dd>{night[key]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {night.note ? <p className="border-t border-current pt-3 text-[15px] leading-[1.45]">{night.note}</p> : null}
              </li>
            ))}
          </ul>
          {askHref ? (
            <a
              href={askHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask about this Sunday (opens WhatsApp in a new tab)"
              className={`${heroButton} mt-8 w-fit bg-yellow text-ink`}
            >
              <Roll>Ask about this Sunday</Roll>
            </a>
          ) : null}
        </section>
      ) : null}

      <Upcoming events={upcomingEvents(data)} />
      <NextPage current="/events" />
    </PageShell>
  );
}
