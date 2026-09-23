import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { albumIds, albumStory } from "@/lib/album-data";
import { AlbumView } from "@/components/motion/AlbumView";
import { PageShell } from "@/components/pages/PageShell";

const data = parseContent(raw);

export function generateStaticParams() {
  return albumIds(data).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: albumStory(data, id)?.title ?? "Album" };
}

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageShell>
      <section className="pb-12 sm:pb-20">
        <AlbumView id={id} />
      </section>
    </PageShell>
  );
}
