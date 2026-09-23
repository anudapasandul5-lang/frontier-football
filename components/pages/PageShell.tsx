import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/primitives/Footer";
import { Nav } from "@/components/primitives/Nav";

/* The frame every page except home sits in (T7). Bone, v1's cream carried to
   the v2 palette (owner, 2026-09-22): the ported pages keep their v1 layout,
   and v1 was a light page. Nav takes the canvas colour like it does on home.
   `night` puts the whole page on night mode (Events, L6). */
export function PageShell({ children, night = false }: { children: ReactNode; night?: boolean }) {
  return (
    <>
      <SmoothScroll />
      <div className={night ? "canvas-night" : "canvas-bone"}>
        <Nav />
        <main id="content">{children}</main>
      </div>
      <Footer />
    </>
  );
}

/* The top of a page with no hero: micro-label, display headline, lede. Flush
   left, capped by viewport height as well as width (HOUSE-RULES section 3). */
export function Masthead({
  eyebrow,
  lines,
  children,
  compact = false,
}: {
  eyebrow: string;
  lines: [string, string];
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="frame pt-10 pb-8 md:pt-20 md:pb-14">
      <p className="micro">{eyebrow}</p>
      <h1
        className={`mt-5 font-display leading-[0.88] font-bold uppercase ${
          compact
            ? "text-[min(clamp(2.5rem,13vw,13.75rem),20vh)] min-[1100px]:text-[min(clamp(3rem,7vw,7.5rem),22vh)]"
            : "text-[min(clamp(2.5rem,13vw,13.75rem),20vh)]"
        }`}
      >
        {lines[0]}
        <br />
        {lines[1]}
      </h1>
      <p className="mt-6 max-w-[46ch] text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] md:mt-8">{children}</p>
    </section>
  );
}
