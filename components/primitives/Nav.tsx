import raw from "@/content.js";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { Menu } from "@/components/primitives/Menu";

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
  // L0 PROTOTYPE: crest left, MENU right; the page links live in the
  // full-screen menu (owner-locked). Takes its canvas colour, as before.
  return (
    <header className="frame relative z-10 flex h-20 items-center justify-between">
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
      <Menu instagram={instagram?.url ? { url: instagram.url, handle: instagram.handle ?? "" } : null} />
    </header>
  );
}
