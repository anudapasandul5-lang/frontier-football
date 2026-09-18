import type { ReactNode } from "react";

export type Column = { key: string; label: string; className?: string };
export type Row = { id: string; cells: Record<string, ReactNode> };

/* United's results table: condensed caps, one hairline between rows, generous
   row height. Below 640px each row folds into a two-column block; explicit
   ARIA roles keep the table semantics that display changes can strip. */
export function ResultsTable({ caption, columns, rows }: { caption: string; columns: Column[]; rows: Row[] }) {
  return (
    <table role="table" className="w-full border-collapse text-left max-sm:block">
      <caption className="sr-only">{caption}</caption>
      <thead role="rowgroup" className="max-sm:sr-only">
        <tr role="row">
          {columns.map((c) => (
            <th role="columnheader" key={c.key} scope="col" className={`micro pb-4 font-medium ${c.className ?? ""}`}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" className="max-sm:block">
        {rows.map((row) => (
          <tr
            role="row"
            key={row.id}
            className="border-t border-current/25 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-4 max-sm:gap-y-1 max-sm:py-4"
          >
            {columns.map((c, i) => (
              <td
                role="cell"
                key={c.key}
                className={`font-display leading-tight uppercase sm:py-5 sm:pr-6 ${
                  i === 0 ? "text-[clamp(1.125rem,1.8vw,1.5rem)]" : "text-[clamp(0.95rem,1.4vw,1.25rem)]"
                } ${c.className ?? ""}`}
              >
                {row.cells[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
