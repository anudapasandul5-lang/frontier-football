import type { CSSProperties } from "react";
import raw from "@/content.js";
import { parseContent, stats } from "@/lib/content-data";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { Numeral } from "@/components/primitives/Numeral";
import { CountUpFigure } from "@/components/motion/CountUpFigure";

// The stat bars (owner, 2026-09-23, from United's metric bars): Frontier's
// green, yellow and blue, each shorter than the one above, drawn in left to
// right one after another. Ink reads on all three (canvas-* utilities).
const bars = [
  { tone: "bg-green", width: "100%" },
  { tone: "bg-yellow", width: "88%" },
  { tone: "bg-blue", width: "76%" },
];
import { TickRule } from "@/components/primitives/TickRule";

/* Act 4, Ticket 04's night-mode count-up. Display line
   left, label and body right and offset down, then the stat stack against one
   oversized numeral.

   Which figure is the numeral is content.js's call, not this file's: its first
   stats row. Today that is 3.4M+ Instagram views, the reach figure, which is
   the job United gives its 211+ Nations (T4, 2026-09-18).

   Copy, all sourced: Turf Wars "where it started" is the owner's (HOUSE-RULES
   section 7); six seasons and the watch-alongs are content.js; the figures and
   their date are the owner's (content.js stats, asOf). */
export function Numbers() {
  const data = parseContent(raw);
  const [lead, ...rest] = stats(data);
  if (!lead) return null;

  // No date recorded: no label, rather than "As of Invalid Date".
  const asOf = lead.asOf
    ? new Date(`${lead.asOf}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    : null;

  return (
    <section id="numbers" aria-labelledby="numbers-heading" className="canvas-night py-[clamp(4rem,14vh,9rem)]">
      <div className="frame flex flex-col gap-[clamp(3rem,10vh,7rem)]">
        <TickRule />
        <div className="grid gap-6 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-10">
          <h2
            id="numbers-heading"
            className="font-display text-[clamp(3.25rem,min(10vw,16svh),8rem)] leading-[0.88] font-bold text-balance uppercase"
          >
            Counted so far.
          </h2>
          <div className="flex max-w-[44ch] flex-col gap-4 md:mt-2 md:gap-[clamp(3rem,12vh,8rem)]">
            {asOf ? <MicroLabel>As of {asOf}</MicroLabel> : null}
            <p className="text-[15px] leading-relaxed">
              It started with Turf Wars at Club Fusion. Six seasons of the 4 x 4 Series have run since, and the big
              games get watched together.
            </p>
          </div>
        </div>
        <div className="grid gap-12 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-10">
          <dl className="flex flex-col gap-3">
            {rest.map((s, i) => {
              const bar = bars[i % bars.length];
              return (
                <div
                  key={s.label}
                  data-reveal
                  className={`stat-bar flex flex-col gap-2 px-6 py-5 text-ink [--tone-muted:var(--color-ink)] sm:px-8 sm:py-6 ${bar.tone}`}
                  style={{ width: bar.width, "--bar-delay": `${i * 140}ms` } as CSSProperties}
                >
                  <dt className="micro">{s.label}</dt>
                  <dd>
                    <CountUpFigure figure={s.figure} className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.9] font-semibold uppercase tabular-nums" />
                  </dd>
                </div>
              );
            })}
          </dl>
          <div className="md:self-center">
            <Numeral figure={lead.figure} caption={lead.label} />
          </div>
        </div>
      </div>
    </section>
  );
}
