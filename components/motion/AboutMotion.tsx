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
      storyMotion(root);
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

/* Our story: the pitch markings draw in with the scroll, the quote marks fade
   up and the quote's two lines glide in from either side, the duel photo opens
   from a slit. Every step is a from-state, so without
   this the section is already complete. */
function storyMotion(root: Element) {
  const story = root.querySelector(".story-quote")?.closest("section");
  if (!story) return;
  const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });

  gsap.fromTo(
    story.querySelectorAll(".pitch-line"),
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, ease: "none", stagger: 0.08, scrollTrigger: { trigger: story, start: "top 80%", end: "bottom 60%", scrub: 1.5 } },
  );

  const fade = story.querySelector(".story-fade");
  if (fade) gsap.from(fade, { opacity: 0, y: 16, duration: 1.2, delay: 0.2, ease: "power2.out", scrollTrigger: once(fade) });

  const quote = story.querySelector(".story-quote")!;
  const q = gsap.timeline({ scrollTrigger: once(quote, "top 75%") });
  q.from(quote.querySelectorAll(".story-mark"), { opacity: 0, scale: 0.6, duration: 1.2, ease: "expo.out", stagger: 0.2 })
    .from(quote.querySelectorAll(".story-line"), { opacity: 0, x: (i) => (i ? 40 : -40), duration: 1.4, ease: "expo.out", stagger: 0.25 }, "<");

  const duel = story.querySelector(".story-duel");
  const photo = story.querySelector(".story-photo");
  if (!duel || !photo) return;
  gsap.fromTo(photo, { clipPath: "inset(48% 0% 48% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: once(duel, "top 80%") });
}
