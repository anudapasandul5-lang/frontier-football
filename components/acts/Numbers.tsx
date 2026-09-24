import type { CSSProperties } from "react";
import raw from "@/content.js";
import { parseContent, stats } from "@/lib/content-data";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { TickRule } from "@/components/primitives/TickRule";
import { CountUpFigure } from "@/components/motion/CountUpFigure";
import { CourtScene } from "@/components/motion/CourtScene";

/* Act 4, the numbers as emotional beats (opus55, after United's "5 Billion
   Fans"): each figure gets a screen of its own, oversized, counting up as it
   arrives, over a WebGL futsal court that draws itself as the reader scrolls
   (CourtScene). The court is the platform the Moment act says was missing.

   Every figure, label and date is content.js's stats (owner, asOf), in its
   order; the lead is its first row, 3.4M+ Instagram views today. The bars
   under each figure are the owner's United-style stat bars (2026-09-23), one
   per brand colour. Copy: Turf Wars "where it started" is the owner's
   (HOUSE-RULES section 7); six seasons and the watch-alongs are content.js. */

const bars = ["bg-yellow", "bg-green", "bg-blue", "bg-red"];

export function Numbers() {
  const data = parseContent(raw);
  const all = stats(data);
  if (all.length === 0) return null;

  // No date recorded: no label, rather than "As of Invalid Date".
  const asOf = all[0].asOf
    ? new Date(`${all[0].asOf}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    : null;

  return (
    <section id="numbers" data-tone="bone" aria-labelledby="numbers-heading" className="canvas-night relative overflow-clip">
      {/* -mb lets the stuck layer hang up to a screen past the section's end;
          overflow-clip (not hidden, which would break sticky) cuts it there so
          it never paints over the next act. */}
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-svh overflow-hidden">
        <CourtScene />
        {/* Keeps the figures readable where the lines run behind them. */}
        <span className="absolute inset-y-0 left-0 w-full bg-night/35 md:w-[60%]" />
      </div>

      <div className="relative">
        <div className="frame flex min-h-svh flex-col justify-center gap-[clamp(2rem,7vh,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <TickRule />
          <div className="grid gap-6 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-10">
            <SplitReveal
              id="numbers-heading"
              lines={["Counted", "so far."]}
              className="font-display text-[clamp(3.25rem,min(12vw,20svh),10rem)] leading-[0.86] font-bold uppercase"
            />
            <div className="flex max-w-[44ch] flex-col gap-4 md:mt-[clamp(3rem,14vh,9rem)]">
              {asOf ? <MicroLabel>As of {asOf}</MicroLabel> : null}
              <p className="text-[15px] leading-relaxed text-bone/85">
                It started with Turf Wars at Club Fusion. Six seasons of the 4 x 4 Series have run since, and the big
                games get watched together.
              </p>
            </div>
          </div>
        </div>

        <dl>
          {all.map((s, i) => (
            <div
              key={s.label}
              className={`frame flex min-h-[85svh] flex-col justify-center gap-4 ${i % 2 ? "md:items-end md:text-right" : ""}`}
            >
                <dt className={`flex items-center gap-4 font-display text-[clamp(2rem,4.5vw,4.5rem)] leading-[0.9] font-bold uppercase ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="h-[3px] w-12 shrink-0 bg-current" />
                  {s.label}
                </dt>
                <dd className={`flex flex-col gap-5 ${i % 2 ? "md:items-end" : ""}`}>
                  <CountUpFigure
                    figure={s.figure}
                    className="font-display text-[clamp(4.5rem,min(15vw,21svh),11rem)] leading-[0.8] font-bold tracking-[-0.02em] uppercase"
                  />
                  <span
                    data-reveal
                    aria-hidden="true"
                    className={`stat-bar block h-3 w-[min(100%,clamp(10rem,36vw,34rem))] ${bars[i % bars.length]}`}
                    style={{ "--bar-delay": "200ms" } as CSSProperties}
                  />
                </dd>
            </div>
          ))}
        </dl>
        <div className="h-[15svh]" />
      </div>
    </section>
  );
}
