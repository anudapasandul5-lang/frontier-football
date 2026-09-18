"use client";

import { useState } from "react";

/* WCAG 2.2.2: anything that moves for more than five seconds needs a way to
   stop it that keyboard and touch users can reach; hover alone is not one.
   Hidden until MotionGate turns motion on, since a still marquee has nothing
   to pause. */
export function MarqueePause() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      className="marquee__pause micro min-h-11 px-4 text-current"
      onClick={(event) => {
        const marquee = event.currentTarget.closest(".marquee");
        const next = !paused;
        if (next) marquee?.setAttribute("data-paused", "");
        else marquee?.removeAttribute("data-paused");
        setPaused(next);
      }}
    >
      {paused ? "Play" : "Pause"}
    </button>
  );
}
