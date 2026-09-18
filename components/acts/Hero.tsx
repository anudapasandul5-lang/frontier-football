import { Nav } from "@/components/primitives/Nav";
import { HeroMotion } from "@/components/motion/HeroMotion";

/* Act 1. United's hero: a serif paragraph with Oswald caps in yellow laid
   straight over it, no attempt to avoid the collision (DESIGN.md).

   Every clause is sourced, nothing is invented:
   - "Small-sided football ... in Colombo": v1's site description.
   - six seasons, and every venue: content.js seasons/competitions, the
     venues settled by the owner 2026-09-03 (HOUSE-RULES section 7).
   - Turf Wars "where it started": owner, 2026-09-03 (HOUSE-RULES section 7).
   - Division 0 "on PS5": CONTEXT.md.
   - "Talent was never missing. The platform was.": the owner's own line, from
     the 4x4 Series proposal deck (v1 hero, 2026-09-10).
   - "Built by the futsal community": v1's signed-off hero headline. */
export function Hero() {
  return (
    <section id="hero" className="canvas-bone relative flex min-h-svh flex-col overflow-hidden">
      <Nav crestPriority />
      <div className="frame flex flex-1 items-center justify-center pt-6 pb-20">
        <div className="relative w-full max-w-[880px] text-center">
          {/* h1 first so the heading is read first; it is positioned, so it still
              paints over the paragraph that follows it. */}
          <h1 className="hero-overprint pointer-events-none absolute inset-0 grid xl:-inset-x-[120px] place-content-center font-display text-[clamp(2.25rem,6.9vw,6.75rem)] leading-[0.86] font-bold text-yellow uppercase">
            <span>Built by the</span>
            <span>futsal community.</span>
          </h1>
          <p className="hero-copy font-serif text-[clamp(1.45rem,2.5vw,2.4rem)] leading-[1.12] text-balance">
            Small-sided football in Colombo. Six seasons of the 4 x 4 Series at Athlete 360. Turf Wars at Club
            Fusion, where it started. Division 0 on PS5 at Pixels N Pints. Talent was never missing. The platform was.
          </p>
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
