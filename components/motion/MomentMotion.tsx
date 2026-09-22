"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Scroll choreography for act 3, United's four phases: drift, zoom, unfold,
   pan. The zoom is an aperture: the centre photo is a full-bleed window shrunk
   to the card's size with its picture counter-scaled, so opening it never
   scales the photo up. Everything is created inside
   gsap.matchMedia("(prefers-reduced-motion: no-preference)"): under reduced
   motion nothing is created at all, and if the setting flips mid-visit
   matchMedia reverts every tween and pin it made. Transforms and opacity only.
   Scrubbed, so the reader's scroll is the clock and every phase can be
   scrolled back through. */
export function MomentMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = anchor.current?.closest("section");
    const stage = section?.querySelector<HTMLElement>(".moment-stage");
    if (!section || !stage) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Layout effects run before MotionGate's effect, so set the switch here
      // too: the strip and the full-bleed centre must exist before they are
      // measured.
      document.documentElement.dataset.motion = "on";
      const q = gsap.utils.selector(section);
      const last = q(".moment-line--last");
      const centre = q(".moment-centre")[0] as HTMLElement;
      const picture = centre.querySelector("img")!;
      const strip = q(".moment-strip")[0] as HTMLElement;
      const markers = q(".moment-marker") as HTMLElement[];

      // Vector from the stage centre to each marker: drift and fly-off both
      // push along it, so every photo leaves the way it was already facing.
      const away = (el: HTMLElement, k: number) => {
        const b = el.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        return {
          x: (b.left + b.width / 2 - (s.left + s.width / 2)) * k,
          y: (b.top + b.height / 2 - (s.top + s.height / 2)) * k,
        };
      };

      // The closed window is the still page's card: min(78vw, 640px) wide at
      // the photo's own ratio. open.p runs 0 (card) to 1 (full bleed); the
      // picture always gets the exact inverse, so it holds still in the window.
      const open = { p: 0 };
      let card = { x: 1, y: 1 };
      const render = () => {
        const x = card.x + (1 - card.x) * open.p;
        const y = card.y + (1 - card.y) * open.p;
        gsap.set(centre, { scaleX: x, scaleY: y });
        gsap.set(picture, { scaleX: 1 / x, scaleY: 1 / y });
      };
      // Measured on "refresh", after ScrollTrigger has released the pin, so a
      // resize mid-act never reads the pinned stage's stale size.
      const measure = () => {
        const w = Math.min(stage.clientWidth * 0.78, 640);
        const h = (w * Number(picture.getAttribute("height"))) / Number(picture.getAttribute("width"));
        card = { x: w / stage.clientWidth, y: h / stage.clientHeight };
        render();
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      // GSAP folds the class's -50% centring into its own x/y on first read, so
      // hand it over explicitly: x/y then carry only the drift.
      gsap.set(markers, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
      gsap.set(strip, { display: "flex", autoAlpha: 0 });
      gsap.set(last, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage, start: "top top", end: "+=450%", pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      // Drift and fly-off are ONE tween so the markers never stop between
      // them: two tweens meant a linear drift, then a fly-off starting from
      // rest, a visible stall at the seam. The linear term keeps them moving from
      // the first scroll; the t^4 term puts them 0.18 out when the zoom starts
      // (the old drift distance), then flings them. Ease-in is fine here only
      // because the scroll is the clock: nothing waits on it.
      tl.addLabel("drift")
        .to(markers, { x: (_, el) => away(el, 2.4).x, y: (_, el) => away(el, 2.4).y, duration: 2.2, ease: (t) => 0.08 * t + 0.92 * t ** 4 })
        .to(markers, { rotation: "+=4", duration: 1 }, "drift")
        .to(open, { p: 0.08, duration: 1, onUpdate: render }, "drift")
        .addLabel("zoom", 1)
        .to(markers, { autoAlpha: 0, duration: 1.2 }, "zoom")
        .to(open, { p: 1, duration: 1.2, ease: "power2.inOut", onUpdate: render }, "zoom")
        // Panel one is the same photo at the same size, so the swap is unseen.
        .addLabel("unfold")
        .set(strip, { autoAlpha: 1 })
        .set(centre, { autoAlpha: 0 })
        .addLabel("pan")
        .to(strip, { x: () => -(strip.scrollWidth - stage.clientWidth), duration: 2.4 })
        .to(last, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.5");
      return () => {
        ScrollTrigger.removeEventListener("refresh", measure);
        // Reduced motion switched on mid-visit: the still page comes back.
        delete document.documentElement.dataset.motion;
      };
    });
    return () => mm.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
