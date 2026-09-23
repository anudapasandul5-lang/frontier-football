import raw from "@/content.js";
import { parseContent, whatsappHref } from "@/lib/content-data";
import { Nav } from "@/components/primitives/Nav";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { HeroTrophy } from "@/components/motion/HeroTrophy";

/* Act 1. United's hero: a serif paragraph with Oswald caps in yellow laid
   straight over it, no attempt to avoid the collision (DESIGN.md), then the
   two audience actions: players to WhatsApp, brands to Collaborate. One
   primary and one secondary action only; watchers reach watch-alongs through
   Events in the nav. Footage cards and a stats row were tried in T2
   (2026-09-22) and removed by the owner. On 2026-09-23 the owner asked for
   United's scale (paragraph ~70vw) with the 3D trophy floating behind the
   copy (HeroTrophy), buttons kept but smaller. Later the same day the owner
   removed the serif paragraph: the caps now sit straight on the trophy.

   "Built by the futsal community": v1's signed-off hero headline. */

const content = parseContent(raw);
const playHref = whatsappHref(content.contact.whatsapp, content.contact.playerMessage);

const button = "flex min-h-10 items-center px-5 font-display text-[clamp(0.875rem,0.8rem+0.3vw,1.05rem)] font-bold uppercase";

export function Hero() {
  return (
    <section id="hero" className="canvas-bone relative flex min-h-svh flex-col overflow-hidden">
      <Nav crestPriority />
      <HeroTrophy />
      <div id="content" className="frame relative flex flex-1 flex-col items-center justify-center gap-6 pt-2 pb-8 md:gap-10">
        <div className="relative grid w-full max-w-[min(100%,70vw)] max-md:max-w-full text-center">
          {/* Yellow on bone is 1.44:1: the owner's deliberate overprint
              (2026-09-18). Do not "fix" it. */}
          <h1 className="hero-overprint pointer-events-none z-[1] col-start-1 row-start-1 grid w-max place-content-center justify-self-center font-display text-[clamp(2.25rem,7.6vw,8rem)] leading-[0.86] font-bold text-yellow uppercase">
            <span>Built by the</span>
            <span>futsal community.</span>
          </h1>
        </div>

        {/* Pushed below the trophy's black base, so the outline button stays on bone. */}
        <div className="relative mt-[8svh] flex flex-wrap items-center justify-center gap-3">
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
