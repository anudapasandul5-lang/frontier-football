import { pages } from "@/components/primitives/Nav";

/* The page footer, on the closing band's teal (DESIGN.md: closing band /
   footer field). The nav's page links plus home; outbound links live in the
   home page's closing act, not here (owner, 2026-09-08). */
export function Footer() {
  return (
    <footer className="canvas-teal pb-8">
      <div className="frame">
        <div className="flex flex-col gap-4 border-t border-current/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Footer">
          <ul className="micro flex flex-wrap gap-x-6 text-current">
            {[{ href: "/", label: "Home" }, ...pages].map((page) => (
              <li key={page.href}>
                <a href={page.href} className="flex min-h-11 items-center underline-offset-4 hover:underline">
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
          <p className="micro">&copy; {new Date().getFullYear()} Frontier Football</p>
        </div>
      </div>
    </footer>
  );
}
