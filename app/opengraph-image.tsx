import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Small-sided football in Colombo - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Small-sided football in Colombo", photo: "/hero/still-desktop.webp" });
}
