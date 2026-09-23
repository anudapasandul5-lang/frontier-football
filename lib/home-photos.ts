/* The home page's photographs, picked in T2 (2026-09-18) from contact sheets
   of 132 frames sampled across all eleven synced albums, then re-checked
   padded at 800px for burned-in marks (HOUSE-RULES section 6).

   Every frame here is CLEAN: no crest, no 4x4 SERIES / HYPE / MAIN badge.
   The SZN 3 and SZN 4 frames were rejected on that re-check: their badges
   reach ~20% up the frame, and the 24% bottom crop that clears them also
   cuts the ball out of every shooting frame in the set.

   Pixels come from Drive at view time (thumbUrl, no-referrer). w and h are
   the frame's own proportions from public/albums/<album>.json. Alt text says
   which album a frame is from, which is known, and nothing about who is in
   it, which is not. */

export type HomePhoto = { id: string; album: string; w: number; h: number; alt: string };

const szn6 = "A 4 x 4 Series SZN 6 match at Athlete 360";

export const marqueePhotos: HomePhoto[] = [
  { id: "1OJuaW4WQYaCBXMaQxaBo0Erw0o_v22FU", album: "szn-6", w: 400, h: 266, alt: szn6 },
  { id: "1xnj8TOD9POZuTafL9Lz_hfwSbVV2eQQd", album: "wa-final-esp-arg", w: 400, h: 267, alt: "The Final: Spain vs Argentina watch-along" },
  { id: "14oAKa0Rir7wqe6sbVRD2Li2RG-sTGV6U", album: "szn-6", w: 400, h: 291, alt: szn6 },
  { id: "16FZRK_xDt_D4LYENOsyd8Rlm0AR2GeJF", album: "wa-norway-england", w: 400, h: 266, alt: "The Norway vs England watch-along" },
  { id: "1t0Xtc7eN3YWW_k7YDW3iUH9CNtGBCGF4", album: "szn-6", w: 400, h: 266, alt: szn6 },
  { id: "19Q2nD1MExaqLRX2VQVxRDqJsSL-lxImK", album: "wa-final-esp-arg", w: 400, h: 267, alt: "The Final: Spain vs Argentina watch-along" },
  { id: "1WiQeDAgWDO2EUFTninn5utDkw_jlWaGO", album: "szn-6", w: 400, h: 309, alt: szn6 },
  { id: "1M4R7aFktJ7HET9uVbbeRH1gPHXWy7tje", album: "wa-norway-england", w: 400, h: 266, alt: "The Norway vs England watch-along" },
  { id: "1HBvbjQitxALSxMpRR8-1G72A2VWA2zek", album: "szn-6", w: 400, h: 368, alt: szn6 },
];

/* Act 5's slider panels (owner, 2026-09-23: bigger photos, blended into the
   colour). Each panel has one full-bleed background frame and up to two framed
   ones. Division 0 frames are from its album and were checked at 800px for
   burned-in marks (none). 4 x 4 frames reuse the clean SZN 6 set above. Turf
   Wars has only the one champions photo anywhere in the project, so it gets
   the background alone until its Drive folder is linked in content.js. */
const div0 = "The Division 0 PS5 tournament at Pixels N Pints";

export const competitionPhotos: Record<"4 x 4 Series" | "Division 0", { bg: HomePhoto; frames: HomePhoto[] }> = {
  "4 x 4 Series": {
    bg: marqueePhotos[0],
    frames: [marqueePhotos[2], marqueePhotos[4]],
  },
  "Division 0": {
    bg: { id: "1nXzq0DGAcDU8jSlpVDr86OFwk2FBZ2_h", album: "division-0", w: 400, h: 266, alt: div0 },
    frames: [
      { id: "1tFbmDB8xFRn6V7PgGSi4_hRm_ordP63s", album: "division-0", w: 400, h: 600, alt: "The Pixels N Pints gaming and sports bar entrance" },
      { id: "19_NtvhsJCWDnFmaKn3fa7eB2dlnUeLpF", album: "division-0", w: 400, h: 266, alt: div0 },
    ],
  },
};

/* Act 3: a crowd with their hands on their heads, the frame that says what
   a watch-along is without a caption. Dark enough to carry bone serif. */
export const statementPhoto: HomePhoto = {
  id: "1GvRigubCeCqlGoSdFA68t59KK4QMWu_A",
  album: "wa-semi-eng-arg",
  w: 400,
  h: 266,
  alt: "The Semi-final: England vs Argentina watch-along",
};
