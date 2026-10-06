import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, partners, reach } from "@/lib/content-data";
import { CountUpFigure } from "@/components/motion/CountUpFigure";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { Marquee } from "@/components/primitives/Marquee";
import { phoneSrcSet } from "@/lib/phone-image";

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
            <a href="#talk" className={`${heroButton} group min-h-14 w-full max-w-[36rem] justify-between bg-yellow text-ink`}>
              <Roll>I want to partner</Roll>
              <span aria-hidden="true" className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-y-1">&darr;</span>
            </a>
          }
        >
          Frontier brings together football, community and culture in Colombo. See who we reach, how partners can get involved, and who is already with us.
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/pages/collab-venue.webp", alt: "The Pixels N Pints entrance, venue partner for Division 0" },
          { src: "/pages/collab-bar-crowd.webp", alt: "A full room at a Frontier watch-along at Main Sports Bar" },
          { src: "/home/moment-celebration.webp", alt: "A fan celebrates at a Frontier watch-along" },
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
          {/* Zigzag (owner reference, 2026-10-07): card 1 text left and photo
              right, then alternating. On a phone the photo always sits on top. */}
          <ol className="border-t-2 border-ink">
            {offer.map((row, i) => (
              <li key={row.title} className="grid items-center gap-6 border-b border-ink/20 py-[clamp(2rem,6vh,3.5rem)] md:grid-cols-2 md:gap-[clamp(2rem,5vw,5rem)]">
                {row.photo ? (
                  <img
                    src={row.photo}
                    srcSet={phoneSrcSet(row.photo)}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt={row.alt ?? ""}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className={`block aspect-[4/3] w-full object-cover ${i % 2 === 0 ? "md:order-2" : ""}`}
                  />
                ) : null}
                <div>
                  <span className="micro tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <strong className="mt-3 block font-display text-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] leading-[0.95] font-bold uppercase">{row.title}</strong>
                  {row.body ? <p className="mt-4 max-w-[44ch] text-[clamp(1.05rem,0.95rem+0.35vw,1.3rem)] leading-normal">{row.body}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {names.length > 0 ? (
        <section data-reveal data-tone="ink" data-chapter="Partners" aria-labelledby="partners-heading" className="wipe canvas-bone relative overflow-hidden py-15 md:py-20">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <h2 id="partners-heading" className="micro mb-4">Already alongside us</h2>
            <Marquee label="Frontier partners" seconds={45}>
              {names.map((p) => {
                const mark = p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="h-[65%] w-auto max-w-[clamp(8rem,13vw,11rem)] object-contain"
                  />
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
      {/* id="talk": the hero button lands here, with the headline at the top
          (no scroll margin: the band's own padding clears the crest). */}
      <div id="talk" data-tone="ink" data-chapter="Talk to us" className="overflow-x-clip bg-yellow py-[clamp(4rem,12vh,8rem)] text-ink">
        <div className="frame grid items-center gap-[clamp(3rem,6vw,5rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p aria-hidden="true" className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.82] font-bold uppercase">
              Talk
              <br />
              to us.
            </p>
            <p className="mt-6 max-w-[46ch] text-[clamp(1.1rem,0.95rem+0.6vw,1.6rem)] leading-[1.4]">One message is all it takes.</p>
            <ContactRoutes only="partner" heading="Talk to us" />
          </div>
          <div className="relative mx-auto w-full max-w-[30rem] md:mx-0">
            <img
              src="/pages/collab-partner-can.webp"
              srcSet={phoneSrcSet("/pages/collab-partner-can.webp")}
              sizes="(min-width: 768px) 40vw, 90vw"
              alt="A giant partner drink can on display at Division 0"
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] w-full rotate-[2.5deg] border-[6px] border-ink object-cover"
            />
          </div>
        </div>
      </div>
      <NextPage current="/collaborate" />
    </PageShell>
  );
}
