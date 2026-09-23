import { CountUpFigure } from "@/components/motion/CountUpFigure";

/* The oversized numeral: one figure alone as a counterweight, caption beneath. */
export function Numeral({ figure, caption }: { figure: string; caption: string }) {
  return (
    <p className="flex flex-col gap-3">
      <CountUpFigure figure={figure} className="font-display text-[clamp(6rem,16vw,10rem)] leading-[0.85] font-bold uppercase tabular-nums" />
      <span className="text-[13px] leading-snug text-[var(--tone-muted)]">{caption}</span>
    </p>
  );
}
