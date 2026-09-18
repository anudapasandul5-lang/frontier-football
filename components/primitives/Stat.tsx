/* One entry of a stat stack: micro-label over a condensed figure. Render
   inside a <dl>; the figure is printed exactly as content.js has it. */
export function Stat({ label, figure }: { label: string; figure: string }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="micro">{label}</dt>
      <dd className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.9] font-semibold uppercase">
        {figure}
      </dd>
    </div>
  );
}
