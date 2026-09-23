import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";

/* The home page's "Join the community" teaser (plan L7): the Sunday Football
   League and one way in, to the Community page where the Registrations live.
   Held from production with the page (PLACEHOLDER gate).

   opus55: a full green field, United's colour-panel scale, the green being the
   league's own accent (SundayLeagueMark). Copy unchanged. Everything shares the
   frame's left edge (owner, 2026-09-23: the edge-to-edge name sat out of line
   with the label and the call to action); the photo fills the right column. */
export function CommunityTeaser() {
  return (
    <section
      aria-labelledby="community-teaser-heading"
      data-tone="ink"
      data-chapter="Community"
      className="canvas-green flex min-h-svh flex-col justify-center overflow-hidden py-[clamp(4rem,12vh,8rem)]"
    >
      <div className="frame grid items-center gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col items-start gap-[clamp(1.5rem,4vh,2.5rem)]">
          <div className="flex items-center gap-3">
            <img src="/crest.webp" alt="" width={525} height={640} loading="lazy" className="h-10 w-auto" />
            <span className="micro">Frontier presents</span>
          </div>
          <SplitReveal
            as="p"
            lines={["Sunday", "League."]}
            step={80}
            className="community-mark font-display leading-[0.8] font-bold uppercase"
          />
          <SplitReveal
            id="community-teaser-heading"
            lines={["Join the community."]}
            className="font-display text-[clamp(2rem,4vw,3.75rem)] leading-[0.88] font-bold uppercase"
          />
          <p className="max-w-[34ch] text-lg leading-snug">Bring a team or come alone as a free agent. Sundays, with Frontier.</p>
          <a
            href="/community"
            data-magnetic="0.25"
            className="btn flex min-h-14 items-center bg-ink px-8 font-display text-[clamp(1rem,0.9rem+0.4vw,1.35rem)] font-bold text-bone uppercase hover:bg-bone hover:text-ink"
          >
            <Roll>See the league</Roll>
          </a>
        </div>
        {/* A real Frontier Sunday: players greeting at a 4 x 4 Series match,
            full resolution from the SZN 4 Drive album. */}
        <img
          src="/home/ring/szn4-greeting.webp"
          alt="Players greeting each other on the pitch at a 4 x 4 Series match"
          width={1200}
          height={801}
          loading="lazy"
          decoding="async"
          data-parallax="-0.06"
          className="aspect-[4/5] w-full object-cover shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] max-md:aspect-[4/3]"
        />
      </div>
    </section>
  );
}
