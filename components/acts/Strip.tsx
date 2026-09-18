import { thumbUrl } from "@/lib/album-data";
import { marqueePhotos } from "@/lib/home-photos";
import { Marquee } from "@/components/primitives/Marquee";

/* Act 2, United's photo marquee: the nine frames T2 picked, full bleed on ink,
   looped. Act 3 scatters the same frames round its centre photo, so this is
   the reader's first look at them and act 3 is where they come apart. Still
   until MotionGate turns motion on; nothing here needs a leaf of its own. */
export function Strip() {
  return (
    <section aria-label="Photographs" className="canvas-ink py-[clamp(3rem,10vh,7rem)]">
      <Marquee label="Photographs from Frontier nights" seconds={70}>
        {marqueePhotos.map((p) => (
          <img
            key={p.id}
            src={thumbUrl(p.id, 800)}
            alt={p.alt}
            width={p.w}
            height={p.h}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="mr-3 h-[clamp(11rem,min(34vw,44svh),24rem)] w-auto"
          />
        ))}
      </Marquee>
    </section>
  );
}
