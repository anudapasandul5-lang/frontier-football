import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, sessions, upcomingEvents } from "@/lib/content-data";
import { Events as Upcoming } from "@/components/acts/Events";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Events" };

const FACTS = [
  ["time", "Time"],
  ["venue", "Venue"],
  ["format", "Format"],
  ["price", "Price"],
] as const;

/* The player's page: the weekly nights first (a standing invitation is true
   more often than news), then the dated one-offs, then the player route. Each
   night prints only the fields content.js has; a night with nothing but its
   day name is dropped by sessions(), and no nights means no section. */
export default function EventsPage() {
  const data = parseContent(raw);
  const nights = sessions(data);

  return (
    <PageShell>
      {/* UNSOURCED (T1 audit, 2026-09-22): "every week" and "here is when we play"
          have no backing while content.js sessions are all TODO, and the 4x4 Series
          posters say "monthly tournaments". Owner to supply weekly details or new copy. */}
      <Masthead eyebrow="For players" lines={["Come and", "play"]}>
        Frontier runs every week, and there is usually something bigger on the way. Here is when we play and what is
        coming up.
      </Masthead>

      {nights.length > 0 ? (
        <section aria-labelledby="sessions-heading" className="frame pb-15">
          <h2 id="sessions-heading" className="mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
            Every week
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(17rem,100%),1fr))] gap-6">
            {nights.map((night, i) => (
              <li key={`${night.day}-${i}`} className="flex flex-col gap-3 border-2 border-ink p-6">
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
                {night.note ? <p className="border-t border-ink pt-3 text-[15px] leading-[1.45]">{night.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Upcoming events={upcomingEvents(data)} />
      <div className={upcomingEvents(data).length > 0 ? "pt-16" : ""}>
        <ContactRoutes only="player" heading="Get a spot" />
      </div>
    </PageShell>
  );
}
