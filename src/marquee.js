/* The pause control on the site's one marquee, and (once step B's hero check
 * passes) the same control on the hero loop. WCAG 2.2.2, Level A: content that
 * moves on its own and runs past five seconds needs a mechanism to stop it.
 * prefers-reduced-motion is a mitigation for people who declared that
 * preference at the OS level; it is not the mechanism 2.2.2 asks for, and it
 * does nothing for someone who did not set it but still cannot read text that
 * is sliding away. base.css already stops every animation under that query,
 * so the button is hidden there rather than left to pause nothing.
 */

function wireMarqueePause() {
  const button = document.querySelector("[data-marquee-pause]");
  const track = document.querySelector(".marquee__track");
  if (!button || !track) return;

  let paused = false;

  button.addEventListener("click", () => {
    paused = !paused;
    track.style.animationPlayState = paused ? "paused" : "running";
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute(
      "aria-label",
      paused ? "Play the scrolling tagline" : "Pause the scrolling tagline",
    );
  });
}

wireMarqueePause();
