"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Act 5 as one pinned slider (owner, 2026-09-23): the colour panels sit in a
   row and slide left as the reader scrolls, one screen of scroll per panel,
   snapping so it never rests on half of two colours. The server renders a
   plain vertical stack; the row layout is set here, inside
   gsap.matchMedia("(prefers-reduced-motion: no-preference)"), so reduced
   motion, no JS, or the setting flipping mid-visit all leave or restore the
   stack. The counter is decoration (each panel keeps its own h2), so it is
   aria-hidden and only exists while the slider runs. */
export function CompetitionsMotion({ count }: { count: number }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  useGSAP(() => {
    const wrap = anchor.current?.parentElement;
    const track = wrap?.querySelector<HTMLElement>(".competitions-track");
    if (!wrap || !track || count < 2) return;
    const panels = Array.from(track.children) as HTMLElement[];

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Percentages of the track, not vw: 100vw counts the scrollbar and
      // would leave a sliver of the next colour showing.
      gsap.set(track, { display: "flex", width: `${count * 100}%` });
      gsap.set(panels, { width: `${100 / count}%`, flexShrink: 0 });
      setIndex(1);

      const slide = gsap.to(track, {
        xPercent: (-100 * (count - 1)) / count,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${(count - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          // inertia off: with Lenis' momentum, velocity-projected snapping
          // flung one wheel flick from the first panel straight to the last.
          snap: { snapTo: 1 / (count - 1), inertia: false, delay: 0.1, duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
          invalidateOnRefresh: true,
          onUpdate: (self) => setIndex(Math.round(self.progress * (count - 1)) + 1),
        },
      });

      // Depth parallax (owner, 2026-09-23): driven by the slide itself through
      // containerAnimation, so it only moves while the row moves. The tinted
      // background lags the panel (far away), the framed photos run ahead of it
      // and drift apart vertically (close). Every value crosses zero when the
      // panel is centred, so a panel at rest shows its layout as designed. The
      // background is over-scaled so its drift never uncovers an edge.
      panels.forEach((panel) => {
        const along = { containerAnimation: slide, trigger: panel, start: "left right", end: "right left", scrub: true };
        const bg = panel.querySelector(".comp-bg");
        // A +-7% drift needs scale >= 1 / (1 - 2 * 0.07) = 1.16 to keep the
        // edges covered; any more zoom only softens Turf Wars' 800px photo.
        if (bg) gsap.fromTo(bg, { xPercent: -7, scale: 1.18 }, { xPercent: 7, scale: 1.18, ease: "none", scrollTrigger: along });
        panel.querySelectorAll(".comp-frame").forEach((frame, i) => {
          const run = 35 + i * 25;
          const lift = i % 2 ? 12 : -12;
          gsap.fromTo(frame, { xPercent: run, yPercent: -lift }, { xPercent: -run, yPercent: lift, ease: "none", scrollTrigger: along });
        });
      });

      return () => {
        gsap.set([track, ...panels], { clearProps: "all" });
        setIndex(null);
      };
    });
    return () => mm.revert();
  }, [count]);

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span ref={anchor} aria-hidden>
      {index !== null ? (
        <span className="micro pointer-events-none absolute bottom-6 left-1/2 z-[1] -translate-x-1/2 tabular-nums">
          {pad(index)} / {pad(count)}
        </span>
      ) : null}
    </span>
  );
}
