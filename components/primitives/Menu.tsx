"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { phoneSrcSet } from "@/lib/phone-image";

/* A native modal keeps focus in the menu and returns it to the trigger on
   Escape. Seven links since Community (L7). `focus` is the photo's
   object-position: on a wide, short window object-cover trims the top and
   bottom, so each photo keeps its faces (the contact shot keeps its players,
   who stand low in the frame). */
export const menuLinks = [
  { href: "/", label: "Home", photo: "/hero/video-poster.webp", focus: "center" },
  { href: "/who-we-are", label: "Who We Are", photo: "/heroes/who-main.webp", focus: "center 55%" },
  { href: "/events", label: "Events", photo: "/heroes/events.webp", focus: "center 40%" },
  { href: "/gallery", label: "Gallery", photo: "/heroes/gallery-phone.webp", focus: "70% 35%" },
  { href: "/community", label: "Community", photo: "/heroes/community-pitch.webp", focus: "center top" },
  { href: "/collaborate", label: "Collaborate", photo: "/heroes/collaborate-crowd.webp", focus: "center" },
  { href: "/contact", label: "Contact", photo: "/heroes/contact.webp", focus: "center 40%" },
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
        aria-label="Menu"
        className="btn flex size-12 cursor-pointer items-center justify-center bg-bone text-ink transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
      >
        {/* Three lines in a cream button: bigger and easier to spot than the word (plan, 2026-10-28). */}
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-none stroke-current [stroke-width:2.4]">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <dialog ref={dialog} id="site-menu" aria-label="Menu" className="menu" onKeyDown={keepFocusInside}>
        <div className="relative z-10 mx-auto flex h-20 w-full max-w-[1450px] items-center justify-between px-4 md:px-8">
          <a href="/" aria-label="Frontier Football, home" onClick={() => dialog.current?.close()}>
            <img src="/crest-sm.webp" alt="" width={295} height={360} className="h-14 w-auto" />
          </a>
          <button
            type="button"
            autoFocus
            {...{ commandfor: "site-menu", command: "close" }}
            onClick={() => dialog.current?.close()}
            className="micro uppercase tracking-[0.12em] flex min-h-11 cursor-pointer items-center px-1 text-bone transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
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
                  style={{ objectPosition: link.focus }}
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
