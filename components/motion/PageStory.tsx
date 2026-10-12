"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The inner pages' story layer (scroll-craft pass). Wired by attributes so the
   pages stay server components and no copy is touched:

   - [data-strip]        the three-photo strip. On a wide screen the photos
                         start stacked on the middle one and fan out into the
                         row as it arrives (scrubbed, no pin). On a phone each
                         photo rises in on its own.
   - [data-quiet]        a calm beat. Its [data-quiet-item] children rise in
                         one after another and its .quiet-line (the halfway
                         line) is drawn left to right with the scroll.
   - [data-hof]          the Hall of Fame wall. The row nearest the middle of
                         the screen gets .is-active (CSS lights it up), so a
                         spotlight travels down the wall as the reader scrolls.
                         It works on touch, where there is no hover.

   Every step moves a finished layout: strips and items are animated FROM an
   offset to their natural place, so JS off, reduced motion or a failed
   ScrollTrigger all leave the page complete. Reduced motion builds nothing
   and switching it on mid-visit reverts everything. */
export function PageStory() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest("main");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 640px)" }, (context) => {
      const { motion, wide } = context.conditions!;
      if (!motion) return;
      const undo = [strips(root, wide), quiet(root), wall(root)];
      return () => undo.forEach((fn) => fn?.());
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}

function strips(root: Element, wide: boolean) {
  for (const strip of root.querySelectorAll("[data-strip]")) {
    const photos = [...strip.querySelectorAll<HTMLElement>("img")];
    if (photos.length < 2) continue;
    if (wide) {
      const mid = (photos.length - 1) / 2;
      // The middle photo sits on top while the outer two tuck behind it.
      gsap.set(photos, { zIndex: (i) => 10 - Math.round(Math.abs(i - mid) * 2) });
      gsap.fromTo(
        photos,
        {
          x: (i, el) => (mid - i) * el.offsetWidth * 0.84,
          rotation: (i) => (i - mid) * 5,
          scale: 0.9,
        },
        {
          x: 0,
          rotation: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: strip, start: "top 92%", end: "top 38%", scrub: 0.7, invalidateOnRefresh: true },
        },
      );
    } else {
      for (const photo of photos) {
        gsap.from(photo, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: photo, start: "top 92%", once: true },
        });
      }
    }
  }
}

function quiet(root: Element) {
  for (const beat of root.querySelectorAll("[data-quiet]")) {
    const items = beat.querySelectorAll("[data-quiet-item]");
    if (items.length) {
      gsap.from(items, {
        opacity: 0,
        y: 28,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.18,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: beat, start: "top 70%", once: true },
      });
    }
    const line = beat.querySelector(".quiet-line");
    if (line) {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: "0% 50%" },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: beat, start: "top 85%", end: "top 35%", scrub: 1 } },
      );
    }
  }
}

function wall(root: Element) {
  const rows = [...root.querySelectorAll<HTMLElement>("[data-hof] .hof-row")];
  if (!rows.length) return;
  // A thin band across the middle of the screen: only the row crossing it is lit.
  const watch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle("is-active", entry.isIntersecting);
    },
    { rootMargin: "-49% 0px -49% 0px", threshold: 0 },
  );
  rows.forEach((row) => watch.observe(row));
  return () => {
    watch.disconnect();
    rows.forEach((row) => row.classList.remove("is-active"));
  };
}
