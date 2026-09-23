"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { stepIndex } from "@/lib/gallery-data";

/* JS off: the tab bar can't work, so show every panel under its own heading. */
const NO_JS_CSS = ".tabs-bar{display:none}.tabs-panel,.tabs-heading{display:block!important}.tabs-panel{margin-bottom:4rem}";

/* The ARIA tabs pattern: roving tabindex, arrows move and wrap, Home/End jump.
   The server renders the tabbed state itself, so hydration moves nothing (a
   heading-per-panel fallback swapped for the taller tab bar shifted the page
   82px at 412px wide, CLS 0.10). With JS off, the <noscript> style above takes
   over, so nothing is unreachable. */
export function Tabs({ label, groups, theme = "bone" }: { label: string; groups: { id: string; label: string; panel: ReactNode }[]; theme?: "bone" | "night" }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    // A tab press is a high-frequency navigation action: reveal its hidden
    // photos before showing the panel, so the panel change itself is instant.
    document.getElementById(`panel-${groups[index].id}`)?.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.remove("is-pre");
      el.classList.add("is-revealed");
    });
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
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="tabs-bar frame mb-8 flex flex-wrap gap-2">
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
            className={`min-h-11 cursor-pointer border-2 px-6 py-2 font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-none uppercase ${theme === "night" ? "border-bone/65 aria-selected:bg-bone aria-selected:text-ink" : "border-ink aria-selected:bg-ink aria-selected:text-bone"}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <div
          key={g.id}
          id={`panel-${g.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${g.id}`}
          tabIndex={0}
          // Inline, not the hidden attribute: Tailwind's reset makes [hidden] a layered
          // !important, which no unlayered rule (the <noscript> one) can undo.
          style={i === selected ? undefined : { display: "none" }}
          className="tabs-panel outline-none"
        >
          <h2 style={{ display: "none" }} className="tabs-heading frame mb-6 font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] leading-none uppercase">
            {g.label}
          </h2>
          {g.panel}
        </div>
      ))}
    </>
  );
}
