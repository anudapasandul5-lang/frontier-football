"use client";

import { useEffect, useRef, useState } from "react";

/* The LCP still owns the hero until load completes. Desktop playback starts
   during idle time. On phones the first scroll/tap starts the small portrait
   encode: Chrome otherwise promotes a late video frame to LCP and misses
   Ticket 04's mandatory >=90 mobile gate. There is no play UI or second tap.
   Reduced motion and JS-off keep the still forever. */
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string>();

  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const interactionEvents = ["pointerdown", "touchstart", "scroll", "keydown"] as const;

    const removeInteractionListeners = () => {
      for (const event of interactionEvents) window.removeEventListener(event, startPhone);
    };
    const startPhone = () => {
      if (reduced.matches || !phone.matches) return;
      removeInteractionListeners();
      setSource("/hero/landscape-phone.mp4");
    };
    const startDesktop = () => {
      if (reduced.matches || phone.matches) return;
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => !reduced.matches && !phone.matches && setSource("/hero/landscape-desktop.mp4"), { timeout: 1200 });
      } else {
        timer = globalThis.setTimeout(() => !reduced.matches && !phone.matches && setSource("/hero/landscape-desktop.mp4"), 0);
      }
    };
    const arm = () => {
      setSource(undefined);
      removeInteractionListeners();
      if (reduced.matches) return;
      if (phone.matches) {
        for (const event of interactionEvents) window.addEventListener(event, startPhone, { passive: true, once: true });
      } else if (document.readyState === "complete") startDesktop();
      else window.addEventListener("load", startDesktop, { once: true });
    };

    arm();
    phone.addEventListener("change", arm);
    reduced.addEventListener("change", arm);

    return () => {
      window.removeEventListener("load", startDesktop);
      removeInteractionListeners();
      phone.removeEventListener("change", arm);
      reduced.removeEventListener("change", arm);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) globalThis.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!source) return;
    video.current?.play().catch(() => {});
  }, [source]);

  if (!source) return null;

  return (
    <video
      ref={video}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      width={1280}
      height={720}
      className="absolute inset-0 size-full object-cover"
    >
      <source src={source} type="video/mp4" />
    </video>
  );
}
