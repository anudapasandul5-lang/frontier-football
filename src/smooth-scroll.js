import Lenis from "lenis";
// Lenis ships its own stylesheet and it is not optional: it sets
// `overscroll-behavior: contain` on every [data-lenis-prevent] container and
// the html.lenis / .lenis-smooth rules the runtime toggles. Without it the
// prevented containers rubber-band the page behind them.
import "lenis/dist/lenis.css";

/* Page-level smooth scrolling.
 *
 * Lenis interpolates the document's own scroll position rather than animating
 * a transformed wrapper, so nothing here changes layout, nothing is pinned,
 * and IntersectionObserver still fires normally - src/reveal.js keeps working
 * untouched, which is the whole reason this approach was picked over a
 * translate-the-page scroller.
 *
 * What it deliberately does NOT do:
 *
 * - It does not touch the champions rail or any other horizontal deck. Lenis
 *   runs in its default vertical orientation and leaves wheel deltaX alone,
 *   and with syncTouch off (the default) it does not intercept touchmove at
 *   all, so a thumb drag along the rail is native browser scrolling. Vertical
 *   wheel over the rail still scrolls the page, which is what a reader
 *   expects.
 *
 * - It does not run under prefers-reduced-motion. respectReducedMotion
 *   defaults to true and is left alone: HOUSE-RULES section 5 says reduced
 *   motion means still, not merely faster, and a smoothed scroll is exactly
 *   the kind of "the page keeps moving after I stopped" effect that setting
 *   exists to switch off.
 */

let instance = null;

export function initSmoothScroll() {
  // Idempotent. Both page entry points call this, and gallery.html loading a
  // second module that also imported it would otherwise leave two rAF loops
  // fighting over one scroll position.
  if (instance) return instance;

  instance = new Lenis({
    // Frame-rate independent smoothing, not a fixed duration. `duration`
    // gives every scroll the same length whatever its distance, which reads
    // as syrup on a long page; lerp keeps a flick short and a drag long.
    // 0.12 rather than the 0.1 default: this site's own motion tokens top out
    // at 400ms and a slower scroll than that felt like a different website.
    lerp: 0.12,
    // The nav's in-page links (#about, #champions, #gallery) get the same
    // easing as everything else. This replaces the usual
    // `html { scroll-behavior: smooth }`, which base.css deliberately never
    // set - two smooth-scroll mechanisms on one page fight each other.
    anchors: true,
  });

  function raf(time) {
    instance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return instance;
}
