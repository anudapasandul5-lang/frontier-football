/* Three full-resolution Frontier photos under a page's masthead (owner,
   2026-09-23: the inner pages had no photographs). Portrait 3:4 crops from the
   Drive albums, stored in public/pages/. The outer two tilt a little so the
   strip reads as prints laid down, not a stock grid; they sit straight below
   640px, where a tilt would cost width. */

export type StripPhoto = { src: string; alt: string };

const tilt = ["sm:-rotate-2", "sm:translate-y-6", "sm:rotate-[1.5deg]"];
// Each print drifts against the scroll at its own rate (Interactions).
const drift = ["-0.05", "0.07", "-0.03"];

export function PhotoStrip({ photos }: { photos: StripPhoto[] }) {
  return (
    <section aria-label="Photographs" className="frame py-[clamp(3rem,10vh,6rem)]">
      <div className="grid grid-cols-3 gap-2 sm:gap-5">
        {photos.map((p, i) => (
          <figure key={p.src} data-parallax={drift[i % drift.length]} className={`border-2 border-current bg-bone p-1 sm:p-2 ${tilt[i % tilt.length]}`}>
            <img
              src={p.src}
              alt={p.alt}
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="block aspect-[3/4] w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
