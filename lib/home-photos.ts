/* Act 3 photos (2026-09-23): full-resolution Drive frames picked from every
   Frontier album via contact sheets, replacing the 720px Instagram grabs.
   Match frames had corner watermarks cropped off (duel and night bottom 13-14%,
   strike right 20%); the watch-along frames are clean. Stored locally as WebP
   so the home page never depends on Drive. sourceUrl is provenance only. */

export type HomePhoto = {
  id: string;
  src: string;
  sourceUrl: string;
  w: number;
  h: number;
  alt: string;
};

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const marqueePhotos: HomePhoto[] = [
  { id: "1WJKqzgN9jrros7u2New0l4kQRbdYDRWc", src: "/home/moment-celebration.webp", sourceUrl: drive("1WJKqzgN9jrros7u2New0l4kQRbdYDRWc"), w: 1200, h: 801, alt: "A supporter throwing his arms up at a goal during the England v Argentina watch-along" },
  { id: "1hVYfeEUIT5foKLM1LKVHadlTBqwv7MRD", src: "/home/moment-duel.webp", sourceUrl: drive("1hVYfeEUIT5foKLM1LKVHadlTBqwv7MRD"), w: 1200, h: 688, alt: "Three players fighting for the ball against the fence in 4 x 4 Series SZN 1" },
  { id: "1yeYXU5iSNHGUDgbnb9Aj8WsK3VoKfLxb", src: "/home/moment-strike.webp", sourceUrl: drive("1yeYXU5iSNHGUDgbnb9Aj8WsK3VoKfLxb"), w: 1200, h: 1000, alt: "A player lining up a shot under the floodlights in 4 x 4 Series SZN 2" },
  { id: "1umKmobksG9TJxie_2TCCqYF80aE3VD7m", src: "/home/moment-hands.webp", sourceUrl: drive("1umKmobksG9TJxie_2TCCqYF80aE3VD7m"), w: 1200, h: 801, alt: "Hands in the air in front of the big screen at a Frontier watch-along" },
  { id: "1WISocyZjLY3_pBxk4WTSaAWa_HmtMMA6", src: "/home/moment-flags.webp", sourceUrl: drive("1WISocyZjLY3_pBxk4WTSaAWa_HmtMMA6"), w: 1200, h: 801, alt: "Argentina supporters with flags at the World Cup final watch-along" },
  { id: "1KuqT9RJxCMau953YOOVBKd4Ug2XiKGwz", src: "/home/moment-night.webp", sourceUrl: drive("1KuqT9RJxCMau953YOOVBKd4Ug2XiKGwz"), w: 1200, h: 696, alt: "A player taking on a defender under the lights in 4 x 4 Series SZN 1" },
];

/* Act 3 opens on the packed Main Sports Bar crowd. */
export const statementPhoto: HomePhoto = { id: "1lzIdThKRPby0xAHllSw-4Jz7Rbb_nw3H", src: "/home/moment-crowd.webp", sourceUrl: drive("1lzIdThKRPby0xAHllSw-4Jz7Rbb_nw3H"), w: 2000, h: 1335, alt: "A packed Frontier watch-along at Main Sports Bar" };

/* Act 5's competition cards pick one landscape photo each from these, served from Drive
   at view time (thumbUrl, no-referrer). The first frame of each is used. Both sets are
   frames from the Stage 2 picks albums (picks-szn-6 #7 and #3, picks-division-0 #2
   and #3; 2026-10-10), none with burned-in marks. Full-bleed backgrounds were dropped 2026-09-24 (too soft). */
export type DrivePhoto = { id: string; w: number; h: number; alt: string };

const szn6 = "A 4 x 4 Series SZN 6 match at Athlete 360";
const div0 = "The Division 0 PS5 tournament at Pixels N Pints";

export const competitionPhotos: Record<"4 x 4 Series" | "Division 0", { frames: DrivePhoto[] }> = {
  "4 x 4 Series": {
    frames: [
      { id: "1vyz8MJf1X4MRf-M3kCVxhVMxhy0ArPzn", w: 400, h: 311, alt: "Players lift trophies and medals under a green tent at 4 x 4 Series SZN 6" },
      { id: "1EAcGlHAlGxo5QXKvhOJbik-tUB96u62U", w: 400, h: 357, alt: szn6 },
    ],
  },
  "Division 0": {
    frames: [
      { id: "1-kJAls0gofEaVr3EieTM3otoHEFW0GMl", w: 400, h: 266, alt: div0 },
      { id: "1gMmy2N8vMdtH2m3nqgNJWsYGPtb5s6dl", w: 400, h: 266, alt: div0 },
    ],
  },
};
