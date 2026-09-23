"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { wireReveal } from "@/lib/reveal";

/* The whole motion contract in one leaf. Content is server-rendered and fully
   visible; this runs after hydration and, only when the reader has not asked
   for reduced motion, switches the CSS pre-states on (data-motion="on") and
   hands every [data-reveal] element to the one reveal observer. JS off or
   reduced motion: none of this happens and the page stays static. */
export function MotionGate() {
  const pathname = usePathname();
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let disconnect: (() => void) | undefined;
    const sync = () => {
      disconnect?.();
      if (query.matches) {
        document.documentElement.dataset.motion = "on";
        disconnect = wireReveal(document.querySelectorAll("[data-reveal]"));
      } else {
        delete document.documentElement.dataset.motion;
        document.querySelectorAll(".is-pre").forEach((el) => el.classList.remove("is-pre"));
      }
    };
    sync();
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    query.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener("change", sync);
      disconnect?.();
    };
  }, [pathname]);
  return null;
}
