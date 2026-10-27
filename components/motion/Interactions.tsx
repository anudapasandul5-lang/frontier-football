"use client";

import { useEffect } from "react";

/* The home page's microinteraction layer, wired by attributes so the acts stay
   server components:

   - [data-tone="ink"|"bone"] on every canvas: the text colour there. The
     floating header takes it on, so it reads on every field without a blend mode inventing off-palette colours.
   - [data-drift="-0.35"]: a row of type that slides with the scroll.
     Add data-drift-flat for a photo row that should slide without leaning.
   - [data-parallax="-0.18"]: drifts against the scroll.
   - [data-zoom="0.18"]: settles from enlarged as its section arrives.
   - .marquee__track: runs faster with scroll speed, and backwards on the way up.

   All of it is decoration: aria-hidden, pointer-events none, nothing
   depends on it. */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Interactions() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const tones = [...document.querySelectorAll<HTMLElement>("[data-tone]")];

    const toneAt = (y: number) => {
      // Last match wins: a pinned or sticky child sits later in the DOM.
      let tone = "bone";
      for (const el of tones) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) tone = el.dataset.tone!;
      }
      return tone;
    };

    const header = document.querySelector<HTMLElement>("header[data-floating]");

    /* Header tone: on scroll only. */
    let scrollY = window.scrollY;
    let velocity = 0;
    let lastScrollAt = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - scrollY;
      velocity = dy / Math.max(1, now - lastScrollAt); // px per ms
      scrollY = window.scrollY;
      lastScrollAt = now;

      if (header) {
        header.dataset.uiTone = toneAt(header.offsetHeight + 1);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const tracks = [...document.querySelectorAll(".marquee__track")];
    const drifts = [...document.querySelectorAll<HTMLElement>("[data-drift]")].map((el) => ({ el, last: Infinity }));
    const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map((el) => ({ el, last: Infinity }));
    const zooms = [...document.querySelectorAll<HTMLElement>("[data-zoom]")].map((el) => ({ el, last: -1 }));
    let marqueeRate = 1;
    let skew = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      // Zoom: a photo settles from slightly enlarged to 1 as its section comes
      // up to the top of the screen.
      if (motion.matches)
        for (const z of zooms) {
          const r = (z.el.closest("section") ?? z.el).getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) continue;
          const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / window.innerHeight));
          const scale = 1 + (Number(z.el.dataset.zoom) || 0.15) * (1 - p);
          if (Math.abs(scale - z.last) > 0.0005) {
            z.last = scale;
            z.el.style.scale = scale.toFixed(4);
          }
        }

      // Parallax: a photo drifts against the scroll, by a share of the
      // viewport, crossing zero when its section is centred.
      if (motion.matches)
        for (const q of parallax) {
          const r = (q.el.closest("section") ?? q.el).getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) continue;
          const centre = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          const y = centre * Number(q.el.dataset.parallax) * window.innerHeight;
          if (Math.abs(y - q.last) > 0.1) {
            q.last = y;
            q.el.style.translate = `0 ${y.toFixed(1)}px`;
          }
        }

      // Drift: type rows slide with the scroll, half a copy back so either
      // direction stays covered.
      const idleNow = performance.now() - lastScrollAt > 90;
      skew += ((idleNow ? 0 : Math.max(-10, Math.min(10, velocity * -3))) - skew) * 0.1;
      if (motion.matches)
        for (const d of drifts) {
          const r = d.el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
          const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
          const x = (p - 0.5) * Number(d.el.dataset.drift) * window.innerWidth * 2 - d.el.scrollWidth / 6;
          if (Math.abs(x - d.last) > 0.1 || Math.abs(skew) > 0.01) {
            d.last = x;
            // data-drift-flat: photo rows slide but never lean; skew suits type only.
            const lean = d.el.dataset.driftFlat === undefined ? skew : 0;
            d.el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${lean.toFixed(2)}deg)`;
          }
        }

      // Marquee speed follows scroll speed and direction, then eases back to 1.
      if (motion.matches) {
        const idle = performance.now() - lastScrollAt > 120;
        const want = idle ? Math.sign(marqueeRate) || 1 : Math.sign(velocity || 1) * (1 + Math.min(Math.abs(velocity) * 2.2, 6));
        const next = lerp(marqueeRate, want, idle ? 0.04 : 0.12);
        if (Math.abs(next - marqueeRate) > 0.002) {
          marqueeRate = next;
          for (const track of tracks) for (const a of track.getAnimations()) a.playbackRate = marqueeRate;
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const z of zooms) z.el.style.scale = "";
      for (const q of parallax) q.el.style.translate = "";
      for (const d of drifts) d.el.style.transform = "";
    };
  }, []);

  return null;
}
