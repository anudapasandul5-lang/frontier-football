import type { ReactNode } from "react";

export type FieldTone = "green" | "blue" | "red" | "teal";

const canvas: Record<FieldTone, string> = {
  green: "canvas-green",
  blue: "canvas-blue",
  red: "canvas-red",
  teal: "canvas-teal",
};

/* A full-viewport flat field. Chromatic colours never appear smaller than
   this (DESIGN.md palette rules). svh, so a phone's collapsing toolbar cannot
   push the field past one screen. */
export function ColourField({
  tone,
  id,
  labelledBy,
  children,
  className = "",
}: {
  tone: FieldTone;
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${canvas[tone]} flex min-h-svh flex-col ${className}`}>
      {children}
    </section>
  );
}
