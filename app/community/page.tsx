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
import { phoneSrcSet } from "@/lib/phone-image";

export const metadata: Metadata = { title: "Community" };

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

/* Each event's scrapbook collage (owner reference, 2026-10-07): bone-framed
   prints on a darker tray, each tipped a fraction of a degree. Kept under 1deg
   because the owner rejected strongly tilted prints as crooked scans
   (2026-09-24). Layout runs by story order: one big print on the left, three
   in a row, one big print on the right, then a 2 x 2 grid. */
const layouts = ["lead-left", "row", "lead-right", "grid"] as const;
type Layout = (typeof layouts)[number];

const grids: Record<Layout, string> = {
  "lead-left": "grid-cols-[3fr_2fr] grid-rows-2 [&>*:first-child]:row-span-2 h-[clamp(16rem,42vw,30rem)]",
  row: "grid-cols-3 h-[clamp(9rem,26vw,20rem)]",
  "lead-right": "grid-cols-[2fr_3fr] grid-rows-2 [&>*:last-child]:col-start-2 [&>*:last-child]:row-span-2 [&>*:last-child]:row-start-1 h-[clamp(16rem,42vw,30rem)]",
  grid: "grid-cols-2 grid-rows-2 h-[clamp(16rem,42vw,30rem)]",
};
const tilts = ["-rotate-[0.8deg]", "rotate-[0.6deg]", "-rotate-[0.4deg]", "rotate-[0.9deg]"];

function Collage({ photos, layout }: { photos: { src: string; alt: string }[]; layout: Layout }) {
  return (
    <div className={`photo-frame grid gap-[clamp(0.5rem,1.5vw,1rem)] bg-ink/[0.08] p-[clamp(0.5rem,1.5vw,1rem)] ${grids[layout]}`}>
      {photos.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          srcSet={phoneSrcSet(p.src)}
          sizes="(min-width: 640px) 50vw, 100vw"
          alt={p.alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`block size-full min-h-0 border-[clamp(3px,0.6vw,6px)] border-bone object-cover transition-transform duration-500 ease-[var(--ease-out)] hover:rotate-0 ${tilts[i % tilts.length]}`}
        />
      ))}
    </div>
  );
}

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
          {raw.communityStories.map((story, i) => (
            <li key={story.name} className="border-b border-ink/20 py-[clamp(2rem,6vh,3.5rem)]">
              <p className="micro mb-2">Event {i + 1}</p>
              <h3 className="mb-6 font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.75rem)] leading-none font-bold uppercase">{story.name}</h3>
              <Collage photos={story.photos} layout={layouts[i % layouts.length]} />
              {"credit" in story ? <p className="micro mt-2">{story.credit}</p> : null}
              <p className="mt-6 max-w-[62ch] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-relaxed">{story.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <NextPage current="/community" />
    </PageShell>
  );
}
