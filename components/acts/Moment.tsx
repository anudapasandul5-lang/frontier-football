import type { CSSProperties } from "react";
import { thumbUrl } from "@/lib/album-data";
import { marqueePhotos, statementPhoto, type HomePhoto } from "@/lib/home-photos";
import { MomentMotion } from "@/components/motion/MomentMotion";

/* Act 3, United's pinned photo act. The server markup is a complete, still
   poster: headline, label, both lines, every photo that
   carries content. MomentMotion only moves what is already there, after
   hydration and only when motion is allowed (HOUSE-RULES section 5).

   Copy: "Talent was never missing. The platform was." is the owner's own line
   (v1 hero, from the 4x4 Series proposal deck). "Built by football. Powered
   by community." is v1's brand tagline. Nothing else is said. */

// Scatter markers: centre of each marker as a fraction of the stage, and a
// tilt. Laid out like United's frame, round the centre photo, never over the
// headline's middle band.
const scatter = [
  { x: 0.2, y: 0.16, r: -7 },
  { x: 0.83, y: 0.13, r: 6 },
  { x: 0.1, y: 0.47, r: 5 },
  { x: 0.9, y: 0.43, r: -6 },
  { x: 0.29, y: 0.83, r: 8 },
  { x: 0.74, y: 0.86, r: -5 },
  { x: 0.56, y: 0.1, r: 4 },
  { x: 0.12, y: 0.78, r: -9 },
  { x: 0.9, y: 0.74, r: 7 },
];

function Photo({ p, width, className = "", style, eager = false }: { p: HomePhoto; width: number; className?: string; style?: CSSProperties; eager?: boolean }) {
  return (
    <img
      src={thumbUrl(p.id, width)}
      alt={p.alt}
      width={p.w}
      height={p.h}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={style}
    />
  );
}

function Headline() {
  return (
    <div className="moment-copy pointer-events-none absolute inset-0 z-20 grid place-content-center px-4 text-center">
      <p className="micro moment-label mb-4 text-yellow">Built by football. Powered by community.</p>
      <h2 id="moment-heading" className="font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] text-bone uppercase text-balance">
        <span className="moment-line block">Talent was never missing.</span>
        <span className="moment-line moment-line--last block">The platform was.</span>
      </h2>
    </div>
  );
}

export function Moment() {
  // The pan strip reuses the statement frame first, so the hand-off from the
  // zoomed photo to the strip is the same picture in the same place.
  const strip = [statementPhoto, marqueePhotos[1], marqueePhotos[3], marqueePhotos[5]];

  return (
    <section id="moment" aria-labelledby="moment-heading" className="canvas-ink relative">
      <div className="moment-stage relative h-svh overflow-hidden">
        {marqueePhotos.map((p, i) => (
          <Photo
            key={p.id}
            p={p}
            width={400}
            className="moment-marker absolute z-10 w-[clamp(64px,10vw,160px)] -translate-x-1/2 -translate-y-1/2 rotate-(--tilt)"
            style={{ left: `${scatter[i].x * 100}%`, top: `${scatter[i].y * 100}%`, "--tilt": `${scatter[i].r}deg` } as CSSProperties}
          />
        ))}
        <div className="moment-centre absolute top-1/2 left-1/2 w-[min(78vw,640px)] -translate-x-1/2 -translate-y-1/2">
          <Photo p={statementPhoto} width={1600} className="block h-auto w-full" />
          <span aria-hidden="true" className="absolute inset-0 bg-ink/35" />
        </div>
        {/* The strip only exists once motion is on: every frame in it is
            already on the page as a marker, so the still page loses
            nothing without it. */}
        {/* Sized by CSS, not measured: panel one is exactly the stage, the
            rest keep their photo's ratio at full height. */}
        <div aria-hidden="true" className="moment-strip absolute inset-y-0 left-0 z-0 hidden w-full">
          {strip.map((p, i) => (
            <div
              key={p.id}
              className={`moment-panel relative h-full shrink-0 ${i === 0 ? "w-full" : ""}`}
              style={i === 0 ? undefined : { aspectRatio: `${p.w} / ${p.h}` }}
            >
              <Photo p={p} width={1600} className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-ink/35" />
            </div>
          ))}
        </div>
        <Headline />
      </div>
      <MomentMotion />
    </section>
  );
}
