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
import { phoneSrcSet } from "@/lib/phone-image";

export const metadata: Metadata = { title: "Gallery" };

/* The opening reel is the hero (plan stress test 3: a photo hero plus a reel
   pushed the albums to the third screen). One row, under the heading, slides
   with the scroll (data-drift, no autoplay, so reduced motion is simply
   still); the row above the heading was removed by the owner, 2026-09-24.
   Each row holds its frames twice so a slide never shows a gap; the
   copy is hidden from assistive tech and the tab order. */
function ReelRow({ frames, drift, lead = false }: { frames: ReelFrame[]; drift: string; lead?: boolean }) {
  return (
    // Start where the drift (Interactions) puts the row at the top of the
    // page, a sixth of its width in. From 0, frame 3 only slid into view
    // once the script ran, which held the phone LCP ~3.5s after it loaded.
    <div data-drift={drift} data-drift-flat className="flex w-max gap-2 sm:gap-3" style={{ transform: "translate3d(-16.667%, 0, 0)" }}>
      {[0, 1].map((copy) =>
        frames.map((f, i) => {
          // The drift opens about a frame and a half in, so frames 1-3 are what
          // a phone sees first (frame 3 is its LCP): they get the bandwidth.
          // The duplicate copy loads lazily.
          const first = lead && !copy && i < 3;
          const img = (
            <img
              src={f.src}
              alt={copy ? "" : f.alt}
              width={f.w}
              height={f.h}
              decoding="async"
              fetchPriority={first ? "high" : "auto"}
              loading={copy ? "lazy" : undefined}
              className="h-[clamp(100px,19svh,225px)] w-auto object-cover"
            />
          );
          const key = `${copy}-${f.src}`;
          return f.albumId ? (
            // No prefetch: a prefetched album page brings its full-size hero
            // as a high-priority preload (~400KB), racing the reel on a phone.
            <Link key={key} href={`/albums/${f.albumId}`} prefetch={false} aria-hidden={copy ? true : undefined} tabIndex={copy ? -1 : undefined} className="photo-frame block shrink-0 overflow-hidden">
              {img}
            </Link>
          ) : (
            <span key={key} className="photo-frame block shrink-0 overflow-hidden">
              {img}
            </span>
          );
        }),
      )}
    </div>
  );
}

function Reel() {
  return (
    <>
    <Nav floating />
    <section data-tone="bone" data-chapter="Gallery" aria-labelledby="page-heading" className="canvas-night relative isolate flex min-h-svh flex-col gap-[clamp(1rem,3svh,2rem)] overflow-hidden pt-4 pb-6">
      {/* Hero photo behind the title and reel (owner, 2026-10-28): the phone
          filming the screen sits right, the title on the blurred left. */}
      <img
        src="/heroes/gallery-phone.webp"
        srcSet={phoneSrcSet("/heroes/gallery-phone.webp")}
        sizes="100vw"
        alt="A fan films the big screen on a phone at a Frontier watch party at Main Sports Bar"
        width={2400}
        height={1602}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
      />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/40 to-night/20" />
      <div aria-hidden="true" className="h-20 shrink-0" />
      {/* Title a quarter smaller and nudged in from the edge (owner, 2026-10-28). */}
      <div className="px-[clamp(1rem,2.5vw,3rem)] md:pl-[6vw]">
        <SplitReveal
          as="h1"
          id="page-heading"
          lines={["Gallery"]}
          lineClassName="last:text-yellow"
          className="-ml-[0.045em] font-display text-[min(clamp(3.375rem,18vw,15rem),24svh)] leading-[0.84] font-bold uppercase"
        />
        <p className="mt-5 max-w-[34ch] text-lead-l leading-snug text-bone">The people and the players.</p>
      </div>
      {/* Title at the top, reel at the foot (owner, 2026-10-28). Every reel
          frame once, so no photo repeats on screen. */}
      <div className="mt-auto">
        <ReelRow frames={reel} drift="0.14" lead />
      </div>
    </section>
    </>
  );
}

/* The album's cover, morphing into its hero on the album page. Both pages
   pick the picture with coverFor, so the two ends of the morph match. */
function Cover({ album, className }: { album: StoryAlbum; className: string }) {
  const cover = coverFor(album);
  if (!cover) return null;
  return (
    <ViewTransition name={`album-cover-${album.id}`} share="album-cover" default="none">
      <img src={cover.src} srcSet={phoneSrcSet(cover.src)} sizes="(min-width: 768px) 50vw, 100vw" alt={cover.alt || `${album.title}.`} width={1600} height={900} loading="lazy" decoding="async" className={className} />
    </ViewTransition>
  );
}

/* No photo count or venue on the cards (plan, 2026-10-28). */
function Meta({ album }: { album: StoryAlbum }) {
  return album.pending ? <p className="micro !text-current/80">Photos coming soon</p> : <span />;
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
        // A pending album has no page yet: same card, not a link.
        const Card = album.pending ? "div" : Link;
        return (
          <li key={album.id}>
            <Card
              href={album.pending ? undefined! : `/albums/${album.id}`}
              className={`photo-frame group relative flex aspect-[4/3] flex-col justify-end overflow-hidden sm:aspect-[4/5] ${pic ? "text-bone" : "bg-yellow text-ink"}`}
            >
              {cover ? (
                <Cover album={album} className="absolute inset-0 size-full object-cover object-[center_30%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              ) : pic ? (
                <img src={pic} srcSet={phoneSrcSet(pic)} sizes="(min-width: 768px) 33vw, 100vw" alt={album.photoAlt ?? ""} width={720} height={900} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
              ) : null}
              {pic ? <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent" /> : null}
              <div className="relative flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="font-display text-display-m leading-[0.88] font-bold uppercase [text-wrap:balance]">{album.short ?? album.title}</h3>
                {album.champion ? (
                  <p className="text-base leading-tight">
                    Champion <strong>{album.champion}</strong>
                  </p>
                ) : null}
                <div className={`flex items-center justify-between gap-4 border-t pt-3 ${pic ? "border-bone/30" : "border-ink/30"}`}>
                  <Meta album={album} />
                  {album.pending ? null : open}
                </div>
              </div>
            </Card>
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
          <Link href={`/albums/${album.id}`} className={`photo-frame group relative block overflow-hidden text-bone ${i < 2 ? "h-[clamp(320px,62svh,620px)]" : "h-[clamp(300px,48svh,480px)]"}`}>
            {album.photo ? <Cover album={album} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" /> : null}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
              <h3 className="max-w-[16ch] font-display text-display-m leading-[0.9] font-bold uppercase [text-wrap:balance]">{album.title}</h3>
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
  return (
    <section id={chapter.id} data-tone="bone" data-chapter={chapter.label} aria-labelledby={`${chapter.id}-heading`} className="canvas-night scroll-mt-4 pb-2 sm:pb-3">
      <header className={`frame flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pb-8 ${chapter.id === "origins" ? "pt-[clamp(1.5rem,5vh,3rem)]" : "pt-[clamp(4rem,14vh,8rem)]"}`}>
        <h2 id={`${chapter.id}-heading`} className="font-display text-display-l leading-[0.9] font-bold uppercase">
          {chapter.label}
        </h2>
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

  return (
    <PageShell hero={<Reel />}>
      {chapters.map((c) => (
        <ChapterBlock key={c.id} chapter={c} />
      ))}
      <NextPage current="/gallery" />
    </PageShell>
  );
}
