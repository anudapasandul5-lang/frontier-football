import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { phoneSrcSet } from "@/lib/phone-image";

/* The home page's "Join the community" teaser (plan L7): the Sunday Football
   League and one way in, to the Community page where the Registrations live.
   Held from production with the page (PLACEHOLDER gate).

   2026-10-28 plan: the green box is gone. One big landscape photo fills the
   screen with the words and the button on top, on the left and clear of the
   faces. The photo is a stand-in until the owner adds the final one. */
export function CommunityTeaser() {
  return (
    <section
      aria-labelledby="community-teaser-heading"
      data-tone="bone"
      data-chapter="Community"
      className="canvas-night relative isolate flex min-h-svh flex-col justify-center overflow-hidden py-[clamp(4rem,12vh,8rem)]"
    >
      <img
        src="/home/community-team.webp"
        srcSet={phoneSrcSet("/home/community-team.webp")}
        sizes="100vw"
        alt="Six smiling players in matching black and gold kits, with their goalkeeper in teal, line up on the pitch"
        width={1280}
        height={853}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover object-[center_8%]"
      />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night/85 via-night/45 to-night/5 max-md:bg-night/60" />
      <div className="flex flex-col items-start gap-[clamp(1.5rem,4vh,2.5rem)] px-[clamp(1rem,2.5vw,3rem)]">
        <SplitReveal
          id="community-teaser-heading"
          lines={["Join the", "community."]}
          step={80}
          className="community-mark font-display leading-[0.8] font-bold uppercase"
        />
        <p className="max-w-[34ch] text-lead leading-snug">Bring your team, or come alone and find one. Every Sunday, there is a place for you with Frontier.</p>
        <a
          href="/community#sunday-league"
          className="btn flex min-h-12 items-center bg-yellow px-8 font-display text-button font-bold text-ink uppercase hover:bg-bone"
        >
          <Roll>Join Sunday League</Roll>
        </a>
      </div>
    </section>
  );
}
