import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Community - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Community", photo: "/home/crowd-close.webp" });
}
