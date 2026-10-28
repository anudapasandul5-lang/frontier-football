import { Fragment, type CSSProperties } from "react";
import { marqueePhotos, markerPhotos, statementPhoto, type HomePhoto } from "@/lib/home-photos";
import { MomentMotion } from "@/components/motion/MomentMotion";
import { phoneSrcSet } from "@/lib/phone-image";

/* Act 3, United's pinned photo act. The server markup is a complete, still
   poster: headline, label, both lines, every photo that
   carries content. MomentMotion only moves what is already there, after
   hydration and only when motion is allowed (HOUSE-RULES section 5).

   Copy: "Talent was never missing. The platform was." is the owner's own line
   (v1 hero, from the 4x4 Series proposal deck). "Built by football. Powered
   by community." is v1's brand tagline. Nothing else is said. */

// Scatter markers: centre of each marker as a fraction of the stage. Laid out
// like United's frame, round the centre photo, never over the headline's
// middle band. Kept straight (2026-10-27): tilted cards read as messy.
// None on phones (UX audit 2026-10-27). Owner 2026-10-27: three more, small,
// placed clear of the screen edges and the headline band. `small` cards are
// about two-thirds the size of the first three.
const scatter = [
  { x: 0.2, y: 0.16 },
  { x: 0.9, y: 0.43 },
  { x: 0.29, y: 0.83 },
  { x: 0.8, y: 0.13, small: true },
  { x: 0.1, y: 0.64, small: true },
  { x: 0.77, y: 0.84, small: true },
];

function Photo({ p, width, className = "", style, eager = false }: { p: HomePhoto; width: number; className?: string; style?: CSSProperties; eager?: boolean }) {
  return (
    <img
      src={p.src}
      srcSet={phoneSrcSet(p.src)}
      // Markers are at most 160px wide; everything else can fill the stage.
      sizes={width <= 400 ? "160px" : "100vw"}
      alt={p.alt}
      width={p.w}
      height={p.h}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

// One span per word: the motion starts every word as a faint ghost over the
// photo, so the jersey name shows, then fills them in one by one on scroll
// (owner, 2026-10-28).
function Ghost({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <span className="moment-mask">{word}</span>
    </Fragment>
  ));
}

function Headline() {
  return (
    <div className="moment-copy pointer-events-none absolute inset-0 z-20 grid place-content-center px-4 text-center">
      <p className="moment-label mb-5 font-display text-[clamp(1.1rem,2.4vw,2.25rem)] leading-[1] font-bold tracking-[0.04em] text-yellow uppercase">
        <Ghost text="Built by football. Powered by community." />
      </p>
      <h2 id="moment-heading" className="font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] text-bone uppercase text-balance">
        <span className="moment-line block">
          <Ghost text="Talent was never missing." />
        </span>
        <span className="moment-line moment-line--last block">The platform was.</span>
      </h2>
    </div>
  );
}

export function Moment() {
  // The pan strip reuses the statement frame first, so the hand-off from the
  // zoomed photo to the strip is the same picture in the same place.
  const strip = [statementPhoto, ...marqueePhotos];

  return (
    <section id="moment" data-tone="bone" aria-labelledby="moment-heading" className="canvas-night relative overflow-x-clip">
      <div className="moment-stage relative h-svh overflow-hidden">
        {markerPhotos.slice(0, scatter.length).map((p, i) => (
          <Photo
            key={p.id}
            p={p}
            width={400}
            className={`moment-marker absolute z-10 ${scatter[i].small ? "w-[clamp(48px,6.5vw,104px)]" : "w-[clamp(64px,10vw,160px)]"} -translate-x-1/2 -translate-y-1/2 max-[899px]:hidden`}
            style={{ left: `${scatter[i].x * 100}%`, top: `${scatter[i].y * 100}%` } as CSSProperties}
          />
        ))}
        <div className="moment-centre absolute top-1/2 left-1/2 w-[min(78vw,640px)] -translate-x-1/2 -translate-y-1/2">
          <Photo p={statementPhoto} width={1600} className="block h-auto w-full" />
          <span aria-hidden="true" className="absolute inset-0 bg-ink/35" />
        </div>
        {/* The strip only exists once motion is on. The still page shows
            the centre photo and up to three markers, not every frame. */}
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
