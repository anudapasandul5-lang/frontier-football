import { ViewTransition, type CSSProperties, type ReactNode } from "react";
import { Nav } from "@/components/primitives/Nav";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { phoneSrcSet } from "@/lib/phone-image";

/* The inner pages' first act, in the home page's language (owner, 2026-09-23:
   "redesign the other pages like you did the homescreen"). A full-screen
   Frontier photograph arrives behind the yellow broadcast wipe and settles
   from enlarged (data-zoom), the caps headline rises word by word, and a label
   row frames the foot of the screen like the home hero's lower third. The
   header floats over it and takes the tone of whatever canvas is below.

   Photos are full-resolution Drive frames in public/heroes/. The last headline
   line is yellow: the home hero's overprint, carried over. */
export function PageHero({
  chapter,
  eyebrow,
  lines,
  photo,
  children,
  actions,
  transition,
}: {
  chapter: string;
  eyebrow?: string;
  lines: string[];
  photo: { src: string; alt: string; position?: string; credit?: string };
  children?: ReactNode;
  actions?: ReactNode;
  /* Shared-element name: an album hero morphs from the gallery band that
     opened it. */
  transition?: string;
}) {
  const image = (
    <img
      src={photo.src}
      srcSet={phoneSrcSet(photo.src)}
      sizes="100vw"
      alt={photo.alt}
      width={2000}
      height={1335}
      fetchPriority="high"
      decoding="async"
      data-zoom="0.16"
      style={{ "--wipe-delay": "140ms", objectPosition: photo.position ?? "center" } as CSSProperties}
      className="wipe__layer absolute inset-0 h-full w-full object-cover"
    />
  );

  return (
    <>
    <Nav floating />
    <section
      data-tone="bone"
      data-chapter={chapter}
      aria-labelledby="page-heading"
      className="canvas-night relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      <div aria-hidden="true" className="h-20 shrink-0" />
      <div data-reveal className="wipe absolute inset-0 -z-10 overflow-hidden">
        <span aria-hidden="true" className="wipe__layer wipe__flash absolute inset-0 bg-yellow" />
        {transition ? (
          <ViewTransition name={transition} share="album-cover" default="none">
            {image}
          </ViewTransition>
        ) : (
          image
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />
      </div>
      {photo.credit ? <p className="micro absolute top-24 right-4 z-10 bg-ink px-3 py-2 text-bone">Photo: {photo.credit}</p> : null}

      {/* Text sits left and mid-height like the FLOST8 hero (owner, 2026-10-28:
          "the headlines should sit like this"), not in the centred 1170px frame,
          which on a wide screen pushed the headline across the photo's faces. */}
      <div className="flex flex-1 flex-col justify-center px-[clamp(1rem,2.5vw,3rem)] pb-[clamp(1.5rem,5vh,3.5rem)]">
        {/* Shadow: on a bright photo the yellow label fell to 3.2:1 (critique 2026-10-27). */}
        {eyebrow ? <p className="micro mb-4 text-yellow text-label [text-shadow:0_1px_10px_rgb(0_0_0/0.75)]">{eyebrow}</p> : null}
        <SplitReveal
          as="h1"
          id="page-heading"
          lines={lines}
          lineClassName="last:text-yellow"
          smallStop
          className="flex flex-wrap gap-x-[0.22em] font-display text-[clamp(2.5rem,calc(7.4vw+36px),9.375rem)] leading-[0.84] font-bold uppercase"
        />
        {children ? (
          <div className="mt-6 max-w-[46ch] text-lead leading-[1.45] text-bone/90">
            {children}
          </div>
        ) : null}
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
    </>
  );
}

/* The home hero's button, for page heroes and closing bands. */
export const heroButton =
  "btn flex min-h-12 items-center px-6 font-display text-button font-bold uppercase";
