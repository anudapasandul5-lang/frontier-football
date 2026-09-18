import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Oswald } from "next/font/google";
import { MotionGate } from "@/components/motion/MotionGate";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});
const display = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });

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
    <html lang="en" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <body>
        {/* ponytail: og:image stays root-relative until the domain is recorded
            (content.js TODO). Next's metadata API would make it absolute
            against localhost:3000, which is worse than relative. React hoists
            this tag into <head>. */}
        <meta property="og:image" content="/og.jpg" />
        {children}
        <MotionGate />
      </body>
    </html>
  );
}
