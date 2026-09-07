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

export function initHero() {
  const stage = document.querySelector(".hero__stage");
  // The stage's children directly: the hero's markup carries no data-reveal
  // attributes and this ticket may not add any.
  if (stage) wireReveal(stage.children);
  wireVideo();
}

initHero();
