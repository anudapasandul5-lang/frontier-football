/* The one reveal-on-scroll observer. hero.js, story.js and champions.js all
 * call this; there were three copies of it before T5 and they had already
 * drifted apart.
 *
 * IntersectionObserver only, no scroll listener, and transform plus opacity
 * only, per the motion budget in docs/HOUSE-RULES.md section 5.
 */

export function shouldReveal(entry: Pick<IntersectionObserverEntry, "isIntersecting" | "boundingClientRect">) {
  // Reveal when intersecting, but ALSO when the element sits entirely above
  // the viewport. A jump past it (the #about anchor, browser scroll
  // restoration on reload, a find-in-page hit) means it never intersects, and
  // without this it would stay at opacity 0 forever. An invisible section on a
  // cream page does not look broken, it looks unbuilt.
  return entry.isIntersecting || entry.boundingClientRect.bottom <= 0;
}

/* Takes an iterable of elements rather than a root, so the hero can pass its
   stage's children while the other sections pass their [data-reveal] nodes.
   The hero's markup carries no data-reveal attributes and T5 may not add any. */
export function wireReveal(elements: Iterable<Element>) {
  // Read the query here, not at module scope: a top-level matchMedia call makes
  // this module unimportable in the node test environment. Reduced motion means
  // genuinely static, not merely faster, so the pre-state is never applied and
  // there is nothing to animate back from.
  if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!shouldReveal(entry)) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    // threshold 0 rather than a fraction: the green panel is taller than a
    // short viewport, and a threshold like 0.2 can fail to fire at all on an
    // element bigger than the root.
    //
    // The enormous TOP margin is the load-bearing part. An observer only calls
    // back when intersection CHANGES, so an element the page jumps clean past
    // goes from not-intersecting (below) to not-intersecting (above) without
    // ever firing, and shouldReveal never gets to run. Pressing End does this.
    // Extending the root upward past any real document height means "above the
    // viewport" counts as inside the root, so the jump is a change and the
    // callback fires. Net effect: reveal once the element's top has reached the
    // viewport bottom, and stay revealed.
    //
    // The bottom stays at 0. A negative inset there ("-15%" until this was
    // found) permanently hides anything in that band once the page is scrolled
    // as far as it goes, because no further scroll can push it into the shrunk
    // root. It went unnoticed while the last section was short enough; the
    // eight-card grid stranded six elements. Reveal-on-scroll may be less
    // fancy. It may not leave content that can never appear.
    { threshold: 0, rootMargin: "100000px 0px 0px 0px" },
  );

  // Hide and observe in the SAME step, with the observer already built. The
  // two-loop version (hide everything, then observe everything) leaves a window
  // where a throw in between strands a whole section at opacity 0 with nothing
  // watching it.
  for (const el of elements) {
    el.classList.add("is-pre");
    observer.observe(el);
  }
  return () => observer.disconnect();
}
