import raw from "@/content.js";
import { activities } from "@/lib/community";

/* Every Past activity and tournament as a record, never with a join button.
   Shared by Community and Contact (owner, 2026-09-23: Contact carries all
   activities and tournaments). Renders nothing while content.js has none. */
export function PastActivities() {
  const past = activities(raw);
  if (past.length === 0) return null;
  return (
    <section aria-labelledby="past-heading" className="frame py-[clamp(4rem,12vh,8rem)]">
      <h2 id="past-heading" className="mb-10 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] font-bold uppercase">
        What we&rsquo;ve run
      </h2>
      <ul className="border-t-2 border-ink">
        {past.map((activity) => (
          <li key={activity.name} className="grid gap-2 border-b border-ink/20 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <p className="font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)] leading-none font-bold uppercase">{activity.name}</p>
              {activity.note ? <p className="micro mt-2">{activity.note}</p> : null}
            </div>
            <a href={activity.href} className="micro flex min-h-11 w-fit items-center border-b border-current text-current hover:text-ink/70">
              See the photos<span className="sr-only">: {activity.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
