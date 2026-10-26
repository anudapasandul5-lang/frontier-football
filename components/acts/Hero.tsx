import { Nav } from "@/components/primitives/Nav";
import { Roll } from "@/components/primitives/Roll";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { HeroVideo } from "@/components/motion/HeroVideo";

/* Act 1. United's hero: yellow condensed caps over the owner's hero film,
   then the two audience actions: players to WhatsApp, brands to Collaborate.
   History: the owner asked for United's scale with the trophy floating behind
   the copy (2026-09-23) and removed the serif paragraph the same day.

   opus55 redesign: the trophy is now something to play with (drag it, it
   leans to the pointer, then flies off to travel with the reader; TrophyStage), the two
   caps lines stay still on scroll (owner, 2026-10-26), the buttons have
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
    <>
    <Nav crestPriority floating />
    <section
      id="hero"
      data-tone="bone"
      data-chapter="Home"
      className="canvas-teal relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* Owner's hero film (2026-10-26) replaces the photo ring. The poster is
          the film's first frame, so the swap to video is seamless; HeroVideo
          starts after load (desktop) or first touch (phone). The scrim keeps
          bone and yellow caps readable on bright frames, and the bottom fade
          hands over to Who We Are's night canvas. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero/video-poster-phone.webp" />
          <img src="/hero/video-poster.webp" alt="" fetchPriority="high" decoding="async" className="absolute inset-0 size-full object-cover" />
        </picture>
        <HeroVideo />
        <span className="absolute inset-0 bg-ink/50" />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent" />
      </div>
      <div aria-hidden="true" className="h-20 shrink-0" />
      <div id="content" className="frame relative flex flex-1 flex-col items-center justify-center pb-4">
        {/* Bone caps, yellow on the closing word of each line (owner,
            2026-10-07: yellow on bone read as yellow on yellow, 1.45:1). */}
        <MicroLabel className="relative z-[3] mb-5 text-center">Football. Community. Culture.</MicroLabel>
        <h1 className="pointer-events-none flex w-full flex-col items-center gap-[clamp(8rem,14vh,11rem)] hero-weave text-center font-display text-[clamp(1rem,5.9vw,7rem)] leading-[0.86] font-bold whitespace-nowrap text-bone uppercase max-sm:text-[clamp(1.9rem,10vw,2.75rem)] max-sm:text-balance max-sm:whitespace-normal">
          <span className="relative z-[3]">Football, community and <span className="text-yellow">culture.</span></span>
          <span className="relative z-[3]">Giving Sri Lanka’s football a <span className="text-yellow">platform.</span></span>
        </h1>
      </div>

      <div className="frame relative z-[3] flex items-center gap-4 pb-6 max-sm:flex-col max-sm:gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <p className="micro text-center sm:hidden">
          Colombo, Sri Lanka
        </p>
        <span aria-hidden="true" className="max-sm:hidden" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="/events" className={`${button} bg-yellow text-ink`}>
            <Roll>Explore events</Roll>
          </a>
          <a href="/collaborate" className={`${button} border-2 border-bone hover:bg-bone hover:text-ink`}>
            <Roll>Partner with us</Roll>
          </a>
        </div>
        <p className="micro justify-self-end max-sm:hidden">Colombo, Sri Lanka</p>
      </div>
    </section>
    </>
  );
}
