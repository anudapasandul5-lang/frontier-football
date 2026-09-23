import raw from "@/content.js";
import { parseContent, partners, stats } from "@/lib/content-data";
import { Marquee } from "@/components/primitives/Marquee";

// Logo and text-fallback share one height band so the strip keeps one rhythm.
const item = "mr-[clamp(2rem,5vw,4.5rem)] flex h-[clamp(2.75rem,5vw,4.5rem)] shrink-0 items-center";
const type = "font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-none font-bold whitespace-nowrap uppercase";

/* Act 8, United's micro-label over a text marquee, on bone. The label is the
   owner's count ("50+ Partners", content.js stats); the strip is only the
   names somebody recorded. Both are true and neither is derived from the other
   (CONTEXT.md). A name links itself the day its url is filled in.

   2026-09-23, owner: smaller section, and the brand logos from the v1 site
   back in (public/partners/, traced from each brand's own marks, content.js).
   A partner with no logo file stays as its name, set small to sit with them. */
export function Partners() {
  const data = parseContent(raw);
  const names = partners(data);
  if (names.length === 0) return null;
  const count = stats(data).find((s) => s.label === "Partners");

  return (
    <section aria-labelledby="partners-heading" className="canvas-bone flex flex-col gap-5 py-[clamp(2.5rem,7vh,4.5rem)]">
      <div className="frame">
        <h2 id="partners-heading" className="micro">
          {count ? `${count.figure} ${count.label}` : "Partners"}
        </h2>
      </div>
      <Marquee label="Frontier partners" seconds={45}>
        {names.map((p) => {
          const mark = p.logo ? (
            <img src={p.logo} alt={p.name ?? ""} loading="lazy" decoding="async" className="h-full w-auto max-w-[clamp(8rem,13vw,11rem)] object-contain" />
          ) : (
            <span className={type}>{p.name}</span>
          );
          return p.url ? (
            <a key={p.name} href={p.url} className={`${item} transition-opacity duration-150 hover:opacity-70`}>
              {mark}
            </a>
          ) : (
            <span key={p.name} className={item}>
              {mark}
            </span>
          );
        })}
      </Marquee>
    </section>
  );
}
