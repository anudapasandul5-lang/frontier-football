import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import raw from "@/content.js";
import { albumIds } from "@/lib/album-data";
import { albumFacts } from "@/lib/album-facts";
import { galleryChapters, type Chapter, type StoryAlbum } from "@/lib/gallery-story";
import { coverFor, reel, type ReelFrame } from "@/lib/highlights";
import { NextPage } from "@/components/pages/NextPage";
import { PageShell } from "@/components/pages/PageShell";
import { Nav } from "@/components/primitives/Nav";
import { SplitReveal } from "@/components/primitives/SplitReveal";

export const metadata: Metadata = { title: "Gallery" };

const n = (x: number) => x.toLocaleString("en");
const photos = (x: number) => `${n(x)} photo${x === 1 ? "" : "s"}`;

/* The opening reel is the hero (plan stress test 3: a photo hero plus a reel
   pushed the albums to the third screen). One row, under the heading, slides
   with the scroll (data-drift, no autoplay, so reduced motion is simply
   still); the row above the heading was removed by the owner, 2026-09-24.
   Each row holds its frames twice so a slide never shows a gap; the
   copy is hidden from assistive tech and the tab order. */
function ReelRow({ frames, drift, lead = false }: { frames: ReelFrame[]; drift: string; lead?: boolean }) {
  return (
    <div data-drift={drift} data-drift-flat className="flex w-max gap-2 sm:gap-3">
      {[0, 1].map((copy) =>
        frames.map((f, i) => {
          // Only the first two frames of the lead row race for bandwidth; the
          // rest wait, and the off-screen copies load lazily (mobile LCP).
          const first = lead && !copy && i < 2;
          const img = (
            <img
              src={f.src}
              alt={copy ? "" : f.alt}
              width={f.w}
              height={f.h}
              decoding="async"
              fetchPriority={first ? "high" : "auto"}
              loading={copy ? "lazy" : undefined}
              className="h-[clamp(130px,25svh,300px)] w-auto object-cover"
            />
          );
          const key = `${copy}-${f.src}`;
          return f.albumId ? (
            <Link key={key} href={`/albums/${f.albumId}`} data-cursor="Open" aria-hidden={copy ? true : undefined} tabIndex={copy ? -1 : undefined} className="block shrink-0 overflow-hidden">
              {img}
            </Link>
          ) : (
            <span key={key} className="block shrink-0 overflow-hidden">
              {img}
            </span>
          );
        }),
      )}
    </div>
  );
}

function Reel({ albums, total }: { albums: number; total: number }) {
  return (
    <section data-tone="bone" data-chapter="Gallery" aria-labelledby="page-heading" className="canvas-night relative isolate flex flex-col gap-[clamp(1rem,3svh,2rem)] overflow-hidden pt-4 pb-10">
      <Nav floating />
      <div className="frame">
        <p className="micro mb-4 text-yellow">Gallery</p>
        <SplitReveal
          as="h1"
          id="page-heading"
          lines={["What it", "feels like."]}
          lineClassName="last:text-yellow"
          className="font-display text-[min(clamp(3.25rem,13vw,10rem),20svh)] leading-[0.84] font-bold uppercase"
        />
        <p className="mt-5 max-w-[44ch] text-[clamp(1.05rem,0.95rem+0.45vw,1.35rem)] leading-[1.45] text-bone/85">
          {n(albums)} albums and {n(total)} photographs from every Frontier night, on the pitch and in front of the screen.
        </p>
      </div>
      <ReelRow frames={reel.slice(5)} drift="0.14" lead />
    </section>
  );
}

/* The album's cover, morphing into its hero on the album page. Both pages
   pick the picture with coverFor, so the two ends of the morph match. */
function Cover({ album, className }: { album: StoryAlbum; className: string }) {
  const cover = coverFor(album);
  if (!cover) return null;
  return (
    <ViewTransition name={`album-cover-${album.id}`} share="album-cover" default="none">
      <img src={cover.src} alt={cover.alt || `${album.title}.`} width={1600} height={900} loading="lazy" decoding="async" className={className} />
    </ViewTransition>
  );
}

function Meta({ album }: { album: StoryAlbum }) {
  return <p className="micro !text-current/80">{[photos(album.count), album.venue].filter(Boolean).join(" · ")}</p>;
}

const open = (
  <span className="micro !text-current inline-flex items-center gap-2">
    Open album <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
  </span>
);

/* Seasons and tournaments as photo cards (owner, 2026-09-24: full-screen
   bands were too big, index rows hid the photos behind a hover). Three to a
   row, 4:5, the name over the photo. An album whose own frames are
   watermarked shows its clean Frontier photo if it has one; with none it is a
   yellow card carrying just the name. */
function AlbumCards({ albums }: { albums: StoryAlbum[] }) {
  return (
    <ul className="frame grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => {
        // Watermarked albums have no clean cover; the inset (a clean Frontier
        // frame) stands in, never morphing, and with neither it is a yellow card.
        const cover = album.treatment === "photo" ? coverFor(album) : null;
        const pic = cover?.src ?? album.inset;
        return (
          <li key={album.id}>
            <Link
              href={`/albums/${album.id}`}
              data-cursor="Open"
              className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden sm:aspect-[4/5] ${pic ? "text-bone" : "bg-yellow text-ink"}`}
            >
              {cover ? (
                <Cover album={album} className="absolute inset-0 size-full object-cover object-[center_30%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              ) : pic ? (
                <img src={pic} alt={album.photoAlt ?? ""} width={720} height={900} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              ) : null}
              {pic ? <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent" /> : null}
              <div className="relative flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="font-display text-[clamp(2.5rem,4.2vw,4rem)] leading-[0.88] font-bold uppercase [text-wrap:balance]">{album.short ?? album.title}</h3>
                {album.champion ? (
                  <p className="text-base leading-tight">
                    Champions <strong>{album.champion}</strong>
                  </p>
                ) : null}
                <div className={`flex items-center justify-between gap-4 border-t pt-3 ${pic ? "border-bone/30" : "border-ink/30"}`}>
                  <Meta album={album} />
                  <span aria-hidden="true" className="font-display text-2xl leading-none transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* Watch parties are nights Frontier watched, not ran: smaller bands, side by
   side, under one heading (stress test 1). The first two take half the row
   each, the rest share thirds. */
function WatchGrid({ albums }: { albums: StoryAlbum[] }) {
  return (
    <ul className="frame grid gap-2 min-[700px]:grid-cols-6 sm:gap-3">
      {albums.map((album, i) => (
        <li key={album.id} className={i < 2 ? "min-[700px]:col-span-3" : "min-[700px]:col-span-2"}>
          <Link href={`/albums/${album.id}`} data-cursor="Open" className={`group relative block overflow-hidden text-bone ${i < 2 ? "h-[clamp(320px,62svh,620px)]" : "h-[clamp(300px,48svh,480px)]"}`}>
            {album.photo ? <Cover album={album} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" /> : null}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
              <h3 className="max-w-[16ch] font-display text-[clamp(1.9rem,3.4vw,3.25rem)] leading-[0.9] font-bold uppercase [text-wrap:balance]">{album.title}</h3>
              <div className="flex items-center justify-between gap-4 border-t border-bone/30 pt-3">
                <Meta album={album} />
                {open}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ChapterBlock({ chapter }: { chapter: Chapter }) {
  const total = chapter.albums.reduce((s, a) => s + a.count, 0);
  const many = chapter.albums.length > 1;
  return (
    <section id={chapter.id} data-tone="bone" data-chapter={chapter.label} aria-labelledby={`${chapter.id}-heading`} className="canvas-night scroll-mt-4 pb-2 sm:pb-3">
      <header className="frame flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pt-[clamp(4rem,14vh,8rem)] pb-8">
        <h2 id={`${chapter.id}-heading`} className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] font-bold uppercase">
          {chapter.label}
        </h2>
        {/* One album: its card already says how many photos. */}
        {many ? (
          <p className="micro">
            {chapter.albums.length} albums · {photos(total)}
          </p>
        ) : null}
      </header>
      {chapter.kind === "watch" ? (
        <WatchGrid albums={chapter.albums} />
      ) : (
        <AlbumCards albums={chapter.albums} />
      )}
    </section>
  );
}

export default function Gallery() {
  const chapters = galleryChapters(raw, albumFacts(albumIds(raw)));
  const albums = chapters.flatMap((c) => c.albums);
  const total = albums.reduce((s, a) => s + a.count, 0);

  return (
    <PageShell hero={<Reel albums={albums.length} total={total} />}>
      {/* Jump links, not tabs: every album stays on the page, and the chapter
          indicator (Interactions) shows where the reader is. */}
      <nav aria-label="Gallery chapters" className="canvas-night border-y border-bone/15">
        <ul className="frame flex flex-wrap gap-x-8 gap-y-2 py-5">
          {chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="inline-flex min-h-11 items-center gap-2 font-display text-[clamp(1.1rem,1rem+0.4vw,1.5rem)] uppercase hover:text-yellow">
                {c.label}
                <span className="micro">{c.albums.length > 1 ? c.albums.length : ""}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {chapters.map((c) => (
        <ChapterBlock key={c.id} chapter={c} />
      ))}
      <NextPage current="/gallery" />
    </PageShell>
  );
}
