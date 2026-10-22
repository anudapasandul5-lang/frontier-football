import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Who We Are - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Who We Are", photo: "/heroes/who.webp" });
}
