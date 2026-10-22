"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { phoneSrcSet } from "@/lib/phone-image";

/* A native modal keeps focus in the menu and returns it to the trigger on
   Escape. Seven links since Community (L7). */
export const menuLinks = [
  { href: "/", label: "Home", photo: "/pages/menu-home.webp" },
  { href: "/who-we-are", label: "Who We Are", photo: "/pages/menu-who.webp" },
  { href: "/events", label: "Events", photo: "/pages/menu-events.webp" },
  { href: "/gallery", label: "Gallery", photo: "/pages/menu-gallery.webp" },
  { href: "/community", label: "Community", photo: "/pages/menu-community.webp" },
  { href: "/collaborate", label: "Collaborate", photo: "/pages/menu-collaborate.webp" },
  { href: "/contact", label: "Contact", photo: "/pages/menu-contact.webp" },
];

export function Menu({ instagram }: { instagram: { url: string; handle: string } | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname();

  function keepFocusInside(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const links = [...event.currentTarget.querySelectorAll<HTMLElement>("a, button")];
    const first = links[0];
    const last = links.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        // Invoker commands open the dialog natively, so the menu works with
        // JS off in browsers that support them; onClick covers the rest.
        {...{ commandfor: "site-menu", command: "show-modal" }}
        onClick={() => dialog.current?.showModal()}
        className="micro flex min-h-11 cursor-pointer items-center px-1 text-current transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
      >
        Menu
      </button>
      <dialog ref={dialog} id="site-menu" aria-label="Menu" className="menu" onKeyDown={keepFocusInside}>
        <div className="frame relative z-10 flex h-20 items-center justify-between">
          <a href="/" aria-label="Frontier Football, home" onClick={() => dialog.current?.close()}>
            <img src="/crest-sm.webp" alt="" width={295} height={360} className="h-14 w-auto" />
          </a>
          <button
            type="button"
            autoFocus
            {...{ commandfor: "site-menu", command: "close" }}
            onClick={() => dialog.current?.close()}
            className="micro flex min-h-11 cursor-pointer items-center px-1 text-bone transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
          >
            Close
          </button>
        </div>
        <nav aria-label="Pages" className="frame flex min-h-[calc(100dvh-5rem)] flex-col justify-between pb-8">
          <ul className="flex flex-col pt-4 md:pt-2">
            {menuLinks.map((link) => (
              <li key={link.href} className="menu__item">
                <img
                  src={link.photo}
                  srcSet={phoneSrcSet(link.photo)}
                  sizes="100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="menu__photo pointer-events-none fixed inset-0 -z-10 size-full object-cover"
                />
                <a
                  href={link.href}
                  aria-current={path === link.href ? "page" : undefined}
                  onClick={() => dialog.current?.close()}
                  className="block w-max font-display text-[clamp(2.5rem,13vw,4rem)] leading-[1] font-bold uppercase transition-colors duration-150 hover:text-yellow aria-[current=page]:text-yellow md:text-[min(8.5vw,10.5vh)] md:leading-[0.92]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="micro flex flex-wrap gap-x-6 gap-y-2 pt-8">
            {instagram ? (
              <a href={instagram.url} className="flex min-h-11 items-center underline-offset-4 hover:underline">
                Instagram {instagram.handle}
              </a>
            ) : null}
          </div>
        </nav>
      </dialog>
    </>
  );
}
