import raw from "@/content.js";
import { brandIcons } from "@/lib/brand-icons";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { TickRule } from "@/components/primitives/TickRule";

/* Act 9, United's closing band, in teal. It ends on the one action (plan Q4):
   following Frontier, as a row of channel logos. The serif line is the
   site's own description (layout.tsx metadata).

   The big "Follow @handle" headline was removed (owner, 2026-09-23); the
   heading stays for screen readers. The home page is the only place TikTok
   shows (owner, 2026-09-08, HOUSE-RULES section 7). */
export function Closing() {
  const links = outboundLinks(parseContent(raw));

  return (
    <section
      aria-labelledby="closing-heading"
      data-tone="bone"
      data-chapter="Contact"
      data-closing
      className="canvas-teal relative isolate overflow-hidden py-[clamp(4rem,14vh,9rem)]"
    >
      {/* The page ends by completing a pitch: its lines are drawn in with the
          scroll (HomeStory), the centre ring last, and the crest settles inside
          it. Drawn in full by default, so a still page already has the pitch. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1400 700"
        preserveAspectRatio="xMaxYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-none stroke-bone/25 [stroke-width:3] max-md:opacity-60"
      >
        <path className="close-line" pathLength={1} d="M1400 40H40V660H1400" />
        <path className="close-line" pathLength={1} d="M1000 40V660" />
        <path className="close-line" pathLength={1} d="M40 200H260V500H40" />
        <path className="close-line" pathLength={1} d="M40 280H130V420H40" />
        <path className="close-line" pathLength={1} d="M260 290A120 120 0 0 1 260 410" />
        <circle className="close-ring stroke-bone/70 max-md:hidden" pathLength={1} cx="1000" cy="350" r="170" />
        <image className="close-crest max-md:hidden" href="/crest.webp" x="922" y="255" width="156" height="190" />
      </svg>
      <div className="frame relative flex flex-col gap-[clamp(2rem,6vh,4rem)]">
        <TickRule />
        <p className="max-w-[18ch] font-serif text-[clamp(2.25rem,min(6vw,10svh),4.5rem)] leading-[1.02]">
          Small-sided football and the culture around it, from the heart of Sri Lanka.
        </p>
        <h2 id="closing-heading" className="sr-only">
          Follow Frontier Football
        </h2>
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
    </section>
  );
}
