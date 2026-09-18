import type { CSSProperties } from "react";

/* A photo that arrives in horizontal bands. The <img> is always in the server
   HTML and visible without JS; the covers exist only in the motion pre-state
   (globals.css) and slide off when the one reveal observer marks the figure
   revealed. `cover` should match the canvas behind it. */
export function BandedReveal({
  src,
  alt,
  width,
  height,
  bands = 6,
  cover = "var(--color-ink)",
  className = "",
  imgClassName = "",
  noReferrer = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  bands?: number;
  cover?: string;
  className?: string;
  imgClassName?: string;
  noReferrer?: boolean;
}) {
  return (
    <figure data-reveal className={`banded ${className}`} style={{ "--bands": bands, "--cover": cover } as CSSProperties}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        referrerPolicy={noReferrer ? "no-referrer" : undefined}
        className={`block h-auto w-full object-cover ${imgClassName}`}
      />
      {Array.from({ length: bands }, (_, i) => (
        <span key={i} aria-hidden="true" className="banded__cover" style={{ "--i": i } as CSSProperties} />
      ))}
    </figure>
  );
}
