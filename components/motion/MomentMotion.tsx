"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const MomentMotionRuntime = lazy(() => import("./MomentMotionRuntime"));

/* Keep GSAP and ScrollTrigger out of the hero's critical window. The static
   Moment act is complete server HTML; its motion runtime is fetched only when
   the act gets within one viewport, and never for reduced motion. */
export function MomentMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = anchor.current?.closest("section");
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!section || !motion.matches || !globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setActive(true);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={anchor} hidden />
      {active ? (
        <Suspense fallback={null}>
          <MomentMotionRuntime />
        </Suspense>
      ) : null}
    </>
  );
}
