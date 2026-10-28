import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, partners, reach } from "@/lib/content-data";
import { CountUpFigure } from "@/components/motion/CountUpFigure";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { Marquee } from "@/components/primitives/Marquee";
import { phoneSrcSet } from "@/lib/phone-image";

// Same rhythm as the home page's partner strip (components/acts/Partners.tsx).
const item = "mr-[clamp(2rem,5vw,4.5rem)] flex h-[clamp(2.75rem,5vw,4.5rem)] shrink-0 items-center";
const type = "font-display text-lead-l leading-none font-bold whitespace-nowrap uppercase text-current";

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
          lines={["Partner with us"]}
          photo={{ src: "/heroes/collaborate.webp", alt: "A packed Main Sports Bar during the England v Argentina watch party", position: "center 35%" }}
        >
          Frontier brings together football, community and culture in Colombo.
        </PageHero>
      }
    >
      {/* Every figure is the owner's, dated. Absent while nothing is measured. */}
      {figures.length > 0 ? (
        <section data-reveal data-tone="bone" data-chapter="Reach" aria-labelledby="reach-heading" className="wipe canvas-night relative overflow-hidden py-[clamp(4rem,12vh,8rem)]">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <p className="micro mb-4 text-yellow">Reach</p>
            <SplitReveal
              id="reach-heading"
              lines={["Our audience"]}
              className="mb-[clamp(2rem,6vh,4rem)] font-display text-display-l leading-[0.85] font-bold uppercase"
            />
            <dl className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 xl:grid-cols-5">
              {figures.map((row) => (
                <div key={row.label} className="flex flex-col gap-2 border-t border-bone/40 pt-4">
                  <dt className="micro">{row.label}</dt>
                  <dd className="font-display text-[clamp(2.75rem,min(7vw,9svh),6rem)] leading-[0.85] font-bold text-yellow uppercase tabular-nums">
                    <CountUpFigure figure={row.figure} />
                  </dd>
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
            className="mb-10 font-display text-display-l leading-[0.88] font-bold uppercase"
          />
          {/* Zigzag (owner reference, 2026-10-07): card 1 text left and photo
              right, then alternating. On a phone the photo always sits on top. */}
          <ol className="border-t-2 border-ink">
            {offer.map((row, i) => (
              <li key={row.title} className="grid items-start gap-6 border-b border-ink/20 py-[clamp(2rem,6vh,3.5rem)] md:grid-cols-2 md:gap-[clamp(2rem,5vw,5rem)]">
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
                  <strong className="mt-3 block font-display text-display-m leading-[0.95] font-bold uppercase">{row.title}</strong>
                  {row.body ? <p className="mt-4 max-w-[44ch] text-lead leading-normal">{row.body}</p> : null}
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
                  <span className={type}>{p.name?.replace(/^@/, "")}</span>
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
        <div className="frame grid items-center gap-[clamp(3rem,6vw,5rem)] md:grid-cols-2">
          <div>
            <p aria-hidden="true" className="font-display text-display-xl leading-[0.82] font-bold uppercase">
              Talk
              <br />
              to us.
            </p>
            <p className="mt-6 max-w-[46ch] text-lead-l leading-[1.4]">We are open to new or interesting opportunities.</p>
            <ContactRoutes only="partner" heading="Talk to us" />
          </div>
          <div className="relative mx-auto w-full max-w-[40rem] md:mx-0">
            <img
              src="/crest.webp"
              alt="Frontier Football crest"
              width={525}
              height={640}
              loading="lazy"
              decoding="async"
              className="mx-auto block h-auto w-[min(70%,22rem)] md:mx-0"
            />
          </div>
        </div>
      </div>
      <NextPage current="/collaborate" />
    </PageShell>
  );
}
