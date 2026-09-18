import raw from "@/content.js";
import { parseContent, partners, stats } from "@/lib/content-data";
import { Marquee } from "@/components/primitives/Marquee";

const type =
  "pr-[0.7em] font-display text-[clamp(2.5rem,min(8vw,14svh),6rem)] leading-none font-bold whitespace-nowrap uppercase";

/* Act 8, United's micro-label over a text marquee, on bone. The label is the
   owner's count ("50+ Partners", content.js stats); the strip is only the
   names somebody recorded. Both are true and neither is derived from the other
   (CONTEXT.md). A name links itself the day its url is filled in. */
export function Partners() {
  const data = parseContent(raw);
  const names = partners(data);
  if (names.length === 0) return null;
  const count = stats(data).find((s) => s.label === "Partners");

  return (
    <section aria-labelledby="partners-heading" className="canvas-bone flex flex-col gap-8 py-[clamp(4rem,12vh,7rem)]">
      <div className="frame">
        <h2 id="partners-heading" className="micro">
          {count ? `${count.figure} ${count.label}` : "Partners"}
        </h2>
      </div>
      <Marquee label="Frontier partners" seconds={45}>
        {names.map((p) =>
          p.url ? (
            <a key={p.name} href={p.url} className={`${type} hover:underline`}>
              {p.name}
            </a>
          ) : (
            <span key={p.name} className={type}>
              {p.name}
            </span>
          ),
        )}
      </Marquee>
    </section>
  );
}
