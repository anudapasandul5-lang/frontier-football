"use client";

import { useEffect, useRef, useState, ViewTransition, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { CLOSED, closeLightbox, openLightbox, stepIndex, type LightboxState } from "@/lib/gallery-data";
import {
  albumCredit,
  albumIdFromQuery,
  albumItems,
  albumStory,
  lightboxItems,
  manifestUrl,
  tileLabel,
  type AlbumItem,
} from "@/lib/album-data";

const button = "min-h-11 cursor-pointer border-2 border-ink px-6 py-2 font-display text-lg leading-none uppercase hover:bg-ink hover:text-bone";

type Credit = ReturnType<typeof albumCredit>;
type Story = NonNullable<ReturnType<typeof albumStory>>;

export function AlbumHead({ title, count, credit, story, id }: { title: string; count: number; credit?: Credit; story?: Story | null; id?: string | null }) {
  return (
    <div className="canvas-ink mb-10">
      <div className={`md:min-h-[min(75svh,760px)] ${story?.photo ? "grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]" : "flex flex-col justify-end"}`}>
        <div className="frame flex flex-col justify-end py-10 md:py-20">
          <p className="micro mb-5">Frontier / Gallery</p>
          <h1 className="max-w-[15ch] font-display text-[clamp(3rem,8vw,8.5rem)] leading-[0.88] font-bold uppercase [text-wrap:balance]">{title}</h1>
          {story?.note ? <p className="mt-6 max-w-[38ch] text-xl">{story.note}</p> : null}
          {story?.champion ? <p className="mt-5 text-xl">Champions: <strong>{story.champion}</strong></p> : null}
          {story?.date || story?.venue ? <p className="micro mt-5">{[story.date, story.venue].filter(Boolean).join(" / ")}</p> : null}
          {story ? <a href="#album-photos" className="micro mt-10 w-fit border-b border-bone pb-1">Explore the photographs ↓</a> : null}
        </div>
        {story?.photo ? (
          <ViewTransition name={`album-cover-${id}`} share="album-cover" default="none">
            <figure className="relative h-[55svh] min-h-[350px] overflow-hidden md:h-full">
              <img src={story.photo} alt={story.photoAlt ?? title} className={`size-full ${story.photo.startsWith("/albums/") ? "object-contain" : "object-cover"}`} fetchPriority="high" />
              {story.photoCredit ? <figcaption className="absolute bottom-0 left-0 bg-ink px-4 py-2 text-xs text-bone">Photo: {story.photoCredit}</figcaption> : null}
            </figure>
          </ViewTransition>
        ) : null}
      </div>
      <div className="frame border-t border-bone/30 py-5">
      {count > 0 ? (
        <p className="text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.35]">
          {count.toLocaleString("en")} photographs.
        </p>
      ) : null}
      {credit?.credit ? (
        <p className="mt-2 text-bone/75">
          {credit.credit}.
          {credit.source ? (
            <>
              {" "}
              <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-yellow">
                See the full set on ThePapare
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}
      <a href="/gallery" className="micro mt-5 inline-flex min-h-11 items-center border-b border-bone hover:text-yellow">
        All albums
      </a>
      </div>
    </div>
  );
}

type Load = { state: "loading" } | { state: "failed" } | { state: "ready"; items: AlbumItem[]; credit: Credit };

/* One album from ?album=<id>, in a CSS-columns masonry, from public/albums/.
   The pixels are Drive thumbnails, or committed WebP for a ThePapare import. Two measured traps carried from v1:
   - src is withheld until a tile nears the viewport. loading="lazy" let all
     463 SZN 3 images ask Drive at once and 462 came back empty.
   - referrerPolicy="no-referrer" on every Drive image, or Drive refuses most
     requests (1 of 12 loaded with the default policy, 12 of 12 without). */
export function QueryAlbumView() {
  const id = albumIdFromQuery(useSearchParams().toString());
  return <AlbumView key={id} id={id} />;
}

export function AlbumView({ id }: { id: string | null }) {
  const story = albumStory(parseContent(raw), id);
  const title = story?.title ?? null;
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const grid = useRef<HTMLUListElement>(null);

  // Set again on every load change: Next re-applies the metadata title
  // ("Album") after hydration, so a single early write does not stick.
  useEffect(() => {
    document.title = `${title ?? "Album not found"} - Frontier Football`;
  }, [title, load]);

  useEffect(() => {
    if (!title || !id) return;
    let live = true;
    fetch(manifestUrl(id))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => live && setLoad({ state: "ready", items: albumItems(json), credit: albumCredit(json) }))
      .catch(() => live && setLoad({ state: "failed" }));
    return () => {
      live = false;
    };
  }, [id, title]);

  // One observer for the whole grid; a tile whose pixels were asked for is done.
  useEffect(() => {
    const imgs = grid.current?.querySelectorAll<HTMLImageElement>("img[data-src]");
    if (!imgs?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          observer.unobserve(img);
        }
      },
      { rootMargin: "600px 0px" },
    );
    imgs.forEach((img) => observer.observe(img));
    return () => observer.disconnect();
  }, [load]);

  if (!title) {
    return (
      <>
        <AlbumHead title="Album not found" count={0} />
        <p className="frame text-lg">That album is not on the site.</p>
      </>
    );
  }
  if (load.state !== "ready") {
    return (
      <>
        <AlbumHead title={title} count={0} story={story} id={id} />
        {load.state === "failed" ? (
          <p id="album-photos" className="frame scroll-mt-24 text-lg">These photographs could not be loaded just now. Try again in a moment.</p>
        ) : (
          // Holds the footer below the fold until the grid lands; without it the
          // grid shoved an on-screen footer down (CLS 0.19 at 412px).
          <div id="album-photos" className="min-h-svh scroll-mt-24" />
        )}
      </>
    );
  }
  if (load.items.length === 0) {
    return (
      <>
        <AlbumHead title={title} count={0} story={story} id={id} />
        <p id="album-photos" className="frame scroll-mt-24 text-lg">Photos are on the way.</p>
      </>
    );
  }

  const items = load.items;
  return (
    <>
      <AlbumHead title={title} count={items.length} credit={load.credit} story={story} id={id} />
      <div id="album-photos" className="frame mb-6 flex scroll-mt-24 items-end justify-between border-t-2 border-ink pt-5">
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none uppercase">Every frame</h2>
        <p className="micro">{items.length.toLocaleString("en")} photos</p>
      </div>
      <Lightbox items={lightboxItems(items, title)}>
        {(open) => (
          <ul ref={grid} className="frame columns-1 gap-2 min-[461px]:columns-2 min-[701px]:columns-3 min-[1101px]:columns-4">
            {items.map((item, i) => (
              <li key={item.id} className="mb-2 break-inside-avoid">
                <button
                  type="button"
                  aria-label={tileLabel(i, items.length, title)}
                  onClick={(event) => open(i, event.currentTarget)}
                  className="block w-full cursor-pointer overflow-hidden transition-transform duration-150 ease-[var(--ease-out)] hover:scale-[1.02]"
                >
                  <img
                    data-src={item.thumb}
                    alt=""
                    width={item.width}
                    height={item.height}
                    // Explicit: a src-less image is not reliably sized from its
                    // attributes, and the columns would reshuffle as pixels land.
                    style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="block h-auto w-full bg-ink/10"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Lightbox>
    </>
  );
}

type Slide = ReturnType<typeof lightboxItems>[number];

/* Native <dialog>: focus trap, Escape and the inert page come from the
   platform. Position is announced, never printed. Every route out (Escape,
   Close, backdrop) arrives at the close event once; focus goes back to the
   tile that opened it. */
function Lightbox({ items, children }: { items: Slide[]; children: (open: (i: number, opener: HTMLElement) => void) => React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<LightboxState>(CLOSED);

  const open = (index: number, opener: HTMLElement) => {
    setState((s) => openLightbox(s, index, opener));
    dialog.current?.showModal();
  };
  const step = (delta: number) => setState((s) => (s.isOpen ? { ...s, index: stepIndex(s.index, delta, items.length) } : s));
  const onClose = () => {
    const opener = state.opener as HTMLElement | null;
    setState((s) => closeLightbox(s));
    opener?.focus();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  };
  const item = state.isOpen ? items[state.index] : null;

  return (
    <>
      {children(open)}
      <dialog
        ref={dialog}
        aria-labelledby="lightbox-title"
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
        className="fixed inset-0 m-0 hidden size-full max-h-none max-w-none grid-rows-[minmax(0,1fr)_auto] gap-4 border-0 bg-bone/92 px-4 pt-15 pb-4 text-ink open:grid backdrop:bg-transparent sm:px-6 sm:pt-20 sm:pb-6"
      >
        <h2 id="lightbox-title" className="sr-only">
          Gallery
        </h2>
        <p className="sr-only" aria-live="polite">
          {item ? `${state.index + 1} of ${items.length}. ${item.alt}`.trim() : ""}
        </p>
        <div className="pointer-events-none grid min-h-0 grid-rows-[minmax(0,1fr)] place-items-center">
          {item ? (
            <img
              key={item.src}
              src={item.src}
              alt={item.alt || "A Frontier photograph."}
              referrerPolicy="no-referrer"
              className="pointer-events-auto h-auto max-h-full w-auto max-w-[min(100%,1100px)] border-2 border-ink bg-bone"
            />
          ) : null}
        </div>
        <div className="flex justify-center gap-3">
          <button type="button" className={button} onClick={() => step(-1)}>
            Previous
          </button>
          <button type="button" className={button} onClick={() => step(1)}>
            Next
          </button>
        </div>
        <button type="button" className={`${button} absolute top-4 right-4 sm:top-6 sm:right-6`} onClick={() => dialog.current?.close()}>
          Close
        </button>
      </dialog>
    </>
  );
}
