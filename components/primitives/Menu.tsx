"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";

/* L0 PROTOTYPE: the full-screen ink menu (owner-locked). Seven giant condensed
   links; on a desktop pointer the hovered link puts its photo behind the
   list. A native modal <dialog>: showModal() makes the page behind inert, so
   Tab stays inside, Escape closes it and focus returns to the MENU button,
   all without hand-written focus code. Who We Are and Community are stubs
   until L1 and L7 build them. */
export const menuLinks = [
  { href: "/", label: "Home", photo: "/champions/szn-6.webp" },
  { href: "/who-we-are", label: "Who We Are", photo: "/champions/szn-1.webp" },
  { href: "/events", label: "Events", photo: "/champions/szn-4.webp" },
  { href: "/gallery", label: "Gallery", photo: "/champions/wa-final-esp-arg.webp" },
  { href: "/community", label: "Community", photo: "/champions/szn-2.webp" },
  { href: "/collaborate", label: "Collaborate", photo: "/champions/wa-semi-esp-fra.webp" },
  { href: "/contact", label: "Contact", photo: "/champions/wa-ucl-final-night.webp" },
];

export function Menu({ instagram }: { instagram: { url: string; handle: string } | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname();

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
      <dialog ref={dialog} id="site-menu" aria-label="Menu" className="menu">
        <div className="frame relative z-10 flex h-20 items-center justify-between">
          <a href="/" aria-label="Frontier Football, home" onClick={() => dialog.current?.close()}>
            <img src="/crest.webp" alt="" width={525} height={640} className="h-14 w-auto" />
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
