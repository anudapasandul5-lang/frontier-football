"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCRUB } from "@/lib/scrub";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* L0 PROTOTYPE: the hero's scroll-scrubbed sequence. The hero pins and the
   scroll plays the clip, frame by frame, onto a canvas laid over the static
   first frame. Budget (plan, performance): 58 frames at 1280x720 on desktop
   (3.0MB), 24 at 640x360 on a phone (0.46MB), requested on the first scroll
   intent after the window `load` event so they never compete with the LCP image.
   Until a frame has arrived the canvas keeps the last one it drew, and until the first
   draw it is invisible, so a slow network shows the still, never a blank.
   Reduced motion: nothing here runs; the still is the hero. */

export function HeroScrub() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const el = canvas.current;
    const section = el?.closest("section");
    const ctx = el?.getContext("2d");
    if (!el || !section || !ctx) return;

    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", phone: "(max-width: 767px)" },
      (context) => {
        const { motion, phone } = context.conditions as { motion: boolean; phone: boolean };
        if (!motion) return;
        const count = phone ? SCRUB.phone : SCRUB.desktop;
        const dir = `${SCRUB.base}/${phone ? "m" : "d"}`;
        const frames: HTMLImageElement[] = [];
        let wanted = 0;
        let live = true; // a frame landing after teardown must not repaint
        let ready = document.readyState === "complete";
        let requested = false;
        let loaded = false;

        const draw = (i: number) => {
          wanted = i;
          if (!live) return;
          const img = frames[i];
          if (!img?.complete || !img.naturalWidth) return;
          if (el.width !== img.naturalWidth) {
            el.width = img.naturalWidth;
            el.height = img.naturalHeight;
          }
          ctx.drawImage(img, 0, 0);
          el.style.opacity = "1";
        };

        const load = () => {
          if (!ready || !requested || loaded) return;
          loaded = true;
          for (let i = 0; i < count; i++) {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => i === wanted && draw(i);
            img.src = `${dir}/${String(i + 1).padStart(3, "0")}.webp`;
            frames[i] = img;
          }
        };
        const activate = () => {
          requested = true;
          load();
        };
        const onWindowLoad = () => {
          ready = true;
          load();
        };
        if (!ready) window.addEventListener("load", onWindowLoad, { once: true });
        for (const event of ["wheel", "touchstart", "keydown", "scroll"])
          window.addEventListener(event, activate, { passive: true });

        const playhead = { frame: 0 };
        gsap.to(playhead, {
          frame: count - 1,
          ease: "none",
          snap: "frame",
          onUpdate: () => draw(playhead.frame),
          scrollTrigger: { trigger: section, start: "top top", end: "+=120%", pin: true, scrub: 0.3 },
        });

        return () => {
          live = false;
          for (const img of frames) img.onload = null;
          window.removeEventListener("load", onWindowLoad);
          for (const event of ["wheel", "touchstart", "keydown", "scroll"])
            window.removeEventListener(event, activate);
          el.style.opacity = "0";
        };
      },
    );
    return () => mm.revert();
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-0" />;
}
