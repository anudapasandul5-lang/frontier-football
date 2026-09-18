import raw from "@/content.js";
import { outboundLinks, parseContent } from "@/lib/content-data";

export const pages = [
  { href: "/events", label: "Events" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
];

/* Three-part nav (DESIGN.md): page links left, crest centre, the one action
   right. It sits at the top of the page's first canvas and takes that canvas's
   colour, so it never needs a bar of its own. Not fixed: a fixed nav would
   pass over bone, ink and four colour fields, and no single text colour reads
   on all six. The mobile menu is a native <details>, so it opens with JS off.

   Instagram is looked up from content.js rather than typed here, so blanking
   its url there removes the link instead of shipping a dead one. */
export function Nav({ crestPriority = false }: { crestPriority?: boolean }) {
  const instagram = outboundLinks(parseContent(raw)).find((link) => link.name === "Instagram");
  return (
    <header className="frame relative z-10 grid h-20 grid-cols-[1fr_auto_1fr] items-center">
      <nav aria-label="Pages" className="justify-self-start">
        <ul className="micro hidden gap-6 text-current md:flex">
          {pages.map((page) => (
            <li key={page.href}>
              <a className="underline-offset-4 hover:underline" href={page.href}>
                {page.label}
              </a>
            </li>
          ))}
        </ul>
        <details className="relative md:hidden">
          <summary className="micro flex min-h-11 cursor-pointer list-none items-center text-current [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <ul className="micro absolute top-full left-0 flex min-w-40 flex-col gap-1 bg-[var(--canvas,var(--color-ink))] p-3 text-current">
            {pages.map((page) => (
              <li key={page.href}>
                <a className="flex min-h-11 items-center" href={page.href}>
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </nav>
      <a href="/" className="block" aria-label="Frontier Football, home">
        <img
          src="/crest.webp"
          alt=""
          width={525}
          height={640}
          className="h-14 w-auto"
          fetchPriority={crestPriority ? "high" : undefined}
        />
      </a>
      {instagram ? (
        <a
          href={instagram.url!}
          className="micro flex min-h-11 items-center justify-self-end text-current underline-offset-4 hover:underline"
        >
          <span className="md:hidden">Instagram</span>
          <span className="max-md:hidden">Follow {instagram.handle}</span>
        </a>
      ) : (
        <span />
      )}
    </header>
  );
}
