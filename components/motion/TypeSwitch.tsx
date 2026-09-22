"use client";

import { useEffect, useState } from "react";

/* L0 PROTOTYPE ONLY: the owner's font A/B switch. Delete once the fonts are
   picked. Headline and body faces switch independently. The choice comes
   from ?display=a|b&body=a|b, and is kept for the tab (sessionStorage) so it
   survives clicking through the site's plain links. */
type Pick = { display: "a" | "b"; body: "a" | "b" };
const KEY = "l0-type";

function read(): Pick {
  const q = new URLSearchParams(location.search);
  let saved: Partial<Pick> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {}
  const pick = (k: keyof Pick) => (q.get(k) === "b" || q.get(k) === "a" ? q.get(k) : saved[k]) === "b" ? "b" : "a";
  return { display: pick("display"), body: pick("body") };
}

export function TypeSwitch() {
  const [type, setType] = useState<Pick | null>(null);

  useEffect(() => setType(read()), []);

  useEffect(() => {
    if (!type) return;
    document.documentElement.dataset.display = type.display;
    document.documentElement.dataset.body = type.body;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(type));
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set("display", type.display);
    url.searchParams.set("body", type.body);
    history.replaceState(history.state, "", url);
  }, [type]);

  if (!type) return null;
  const seg = (k: keyof Pick, v: "a" | "b", label: string) => (
    <button
      type="button"
      aria-pressed={type[k] === v}
      onClick={() => setType({ ...type, [k]: v })}
      className="min-h-9 min-w-9 px-3 aria-pressed:bg-yellow aria-pressed:text-ink"
    >
      {v.toUpperCase()}
      <span className="max-sm:hidden"> {label}</span>
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Font preview (prototype)"
      className="fixed bottom-3 left-1/2 z-40 flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 border border-bone/30 bg-ink p-1 font-[family-name:var(--font-geist)] text-[12px] text-bone"
    >
      <span className="px-2 text-muted">Headline</span>
      {seg("display", "a", "Oswald")}
      {seg("display", "b", "Bricolage")}
      <span className="px-2 text-muted">Body</span>
      {seg("body", "a", "Geist")}
      {seg("body", "b", "Bricolage")}
    </div>
  );
}
