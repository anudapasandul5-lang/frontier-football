import raw from "@/content.js";
import { activities } from "@/lib/community";
import { SplitReveal } from "@/components/primitives/SplitReveal";

/* Every Past activity and tournament as a record, never with a join button.
   Shared by Community and Contact (owner, 2026-09-23: Contact carries all
   activities and tournaments). Renders nothing while content.js has none.

   opus55: numbered rows in the home results-table manner. The whole row is
   the link to its photos. */
export function PastActivities() {
  const past = activities(raw);
  if (past.length === 0) return null;
  return (
    <section data-tone="ink" data-chapter="What we've run" aria-labelledby="past-heading" className="frame py-[clamp(4rem,12vh,8rem)]">
      <p className="micro mb-4">The record</p>
      <SplitReveal
        id="past-heading"
        lines={["What we’ve run"]}
        className="mb-10 font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.88] font-bold uppercase"
      />
      <ol className="border-t-2 border-ink">
        {past.map((activity, i) => (
          <li key={activity.name} className="border-b border-ink/20">
            <a
              href={activity.href}
              className="group grid grid-cols-[3ch_minmax(0,1fr)_auto] items-center gap-x-4 py-6 transition-colors duration-200 hover:bg-ink hover:text-bone focus-visible:bg-ink focus-visible:text-bone sm:gap-x-8 sm:px-4"
            >
              <span className="micro tabular-nums group-hover:text-bone/70 group-focus-visible:text-bone/70">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.75rem)] leading-none font-bold uppercase transition-transform duration-300 group-hover:translate-x-2">
                  {activity.name}
                </span>
                {activity.note ? <span className="micro mt-2 block group-hover:text-bone/70">{activity.note}</span> : null}
              </span>
              <span className="micro flex min-h-11 items-center group-hover:text-yellow">
                Photos <span aria-hidden="true" className="ml-2 text-lg">&rarr;</span>
                <span className="sr-only">: {activity.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
