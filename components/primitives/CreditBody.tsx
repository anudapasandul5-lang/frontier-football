import type { ReactNode } from "react";

/* Micro-caps credit on the left, body on the right, offset down so the two
   never share a baseline. Body measure held at 45-55 characters. */
export function CreditBody({ credit, children }: { credit: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      <p className="micro">{credit}</p>
      <div className="max-w-[52ch] text-[15px] leading-relaxed md:mt-10">{children}</div>
    </div>
  );
}
