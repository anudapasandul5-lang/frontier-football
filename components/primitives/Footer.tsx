import raw from "@/content.js";
import { outboundLinks, parseContent } from "@/lib/content-data";
import { pages } from "@/components/primitives/Nav";

/* The minimal footer (plan L6b): one row of page links, the socials, the
   copyright, on the closing band's teal (DESIGN.md: closing band / footer
   field). Socials come from content.js, so blanking a url there drops the
   link instead of shipping a dead one. WhatsApp stays with the actions that
   carry its prefilled text, not down here. */
const socials = outboundLinks(parseContent(raw)).filter((link) => link.name === "Instagram" || link.name === "TikTok");

const link = "flex min-h-11 items-center underline-offset-4 hover:underline";

export function Footer() {
  return (
    <footer className="canvas-teal pb-8">
      <div className="frame">
        <div className="micro flex flex-col gap-4 border-t border-current/25 pt-6 text-current lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6">
              {[{ href: "/", label: "Home" }, ...pages].map((page) => (
                <li key={page.href}>
                  <a href={page.href} className={link}>
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-x-6">
            <ul aria-label="Social" className="flex gap-x-6">
              {socials.map((social) => (
                <li key={social.name}>
                  <a href={social.url!} target="_blank" rel="noopener noreferrer" className={link}>
                    {social.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p>&copy; {new Date().getFullYear()} Frontier Football</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
