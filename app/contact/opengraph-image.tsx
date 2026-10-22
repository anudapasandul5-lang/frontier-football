import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "Contact - Frontier Football";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return ogCard({ title: "Contact", photo: "/heroes/contact.webp" });
}
