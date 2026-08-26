// Pure motion math for the hero — no DOM, safe to unit test.
//
// Object parallax is NOT here: it runs as a native CSS scroll-driven
// animation (see hero.css), so there is no scroll handler and no
// scroll-progress maths to own.

/** Magnetic-hover pull toward the pointer, clamped to `strength` px and
 * zeroed once the pointer is outside `radius` of the element's center. */
export function magnetOffset(dx, dy, radius, strength) {
  const distance = Math.hypot(dx, dy);
  if (distance > radius) return { x: 0, y: 0 };
  const pull = (1 - distance / radius) * strength;
  const angle = Math.atan2(dy, dx);
  return { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
}
