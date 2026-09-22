import { preload } from "react-dom";
import raw from "@/content.js";
import { parseContent, whatsappHref } from "@/lib/content-data";
import { Nav } from "@/components/primitives/Nav";
import { HeroScrub } from "@/components/motion/HeroScrub";
import { SCRUB } from "@/lib/scrub";

/* Act 1, L0 PROTOTYPE: the night-mode hero. Huge condensed caps, the two
   audience actions, and a framed vertical scrub beside the headline: clip A
   from ticket 01 (IG post DWEgZpsCpWa, 11.0-13.4s), strike to goal. All the
   usable clips are vertical, so on a desktop the clip sits in a frame; on a
   phone, which is itself vertical, it fills the screen behind the words.

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
      <div
        id="content"
        className="frame flex flex-1 flex-col justify-end gap-8 pt-4 pb-[clamp(1.5rem,6vh,4rem)] md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 md:pb-10"
      >
        <div className="flex flex-col gap-6 md:gap-8">
          <h1 className="font-display text-[clamp(3.5rem,20vw,6rem)] leading-[0.84] font-bold uppercase md:text-[min(10.5vw,20vh)]">
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

        {/* The frame: full-bleed backdrop on a phone, a 9:16 window beside the
            headline from md up. */}
        <div className="absolute inset-0 -z-10 md:relative md:inset-auto md:z-auto md:aspect-[9/16] md:h-[min(76svh,720px)]">
          <picture>
            <source media="(max-width: 767px)" srcSet={`${SCRUB.base}/m/001.webp`} width={360} height={640} />
            <img
              src={`${SCRUB.base}/d/001.webp`}
              alt="A Frontier night game: a strike, the keeper beaten, the ball in the net."
              width={540}
              height={960}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </picture>
          <HeroScrub />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/10 md:hidden" />
        </div>
      </div>
    </section>
  );
}
