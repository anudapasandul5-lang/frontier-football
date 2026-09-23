import type { CSSProperties } from "react";
import { marqueePhotos } from "@/lib/home-photos";
import { Marquee } from "@/components/primitives/Marquee";

/* Act 2: the six Ticket 04 owner picks, full bleed on night mode and looped.
   Act 3 scatters the same frames round its centre photo, so this is
   the reader's first look at them and act 3 is where they come apart. Still
   until MotionGate turns motion on; nothing here needs a leaf of its own. */
export function Strip() {
  return (
    <section aria-label="Photographs" className="canvas-night py-[clamp(3rem,10vh,7rem)]">
      <div data-reveal className="wipe relative overflow-hidden">
        <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 z-10 bg-yellow" />
        <div className="wipe__layer relative" style={{ "--wipe-delay": "140ms" } as CSSProperties}>
          <Marquee label="Photographs from Frontier nights" seconds={70}>
            {marqueePhotos.map((p) => (
              <img
                key={p.id}
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                className="mr-3 h-[clamp(11rem,min(34vw,44svh),24rem)] w-auto"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
