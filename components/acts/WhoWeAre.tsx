import { thumbUrl } from "@/lib/album-data";
import { SplitReveal } from "@/components/primitives/SplitReveal";

/* Who We Are: a full-bleed SZN 6 night with the owner's words on it. The
   guide's still-to-video treatment was tried here and removed by the owner
   (2026-09-22).

   Copy is the owner's, from the 4x4 Series proposal deck (2026-09-10), cut
   down; the Moment act already says "Talent was never missing", so it is not
   repeated here. Still: Drive album szn-6. */
const STILL = { id: "1HBvbjQitxALSxMpRR8-1G72A2VWA2zek", w: 400, h: 368 };

export function WhoWeAre() {
  return (
    <section aria-labelledby="who-heading" data-tone="bone" data-chapter="Who we are" className="canvas-night relative">
      {/* L0 PROTOTYPE: the one hard image wipe. data-reveal hands it to the
          reveal observer; the yellow slab crosses first, the photo follows. */}
      <div data-reveal className="wipe relative h-svh overflow-hidden">
        <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
        <img
          src={thumbUrl(STILL.id, 2000)}
          alt="A 4 x 4 Series SZN 6 team together on the pitch at night, names on their shirts"
          width={STILL.w}
          height={STILL.h}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ "--wipe-delay": "140ms" } as React.CSSProperties}
          data-zoom="0.18"
          className="wipe__layer absolute inset-0 h-full w-full object-cover"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
        <div className="frame absolute inset-x-0 bottom-0 pb-[clamp(2rem,8vh,5rem)]">
          <p className="micro mb-3 text-yellow">Who we are</p>
          <SplitReveal
            id="who-heading"
            lines={["A main stage for Sri Lanka’s football community."]}
            className="max-w-[18ch] font-display text-[clamp(2.2rem,5.4vw,5.25rem)] leading-[0.88] font-bold text-balance uppercase"
          />
          <p className="mt-4 max-w-[46ch] text-[clamp(0.95rem,0.9rem+0.3vw,1.15rem)] leading-relaxed text-bone/85">
            Built to spotlight talent and unite everyone who shares a passion for the game.
          </p>
        </div>
      </div>
    </section>
  );
}
