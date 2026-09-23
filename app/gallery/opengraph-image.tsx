import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Gallery - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Gallery", photo: "/gallery/szn-5-hero.webp" });
}
