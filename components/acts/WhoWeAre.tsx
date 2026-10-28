import { phoneSrcSet } from "@/lib/phone-image";
import { SplitReveal } from "@/components/primitives/SplitReveal";

/* Who We Are: reviewed daylight football with the owner's words on it. The
   guide's still-to-video treatment was tried here and removed by the owner
   (2026-09-22).

   Copy is the owner's, from the 4x4 Series proposal deck (2026-09-10), cut
   down; the Moment act already says "Talent was never missing", so it is not
   repeated here. Still: DSC_9019 (SZN 6, night), wide crop (owner, 2026-10-28). */
const STILL = { src: "/home/who-we-are-night.webp", w: 2326, h: 1038 };

export function WhoWeAre() {
  return (
    <section aria-labelledby="who-heading" data-tone="bone" data-chapter="Who we are" className="canvas-night relative">
      {/* L0 PROTOTYPE: the one hard image wipe. data-reveal hands it to the
          reveal observer; the yellow slab crosses first, the photo follows. */}
      <div data-reveal className="wipe relative h-svh overflow-hidden">
        <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
        <img
          src={STILL.src}
          srcSet={phoneSrcSet(STILL.src)}
          sizes="(max-width: 767px) 150svh, 100vw"
          alt="A player lines up a shot as a defender slides in under the floodlights at 4 x 4 Series SZN 6"
          width={STILL.w}
          height={STILL.h}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ "--wipe-delay": "140ms" } as React.CSSProperties}
          className="wipe__layer absolute inset-0 h-full w-full -scale-x-100 object-cover object-[48%_center] md:object-center"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-night/90 via-night/45 to-night/10" />
        {/* Text starts about a third down, level with the pitch (owner,
            2026-10-28), and never under the 5rem floating header. */}
        <div className="absolute inset-x-0 top-0 px-[clamp(1rem,2.5vw,3rem)] pt-[max(calc(5rem+1.5rem),30svh)]">
          <SplitReveal
            id="who-heading"
            lines={["A platform for Sri Lanka’s football community."]}
            className="max-w-[18ch] font-display text-title leading-[0.88] font-bold text-balance uppercase"
          />
          <p className="mt-5 max-w-[46ch] text-lead leading-relaxed text-bone">
            A place for players, fans and brands to show up, get seen and be part of something bigger than the final whistle.
          </p>
        </div>
      </div>
    </section>
  );
}
