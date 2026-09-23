import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Instrument_Serif } from "next/font/google";
import { MotionGate } from "@/components/motion/MotionGate";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  // The serif first appears below the hero. Do not let its two files compete
  // with the phone LCP image and the above-fold display/body faces.
  preload: false,
  variable: "--font-instrument-serif",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
// Headlines use the 75-width setting; optical size is never set. Omitting that
// unused axis materially reduces the preloaded variable font.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: { default: "Frontier Football", template: "%s - Frontier Football" },
  description: "Small-sided football and the culture around it, in Colombo.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    title: "Frontier Football",
    description: "Small-sided football and the culture around it, in Colombo.",
  },
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${bricolage.variable}`}>
      <body>
        {/* ponytail: og:image stays root-relative until the domain is recorded
            (content.js TODO). Next's metadata API would make it absolute
            against localhost:3000, which is worse than relative. React hoists
            this tag into <head>. */}
        <meta property="og:image" content="/og.jpg" />
        {/* First tab stop on every page: jumps past the nav (Web Interface
            Guidelines, T5 2026-09-22). Hidden until focused. */}
        <a
          href="#content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:bg-yellow focus-visible:px-4 focus-visible:py-3 focus-visible:font-display focus-visible:font-bold focus-visible:text-ink focus-visible:uppercase"
        >
          Skip to content
        </a>
        {children}
        <MotionGate />
      </body>
    </html>
  );
}
