import type { CSSProperties, ReactNode } from "react";
import { MarqueePause } from "@/components/motion/MarqueePause";

/* Repeats its run twice and slides by half (CSS in globals.css). The second
   run is aria-hidden and inert so assistive tech and the tab order meet the
   content once. Static until MotionGate switches motion on; pauses on hover
   and focus, and carries a Pause button once it moves (WCAG 2.2.2). */
export function Marquee({
  children,
  label,
  seconds = 40,
  className = "",
}: {
  children: ReactNode;
  label: string;
  seconds?: number;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className={`marquee ${className}`}
      style={{ "--marquee-duration": `${seconds}s` } as CSSProperties}
    >
      <div className="marquee__track">
        <div className="marquee__run">{children}</div>
        <div className="marquee__run" aria-hidden="true" inert>
          {children}
        </div>
      </div>
      <MarqueePause />
    </div>
  );
}
