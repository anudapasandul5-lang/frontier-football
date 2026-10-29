import { Roll } from "@/components/primitives/Roll";

/* Every inner page ends by handing the reader on, in menu order, the way the
   home page's acts run into each other. The whole band is the link. */
const order = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/community", label: "Community" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/contact", label: "Contact" },
];

export function NextPage({ current }: { current: string }) {
  const i = order.findIndex((p) => p.href === current);
  const next = order[(i + 1) % order.length];
  return (
    <section data-tone="bone" data-chapter="Next" className="canvas-ink border-t border-bone/15">
      <a href={next.href} className="frame group flex flex-col gap-4 py-[clamp(2.5rem,7vh,4.5rem)]">
        {/* Label hidden on screen, kept for screen readers (owner, 2026-10-28). */}
        <span className="sr-only">Next:</span>
        <span className="flex items-end justify-between gap-6 font-display text-title leading-[0.85] font-bold uppercase">
          <Roll>{next.label}</Roll>
          <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-3">
            &rarr;
          </span>
        </span>
      </a>
    </section>
  );
}
