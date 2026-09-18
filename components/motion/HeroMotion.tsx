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
      gsap.to(hero.querySelector(".hero-overprint"), {
        yPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
