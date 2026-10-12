"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The home page's resolve and entrance layer (scroll-craft pass), wired by
   attributes so the acts stay server components and no copy is touched.
   The Moment act is the page's one peak and is not touched here.

   - [data-closing]  the closing band. Its pitch (.close-line) is drawn in with
                     the scroll, the centre ring (.close-ring) last, and the
                     crest settles inside it: the page ends by completing a
                     pitch around the crest.
   - [data-comp]     the Competitions index. The rows come in one after another
                     and the photo stage opens from the top, once.

   Both animate FROM an offset to the finished layout, so JS off, reduced
   motion or a missed trigger leave the page complete. */
export function HomeStory() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest("main");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      closing(root);
      competitions(root);
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}

function closing(root: Element) {
  const band = root.querySelector("[data-closing]");
  if (!band) return;
  const lines = band.querySelectorAll(".close-line");
  const ring = band.querySelector(".close-ring");
  const crest = band.querySelector(".close-crest");

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: band, start: "top 80%", end: "center 55%", scrub: 1 },
  });
  tl.fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12 });
  if (ring) tl.fromTo(ring, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9 }, ">-0.1");
  if (crest)
    tl.fromTo(
      crest,
      { opacity: 0, scale: 0.86, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      ">-0.2",
    );
}

function competitions(root: Element) {
  const index = root.querySelector("[data-comp]");
  if (!index) return;
  const rows = index.querySelectorAll(".comp__item");
  const stage = index.querySelector(".comp__stage");
  const once = { trigger: index, start: "top 78%", once: true };

  gsap.from(rows, {
    opacity: 0,
    x: -28,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.09,
    clearProps: "transform,opacity",
    scrollTrigger: once,
  });
  if (stage) {
    gsap.fromTo(
      stage,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: once },
    );
  }
}
