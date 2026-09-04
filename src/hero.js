import { magnetOffset } from "./hero-motion.js";
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

  // The pause control shows only in this branch, the one that actually
  // attached a video: a phone or a reduced-motion visitor already has the
  // poster and never runs wireVideo at all, so a button here would announce
  // a control over nothing. Kept in hero.js rather than src/marquee.js
  // because this function is the one place that already knows whether a
  // video was attached; re-deriving that from outside would just repeat the
  // two checks above.
  wireHeroPause();
}

/* WCAG 2.2.2 companion to src/marquee.js's control on the tagline strip:
   content that starts moving on its own and runs past five seconds needs a
   way to stop it. aria-pressed states the button's own condition rather than
   naming a destination, matching the marquee control's pattern. */
function wireHeroPause() {
  const button = document.querySelector("[data-hero-pause]");
  const video = document.querySelector(".hero__bg");
  if (!button || !video) return;

  button.hidden = false;
  button.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
    // .play() and .pause() both flip video.paused synchronously (the promise
    // .play() returns only covers whether playback actually started), so
    // reading it fresh here reflects the state the click just produced.
    // Deriving the label from the pre-click boolean instead is exactly how
    // this went backwards the first time it was written.
    const isPaused = video.paused;
    button.setAttribute("aria-pressed", String(isPaused));
    button.setAttribute(
      "aria-label",
      isPaused ? "Play the background video" : "Pause the background video",
    );
  });
}

function wireMagneticCta(root) {
  // The showpiece belongs on the showpiece button, not the nav's now-secondary
  // one. It was written against .nav__cta originally, but .btn:hover
  // (specificity 0,2,0) always outranked .nav__cta's own transform rule
  // (0,1,0) - the pointer has to be over the button for pointermove to fire
  // at all, so :hover was true for the effect's entire life and the lift
  // always won. The magnet has never actually rendered on this site. Moving
  // it here alone does not fix that; hero.css gives .hero__cta a :hover rule
  // of its own so the two states tie on specificity and hero.css's load
  // order settles it.
  const cta = root.querySelector(".hero__cta");
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
