"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Loaded only when the Moment act is near the viewport. The zoom is an
   aperture: the centre photo is a full-bleed window shrunk to the card's size
   with its picture counter-scaled, so opening it never scales the photo up. */
export default function MomentMotionRuntime() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = anchor.current?.closest("section");
    const stage = section?.querySelector<HTMLElement>(".moment-stage");
    if (!section || !stage) return;

    const mm = gsap.matchMedia();
    // Phones get a shorter pin: 450% is 5.5 screens of thumb-scrolling, and
    // the home page on a phone was over 12 screens long (UX audit T3).
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", narrow: "(max-width: 899px)" }, (context) => {
      const { motion, narrow } = context.conditions!;
      if (!motion) return;
      document.documentElement.dataset.motion = "on";
      const q = gsap.utils.selector(section);
      const last = q(".moment-line--last");
      const centre = q(".moment-centre")[0] as HTMLElement;
      const picture = centre.querySelector("img")!;
      const strip = q(".moment-strip")[0] as HTMLElement;
      const markers = q(".moment-marker") as HTMLElement[];

      const away = (el: HTMLElement, k: number) => {
        const b = el.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        return {
          x: (b.left + b.width / 2 - (s.left + s.width / 2)) * k,
          y: (b.top + b.height / 2 - (s.top + s.height / 2)) * k,
        };
      };

      const open = { p: 0 };
      let card = { x: 1, y: 1 };
      const render = () => {
        const x = card.x + (1 - card.x) * open.p;
        const y = card.y + (1 - card.y) * open.p;
        gsap.set(centre, { scaleX: x, scaleY: y });
        gsap.set(picture, { scaleX: 1 / x, scaleY: 1 / y });
      };
      const measure = () => {
        const w = Math.min(stage.clientWidth * 0.78, 640);
        const h = (w * Number(picture.getAttribute("height"))) / Number(picture.getAttribute("width"));
        card = { x: w / stage.clientWidth, y: h / stage.clientHeight };
        render();
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      gsap.set(markers, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
      gsap.set(strip, { display: "flex", autoAlpha: 0 });
      gsap.set(last, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage, start: "top top", end: narrow ? "+=120%" : "+=450%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.addLabel("drift")
        .to(last, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, "drift")
        .to(markers, { x: (_, el) => away(el, 2.4).x, y: (_, el) => away(el, 2.4).y, duration: 2.2, ease: (t) => 0.08 * t + 0.92 * t ** 4 }, "drift")
        .to(markers, { rotation: "+=4", duration: 1 }, "drift")
        .to(open, { p: 0.08, duration: 1, onUpdate: render }, "drift")
        .addLabel("zoom", 1)
        .to(markers, { autoAlpha: 0, duration: 1.2 }, "zoom")
        .to(open, { p: 1, duration: 1.2, ease: "power2.inOut", onUpdate: render }, "zoom")
        .addLabel("unfold")
        .set(strip, { autoAlpha: 1 })
        .set(centre, { autoAlpha: 0 })
        .addLabel("pan")
        .to(strip, { x: () => -(strip.scrollWidth - stage.clientWidth), duration: 2.4 });
      // This pin arrives lazily, after triggers further down (the competitions
      // slider) have measured their starts without its pinned scroll. Re-sort
      // into page order and re-measure, or those starts land ~4.5 screens early.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.removeEventListener("refresh", measure);
        delete document.documentElement.dataset.motion;
      };
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
