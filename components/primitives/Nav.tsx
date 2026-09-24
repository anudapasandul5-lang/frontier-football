import raw from "@/content.js";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { Menu } from "@/components/primitives/Menu";

export const pages = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/community", label: "Community" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/contact", label: "Contact" },
];

/* Three-part nav (DESIGN.md): page links left, crest centre, the one action
   right. It sits at the top of the page's first canvas and takes that canvas's
   colour, so it never needs a bar of its own. Not fixed: a fixed nav would
   pass over bone, ink and four colour fields, and no single text colour reads
   on all six. The mobile menu is a native <details>, so it opens with JS off.

   Instagram is looked up from content.js rather than typed here, so blanking
   its url there removes the link instead of shipping a dead one. */
/* `floating` (home, opus55): the header is fixed, takes the text colour of
   whatever canvas is under it (Interactions.tsx sets data-ui-tone), slides
   away while the reader scrolls down and returns on the way up. A spacer
   keeps the hero's layout where the header used to sit. */
export function Nav({ crestPriority = false, floating = false }: { crestPriority?: boolean; floating?: boolean }) {
  const instagram = outboundLinks(parseContent(raw)).find((link) => link.name === "Instagram");
  return (
    <>
    {floating ? <div aria-hidden="true" className="h-20" /> : null}
    <header
      data-floating={floating || undefined}
      className={floating ? "site-header" : "frame relative z-10 flex h-20 items-center justify-between"}
    >
      <div className={floating ? "frame flex h-20 items-center justify-between" : "contents"}>
      <a href="/" className="block" aria-label="Frontier Football, home">
        <img
          src="/crest-sm.webp"
          alt=""
          width={295}
          height={360}
          className="h-14 w-auto"
          fetchPriority={crestPriority ? "high" : undefined}
        />
      </a>
      <Menu instagram={instagram?.url ? { url: instagram.url, handle: instagram.handle ?? "" } : null} />
      </div>
    </header>
    </>
  );
}
