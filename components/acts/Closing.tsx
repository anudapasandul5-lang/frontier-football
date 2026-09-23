import raw from "@/content.js";
import { brandIcons } from "@/lib/brand-icons";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { TickRule } from "@/components/primitives/TickRule";

/* Act 9, United's closing band, in teal. It ends on the one action (plan Q4):
   following Frontier, as the act's headline rather than a button. The serif
   line is the site's own description (layout.tsx metadata).

   Whatever outbound link comes first in content.js leads (Instagram today), so
   blanking it degrades to the next one instead of a headless band. Every
   channel then sits below as its logo (owner, 2026-09-23); the home page is
   the only place TikTok shows (owner, 2026-09-08, HOUSE-RULES section 7). */
export function Closing() {
  const links = outboundLinks(parseContent(raw));
  const lead = links[0];

  return (
    <section
      aria-labelledby="closing-heading"
      data-tone="bone"
      data-chapter="Contact"
      className="canvas-teal overflow-hidden pt-[clamp(4rem,14vh,9rem)]"
    >
      <div className="frame relative flex flex-col gap-[clamp(2rem,6vh,4rem)]">
        <TickRule />
        <p className="max-w-[18ch] font-serif text-[clamp(2.25rem,min(6vw,10svh),4.5rem)] leading-[1.02]">
          Small-sided football and the culture around it, in Colombo.
        </p>
        {lead ? (
          <h2
            id="closing-heading"
            className="font-display text-[clamp(1.75rem,min(8vw,14svh),7rem)] leading-[0.9] font-bold uppercase"
          >
            <a href={lead.url!} data-cursor="Follow" className="follow-link">
              Follow <span className="block [overflow-wrap:anywhere]">{lead.handle ?? lead.name}</span>
            </a>
          </h2>
        ) : (
          <h2 id="closing-heading" className="sr-only">
            Frontier Football
          </h2>
        )}
        {links.length ? (
          <ul className="flex flex-wrap items-center gap-3">
            {links.map((link) => {
              const icon = link.name ? brandIcons[link.name] : undefined;
              return (
                <li key={link.name}>
                  <a
                    href={link.url!}
                    aria-label={icon ? `${link.name} ${link.handle ?? ""}`.trim() : undefined}
                    className="flex size-14 w-auto min-w-14 items-center justify-center border-2 border-current px-3 transition-colors hover:bg-bone hover:text-teal"
                  >
                    {icon ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
                        <path d={icon} />
                      </svg>
                    ) : (
                      <span className="micro">{link.name}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {/* The sign-off (opus55): the name, edge to edge, rising line by line.
          Decoration; the page already names itself. */}
      <SplitReveal
        as="p"
        lines={["Frontier", "Football."]}
        step={90}
        className="closing-mark mt-[clamp(3rem,10vh,7rem)] px-[1.5vw] font-display leading-[0.8] font-bold uppercase [&>span:last-child]:text-yellow"
      />
    </section>
  );
}
