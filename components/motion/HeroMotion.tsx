"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The hero has no entrance: it is the first thing painted and a pre-state
   would flash it away after hydration. Its motion is scroll-linked only, so
   the resting state is always the server's. As the reader scrolls, the
   yellow caps lift off the serif faster than the page moves, pulling the
   collision apart. Nothing under reduced motion. */
export function HeroMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const hero = anchor.current?.closest("section");
    if (!hero) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The two caps lines part sideways as they lift (opus55).
      const lines = hero.querySelectorAll(".hero-line");
      const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.to(lines[0], { xPercent: -14, yPercent: -60, ease: "none", scrollTrigger: scrub });
      gsap.to(lines[1], { xPercent: 10, yPercent: -30, ease: "none", scrollTrigger: scrub });
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
