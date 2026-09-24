/* The Sunday Football League wordmark lockup (CONTEXT.md: a Frontier
   sub-brand). Frontier's type and colours plus one accent, the pitch green:
   the crest and a small FRONTIER label above a stacked SUNDAY / LEAGUE, with a
   green bar under LEAGUE. The accessible name is the full league name, since
   the wordmark alone is not the name. */
export function SundayLeagueMark({ size = "lg" }: { size?: "lg" | "sm" }) {
  const word = size === "lg" ? "text-[clamp(4rem,22cqw,10rem)]" : "text-[clamp(3rem,10vw,5.5rem)]";
  return (
    <div role="img" aria-label="Frontier Sunday Football League" className="inline-flex w-full flex-col items-start">
      <div className="mb-3 flex items-center gap-3">
        <img src="/crest-sm.webp" alt="" width={295} height={360} loading="lazy" className={size === "lg" ? "h-12 w-auto" : "h-9 w-auto"} />
        <span className="micro text-current">Frontier presents</span>
      </div>
      <span aria-hidden="true" className={`font-display ${word} leading-[0.82] font-bold uppercase`}>
        Sunday
      </span>
      <span aria-hidden="true" className={`font-display ${word} leading-[0.82] font-bold text-green uppercase`}>
        League
      </span>
      <span aria-hidden="true" className="mt-3 h-2 w-full bg-green" />
    </div>
  );
}
