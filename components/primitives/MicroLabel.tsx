import type { ElementType, ReactNode } from "react";

/* 11px letterspaced caps. Always ABOVE the thing it labels (DESIGN.md). */
export function MicroLabel({
  as: Tag = "p",
  children,
  className = "",
  id,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={`micro ${className}`}>
      {children}
    </Tag>
  );
}
