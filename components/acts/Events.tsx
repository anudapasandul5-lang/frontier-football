import type { upcomingEvents } from "@/lib/content-data";
import { ResultsTable, Unrecorded } from "@/components/primitives/ResultsTable";
import { TickRule } from "@/components/primitives/TickRule";

type Event = ReturnType<typeof upcomingEvents>[number];

/* Act 7: the dated one-offs, as a results-table variant on the same ink as
   the champions above it. Renders NOTHING while content.js has no named event
   (HOUSE-RULES section 9): no heading, no "nothing on yet" line. Takes its list
   as a prop so that rule has a test (Events.test.tsx). */
export function Events({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <section id="events" data-tone="bone" aria-labelledby="events-heading" className="canvas-ink pb-[clamp(4rem,14vh,9rem)]">
      <div className="frame flex flex-col gap-[clamp(2.5rem,8vh,5rem)]">
        <TickRule />
        <h2
          id="events-heading"
          className="font-display text-display-l leading-[0.88] font-bold uppercase"
        >
          Our events
        </h2>
        <p className="max-w-[58ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-relaxed">Watch parties, game nights, community sessions and our football events. See what is coming up and be there.</p>
        <ResultsTable
          caption="Upcoming Frontier events"
          columns={[
            { key: "name", label: "Event" },
            { key: "date", label: "Date" },
            { key: "venue", label: "Venue", className: "max-sm:text-[var(--tone-muted)]" },
            { key: "details", label: "Details", className: "text-right" },
          ]}
          rows={events.map((event, i) => ({
            id: `${event.name}-${i}`,
            cells: {
              name: (
                <>
                  {event.name}
                  {event.note ? (
                    <span className="mt-2 block font-sans text-[13px] leading-snug normal-case text-[var(--tone-muted)]">
                      {event.note}
                    </span>
                  ) : null}
                </>
              ),
              date: event.date ?? <Unrecorded />,
              venue: event.venue ?? <Unrecorded />,
              details: event.url ? (
                <a href={event.url} className="underline underline-offset-4 hover:no-underline">
                  Details<span className="sr-only">, {event.name}</span>
                </a>
              ) : null,
            },
          }))}
        />
      </div>
    </section>
  );
}
