import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, resultRows, sessions, upcomingEvents, whatsappHref } from "@/lib/content-data";
import { Events as Upcoming } from "@/components/acts/Events";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { phoneSrcSet } from "@/lib/phone-image";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { MarqueePause } from "@/components/motion/MarqueePause";
import styles from "./hall-of-fame.module.css";

export const metadata: Metadata = { title: "Events" };

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
          photo={{ src: "/heroes/events.webp", alt: "Players close in on the ball under the floodlights at 4 x 4 Series SZN 6", position: "center 40%" }}
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
          { src: "/pages/events-strike.webp", alt: "A player drives forward with the ball in a daylight 4 x 4 Series SZN 6 match" },
          { src: "/pages/events-keeper.webp", alt: "Players celebrate with a high-five under floodlights at a 4 x 4 Series match" },
          { src: "/pages/events-day-match.webp", alt: "Players race together towards the ball in a daylight 4 x 4 Series match" },
        ]}
      />

      {nights.length > 0 ? (
        <section data-tone="bone" id="join" data-chapter="Join us" aria-labelledby="sessions-heading" className="frame scroll-mt-24 py-[clamp(4rem,12vh,8rem)]">
          <h2 id="sessions-heading" className="mb-6 font-display text-display-m leading-none uppercase">
            Join us
          </h2>
          <p className="max-w-[58ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-relaxed">{raw.league.sessionLine}</p>
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
        <section data-tone="bone" id="hall-of-fame" data-chapter="Hall of Fame" aria-labelledby="results-heading" className="frame scroll-mt-24 pt-[clamp(3rem,10vh,6rem)] pb-[clamp(4rem,14vh,9rem)]">
          <div className={`${styles.celebration} marquee`} role="region" aria-label="Hall of Fame animation">
            <svg className={styles.art} viewBox="0 0 1000 500" fill="none" aria-hidden="true" focusable="false">
              <g className={styles.arcs} stroke="currentColor" strokeWidth="2">
                <path d="M350 500C420 120 710-45 1030 85M440 520C500 190 750 45 1020 160M530 540C590 265 800 145 1010 235" />
              </g>
              <g className={styles.trophy} stroke="currentColor" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
                <path d="M620 90h220v90c0 80-47 137-110 137s-110-57-110-137V90Zm0 26h-76v44c0 61 34 96 84 96m212-140h76v44c0 61-34 96-84 96M730 317v74m-58 0h116m-138 43h160m-147-43h134v43H663z" />
              </g>
              <path className={styles.sweep} d="M160 430 1020 130" stroke="currentColor" strokeWidth="6" />
            </svg>
            <div className={styles.headerCopy}>
              <SplitReveal
                id="results-heading"
                lines={["Hall of Fame"]}
                className="mb-4 font-display text-display-l leading-[0.88] font-bold uppercase"
              />
              <p className="max-w-[58ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-relaxed">The winners of every Frontier event, and the stats behind them.</p>
            </div>
            <MarqueePause />
          </div>
          <ol aria-labelledby="results-heading" className={styles.wall}>
            {results.map((row) => {
              const meta = [row.venue, row.date, row.runnerUp ? `Runner-up ${row.runnerUp}` : null].filter(Boolean).join("  ·  ");
              return (
                <li key={row.id} data-reveal className={styles.poster}>
                  <h3 className={`${styles.eventName} font-display font-bold uppercase`}>{row.name}</h3>
                  <figure className={styles.photo}>
                    {row.photo ? (
                      <img
                        src={row.photo}
                        srcSet={phoneSrcSet(row.photo)}
                        sizes="(min-width: 1100px) 340px, (min-width: 600px) 45vw, calc(100vw - 80px)"
                        alt={row.photoAlt ?? row.name}
                        width={1200}
                        height={800}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className={styles.placeholder}>No event photo</div>
                    )}
                    {row.photoCredit ? <figcaption className={styles.credit}>Photo: {row.photoCredit}</figcaption> : null}
                  </figure>
                  <div className={styles.details}>
                    <span className={styles.championLabel}>Champion</span>
                    {row.champion ? (
                      <p className={`${styles.champion} font-display font-bold uppercase`}>{row.champion}</p>
                    ) : (
                      <p className={styles.meta}>Not recorded yet</p>
                    )}
                    {meta ? <p className={styles.meta}>{meta}</p> : null}
                    {row.photos ? (
                      <a href={row.photos} className={styles.photosLink}>
                        Photos <span className="sr-only">, {row.name}</span>
                      </a>
                    ) : null}
                  </div>
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
