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
  // Crowd reactions from the five watch-party albums (owner, 2026-10-28:
  // "crowd reaction, crowd cheering"), mixed so no two nights sit together.
  // UCL Final Night frames have the bottom cut to clear the bar's badges.
  const night: Record<string, string> = {
    ucl: "the UCL Final Night",
    final: "the Spain v Argentina final",
    eng: "the England v Argentina semi-final",
    nor: "the Norway v England match",
    fra: "the Spain v France semi-final",
  };
  const order = ["ucl", "final", "eng", "nor", "fra", "final", "ucl", "eng", "nor", "fra", "final", "ucl", "eng", "nor", "fra", "final", "ucl", "eng", "nor", "fra", "final", "ucl", "nor"];
  const files: Record<string, number[]> = { ucl: [25, 2, 3, 26, 5], final: [28, 7, 8, 9, 27], eng: [11, 12, 13, 14], nor: [15, 16, 17, 18, 19], fra: [20, 21, 22, 23] };
  // wp-25 is the owner's group photo (2026-10-29). wp-05, 27 and 28 are crops of DSC_2865 and
  // DSC_2906, night not recorded, so their alt text names no match.
  const swapped = [5, 14, 25, 26, 27, 28]; // wp-14 and wp-26: owner's DSC_7853 and an edited DSC_8650 (2026-10-29), night not recorded
  const highlights = order.map((key) => {
    const n = files[key].shift()!;
    const where = swapped.includes(n) ? "a" : `${night[key]}`;
    // wp-28 is a match-day photo by Ashan Senevirathne for ThePapare, not a watch party (owner, 2026-10-29).
    const alt = n === 28 ? "Two fans pose together at a Frontier match day; photograph by ThePapare" : `Fans react together at ${where} watch party`;
    return { src: `/community/wp-${String(n).padStart(2, "0")}.webp`, alt };
  });

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Community"
          lines={["Sunday Socials"]}
          photo={{ src: "/heroes/community-pitch.webp", alt: "Players shake hands on the pitch after a game", position: "center top" }}
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
