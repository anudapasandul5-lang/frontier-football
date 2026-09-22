import raw from "@/content.js";
import { parseContent, whatsappHref } from "@/lib/content-data";
import { Nav } from "@/components/primitives/Nav";
import { HeroMotion } from "@/components/motion/HeroMotion";

/* Act 1. United's hero: a serif paragraph with Oswald caps in yellow laid
   straight over it, no attempt to avoid the collision (DESIGN.md), then the
   two audience actions: players to WhatsApp, brands to Collaborate. One
   primary and one secondary action only; watchers reach watch-alongs through
   Events in the nav. Footage cards and a stats row were tried in T2
   (2026-09-22) and removed by the owner.

   Every clause is sourced, nothing is invented:
   - "Small-sided football ... in Colombo": v1's site description.
   - six seasons, and every venue: content.js seasons/competitions, the
     venues settled by the owner 2026-09-03 (HOUSE-RULES section 7).
   - Turf Wars "where it started": owner, 2026-09-03 (HOUSE-RULES section 7).
   - Division 0 "on PS5": CONTEXT.md.
   - "Talent was never missing. The platform was.": the owner's own line, from
     the 4x4 Series proposal deck (v1 hero, 2026-09-10).
   - "Built by the futsal community": v1's signed-off hero headline. */

const content = parseContent(raw);
const playHref = whatsappHref(content.contact.whatsapp, content.contact.playerMessage);

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase";

export function Hero() {
  return (
    <section id="hero" className="canvas-bone relative flex min-h-svh flex-col overflow-hidden">
      <Nav crestPriority />
      <div className="frame relative flex flex-1 flex-col items-center justify-center gap-6 pt-2 pb-8 md:gap-10">
        <div className="relative grid w-full max-w-[760px] text-center">
          {/* h1 first so it is read first; both share one grid cell, z-1 paints it
              over the paragraph. Yellow on bone is 1.44:1: the owner's
              deliberate overprint (2026-09-18). Do not "fix" it. */}
          <h1 className="hero-overprint pointer-events-none z-[1] col-start-1 row-start-1 grid w-max place-content-center justify-self-center font-display text-[clamp(2.25rem,6.9vw,6.75rem)] leading-[0.86] font-bold text-yellow uppercase">
            <span>Built by the</span>
            <span>futsal community.</span>
          </h1>
          <p className="col-start-1 row-start-1 self-center font-serif text-[clamp(1.3rem,2.5vw,2.4rem)] leading-[1.12] text-balance">
            Small-sided football in Colombo. Six seasons of the 4 x 4 Series at Athlete 360. Turf Wars at Club Fusion,
            where it started. Division 0 on PS5 at Pixels N Pints. Talent was never missing. The platform was.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <a
            href={playHref ?? "/contact"}
            {...(playHref ? { target: "_blank", rel: "noopener noreferrer", "aria-label": "Join next season (opens WhatsApp in a new tab)" } : {})}
            className={`${button} bg-yellow text-ink transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]`}
          >
            Join next season
          </a>
          <a href="/collaborate" className={`${button} border-2 border-ink transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-bone active:scale-[0.97]`}>
            Partner with us
          </a>
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
