import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Events - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Events", photo: "/champions/szn-6.webp" });
}
