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
          lines={["Join the", "action."]}
          photo={{ src: "/heroes/events.webp", alt: "A 4 x 4 Series SZN 06 match under the floodlights at night", position: "center 40%" }}
          actions={
            <>
              {nights.length > 0 ? (
                <a href="#join" className={`${heroButton} bg-yellow text-ink`}>
                  <Roll>Join us</Roll>
                </a>
              ) : null}
              {results.length > 0 ? (
                <a href="#hall-of-fame" className={`${heroButton} border-2 border-bone hover:bg-bone hover:text-ink`}>
                  <Roll>Hall of Fame</Roll>
                </a>
              ) : null}
            </>
          }
        >
          Frontier runs every week, and something bigger is usually on the way. Here is when we play and what is coming up.
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

      {nights.length > 0 ? (
        <section data-tone="bone" id="join" data-chapter="Join us" aria-labelledby="sessions-heading" className="frame scroll-mt-24 py-[clamp(4rem,12vh,8rem)]">
          <h2 id="sessions-heading" className="mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
            Join us
          </h2>
          <p className="max-w-[58ch] text-lg leading-relaxed">{raw.league.sessionLine}</p>
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
      {results.length > 0 ? (
        <section data-tone="bone" id="hall-of-fame" data-chapter="Hall of Fame" aria-labelledby="results-heading" className="frame scroll-mt-24 pb-[clamp(4rem,14vh,9rem)]">
          <SplitReveal
            id="results-heading"
            lines={["Hall of Fame"]}
            className="mb-[clamp(2rem,6vh,4rem)] font-display text-[clamp(3rem,min(9vw,15svh),7.5rem)] leading-[0.88] font-bold uppercase"
          />
          <p className="mb-8 max-w-[58ch] text-lg leading-relaxed">The winners of every Frontier event, and the stats behind them.</p>
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

      <NextPage current="/events" />
    </PageShell>
  );
}
