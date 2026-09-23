import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, recorded } from "@/lib/content-data";
import { activities, registrations } from "@/lib/community";
import { Masthead, PageShell } from "@/components/pages/PageShell";
import { SundayLeagueMark } from "@/components/primitives/SundayLeagueMark";

export const metadata: Metadata = { title: "Community" };

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

/* The Community page (plan L7): the Sunday Football League, the one live
   activity, on night mode with its two Registrations and the email; then every
   Past activity on bone, as a record, never with a join button. League details
   are PLACEHOLDER until the owner supplies them, and the PLACEHOLDER gate keeps
   this page out of production until then. */
export default function CommunityPage() {
  const email = parseContent(raw).contact.email;
  const details = ((raw.league?.details ?? []) as { label: unknown; value: unknown }[])
    .map((row) => ({ label: recorded(row.label), value: recorded(row.value) }))
    .filter((row): row is { label: string; value: string } => Boolean(row.label && row.value));
  const buttons = registrations(raw);
  const past = activities(raw);

  return (
    <PageShell>
      <Masthead eyebrow="Community" lines={["Play with", "Frontier"]}>
        Every format Frontier has run, and the league you can join now.
      </Masthead>

      <section aria-labelledby="league-heading" className="canvas-night">
        <div className="frame grid gap-12 py-[clamp(4rem,12vh,8rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="league-heading" className="sr-only">
              Sunday Football League
            </h2>
            <SundayLeagueMark />
          </div>
          <div>
            <p className="micro">Now registering</p>
            {details.length > 0 ? (
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-t border-bone/25 pt-6">
                {details.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="micro self-center">{row.label}</dt>
                    <dd className="text-lg">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {buttons.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {buttons.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} (opens WhatsApp in a new tab)`}
                    className={`${button} ${i === 0 ? "bg-yellow text-ink" : "border border-bone"}`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
            {email ? (
              <p className="mt-6 text-bone/80">
                Or email{" "}
                <a href={`mailto:${email}`} className="underline underline-offset-4 hover:text-yellow">
                  {email}
                </a>
                .
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {past.length > 0 ? (
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
      ) : null}
    </PageShell>
  );
}
