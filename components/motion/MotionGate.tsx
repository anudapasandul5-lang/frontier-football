"use client";

import { useEffect } from "react";
import { wireReveal } from "@/lib/reveal";

/* The whole motion contract in one leaf. Content is server-rendered and fully
   visible; this runs after hydration and, only when the reader has not asked
   for reduced motion, switches the CSS pre-states on (data-motion="on") and
   hands every [data-reveal] element to the one reveal observer. JS off or
   reduced motion: none of this happens and the page stays static. */
export function MotionGate() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!query.matches) return;
    document.documentElement.dataset.motion = "on";
    wireReveal(document.querySelectorAll("[data-reveal]"));
    // Turning reduced motion on mid-visit stops everything, pre-states included.
    const off = () => {
      if (query.matches) return;
      delete document.documentElement.dataset.motion;
      document.querySelectorAll(".is-pre").forEach((el) => el.classList.remove("is-pre"));
    };
    query.addEventListener("change", off);
    return () => query.removeEventListener("change", off);
  }, []);
  return null;
}
