"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* v1's about.js timeline, moved to useGSAP (T7). Each record row's columns
   rise in with a short stagger as the row reaches the lower screen; above
   900px each photo drifts inside its frame as it passes. Transform and opacity
   only. Created inside matchMedia("no-preference"), so reduced motion creates
   nothing and switching it on mid-visit reverts everything. The pre-state is
   set here, after hydration, so JS off shows every row. ScrollTrigger fires
   onEnter even when a jump skips past a row, so no row is stranded. */
export function AboutMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest("main");
    if (!root) return;
    const mm = gsap.matchMedia();
    // Conditions form: v1 wrote context.add("(min-width: 900px)", fn), which
    // registers a method named after the query and never runs it, so v1's
    // photo drift never played.
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (context) => {
      const { motion, wide } = context.conditions!;
      if (!motion) return;
      for (const row of root.querySelectorAll(".record-row")) {
        gsap.from(row.children, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      }
      if (wide) {
        for (const photo of root.querySelectorAll(".record-photo")) {
          gsap.fromTo(
            photo,
            { yPercent: -6 },
            { yPercent: 6, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      }
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
