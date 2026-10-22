/* Photo refresh, 2026-10-20: cropped exports from the owner's photo folder, none repeated.
   sourceUrl records provenance. The home hero is reserved for video. */
export type HomePhoto = { id: string; src: string; sourceUrl: string; w: number; h: number; alt: string };
/* The big frames that pan across the Moment act. */
export const marqueePhotos: HomePhoto[] = [
  {
    "id": "DSC_9274",
    "src": "/home/moment-celebration.webp",
    "sourceUrl": "https://drive.google.com/file/d/18Vgu3L3WfNXMgatH-uKyeyKUjSSEBjOG/view",
    "w": 1600,
    "h": 1066,
    "alt": "The SZN 6 champions lift their trophies under the tent after the final"
  },
  {
    "id": "DSC_8533",
    "src": "/home/moment-strike.webp",
    "sourceUrl": "https://drive.google.com/file/d/1ra_xs5JnizPY8x1Plu639R2SkszhGQ_O/view",
    "w": 1600,
    "h": 1066,
    "alt": "A player winds up a strike in the evening sun at 4 x 4 Series SZN 6"
  },
  {
    "id": "e6ccd632929a10a0001976a1436a927d",
    "src": "/home/moment-trophy.webp",
    "sourceUrl": "",
    "w": 1280,
    "h": 853,
    "alt": "Winners line up with their medals and the trophy after 4 x 4 Series SZN 5; photograph by ThePapare"
  },
  {
    "id": "DSC_9019",
    "src": "/home/moment-night.webp",
    "sourceUrl": "https://drive.google.com/file/d/1On76QkXr8Ve6GfNIC8BHDu24VW3bK-Hq/view",
    "w": 1600,
    "h": 1067,
    "alt": "A defender slides in to block a shot under the floodlights at SZN 6"
  }
];
/* The small tilted frames that drift round the headline: football and celebrations only. */
export const markerPhotos: HomePhoto[] = [
  {
    "id": "DSC_8308",
    "src": "/home/marker-1.webp",
    "sourceUrl": "https://drive.google.com/file/d/11TJJVuQtbBInXBTitUIVDFywbsDJt7F6/view",
    "w": 600,
    "h": 400,
    "alt": "Players chase the ball past the net at 4 x 4 Series SZN 6"
  },
  {
    "id": "DSC_8461",
    "src": "/home/marker-2.webp",
    "sourceUrl": "https://drive.google.com/file/d/16whroZQHoGOD355upfRtTvLlyu7ADohN/view",
    "w": 600,
    "h": 900,
    "alt": "A goalkeeper in pink and a referee watch the play at 4 x 4 Series SZN 6"
  },
  {
    "id": "DSC_8128",
    "src": "/home/marker-3.webp",
    "sourceUrl": "https://drive.google.com/file/d/1i5AjB4Tc2f99OM26CoKrzfttRlZdck9u/view",
    "w": 600,
    "h": 796,
    "alt": "A player strikes the ball while a referee looks on at 4 x 4 Series SZN 6"
  },
  {
    "id": "DSC_9142",
    "src": "/home/marker-4.webp",
    "sourceUrl": "https://drive.google.com/file/d/12lXuRUCp0J-_ulAa-dlxIFwRR7lwXTFm/view",
    "w": 600,
    "h": 512,
    "alt": "A player receives an award at the SZN 6 presentation"
  },
  {
    "id": "DSC_9054",
    "src": "/home/marker-5.webp",
    "sourceUrl": "https://drive.google.com/file/d/1Ex_YPJQrVWeV9o-HIyLtqDzoNWXPeEEl/view",
    "w": 600,
    "h": 400,
    "alt": "Players gather in a circle on the pitch at night at SZN 6"
  },
  {
    "id": "DSC_8906",
    "src": "/home/marker-6.webp",
    "sourceUrl": "https://drive.google.com/file/d/1YMC-qdEG6eIOItt4mEm0JxazURouxsmR/view",
    "w": 600,
    "h": 632,
    "alt": "Players in black huddle on the pitch at 4 x 4 Series SZN 6"
  }
];
export const statementPhoto: HomePhoto = {
  "id": "DSC_8480",
  "src": "/home/moment-crowd.webp",
  "sourceUrl": "https://drive.google.com/file/d/1HJWVCiVDlVxTtqTD09iUTvQ2wwbEbGMm/view",
  "w": 1600,
  "h": 1067,
  "alt": "A goalkeeper slides in as a player in orange strikes at 4 x 4 Series SZN 6"
};
export const competitionPhotos = {
  "4 x 4 Series": {
    "id": "DSC_8084",
    "src": "/pages/competition-4x4.webp",
    "sourceUrl": "https://drive.google.com/file/d/1Wd8_rpH8tNf5elD9px8i1hoS4zgX4TlX/view",
    "w": 1600,
    "h": 1200,
    "alt": "A goalkeeper in an orange bib plays the ball out at 4 x 4 Series SZN 6"
  },
  "Division 0": {
    "id": "DSC_6047",
    "src": "/pages/competition-division-0.webp",
    "sourceUrl": "https://drive.google.com/file/d/17kS3j0HWH66mpqER6xsms_-ilFEJ1NVL/view",
    "w": 1600,
    "h": 1200,
    "alt": "Players and friends gather round a Division 0 console match"
  }
};
