"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { stepIndex } from "@/lib/gallery-data";

/* The ARIA tabs pattern: roving tabindex, arrows move and wrap, Home/End jump.
   Before hydration (and with JS off) there is no tab bar and every panel shows
   under its own heading, so nothing is unreachable without JS. */
export function Tabs({ label, groups }: { label: string; groups: { id: string; label: string; panel: ReactNode }[] }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setReady(true), []);

  const select = (index: number, focus = false) => {
    setSelected(index);
    if (focus) tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in moves) select(stepIndex(selected, moves[event.key], groups.length), true);
    else if (event.key === "Home") select(0, true);
    else if (event.key === "End") select(groups.length - 1, true);
    else return;
    event.preventDefault(); // or the arrow scrolls the page as well
  };

  return (
    <>
      {ready ? (
        <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="frame mb-8 flex flex-wrap gap-2">
          {groups.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-controls={`panel-${g.id}`}
              aria-selected={i === selected}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => select(i)}
              className="min-h-11 cursor-pointer border-2 border-ink px-6 py-2 font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-none uppercase aria-selected:bg-ink aria-selected:text-bone"
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}
      {groups.map((g, i) => (
        <div
          key={g.id}
          id={`panel-${g.id}`}
          role={ready ? "tabpanel" : undefined}
          aria-labelledby={ready ? `tab-${g.id}` : undefined}
          tabIndex={ready ? 0 : undefined}
          hidden={ready && i !== selected}
          className="outline-none"
        >
          {ready ? null : (
            <h2 className="frame mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
              {g.label}
            </h2>
          )}
          <div className={ready ? "" : "mb-16"}>{g.panel}</div>
        </div>
      ))}
    </>
  );
}
