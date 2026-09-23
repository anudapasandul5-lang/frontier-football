"use client";

import { useEffect, useRef } from "react";
import { countFrame } from "@/lib/count-up";

const DURATION_MS = 1200;

export function CountUpFigure({ figure, className = "" }: { figure: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!element || !motion.matches || !globalThis.IntersectionObserver) return;

    let frame = 0;
    let started = false;
    element.textContent = countFrame(figure, 0);

    const finish = () => {
      cancelAnimationFrame(frame);
      element.textContent = figure;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        const startedAt = performance.now();

        const tick = (now: number) => {
          const elapsed = Math.min(1, (now - startedAt) / DURATION_MS);
          const eased = 1 - (1 - elapsed) ** 4;
          element.textContent = countFrame(figure, eased);
          if (elapsed < 1 && motion.matches) frame = requestAnimationFrame(tick);
          else finish();
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    motion.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", finish);
      finish();
    };
  }, [figure]);

  return (
    <span ref={ref} aria-label={figure} className={className}>
      {figure}
    </span>
  );
}
