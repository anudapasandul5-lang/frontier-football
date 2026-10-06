import type { Metadata } from "next";
import raw from "@/content.js";
import { recorded } from "@/lib/content-data";
import { registrations } from "@/lib/community";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { SundayLeagueMark } from "@/components/primitives/SundayLeagueMark";

export const metadata: Metadata = { title: "Community" };

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

/* The Community page (plan L7): the Sunday Football League, the one live
   activity, on night mode with its two Registrations and the email; then every
   Past activity on bone, as a record, never with a join button. League details
   are PLACEHOLDER until the owner supplies them, and the PLACEHOLDER gate keeps
   this page out of production until then. */
export default function CommunityPage() {
  const details = ((raw.league?.details ?? []) as { label: unknown; value: unknown }[])
    .map((row) => ({ label: recorded(row.label), value: recorded(row.value) }))
    .filter((row): row is { label: string; value: string } => Boolean(row.label && row.value));
  const buttons = registrations(raw);

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Community"
          eyebrow="Community"
          lines={["More than", "a game."]}
          photo={{ src: "/heroes/community.webp", alt: "A supporter dancing in front of the big screen at a Frontier watch-along", position: "30% center" }}
        >
          Your next game starts here. Join the league.
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/pages/community-team.webp", alt: "A 4 x 4 Series team arm in arm on the pitch" },
          { src: "/pages/community-final-table.webp", alt: "Argentina and Spain fans together at the World Cup final watch-along" },
          { src: "/pages/community-division-0.webp", alt: "Players crowding round the console at the Division 0 tournament" },
        ]}
      />

      <section id="sunday-league" data-tone="bone" data-chapter="Sunday League" aria-labelledby="league-heading" className="canvas-night scroll-mt-24">
        <div className="frame grid gap-12 py-[clamp(4rem,12vh,8rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div className="@container min-w-0">
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
          </div>
        </div>
      </section>

      <section data-tone="ink" data-chapter="Every event we have done" aria-labelledby="past-heading" className="frame py-[clamp(4rem,12vh,8rem)]">
        <SplitReveal id="past-heading" lines={["Every event we have done"]} className="mb-10 font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.88] font-bold uppercase" />
        <ol className="border-t-2 border-ink">
          {raw.communityStories.map((story) => (
            <li key={story.name} className="grid gap-6 border-b border-ink/20 py-7 sm:grid-cols-2 sm:gap-8">
              <h3 className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.75rem)] leading-none font-bold uppercase">{story.name}</h3>
              <p className="max-w-[58ch] text-lg leading-relaxed">{story.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <NextPage current="/community" />
    </PageShell>
  );
}
