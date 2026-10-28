/* Three full-resolution Frontier photos under a page's masthead (owner,
   2026-09-23: the inner pages had no photographs). Landscape 4:3 crops from
   the Drive albums, stored in public/pages/ and public/who/. Straight and
   unframed (owner, 2026-09-24: the tilted 3:4 prints cut the subjects off
   and read as crooked scans). */

import { phoneSrcSet } from "@/lib/phone-image";

export type StripPhoto = { src: string; alt: string };

/* `aspect` is for pages whose photos are 3:2 and must not lose their edges. */
export function PhotoStrip({ photos, aspect = "aspect-[4/3]" }: { photos: StripPhoto[]; aspect?: string }) {
  return (
    <section aria-label="Photographs" className="frame py-[clamp(3rem,10vh,6rem)]">
      {/* Phone: one wide photo over two, so none shrinks to a thumbnail. */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            srcSet={phoneSrcSet(p.src)}
            sizes={i === 0 ? "(min-width: 640px) 33vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
            alt={p.alt}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className={`block ${aspect} w-full object-cover ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
