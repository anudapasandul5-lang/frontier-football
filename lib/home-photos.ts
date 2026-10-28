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
    "id": "dusk-futsal-match",
    "src": "/home/moment-dusk.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/Photos/Dusk Futsal Match on Urban Rooftop.png",
    "w": 1600,
    "h": 727,
    "alt": "Five players chase a boy in a blue shirt dribbling the ball on a futsal pitch at dusk"
  },

  {
    "id": "ashan-kick",
    "src": "/home/moment-kick.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/frontier web/d05d95133834959444de4fa14c36e37f.jpg",
    "w": 1280,
    "h": 853,
    "alt": "A player in a grey shirt winds up to strike the ball while three players in red and white shirts watch"
  },
  {
    "id": "ashan-goal",
    "src": "/home/moment-goal.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/Photos/cb8f1f035f1cc9113e334ba87fab0a44.jpg",
    "w": 1280,
    "h": 853,
    "alt": "A goalkeeper in blue stretches across the goal as the ball flies in past a player in orange"
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
    "id": "gaming-lounge-focus",
    "src": "/pages/division-0-lounge.webp",
    "sourceUrl": "C:/Users/anuda/Desktop/Photos/Cinematic Gaming Lounge Focus.png",
    "w": 1024,
    "h": 1536,
    "focus": "50% 42%",
    "alt": "A man in a black shirt grips a glowing white controller as he looks at the screen in a gaming lounge, with a second player behind him"
  }
};
