"use client";

import { useEffect, useId, useRef, useState, ViewTransition, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { CLOSED, closeLightbox, countLabel, openLightbox, stepIndex, type LightboxState } from "@/lib/gallery-data";
import type { Highlight } from "@/lib/highlights";
import {
  albumCredit,
  albumIdFromQuery,
  albumItems,
  albumStory,
  lightboxItems,
  manifestUrl,
  refPolicy,
  tileLabel,
  type AlbumItem,
} from "@/lib/album-data";

// Square icon buttons on the dark lightbox; 48px keeps them thumb-sized.
const button = "flex size-12 cursor-pointer items-center justify-center border border-bone/40 font-display text-2xl leading-none text-bone transition-colors hover:border-yellow hover:text-yellow";

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
              <img src={story.photo} alt={story.photoAlt ?? title} className={`size-full ${story.photo.startsWith("/albums/") ? "object-contain" : "object-cover"}`} fetchPriority="high" referrerPolicy={refPolicy(story.photo)} />
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

/* One album from ?album=<id>, in justified rows, from public/albums/.
   The pixels are Drive thumbnails, or committed WebP for a ThePapare import. Two measured traps carried from v1:
   - src is withheld until a tile nears the viewport. loading="lazy" let all
     463 SZN 3 images ask Drive at once and 462 came back empty.
   - referrerPolicy="no-referrer" on every Drive image, or Drive refuses most
     requests (1 of 12 loaded with the default policy, 12 of 12 without). */
export function QueryAlbumView() {
  const id = albumIdFromQuery(useSearchParams().toString());
  return <AlbumView key={id} id={id} />;
}

type Tile = { key: string; src?: string; lazySrc?: string; width: number; height: number; alt: string };

/* Justified rows in CSS alone: each tile grows in proportion to its own
   aspect ratio from a basis of ratio x --row-h, so a row fills the width and
   no photo is cropped. The ::after filler stops a short last row from
   stretching its few tiles to full width. */
function Justified({ tiles, rowHeight, onOpen, labelFor }: { tiles: Tile[]; rowHeight: string; onOpen: (i: number, el: HTMLElement) => void; labelFor: (i: number) => string }) {
  return (
    <ul className="frame flex flex-wrap gap-2 after:grow-[999] after:content-['']" style={{ "--row-h": rowHeight } as CSSProperties}>
      {tiles.map((t, i) => {
        const ratio = t.width / t.height;
        return (
          <li key={t.key} style={{ flexGrow: ratio, flexBasis: `calc(${ratio} * var(--row-h))` }}>
            <button type="button" aria-label={labelFor(i)} onClick={(e) => onOpen(i, e.currentTarget)} className="group block w-full cursor-pointer overflow-hidden bg-bone/5">
              <img
                src={t.src}
                data-src={t.lazySrc}
                alt={t.alt}
                width={t.width}
                height={t.height}
                // Explicit: a src-less image is not reliably sized from its
                // attributes, and the rows would reshuffle as pixels land.
                style={{ aspectRatio: `${t.width} / ${t.height}` }}
                loading={t.src ? "lazy" : undefined}
                decoding="async"
                referrerPolicy="no-referrer"
                className="block h-auto w-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* The album's own words first: the hand-picked frames, big. */
function Highlights({ items, title }: { items: Highlight[]; title: string }) {
  const slides = items.map((h) => ({ src: h.src, alt: h.alt, isClip: false, width: h.w, height: h.h }));
  return (
    <section aria-labelledby="highlights-heading" className="pt-[clamp(3rem,10vh,6rem)]">
      <div className="frame mb-8 flex items-end justify-between gap-6">
        <h2 id="highlights-heading" className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] font-bold uppercase">
          Highlights
        </h2>
        <p className="micro">{items.length} picked frames</p>
      </div>
      <Lightbox items={slides}>
        {(open) => (
          <Justified
            tiles={items.map((h) => ({ key: h.src, src: h.src, width: h.w, height: h.h, alt: h.alt }))}
            rowHeight="clamp(150px, 24vw, 320px)"
            onOpen={open}
            labelFor={(i) => `Open highlight ${i + 1} of ${items.length}, ${title}`}
          />
        )}
      </Lightbox>
    </section>
  );
}

export function AlbumView({ id, head = true, highlights = [] }: { id: string | null; head?: boolean; highlights?: Highlight[] }) {
  const story = albumStory(parseContent(raw), id);
  const title = story?.title ?? null;
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const grid = useRef<HTMLElement>(null);

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

  const ready = load.state === "ready" ? load : null;
  const top = head ? <AlbumHead title={title} count={ready?.items.length ?? 0} credit={ready?.credit} story={story} id={id} /> : null;
  const picks = highlights.length > 0 ? <Highlights items={highlights} title={title} /> : null;

  if (!ready || ready.items.length === 0) {
    return (
      <>
        {top}
        {picks}
        {load.state === "failed" ? (
          <p id="album-photos" className="frame scroll-mt-24 pt-12 text-lg">
            These photographs could not be loaded just now. Try again in a moment.
          </p>
        ) : ready ? (
          <p id="album-photos" className="frame scroll-mt-24 pt-12 text-lg">
            Photos are on the way.
          </p>
        ) : (
          // Holds the footer below the fold until the grid lands; without it the
          // grid shoved an on-screen footer down (CLS 0.19 at 412px).
          <div id="album-photos" className="min-h-svh scroll-mt-24" />
        )}
      </>
    );
  }

  const { items, credit } = ready;
  return (
    <>
      {top}
      {picks}
      <section ref={grid} id="album-photos" aria-labelledby="all-heading" className="scroll-mt-24 pt-[clamp(4rem,12vh,7rem)]">
        <div className="frame mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 id="all-heading" className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] font-bold uppercase">
            All {items.length.toLocaleString("en")}
          </h2>
          {!head && credit.credit ? (
            <p className="micro">
              {credit.credit}
              {credit.source ? (
                <>
                  {" · "}
                  <a href={credit.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-yellow">
                    Full set on ThePapare
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        <Lightbox items={lightboxItems(items, title)}>
          {(open) => (
            <Justified
              tiles={items.map((item) => ({ key: item.id, lazySrc: item.thumb, width: item.width, height: item.height, alt: "" }))}
              rowHeight="clamp(110px, 17vw, 230px)"
              onOpen={open}
              labelFor={(i) => tileLabel(i, items.length, title)}
            />
          )}
        </Lightbox>
      </section>
    </>
  );
}

type Slide = { src: string; alt: string };

/* Native <dialog>: focus trap, Escape and the inert page come from the
   platform. Dark, because photographs read best on dark. The position is
   printed and announced; arrow keys, the buttons or a sideways swipe step
   through, and the neighbours are fetched ahead so the next frame is ready.
   Every route out (Escape, Close, backdrop) arrives at the close event once;
   focus goes back to the tile that opened it. */
function Lightbox({ items, children }: { items: Slide[]; children: (open: (i: number, opener: HTMLElement) => void) => ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  // An album page holds two lightboxes (Highlights and All), so the label id
  // must be unique per instance.
  const titleId = useId();
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

  useEffect(() => {
    if (!state.isOpen || items.length < 2) return;
    for (const d of [1, -1]) {
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = items[stepIndex(state.index, d, items.length)].src;
    }
  }, [state.isOpen, state.index, items]);

  return (
    <>
      {children(open)}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          const start = swipe.current;
          swipe.current = null;
          if (start === null || e.pointerType === "mouse") return;
          const dx = e.clientX - start;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
        className="fixed inset-0 m-0 hidden size-full max-h-none max-w-none touch-pan-y grid-rows-[auto_minmax(0,1fr)_auto] gap-4 border-0 bg-night/96 p-4 text-bone open:grid backdrop:bg-transparent sm:p-6"
      >
        <h2 id={titleId} className="sr-only">
          Gallery
        </h2>
        <p className="sr-only" aria-live="polite">
          {item ? `${state.index + 1} of ${items.length}. ${item.alt}`.trim() : ""}
        </p>
        <div className="flex items-center justify-between">
          <p aria-hidden="true" className="micro">
            {state.isOpen ? countLabel(state.index, items.length) : ""}
          </p>
          <button type="button" aria-label="Close" className={button} onClick={() => dialog.current?.close()}>
            ×
          </button>
        </div>
        <div className="pointer-events-none grid min-h-0 grid-rows-[minmax(0,1fr)] place-items-center">
          {item ? (
            <img
              key={item.src}
              src={item.src}
              alt={item.alt || "A Frontier photograph."}
              referrerPolicy="no-referrer"
              draggable={false}
              className="pointer-events-auto h-auto max-h-full w-auto max-w-[min(100%,1400px)] select-none"
            />
          ) : null}
        </div>
        <div className="flex justify-center gap-3">
          <button type="button" aria-label="Previous photo" className={button} onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next photo" className={button} onClick={() => step(1)}>
            →
          </button>
        </div>
      </dialog>
    </>
  );
}

