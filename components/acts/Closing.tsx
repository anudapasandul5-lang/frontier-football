import { Roll } from "@/components/primitives/Roll";

/* Act 9. The home page ends like the inner pages: a Next band handing the
   reader on, then the footer bar with the channel icons (owner, 2026-10-28:
   the full-screen photo finish is gone). */
export function Closing() {
  return (
    <section aria-labelledby="closing-heading" data-tone="bone" data-chapter="Next" className="canvas-ink border-t border-bone/15">
      <h2 id="closing-heading" className="sr-only">
        Next: Who We Are
      </h2>
      <a href="/who-we-are" className="frame group flex flex-col gap-4 py-[clamp(2.5rem,7vh,4.5rem)]">
        {/* Label hidden on screen, kept for screen readers (owner, 2026-10-28). */}
        <span className="sr-only">Next:</span>
        <span className="flex items-end justify-between gap-6 font-display text-title leading-[0.85] font-bold uppercase">
          <Roll>Who We Are</Roll>
          <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-3">
            &rarr;
          </span>
        </span>
      </a>
    </section>
  );
}
