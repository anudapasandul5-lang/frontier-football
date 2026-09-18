import raw from "@/content.js";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { MicroLabel } from "@/components/primitives/MicroLabel";
import { TickRule } from "@/components/primitives/TickRule";

/* Act 9, United's closing band, in teal. It ends on the one action (plan Q4):
   following Frontier, as the act's headline rather than a button. The serif
   line is the site's own description (layout.tsx metadata).

   Whatever outbound link comes first in content.js leads (Instagram today), so
   blanking it degrades to the next one instead of a headless band. The rest
   sit under "Also on": the home page is the only place TikTok shows (owner,
   2026-09-08, HOUSE-RULES section 7). */
export function Closing() {
  const [lead, ...others] = outboundLinks(parseContent(raw));

  return (
    <section
      aria-labelledby="closing-heading"
      className="canvas-teal pt-[clamp(4rem,14vh,9rem)] pb-[clamp(3rem,8vh,5rem)]"
    >
      <div className="frame flex flex-col gap-[clamp(2rem,6vh,4rem)]">
        <TickRule />
        <p className="max-w-[18ch] font-serif text-[clamp(2.25rem,min(6vw,10svh),4.5rem)] leading-[1.02]">
          Small-sided football and the culture around it, in Colombo.
        </p>
        {lead ? (
          <h2
            id="closing-heading"
            className="font-display text-[clamp(1.75rem,min(8vw,14svh),7rem)] leading-[0.9] font-bold uppercase"
          >
            <a href={lead.url!} className="underline-offset-[0.1em] hover:underline">
              Follow <span className="block [overflow-wrap:anywhere]">{lead.handle ?? lead.name}</span>
            </a>
          </h2>
        ) : (
          <h2 id="closing-heading" className="sr-only">
            Frontier Football
          </h2>
        )}
        {others.length ? (
          <div className="flex flex-col gap-2">
            <MicroLabel>Also on</MicroLabel>
            <ul className="micro flex flex-wrap gap-x-6 text-current">
              {others.map((link) => (
                <li key={link.name}>
                  <a href={link.url!} className="flex min-h-11 items-center underline underline-offset-4 hover:no-underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
