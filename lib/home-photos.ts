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
    "id": "gallery-p06",
    "src": "/home/moment-strike.webp",
    "sourceUrl": "public/gallery/p06.webp",
    "w": 1600,
    "h": 1066,
    "alt": "A striker in a number 30 shirt lines up the ball as defenders close in at 4 x 4 Series"
  },
  {
    "id": "DSC_9019",
    "src": "/home/moment-night.webp",
    "sourceUrl": "https://drive.google.com/file/d/1On76QkXr8Ve6GfNIC8BHDu24VW3bK-Hq/view",
    "w": 1600,
    "h": 1067,
    "alt": "A defender slides in to block a shot under the floodlights at SZN 6"
  },
  {
    "id": "DSC_8676",
    "src": "/home/moment-shot.webp",
    "sourceUrl": "https://drive.google.com/file/d/1AAiZwD2c11mjogAyPLY6FVS9BWmwcUD9/view",
    "w": 1600,
    "h": 1067,
    "alt": "A striker swings through the ball as defenders chase at dusk at 4 x 4 Series SZN 6"
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
  "id": "midnight-futsal-under-floodlights",
  "src": "/home/moment-crowd.webp",
  "sourceUrl": "C:/Users/anuda/Desktop/Photos/Midnight Futsal Under Floodlights.png",
  "w": 1536,
  "h": 1024,
  "alt": "A player in a blue number 10 shirt faces the goal on a futsal pitch under floodlights"
};
export const competitionPhotos = {
  "4 x 4 Series": {
    "id": "DSC_0546",
    "src": "/pages/competition-4x4.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/Photos/DSC_0546.jpg",
    "w": 1600,
    "h": 1200,
    "alt": "Players in green bibs and blue shirts contest the ball near goal at 4 x 4 Series SZN 3"
  },
  "Division 0": {
    "id": "DSC_6078",
    "src": "/pages/competition-division-0.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/Photos/DSC_6078.jpg",
    "w": 1600,
    "h": 1200,
    "alt": "A player grips a glowing controller in the dark at Division 0"
  }
};
