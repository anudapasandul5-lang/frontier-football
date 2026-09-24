import { Nav } from "@/components/primitives/Nav";
import { Roll } from "@/components/primitives/Roll";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { HeroRing } from "@/components/motion/HeroRing";

/* Act 1. United's hero: yellow condensed caps straight over the 3D trophy,
   then the two audience actions: players to WhatsApp, brands to Collaborate.
   History: the owner asked for United's scale with the trophy floating behind
   the copy (2026-09-23) and removed the serif paragraph the same day.

   opus55 redesign: the trophy is now something to play with (drag it, it
   leans to the pointer, then flies off to travel with the reader; TrophyStage), the two
   caps lines part sideways on scroll (HeroMotion), the buttons have
   rolling labels (not magnetic: owner, 2026-09-23), and a label row frames the stage like a broadcast
   lower third. Label copy is the site's own description (layout.tsx
   metadata) and Who We Are's "Sri Lanka's football community".

   "Built by the football community": v1's hero headline, "futsal" swapped
   for "football" by the owner on 2026-09-24.

   UX audit T1 (2026-09-24): the player action goes to the Sunday League
   section on Community, where the team and free-agent drafts live, and the
   phone shows the offer and place in one line above the actions. */

const button = "btn flex min-h-11 items-center px-6 font-display text-[clamp(0.9rem,0.8rem+0.3vw,1.1rem)] font-bold uppercase";

export function Hero() {
  return (
    <section
      id="hero"
      data-tone="ink"
      data-chapter="Home"
      className="canvas-bone relative isolate flex min-h-svh touch-pan-y flex-col overflow-hidden select-none"
    >
      <Nav crestPriority floating />
      <HeroRing />
      <div id="content" className="frame relative flex flex-1 flex-col items-center justify-center pb-4">
        {/* Yellow on bone is the owner's deliberate overprint (2026-09-18).
            Both lines sit above the photo band (HeroRing, z-2) so no photo
            covers the words. Ink slabs behind the lines were tried for
            contrast and rejected by the owner (UX audit T2, 2026-09-24). */}
        <h1 className="pointer-events-none flex flex-col items-center hero-weave text-center font-display text-[clamp(min(2.4rem,10vw),9.2vw,9.5rem)] leading-[0.86] font-bold whitespace-nowrap text-yellow uppercase">
          <span className="hero-line relative z-[3]">Built by the</span>
          <span className="hero-line relative z-[3]">football community.</span>
        </h1>
      </div>

      <div className="frame relative z-[3] flex items-center justify-between gap-4 pb-6 max-sm:flex-col max-sm:gap-3">
        <p className="micro text-center sm:hidden">
          <span className="whitespace-nowrap">Small-sided football ·</span> <span className="whitespace-nowrap">Colombo, Sri Lanka</span>
        </p>
        <p className="micro max-sm:hidden">Small-sided football</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="/community#sunday-league" className={`${button} bg-yellow text-ink`}>
            <Roll>Explore Sunday League</Roll>
          </a>
          <a href="/collaborate" className={`${button} border-2 border-ink hover:bg-ink hover:text-bone`}>
            <Roll>Partner with us</Roll>
          </a>
        </div>
        <p className="micro max-sm:hidden">Colombo, Sri Lanka</p>
      </div>
      <HeroMotion />
    </section>
  );
}
