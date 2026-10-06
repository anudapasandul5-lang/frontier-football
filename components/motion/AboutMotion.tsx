"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Paper tilt, hover lift and scroll reveal use separate wrappers, so their
   transforms compose. Only uncredited photos drift inside their frames; a
   credited photo retains its complete crop and watermark. Reduced motion
   creates nothing and switching it on mid-visit reverts everything. The
   pre-state is set after hydration, so JS off shows the complete scrapbook.
   ScrollTrigger also reveals cards skipped by an anchor jump. */
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
      for (const row of root.querySelectorAll(".scrapbook-reveal")) {
        gsap.from(row, {
          opacity: 0,
          y: 36,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 92%", once: true },
        });
      }
      if (wide) {
        for (const photo of root.querySelectorAll(".scrapbook-photo")) {
          gsap.fromTo(
            photo,
            { scale: 1.08, yPercent: -3 },
            { yPercent: 3, ease: "none", scrollTrigger: { trigger: photo.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      }
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
