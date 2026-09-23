export type ParsedCountFigure = {
  value: number;
  decimals: number;
  suffix: string;
};

export function parseCountFigure(figure: string): ParsedCountFigure | null {
  const match = figure.trim().match(/^(\d+(?:\.(\d+))?)(.*)$/);
  if (!match) return null;

  return {
    value: Number(match[1]),
    decimals: match[2]?.length ?? 0,
    suffix: match[3],
  };
}

export function countFrame(figure: string, progress: number): string {
  if (progress >= 1) return figure;

  const parsed = parseCountFigure(figure);
  if (!parsed) return figure;

  const clamped = Math.max(0, Math.min(1, progress));
  return `${(parsed.value * clamped).toFixed(parsed.decimals)}${parsed.suffix}`;
}
