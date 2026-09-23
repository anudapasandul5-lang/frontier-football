import { introScript } from "@/lib/intro";

/* The first-visit intro (plan L6b). The script runs while the page is still
   being parsed, before anything paints, and only marks <html> with
   data-intro; globals.css shows the overlay for that mark alone. So the
   overlay is there from the first frame or not at all, the hero renders
   underneath it the whole time, and JS off, reduced motion, a repeat visit or
   a failing store all mean no intro. Pure CSS after that: no hydration wait. */
export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <div aria-hidden="true" className="intro canvas-night">
        <img src="/crest.webp" alt="" width={525} height={640} className="intro-crest h-28 w-auto md:h-36" />
        <p className="intro-word font-display text-[clamp(2.5rem,11vw,7rem)] leading-[0.84] font-bold uppercase">
          Frontier <span className="text-yellow">Football.</span>
        </p>
      </div>
    </>
  );
}
