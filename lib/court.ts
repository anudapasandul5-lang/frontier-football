/* A futsal court as polylines, for the Numbers chapter's WebGL court
   (components/motion/CourtScene.tsx). FIFA Futsal Laws of the Game, Law 1:
   a 40 x 20 m pitch (inside the 38-42 x 20-25 m range), 3 m centre circle,
   penalty area of two 6 m quarter circles centred just outside each post and
   joined by a 3.16 m line, penalty mark at 6 m, second penalty mark at 10 m,
   goals 3 m wide and 2 m high.

   Axes: x runs along the length (-20..20), z across the width (-10..10), y is
   up. Units are metres. Pure data, so the drawing order can be tested. */

export type Point = [number, number, number];
export type CourtLine = { id: string; points: Point[]; accent?: boolean };

export const COURT = { length: 40, width: 20, centreRadius: 3, penaltyRadius: 6, goalWidth: 3, goalHeight: 2 };

const HALF_L = COURT.length / 2;
const HALF_W = COURT.width / 2;
const POST = COURT.goalWidth / 2 + 0.08; // outside of the post: posts are 8 cm thick

function arc(cx: number, cz: number, r: number, from: number, to: number, steps: number): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cx + r * Math.cos(a), 0, cz + r * Math.sin(a)];
  });
}

function spot(id: string, x: number): CourtLine {
  return { id, points: arc(x, 0, 0.14, 0, Math.PI * 2, 12) };
}

function end(s: 1 | -1): CourtLine[] {
  const gx = s * HALF_L;
  const r = COURT.penaltyRadius;
  // The D: a quarter circle round each post, from the goal line inwards to the
  // 6 m line, the two joined by the straight 3.16 m piece between them. Angle 0
  // points along +x, so "inwards" is PI at the east end and 0 at the west.
  const inward = s === 1 ? -Math.PI : 0;
  const box: Point[] = [
    ...arc(gx, -POST, r, -Math.PI / 2, inward, 18),
    ...arc(gx, POST, r, s === 1 ? Math.PI : 0, Math.PI / 2, 18),
  ];
  const h = COURT.goalHeight;
  const g = COURT.goalWidth / 2;
  const back = gx + s * 1;
  const tag = s === 1 ? "east" : "west";
  return [
    { id: `penalty-area-${tag}`, points: box },
    spot(`penalty-mark-${tag}`, gx - s * 6),
    spot(`second-mark-${tag}`, gx - s * 10),
    {
      id: `goal-${tag}`,
      accent: true,
      points: [
        [gx, 0, -g],
        [gx, h, -g],
        [gx, h, g],
        [gx, 0, g],
        [back, 0, g],
        [back, 0, -g],
        [gx, 0, -g],
      ],
    },
  ];
}

/* In drawing order: the boundary first, then the halfway line and centre, then
   each end. The CourtScene "pen" follows this order. */
export function courtLines(): CourtLine[] {
  return [
    {
      id: "boundary",
      points: [
        [-HALF_L, 0, -HALF_W],
        [HALF_L, 0, -HALF_W],
        [HALF_L, 0, HALF_W],
        [-HALF_L, 0, HALF_W],
        [-HALF_L, 0, -HALF_W],
      ],
    },
    { id: "halfway", accent: true, points: [[0, 0, -HALF_W], [0, 0, HALF_W]] },
    { id: "centre-circle", points: arc(0, 0, COURT.centreRadius, 0, Math.PI * 2, 48) },
    spot("centre-mark", 0),
    ...end(-1),
    ...end(1),
  ];
}

export function lineLength(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay, az] = points[i - 1];
    const [bx, by, bz] = points[i];
    total += Math.hypot(bx - ax, by - ay, bz - az);
  }
  return total;
}

/* How many segments of each line are drawn at `progress` (0..1), as if one
   pen walked every line in order at constant speed. A line is either not
   started, part drawn (whole segments only) or complete. */
export function drawnSegments(lines: CourtLine[], progress: number): number[] {
  const lengths = lines.map((l) => lineLength(l.points));
  const total = lengths.reduce((a, b) => a + b, 0);
  let budget = Math.max(0, Math.min(1, progress)) * total;
  return lines.map((line, i) => {
    const segments = line.points.length - 1;
    if (budget >= lengths[i]) {
      budget -= lengths[i];
      return segments;
    }
    const done = lengths[i] === 0 ? 0 : Math.floor((budget / lengths[i]) * segments);
    budget = 0;
    return done;
  });
}
