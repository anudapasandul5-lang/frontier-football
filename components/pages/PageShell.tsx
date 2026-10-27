import type { ReactNode } from "react";
import { Interactions } from "@/components/motion/Interactions";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/primitives/Footer";
import { Nav } from "@/components/primitives/Nav";

/* The frame every page except home sits in (T7). Bone, v1's cream carried to
   the v2 palette (owner, 2026-09-22): the ported pages keep their v1 layout,
   and v1 was a light page. Nav takes the canvas colour like it does on home.
   `night` puts the whole page on night mode (Events, L6).
   `hero` (opus55): a full-screen PageHero carrying its own floating header,
   in place of the static nav. Every page gets the home page's cursor and
   scroll effects (Interactions). */
export function PageShell({ children, night = false, hero }: { children: ReactNode; night?: boolean; hero?: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <div className={night ? "canvas-night" : "canvas-bone"}>
        {hero ? null : <Nav />}
        <main id="content">
          {hero}
          {children}
        </main>
      </div>
      <Footer />
      <Interactions />
    </>
  );
}
