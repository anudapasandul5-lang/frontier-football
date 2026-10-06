import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { PageShell } from "@/components/pages/PageShell";
import { SeriesSeasons } from "@/components/pages/Scrapbook";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { AboutMotion } from "@/components/motion/AboutMotion";

export const metadata: Metadata = { title: "4 x 4 Series" };

export default function SeriesPage() {
  const { seasons } = parseContent(raw);
  return <PageShell>
    <section data-tone="ink" data-chapter="4 x 4 Series" aria-labelledby="series-heading" className="frame pt-10 pb-24 sm:pt-16 sm:pb-36">
      <Link href="/who-we-are#run-heading" className="micro mb-12 inline-flex min-h-11 items-center gap-3"><span aria-hidden="true">←</span> The run so far</Link>
      <header className="mb-12 flex items-end justify-between gap-4 sm:mb-16">
        <SplitReveal as="h1" id="series-heading" lines={["4 x 4 Series"]} className="font-display text-[clamp(3.25rem,8vw,8rem)] leading-[0.88] font-bold uppercase" />
        <p className="micro max-w-[6rem] shrink-0 pb-1 text-right">{seasons.length === 6 ? "All six seasons" : `${seasons.length} seasons`}</p>
      </header>
      <SeriesSeasons seasons={seasons} />
    </section>
    <AboutMotion />
  </PageShell>;
}
