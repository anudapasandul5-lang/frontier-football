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
