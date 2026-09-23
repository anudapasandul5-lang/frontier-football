import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, partners, reach, stats } from "@/lib/content-data";
import { CountUpFigure } from "@/components/motion/CountUpFigure";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Collaborate" };

/* The brand's page. The action sits beside the masthead above 1100px (owner,
   2026-09-07) so a brand that has already decided does not scroll for it. Then
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
    <PageShell>
      <div className="min-[1100px]:frame min-[1100px]:grid min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] min-[1100px]:items-start min-[1100px]:gap-x-15 min-[1100px]:[&>section]:px-0 min-[1100px]:[&>section:last-child]:pt-20">
        {/* Source: Frontier's own event posters (Instagram cache, 2026-09-22 audit):
            4x4 Series at Athlete 360 Nugegoda, Turf Wars at Club Fusion Boralesgamuwa,
            watch-alongs at Main Sports Bar. "Small-sided" = the 4x4 format. */}
        <Masthead eyebrow="For brands" lines={["Collaborate", "with us"]} compact>
          Frontier runs small-sided football in Colombo and the culture that comes with it. Here is who sees it,
          what a partner gets, and who is already standing alongside us.
        </Masthead>
        <ContactRoutes only="partner" heading="Talk to us" />
      </div>

      {/* Every figure is the owner's, dated. Absent while nothing is measured. */}
      {figures.length > 0 ? (
        <section data-reveal aria-labelledby="reach-heading" className="wipe canvas-night relative overflow-hidden py-15 md:py-20">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <h2 id="reach-heading" className="micro mb-8">
              Who sees it
            </h2>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-8">
              {figures.map((row) => (
                <div key={row.label} className="flex flex-col gap-2 border-t border-bone/40 pt-4">
                  <dt className="micro">{row.label}</dt>
                  <dd className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] font-semibold uppercase tabular-nums">
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
        <section aria-labelledby="offer-heading" className="frame py-15 md:pb-20">
          <h2 id="offer-heading" className="mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
            What a partner gets
          </h2>
          <ul className="max-w-[64ch] border-t border-ink">
            {offer.map((row) => (
              <li key={row.title} className="flex flex-col gap-1 border-b border-ink py-5">
                <strong className="font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-none font-normal uppercase">
                  {row.title}
                </strong>
                {row.body ? <span className="max-w-[58ch] text-[15px] leading-normal">{row.body}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {names.length > 0 ? (
        <section data-reveal aria-labelledby="partners-heading" className="wipe canvas-night relative overflow-hidden py-15 md:py-20">
          <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
          <div className="wipe__layer frame relative" style={{ "--wipe-delay": "140ms" } as React.CSSProperties}>
            <h2 id="partners-heading" className="micro mb-8">
              {count ? `${count.figure} ${count.label}` : "Partners"}
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-3">
              {names.map((p) => {
                const chip = p.logo ? (
                  <img src={p.logo} alt={p.name ?? ""} loading="lazy" className="h-12 w-full object-contain" />
                ) : (
                  <span className="font-display text-lg leading-none font-bold uppercase">{p.name}</span>
                );
                return (
                  <li key={p.name} className="flex h-24 items-center justify-center rounded-sm bg-bone px-4 text-center text-ink">
                    {p.url ? (
                      <a href={p.url} className="flex h-full w-full items-center justify-center">
                        {chip}
                      </a>
                    ) : (
                      chip
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
