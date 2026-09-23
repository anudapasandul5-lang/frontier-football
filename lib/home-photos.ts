/* Ticket 04's six owner-picked home photos (2026-09-23). They were selected
   from a padded 12-photo contact sheet and stored locally as WebP so the home
   page never depends on an expiring CDN. The two 720px poster picks are fresh
   frame grabs from their matching MP4s (036 at 14s, 037 at 40s). sourceUrl is
   provenance only; the UI renders the local src. */

export type HomePhoto = {
  id: string;
  src: string;
  sourceUrl: string;
  w: number;
  h: number;
  alt: string;
};

export const marqueePhotos: HomePhoto[] = [
  { id: "Da0NsMVKRUM", src: "/home/crowd-close.webp", sourceUrl: "https://www.instagram.com/p/Da0NsMVKRUM/", w: 720, h: 1280, alt: "Supporters watching a match together at Main Sports Bar" },
  { id: "Da0AXu9oPS4", src: "/home/crowd-wide.webp", sourceUrl: "https://www.instagram.com/p/Da0AXu9oPS4/", w: 1080, h: 721, alt: "A packed Frontier watch-along at Main Sports Bar" },
  { id: "DZFo5k_jih0", src: "/home/penalty.webp", sourceUrl: "https://www.instagram.com/p/DZFo5k_jih0/", w: 1080, h: 570, alt: "A penalty taker facing the goalkeeper at a Frontier night match" },
  { id: "DXwn3ZdqEW7", src: "/home/dribble.webp", sourceUrl: "https://www.instagram.com/p/DXwn3ZdqEW7/", w: 720, h: 1280, alt: "A player dribbling under the floodlights during the 4 x 4 Series" },
  { id: "DYUZaTjIVDg", src: "/home/celebration.webp", sourceUrl: "https://www.instagram.com/p/DYUZaTjIVDg/", w: 720, h: 1280, alt: "Players celebrating together after a 4 x 4 Series match" },
  { id: "DWJn1Kjiq6i", src: "/home/ball-detail.webp", sourceUrl: "https://www.instagram.com/p/DWJn1Kjiq6i/", w: 720, h: 406, alt: "A player's boot resting on a football under the floodlights" },
];

/* Act 3 opens on the wide watch-along frame, one of the same six rather than
   introducing a seventh unapproved image. */
export const statementPhoto = marqueePhotos[1];

/* Act 5's slider panels (owner, 2026-09-23: bigger photos, blended into the
   colour). Each panel has one full-bleed background frame and up to two framed
   ones, served from Drive at view time (thumbUrl, no-referrer). The 4 x 4
   frames are clean SZN 6 picks from T2; the Division 0 frames are from its
   album and were checked at 800px for burned-in marks (none). Turf Wars has
   only the one champions photo anywhere in the project, so it gets the
   background alone until its Drive folder is linked in content.js. */
export type DrivePhoto = { id: string; w: number; h: number; alt: string };

const szn6 = "A 4 x 4 Series SZN 6 match at Athlete 360";
const div0 = "The Division 0 PS5 tournament at Pixels N Pints";

export const competitionPhotos: Record<"4 x 4 Series" | "Division 0", { bg: DrivePhoto; frames: DrivePhoto[] }> = {
  "4 x 4 Series": {
    bg: { id: "1OJuaW4WQYaCBXMaQxaBo0Erw0o_v22FU", w: 400, h: 266, alt: szn6 },
    frames: [
      { id: "14oAKa0Rir7wqe6sbVRD2Li2RG-sTGV6U", w: 400, h: 291, alt: szn6 },
      { id: "1t0Xtc7eN3YWW_k7YDW3iUH9CNtGBCGF4", w: 400, h: 266, alt: szn6 },
    ],
  },
  "Division 0": {
    bg: { id: "1nXzq0DGAcDU8jSlpVDr86OFwk2FBZ2_h", w: 400, h: 266, alt: div0 },
    frames: [
      { id: "1tFbmDB8xFRn6V7PgGSi4_hRm_ordP63s", w: 400, h: 600, alt: "The Pixels N Pints gaming and sports bar entrance" },
      { id: "19_NtvhsJCWDnFmaKn3fa7eB2dlnUeLpF", w: 400, h: 266, alt: div0 },
    ],
  },
};
