"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Lenis, driven by gsap.ticker so ScrollTrigger and the smoothed scroll share
   one clock (the one-engine rule, HOUSE-RULES section 4). Off under reduced
   motion: native scrolling is what that reader asked for. */
export function SmoothScroll() {
  useEffect(() => {
    // matchMedia, not a one-off check: turning reduced motion on mid-visit
    // destroys Lenis, turning it off builds it again.
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // anchors: in-page links (#talk, #hall-of-fame) glide instead of jump.
      // Lenis honours each target's scroll-margin (scroll-mt-24), which clears the crest.
      // A fixed 1.6s ease-in-out instead of the default lerp, which lunched
      // off and then crawled the last stretch.
      const lenis = new Lenis({
        autoRaf: false,
        anchors: { duration: 1.6, easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2) },
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33); // GSAP's default
        lenis.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  return null;
}
