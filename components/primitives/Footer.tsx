import raw from "@/content.js";
import { brandIcons } from "@/lib/brand-icons";
import { outboundLinks, parseContent } from "@/lib/content-data";

/* Footer (plan, 2026-10-28): just the platform icons, FLOST8 style, no text
   links (the menu already lists every page). Socials come from content.js, so
   blanking a url there drops the icon instead of shipping a dead link.
   WhatsApp stays with the actions that carry its prefilled text. The icons sit
   in the centre of the bar, the copyright at the right (owner, 2026-10-28). */
const socials = outboundLinks(parseContent(raw)).filter((link) => link.name === "Instagram" || link.name === "TikTok");

export function Footer() {
  return (
    <footer className="canvas-teal pb-8">
      <div className="frame">
        <div className="micro grid items-center gap-4 border-t border-current/25 pt-6 text-current sm:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden="true" className="max-sm:hidden" />
          <ul aria-label="Social" className="flex justify-center gap-3">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} (opens in a new tab)`}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-current transition-colors hover:bg-bone hover:text-teal"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
                    <path d={brandIcons[social.name!]} />
                  </svg>
                </a>
              </li>
            ))}
        </ul>
          <p className="text-center sm:justify-self-end">&copy; {new Date().getFullYear()} Frontier Football</p>
        </div>
      </div>
    </footer>
  );
}
