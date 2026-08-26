import { describe, it, expect } from "vitest";
import { magnetOffset } from "./hero-motion.js";

describe("magnetOffset", () => {
  it("pulls toward the pointer inside the radius", () => {
    const { x, y } = magnetOffset(10, 0, 40, 16);
    expect(x).toBeGreaterThan(0);
    expect(y).toBe(0);
  });

  it("pulls hardest at the centre and eases to nothing at the edge", () => {
    const near = magnetOffset(4, 0, 40, 16).x;
    const far = magnetOffset(30, 0, 40, 16).x;
    expect(near).toBeGreaterThan(far);
  });

  it("goes fully inert once the pointer leaves the radius", () => {
    expect(magnetOffset(50, 0, 40, 16)).toEqual({ x: 0, y: 0 });
  });

  it("never exceeds the configured strength", () => {
    const { x, y } = magnetOffset(0.001, 0, 40, 16);
    expect(Math.hypot(x, y)).toBeLessThanOrEqual(16);
  });
});
