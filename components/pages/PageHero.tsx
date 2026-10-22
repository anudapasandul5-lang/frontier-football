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
  labels = ["Frontier Football", "Colombo, Sri Lanka"],
  transition,
}: {
  chapter: string;
  eyebrow: string;
  lines: string[];
  photo: { src: string; alt: string; position?: string; credit?: string };
  children?: ReactNode;
  actions?: ReactNode;
  labels?: [string, string];
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

      <div className="frame flex flex-1 flex-col justify-end pb-[clamp(1.5rem,5vh,3.5rem)]">
        <p className="micro mb-4 text-yellow text-[clamp(0.875rem,0.7rem+0.6vw,1.25rem)]">{eyebrow}</p>
        <SplitReveal
          as="h1"
          id="page-heading"
          lines={lines}
          lineClassName="last:text-yellow"
          className="font-display text-[min(clamp(3.25rem,15.5vw,12rem),24svh)] leading-[0.84] font-bold uppercase"
        />
        {children ? (
          <div className="mt-6 max-w-[46ch] text-[clamp(1.05rem,0.95rem+0.45vw,1.4rem)] leading-[1.45] text-bone/90">
            {children}
          </div>
        ) : null}
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      {/* The rule sits on an inner row so it starts where the text does, not
          at the frame's padding edge. */}
      <div className="frame">
        <div className="flex items-center justify-between gap-4 border-t border-bone/25 py-4">
          <p className="micro">{labels[0]}</p>
          <p className="micro max-sm:hidden">Scroll</p>
          <p className="micro">{labels[1]}</p>
        </div>
      </div>
    </section>
    </>
  );
}

/* The home hero's button, for page heroes and closing bands. */
export const heroButton =
  "btn flex min-h-11 items-center px-6 font-display text-[clamp(0.9rem,0.8rem+0.3vw,1.1rem)] font-bold uppercase";
