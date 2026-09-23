import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { albumIds, albumStory } from "@/lib/album-data";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

const data = parseContent(raw);

export const alt = "A Frontier Football album";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return albumIds(data).map((id) => ({ id }));
}

// Every album has a cover photo in content.js today; the hero still covers one that does not.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const story = albumStory(data, (await params).id);
  return ogCard({ title: story?.title ?? "Gallery", photo: story?.photo ?? "/hero/still-desktop.webp" });
}
