import type { Metadata } from "next";
import { PageShell } from "@/components/pages/PageShell";
import { phoneSrcSet } from "@/lib/phone-image";

export const metadata: Metadata = { title: "Offside", robots: { index: false } };

const button = "flex min-h-12 items-center px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]";

/* The branded 404 (plan L6b): night mode, a real photo, a way home and a way
   to the gallery. The static export writes it as 404.html, which the host
   serves with a 404 status for any unknown URL. */
export default function NotFound() {
  return (
    <PageShell night>
      <section className="grid md:min-h-[min(80svh,820px)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        {/* The text column lines up with the nav and footer frame (1170px, centred) rather than the column edge. */}
        <div className="frame flex flex-col justify-end py-12 md:py-20 min-[1170px]:pl-[calc((100vw-1170px)/2+32px)]">
          <p className="micro">404 / Page not found</p>
          <h1 className="mt-5 font-display text-[clamp(4rem,18vw,12rem)] leading-[0.84] font-bold uppercase">
            Offside<span className="text-yellow">.</span>
          </h1>
          <p className="mt-6 max-w-[34ch] text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-snug">
            That page was never in play. It may have moved, or the link is wrong.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/" className={`${button} bg-yellow text-ink`}>
              Back to home
            </a>
            <a href="/gallery" className={`${button} border border-bone`}>
              See the gallery
            </a>
          </div>
        </div>
        <figure className="relative h-[50svh] min-h-[320px] overflow-hidden md:h-auto">
          <img
            src="/home/moment-strike.webp"
            srcSet={phoneSrcSet("/home/moment-strike.webp")}
            sizes="100vw"
            alt="A player lining up a shot under the floodlights in the 4 x 4 Series"
            width={1200}
            height={1000}
            className="absolute inset-0 size-full object-cover object-[65%_center]"
          />
        </figure>
      </section>
    </PageShell>
  );
}
