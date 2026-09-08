import { wireReveal } from "./reveal.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Video is opt-in, never automatic: it loads only when motion is allowed.
   No viewport gate - plays on phones too, by request. */
function wireVideo() {
  if (reduceMotion) return;

  for (const video of document.querySelectorAll("video[data-src]")) {
    video.src = video.dataset.src;
    // muted + playsinline are on the element already, but autoplay can
    // still be refused; a rejected promise must not surface as an
    // unhandled rejection. The poster simply stays put.
    video.play().catch(() => {});
  }

}

/* The home nav floats transparent over the hero and turns solid once the hero
   is behind it. IntersectionObserver, not a scroll listener - HOUSE-RULES
   section 5 rules out `window.addEventListener("scroll")` outright, and a
   handler reading offsetHeight on every scroll frame forces layout on the
   scroll path besides. Shrinking the root by the nav's height means the hero
   stops "intersecting" the instant its bottom edge rises past the nav - the
   exact point there is no more hero behind the bar to show through it. */
function wireNavOverlay() {
  const nav = document.querySelector(".nav--overlay");
  const hero = document.querySelector(".hero");
  if (!nav || !hero) return;

  // Matches .hero's own padding-top (hero.css), which exists to clear this
  // same nav - keep the two literals in sync.
  const NAV_CLEARANCE = 88;

  // A synchronous first read so a mid-page refresh doesn't flash a transparent
  // bar for the one frame before the observer's first callback.
  nav.classList.toggle("is-scrolled", hero.getBoundingClientRect().bottom <= NAV_CLEARANCE);

  new IntersectionObserver(
    ([entry]) => nav.classList.toggle("is-scrolled", !entry.isIntersecting),
    { rootMargin: `-${NAV_CLEARANCE}px 0px 0px 0px` },
  ).observe(hero);
}

export function initHero() {
  const stage = document.querySelector(".hero__stage");
  // The stage's children directly: the hero's markup carries no data-reveal
  // attributes and this ticket may not add any.
  if (stage) wireReveal(stage.children);
  wireVideo();
  wireNavOverlay();
}

initHero();
