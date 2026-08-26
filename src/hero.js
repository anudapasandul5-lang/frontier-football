import { magnetOffset } from "./hero-motion.js";
import { wireReveal } from "./reveal.js";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Video is opt-in, never automatic: it loads only when motion is allowed
   AND the viewport is wide enough to be worth ~475KB. A phone on Sri
   Lankan mobile data keeps the poster still and downloads no video, which
   is the constraint the build prompt sets. */
function wireVideo() {
  if (reduceMotion || !matchMedia("(min-width: 600px)").matches) return;

  for (const video of document.querySelectorAll("video[data-src]")) {
    video.src = video.dataset.src;
    // muted + playsinline are on the element already, but autoplay can
    // still be refused; a rejected promise must not surface as an
    // unhandled rejection. The poster simply stays put.
    video.play().catch(() => {});
  }
}

function wireMagneticCta(root) {
  const cta = root.querySelector(".nav__cta");
  // Coarse pointers have no hover to be magnetic about.
  if (!cta || reduceMotion || !matchMedia("(pointer: fine)").matches) return;

  const radius = 110;
  const strength = 16;

  cta.addEventListener("pointermove", (event) => {
    const rect = cta.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const { x, y } = magnetOffset(dx, dy, radius, strength);
    cta.style.setProperty("--cta-magnet-x", `${x}px`);
    cta.style.setProperty("--cta-magnet-y", `${y}px`);
  });

  cta.addEventListener("pointerleave", () => {
    cta.style.removeProperty("--cta-magnet-x");
    cta.style.removeProperty("--cta-magnet-y");
  });
}

export function initHero() {
  const stage = document.querySelector(".hero__stage");
  // The stage's children directly: the hero's markup carries no data-reveal
  // attributes and this ticket may not add any.
  if (stage) wireReveal(stage.children);
  wireVideo();
  wireMagneticCta(document);
}

initHero();
