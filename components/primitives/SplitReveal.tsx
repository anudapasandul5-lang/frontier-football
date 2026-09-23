import { Fragment, type CSSProperties, type ElementType } from "react";

/* A headline whose words rise out of their own line, one after another, when
   the reveal observer reaches it. Every word is plain text in the server HTML;
   the lowered pre-state exists only under data-motion="on" (globals.css), so
   JS off or reduced motion shows the headline as set. `lines` keeps authored
   line breaks; each line is a block. */
export function SplitReveal({
  as: Tag = "h2",
  lines,
  id,
  className = "",
  lineClassName = "",
  step = 55,
}: {
  as?: ElementType;
  lines: string[];
  id?: string;
  className?: string;
  lineClassName?: string;
  step?: number;
}) {
  let i = 0;
  return (
    <Tag id={id} data-reveal className={`split ${className}`}>
      {lines.map((line, l) => (
        <span key={l} className={`block ${lineClassName}`}>
          {line.split(" ").map((word, w, words) => (
            <Fragment key={w}>
              <span className="split__w">
                <span className="split__i" style={{ "--d": `${i++ * step}ms` } as CSSProperties}>
                  {word}
                </span>
              </span>
              {w < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
