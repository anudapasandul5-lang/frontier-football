import type { Metadata } from "next";
import raw from "@/content.js";
import { recorded } from "@/lib/content-data";
import { registrations } from "@/lib/community";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { SundayLeagueMark } from "@/components/primitives/SundayLeagueMark";
import { phoneSrcSet } from "@/lib/phone-image";

export const metadata: Metadata = { title: "Community" };

const button = "flex min-h-12 items-center rounded-full px-6 font-display text-button font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

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
  const highlights = raw.communityStories.flatMap((story) => story.photos);

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Community"
          lines={["Sunday Socials"]}
          photo={{ src: "/heroes/community.webp", alt: "Four friends arm in arm at the Spain v France watch party", position: "center 20%" }}
        >
          Your next game starts here. Join the league.
        </PageHero>
      }
    >
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
                <p className="micro w-full">Opens WhatsApp with the message ready</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Highlights (plan, 2026-10-28): a no-text collage of the best event
          photos, shown at their own shape so no face is cut. Drawn from the
          event stories in content.js; the owner swaps in sharper picks. */}
      <section data-tone="ink" data-chapter="Highlights" aria-labelledby="highlights-heading" className="py-[clamp(4rem,12vh,8rem)]">
        <div className="px-[clamp(1rem,2.5vw,3rem)]">
          <SplitReveal id="highlights-heading" lines={["Highlights"]} className="mb-10 font-display text-display-l leading-[0.88] font-bold uppercase" />
          <div className="columns-2 gap-3 md:columns-3 [&>img]:mb-3">
            {highlights.map((p) => (
              <img
                key={p.src}
                src={p.src}
                srcSet={phoneSrcSet(p.src)}
                sizes="(min-width: 768px) 33vw, 50vw"
                alt={p.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="block h-auto w-full break-inside-avoid"
              />
            ))}
          </div>
        </div>
      </section>
      <NextPage current="/community" />
    </PageShell>
  );
}
