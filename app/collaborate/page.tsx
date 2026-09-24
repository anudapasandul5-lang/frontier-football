import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, partners, reach, stats } from "@/lib/content-data";
import { CountUpFigure } from "@/components/motion/CountUpFigure";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { Marquee } from "@/components/primitives/Marquee";

// Same rhythm as the home page's partner strip (components/acts/Partners.tsx).
const item = "mr-[clamp(2rem,5vw,4.5rem)] flex h-[clamp(2.75rem,5vw,4.5rem)] shrink-0 items-center";
const type = "font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-none font-bold whitespace-nowrap uppercase text-current";

export const metadata: Metadata = { title: "Collaborate" };

/* The brand's page. opus55: the action is a button in the photo hero (it
   jumps to the partner card, now at the foot of the page), so a brand that has
   already decided still does not scroll for it (owner, 2026-09-07). Then
   the owner's reach figures, what a partner gets, and who is already here: the
   partners on cream chips in their real colours. PARTNER, never sponsor
   (CONTEXT.md). L6 restyle: the reach and partner sections go to night mode and
   enter with the hard wipe; every word is unchanged. */
export default function Collaborate() {
  const data = parseContent(raw);
  const figures = reach(data);
  const offer = data.collaborate.offer;
  const names = partners(data);
  const count = stats(data).find((s) => s.label === "Partners");

  return (
    <PageShell
      hero={
        /* Source: Frontier's own event posters (Instagram cache, 2026-09-22 audit):
           4x4 Series at Athlete 360 Nugegoda, watch-alongs at Main Sports Bar. "Small-sided" = the 4x4 format. */
        <PageHero
          chapter="Collaborate"
          eyebrow="For brands"
          lines={["Collaborate", "with us."]}
          photo={{ src: "/heroes/collaborate.webp", alt: "A packed watch-along under a partner's banner, the match on the big screen", position: "center 35%" }}
          actions={
            <a href="#routes-partner" className={`${heroButton} bg-yellow text-ink`}>
              <Roll>I want to partner</Roll>
            </a>
          }
        >
          Frontier runs small-sided football in Colombo and the culture that comes with it. Here is who sees it, what a
          partner gets, and who is already standing alongside us.
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/pages/collab-venue.webp", alt: "The Pixels N Pints entrance, venue partner for Division 0" },
          { src: "/pages/collab-bar-crowd.webp", alt: "A full room at a Frontier watch-along at Main Sports Bar" },
          { src: "/pages/collab-partner-can.webp", alt: "A giant partner drink can on display at Division 0" },
        ]}
      />

      {/* Every figure is the owner's, dated. Absent while nothing is measured. */}
      {figures.length > 0 ? (
        <section data-reveal data-tone="bone" data-chapter="Reach" aria-labelledby="reach-heading" className="wipe canvas-night relative overflow-hidden py-[clamp(4rem,12vh,8rem)]">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <p className="micro mb-4 text-yellow">Reach</p>
            <SplitReveal
              id="reach-heading"
              lines={["Who sees it."]}
              className="mb-[clamp(2rem,6vh,4rem)] font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] font-bold uppercase"
            />
            <dl className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 xl:grid-cols-5">
              {figures.map((row) => (
                <div key={row.label} className="flex flex-col gap-2 border-t border-bone/40 pt-4">
                  <dt className="micro">{row.label}</dt>
                  <dd className="font-display text-[clamp(2.75rem,min(7vw,9svh),6rem)] leading-[0.85] font-bold text-yellow uppercase tabular-nums">
                    <CountUpFigure figure={row.figure} />
                  </dd>
                  {row.asOf ? <dd className="micro">As of {row.asOf}</dd> : null}
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {offer.length > 0 ? (
        <section data-tone="ink" data-chapter="What a partner gets" aria-labelledby="offer-heading" className="frame py-[clamp(4rem,12vh,8rem)]">
          <SplitReveal
            id="offer-heading"
            lines={["What a partner gets"]}
            className="mb-10 font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.88] font-bold uppercase"
          />
          <ol className="border-t-2 border-ink">
            {offer.map((row, i) => (
              <li key={row.title} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-x-4 border-b border-ink/20 py-7 sm:grid-cols-[3ch_minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-8">
                <span className="micro pt-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <strong className="font-display text-[clamp(1.6rem,1.1rem+2vw,3rem)] leading-[0.95] font-bold uppercase">{row.title}</strong>
                {row.body ? <span className="col-start-2 mt-3 max-w-[48ch] text-[clamp(1rem,0.95rem+0.2vw,1.125rem)] leading-normal sm:col-start-3 sm:mt-0 sm:pt-1">{row.body}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {names.length > 0 ? (
        <section data-reveal data-tone="bone" data-chapter="Partners" aria-labelledby="partners-heading" className="wipe canvas-night relative overflow-hidden py-15 md:py-20">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <p className="micro mb-4 text-yellow">Already alongside us</p>
            <SplitReveal
              id="partners-heading"
              lines={[count ? `${count.figure} ${count.label}.` : "Partners."]}
              className="mb-10 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] font-bold uppercase"
            />
            <Marquee label="Frontier partners" seconds={45}>
              {names.map((p) => {
                const mark = p.logo ? (
                  <span className="flex h-full items-center rounded-sm bg-bone px-4">
                    <img
                      src={p.logo}
                      alt={p.name ?? ""}
                      loading="lazy"
                      decoding="async"
                      className="h-[65%] w-auto max-w-[clamp(8rem,13vw,11rem)] object-contain"
                    />
                  </span>
                ) : (
                  <span className={type}>{p.name}</span>
                );
                return p.url ? (
                  <a key={p.name} href={p.url} className={`${item} transition-opacity duration-150 hover:opacity-70`}>
                    {mark}
                  </a>
                ) : (
                  <span key={p.name} className={item}>
                    {mark}
                  </span>
                );
              })}
            </Marquee>
          </div>
        </section>
      ) : null}

      {/* The page's action, again at the foot, on the yellow the hero button
          uses. The card keeps its own sr-only heading; the big line is display. */}
      <div data-tone="ink" data-chapter="Talk to us" className="@container bg-yellow pt-[clamp(4rem,12vh,8rem)] text-ink">
        <div className="frame pb-8">
          <p aria-hidden="true" className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-bold uppercase">
            Talk to us.
          </p>
          <p className="mt-5 max-w-[46ch] text-[clamp(1.05rem,0.95rem+0.45vw,1.4rem)] leading-[1.45]">
            One message is all it takes to start.
          </p>
        </div>
        <ContactRoutes only="partner" heading="Talk to us" />
      </div>
      <NextPage current="/collaborate" />
    </PageShell>
  );
}
