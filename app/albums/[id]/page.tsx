import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { albumIds, albumStory } from "@/lib/album-data";
import { albumFacts } from "@/lib/album-facts";
import { galleryChapters, nextAlbum } from "@/lib/gallery-story";
import { albumHero, highlights } from "@/lib/highlights";
import { AlbumView } from "@/components/motion/AlbumView";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { Roll } from "@/components/primitives/Roll";

const data = parseContent(raw);

export function generateStaticParams() {
  return albumIds(data).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: albumStory(data, id)?.title ?? "Album" };
}

/* An album is a full-screen hero, the picked highlights, then every frame, and
   it always hands on to the next album in the gallery's story order. */
export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapters = galleryChapters(raw, albumFacts(albumIds(data)));
  const chapter = chapters.find((c) => c.albums.some((a) => a.id === id));
  const album = chapter?.albums.find((a) => a.id === id);
  const picks = highlights[id] ?? [];
  const next = nextAlbum(chapters, id);

  if (!album || !chapter) {
    return (
      <PageShell>
        <section className="pb-12 sm:pb-20">
          <AlbumView id={id} />
        </section>
      </PageShell>
    );
  }

  const cover = albumHero(album);
  const lines = chapter.kind === "series" ? ["4x4 Series", album.title] : [album.title];
  const facts = [`${album.count.toLocaleString("en")} photos`, album.venue].filter(Boolean).join(" · ");

  return (
    <PageShell
      hero={
        <PageHero
          chapter={album.short ?? album.title}
          eyebrow={chapter.kind === "series" ? facts : `${chapter.label} · ${facts}`}
          lines={lines}
          photo={{ src: cover.src, alt: cover.alt, position: "center 35%" }}
          transition={cover.morph ? `album-cover-${album.id}` : undefined}
          labels={["Frontier / Gallery", album.champion ? `Champions: ${album.champion}` : "Colombo, Sri Lanka"]}
          actions={
            <>
              <a href={picks.length ? "#highlights-heading" : "#album-photos"} className={`${heroButton} bg-yellow text-ink`}>
                See the photos
              </a>
              <Link href="/gallery" className={`${heroButton} border border-bone/50`}>
                All albums
              </Link>
            </>
          }
        />
      }
    >
      <section data-tone="bone" data-chapter="Photos" className="canvas-night pb-[clamp(4rem,12vh,8rem)]">
        <AlbumView id={id} head={false} highlights={picks} />
      </section>
      {next ? (
        <section data-tone="bone" data-chapter="Next album" className="canvas-ink border-t border-bone/15">
          <Link href={`/albums/${next.id}`} data-preview={next.photo ?? next.inset ?? undefined} className="frame group flex flex-col gap-4 py-[clamp(4rem,14vh,9rem)]">
            <span className="micro text-yellow">Next album · {next.count.toLocaleString("en")} photos</span>
            <span className="flex items-end justify-between gap-6 font-display text-[clamp(3rem,11vw,10rem)] leading-[0.85] font-bold uppercase">
              <Roll>{next.short ?? next.title}</Roll>
              <span aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-3">
                →
              </span>
            </span>
          </Link>
        </section>
      ) : null}
    </PageShell>
  );
}
