import { describe, expect, it } from "vitest";
import { COURT, courtLines, drawnSegments, lineLength } from "./court";

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 2);

describe("court lines", () => {
  const lines = courtLines();
  const byId = (id: string) => lines.find((l) => l.id === id)!;

  it("keeps every marking on or inside the boundary (goals may sit 1 m behind it)", () => {
    for (const line of lines)
      for (const [x, y, z] of line.points) {
        expect(Math.abs(x)).toBeLessThanOrEqual(COURT.length / 2 + 1 + 1e-9);
        expect(Math.abs(z)).toBeLessThanOrEqual(COURT.width / 2 + 1e-9);
        expect(y).toBeGreaterThanOrEqual(0);
      }
  });

  it("closes the boundary and measures it as the perimeter", () => {
    const b = byId("boundary").points;
    expect(b[0]).toEqual(b.at(-1));
    close(lineLength(b), 2 * (COURT.length + COURT.width));
  });

  it("draws each penalty area from goal line to goal line through the 6 m line", () => {
    for (const [id, gx] of [["penalty-area-east", 20], ["penalty-area-west", -20]] as const) {
      const p = byId(id).points;
      close(p[0][0], gx);
      close(p[0][2], -7.58);
      close(p.at(-1)![0], gx);
      close(p.at(-1)![2], 7.58);
      // Its closest approach to the centre is the 6 m line.
      const inner = Math.min(...p.map(([x]) => Math.abs(x)));
      close(inner, 14);
    }
  });

  it("puts the penalty marks at 6 m and 10 m from each goal line", () => {
    const centre = (id: string) => {
      const p = byId(id).points;
      const xs = p.map(([x]) => x);
      return (Math.min(...xs) + Math.max(...xs)) / 2;
    };
    close(Math.abs(centre("penalty-mark-east")), 14);
    close(Math.abs(centre("second-mark-west")), 10);
  });
});

describe("drawnSegments", () => {
  const lines = courtLines();
  const full = lines.map((l) => l.points.length - 1);

  it("draws nothing at 0 and everything at 1, clamping outside that", () => {
    expect(drawnSegments(lines, 0)).toEqual(lines.map(() => 0));
    expect(drawnSegments(lines, 1)).toEqual(full);
    expect(drawnSegments(lines, 2)).toEqual(full);
    expect(drawnSegments(lines, -1)).toEqual(lines.map(() => 0));
  });

  it("walks the lines in order: nothing starts before the one ahead of it is complete", () => {
    for (const p of [0.1, 0.35, 0.6, 0.9]) {
      const drawn = drawnSegments(lines, p);
      const firstIncomplete = drawn.findIndex((n, i) => n < full[i]);
      drawn.slice(firstIncomplete + 1).forEach((n) => expect(n).toBe(0));
    }
  });

  it("never goes backwards as progress grows", () => {
    let last = drawnSegments(lines, 0);
    for (let p = 0.05; p <= 1; p += 0.05) {
      const now = drawnSegments(lines, p);
      now.forEach((n, i) => expect(n).toBeGreaterThanOrEqual(last[i]));
      last = now;
    }
  });
});
