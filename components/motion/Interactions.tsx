"use client";

import { useEffect, useRef, useState } from "react";

/* The home page's microinteraction layer, wired by attributes so the acts stay
   server components:

   - [data-tone="ink"|"bone"] on every canvas: the text colour there. The
     cursor and the chapter indicator take it on, so they read on every field
     without a blend mode inventing off-palette colours.
   - [data-chapter="Label"]: where a menu chapter starts (indicator).
   - [data-magnetic="0.3"]: pulled toward the pointer when it comes close.
   - [data-cursor="Label"]: the cursor ring grows and says this.
   - [data-preview="/img.webp"]: a photo follows the pointer over the element.
   - [data-drift="-0.35"]: a row of type that slides with the scroll.
     Add data-drift-flat for a photo row that should slide without leaning.
   - [data-parallax="-0.18"]: drifts against the scroll.
   - [data-zoom="0.18"]: settles from enlarged as its section arrives.
   - .marquee__track: runs faster with scroll speed, and backwards on the way up.

   Pointer effects need a fine pointer and motion allowed. The indicator is
   plain scroll position, so it shows either way. All of it is decoration:
   aria-hidden, pointer-events none, nothing depends on it. */

type Magnet = { el: HTMLElement; x: number; y: number; strength: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Interactions() {
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLImageElement>(null);
  const indicator = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState<{ n: number; total: number; label: string } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const pointerFx = () => fine.matches && motion.matches;

    const chapters = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const tones = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
    const magnets: Magnet[] = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")].map((el) => ({
      el,
      x: 0,
      y: 0,
      strength: Number(el.dataset.magnetic) || 0.3,
    }));

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
    let headerHidden = false;

    /* Chapter indicator + page progress: on scroll only. */
    let lastLabel = "";
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
        header.dataset.uiTone = toneAt(40);
        // Hide going down past the first screen, show on any scroll up.
        const hide = dy > 2 && scrollY > window.innerHeight * 0.8 ? true : dy < -2 ? false : headerHidden;
        if (hide !== headerHidden) {
          headerHidden = hide;
          header.dataset.hidden = String(hide);
        }
        header.dataset.solid = String(scrollY > 40);
      }

      const mid = window.innerHeight * 0.5;
      let active = 0;
      chapters.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= mid) active = i;
      });
      const text = chapters[active]?.dataset.chapter ?? "";
      if (text !== lastLabel) {
        lastLabel = text;
        setChapter({ n: active + 1, total: chapters.length, label: text });
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? scrollY / max : 0})`);
      if (indicator.current) {
        indicator.current.dataset.uiTone = toneAt(window.innerHeight - 28);
        // The hero frames itself with its own label row; the indicator joins
        // once the reader is on the way down.
        indicator.current.dataset.show = scrollY > window.innerHeight * 0.6 ? "true" : "false";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* Pointer state for the rAF loop. */
    let px = -100;
    let py = -100;
    let cx = -100;
    let cy = -100;
    let prevCx = cx;
    let inside = false;
    let previewSrc = "";

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!inside) {
        cx = px;
        cy = py;
        inside = true;
      }
      const target = e.target instanceof Element ? e.target : null;
      const c = cursor.current;
      if (!c || !pointerFx()) return;
      // A link or button speaks for itself: it only carries a label it names,
      // never one inherited from the section around it.
      const link = target?.closest<HTMLElement>("a, button");
      const labelled = link ? (link.dataset.cursor ? link : null) : target?.closest<HTMLElement>("[data-cursor]");
      const interactive = link ?? labelled;
      c.dataset.state = interactive ? "hover" : "idle";
      if (label.current) label.current.textContent = labelled?.dataset.cursor ?? "";
      c.dataset.labelled = labelled ? "true" : "false";
      c.dataset.uiTone = target?.closest<HTMLElement>("[data-tone]")?.dataset.tone ?? "bone";

      const row = target?.closest<HTMLElement>("[data-preview]");
      const img = preview.current;
      if (img) {
        const src = row?.dataset.preview ?? "";
        if (src && src !== previewSrc) img.src = src;
        previewSrc = src;
        img.dataset.show = src ? "true" : "false";
      }
    };
    const onLeave = () => {
      inside = false;
      if (cursor.current) cursor.current.dataset.state = "gone";
      if (preview.current) preview.current.dataset.show = "false";
      previewSrc = "";
    };
    const onDown = () => cursor.current?.setAttribute("data-pressed", "true");
    const onUp = () => cursor.current?.removeAttribute("data-pressed");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    const tracks = [...document.querySelectorAll(".marquee__track")];
    const drifts = [...document.querySelectorAll<HTMLElement>("[data-drift]")].map((el) => ({ el, last: Infinity }));
    const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map((el) => ({ el, last: Infinity }));
    const zooms = [...document.querySelectorAll<HTMLElement>("[data-zoom]")].map((el) => ({ el, last: -1 }));
    let marqueeRate = 1;
    let skew = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const fx = pointerFx();

      // Cursor ring trails the pointer; the preview photo trails further and
      // leans into its own horizontal speed.
      if (fx && inside) {
        prevCx = cx;
        cx = lerp(cx, px, 0.22);
        cy = lerp(cy, py, 0.22);
        cursor.current?.style.setProperty("transform", `translate3d(${cx}px, ${cy}px, 0)`);
        const img = preview.current;
        if (img?.dataset.show === "true") {
          const lean = Math.max(-12, Math.min(12, (cx - prevCx) * 0.6));
          img.style.transform = `translate3d(${cx + 28}px, ${cy - 90}px, 0) rotate(${lean}deg)`;
        }
      }

      // Magnets: pull toward the pointer inside a 60px halo, spring home out of it.
      for (const m of magnets) {
        let tx = 0;
        let ty = 0;
        if (fx && inside) {
          const r = m.el.getBoundingClientRect();
          const halo = 60;
          if (px > r.left - halo && px < r.right + halo && py > r.top - halo && py < r.bottom + halo) {
            tx = (px - (r.left + r.width / 2)) * m.strength;
            ty = (py - (r.top + r.height / 2)) * m.strength;
          }
        }
        const nx = lerp(m.x, tx, 0.16);
        const ny = lerp(m.y, ty, 0.16);
        if (Math.abs(nx - m.x) > 0.01 || Math.abs(ny - m.y) > 0.01) {
          m.x = nx;
          m.y = ny;
          m.el.style.translate = `${nx.toFixed(2)}px ${ny.toFixed(2)}px`;
        }
      }

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
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      for (const m of magnets) m.el.style.translate = "";
      for (const z of zooms) z.el.style.scale = "";
      for (const q of parallax) q.el.style.translate = "";
      for (const d of drifts) d.el.style.transform = "";
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div ref={cursor} aria-hidden="true" className="cursor" data-state="gone">
        <span className="cursor__ring" />
        <span ref={label} className="cursor__label" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={preview} alt="" aria-hidden="true" className="row-preview" data-show="false" />
      <div ref={indicator} aria-hidden="true" className="chapter-indicator micro" data-ui-tone="bone" data-show="false">
        {chapter ? (
          <span key={chapter.label} className="chapter-indicator__text">
            <span className="flex items-center gap-2 tabular-nums">
              {pad(chapter.n)}
              <span className="chapter-indicator__rule" />
              {pad(chapter.total)}
            </span>
            {chapter.label}
          </span>
        ) : null}
        <span className="chapter-indicator__track">
          <span ref={bar} className="chapter-indicator__bar" />
        </span>
      </div>
    </>
  );
}
