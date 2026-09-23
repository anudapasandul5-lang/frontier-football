import raw from "@/content.js";
import { parseContent, whatsappHref } from "@/lib/content-data";
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
   metadata) and Who We Are's "Sri Lanka's futsal community".

   "Built by the futsal community": v1's signed-off hero headline. */

const content = parseContent(raw);
const playHref = whatsappHref(content.contact.whatsapp, content.contact.playerMessage);

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
        {/* The photo band (HeroRing, z-2) weaves through the headline: the
            first line sits behind it, the second in front. Yellow on bone is
            the owner's deliberate overprint (2026-09-18). */}
        <h1 className="pointer-events-none flex flex-col items-center hero-weave text-center font-display text-[clamp(2.4rem,9.2vw,9.5rem)] leading-[0.86] font-bold whitespace-nowrap text-yellow uppercase">
          <span className="hero-line relative z-[1]">Built by the</span>
          <span className="hero-line relative z-[3]">futsal community.</span>
        </h1>
      </div>

      <div className="frame relative z-[3] flex items-center justify-between gap-4 pb-6">
        <p className="micro max-sm:hidden">Small-sided football</p>
        <div className="flex flex-wrap items-center justify-center gap-3 max-sm:mx-auto">
          <a
            href={playHref ?? "/contact"}
            {...(playHref ? { target: "_blank", rel: "noopener noreferrer", "aria-label": "Join next season (opens WhatsApp in a new tab)" } : {})}
            className={`${button} bg-yellow text-ink`}
          >
            <Roll>Join next season</Roll>
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
