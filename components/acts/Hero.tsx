import { preload } from "react-dom";
import raw from "@/content.js";
import { parseContent, whatsappHref } from "@/lib/content-data";
import { Nav } from "@/components/primitives/Nav";
import { HeroScrub } from "@/components/motion/HeroScrub";
import { SCRUB } from "@/lib/scrub";

/* Act 1, L0 PROTOTYPE: the night-mode hero. Huge condensed caps, the two
   audience actions, and a landscape scroll-scrubbed clip (owner's pick,
   2026-09-22): IG post DZFOfDRKNOb, the SZN 5 promo, 1:23.80-1:25.74, a
   player beats a defender, then a wide shot of the strike and follow-through.
   Desktop: the clip fills the hero behind the words. Phone: the clip fills
   the space between the nav and the words (a centre crop), so the pinned
   hero is exactly one screen and never shows an empty band.

   The first frame is a plain <img>, fetched at high priority: it is the LCP
   image and the whole of the hero under reduced motion or with JS off.
   HeroScrub paints the other frames over it once the page has loaded.

   Copy is sourced, nothing invented: "Small-sided football in Colombo" is
   v1's site description; "Talent was never missing. The platform was." is the
   owner's line from the 4x4 Series proposal deck (v1 hero, 2026-09-10). */

const content = parseContent(raw);
const playHref = whatsappHref(content.contact.whatsapp, content.contact.playerMessage);

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

export function Hero() {
  // The still is the LCP image: preload the size each screen will use.
  preload(`${SCRUB.base}/d/001.webp`, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
  preload(`${SCRUB.base}/m/001.webp`, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  return (
    <section id="hero" className="canvas-night relative isolate flex min-h-svh flex-col overflow-hidden">
      <Nav crestPriority />
      <div className="relative min-h-[36svh] w-full flex-1 md:absolute md:inset-0 md:-z-10">
        <picture>
          <source media="(max-width: 767px)" srcSet={`${SCRUB.base}/m/001.webp`} width={480} height={270} />
          <img
            src={`${SCRUB.base}/d/001.webp`}
            alt="A 4 x 4 Series player beats a defender, then strikes the ball."
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        <HeroScrub />
        {/* Scrim for the words: heavier bottom-left, where they sit. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-tr from-night via-night/60 to-night/10 md:block"
        />
        {/* And a band under the nav, so MENU reads over a bright sky. */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-night/80 to-transparent md:block" />
      </div>
      <div id="content" className="frame flex flex-col gap-6 pt-6 md:flex-1 md:justify-end md:pt-6 pb-[clamp(1.5rem,6vh,4rem)] md:gap-8 md:pb-[clamp(2rem,8vh,5rem)]">
        <h1 className="font-display text-[clamp(3.5rem,20vw,6rem)] leading-[0.84] font-bold uppercase md:text-[min(12vw,22vh)]">
          <span className="block">Frontier</span>
          <span className="block text-yellow">Football.</span>
        </h1>
        <p className="max-w-[34ch] text-[clamp(1.05rem,0.95rem+0.4vw,1.35rem)] leading-snug text-bone/90">
          Small-sided football in Colombo. Talent was never missing. The platform was.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={playHref ?? "/contact"}
            {...(playHref ? { target: "_blank", rel: "noopener noreferrer", "aria-label": "Join next season (opens WhatsApp in a new tab)" } : {})}
            className={`${button} bg-yellow text-ink`}
          >
            Join next season
          </a>
          <a href="/collaborate" className={`${button} border-2 border-bone hover:bg-bone hover:text-ink`}>
            Partner with us
          </a>
        </div>
      </div>
    </section>
  );
}
