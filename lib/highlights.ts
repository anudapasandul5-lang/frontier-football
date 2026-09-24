/* Hand-picked frames per album (owner, 2026-09-24: "highlights, then all").
   Picked from contact sheets of the whole album: people, emotion and action,
   no burned-in mark over a face or the ball. Corner badges (Frontier's own,
   the REIGNITE, HYPE and MAIN partner marks) stay, as they sit clear of
   the action. The first frame is the album's lead. Stored locally as WebP so the first thing an
   album shows never depends on Drive. `n` is the frame's position in the
   album manifest (1-based), `id` its Drive file, both provenance only. */

export type Highlight = { n: number; id: string; src: string; w: number; h: number; alt: string };

const h = (album: string, n: number, id: string, w: number, height: number, alt: string): Highlight => ({ n, id, src: `/gallery/highlights/${album}/${n}.webp`, w, h: height, alt });
const szn3 = (n: number, id: string, w: number, height: number, alt: string) => h("szn-3", n, id, w, height, alt);

export const highlights: Record<string, Highlight[]> = {
  "szn-3": [
    szn3(222, "13JA6Mf9sXQL4iBQDQQgoX07n05d8qtA3", 1600, 1068, "Number 30 winds up a shot at the keeper under the floodlights"),
    szn3(100, "19mEo445herdbQKMWLrjCRUetwdGYjM_F", 1000, 1498, "A player in a Frontier shirt walks along the fence before a match"),
    szn3(342, "1qFNZ2PEQqM5YQbmi4--B2HTn_vJyAQX2", 1600, 1066, "A team pulled into a tight huddle on the pitch at night"),
    szn3(220, "1VQQF1u8KXxlt-8wwIVPLmnfP2QVx5C2g", 1600, 1068, "The keeper throws himself across goal as a shot flies past"),
    szn3(190, "18AoibPznj7PHD2w5nXlpeFakAM_g-O_0", 1600, 1068, "Players and supporters on the benches watching a match under the lights"),
    szn3(353, "17vHpqDfkDr-UJ_DsKa_XtULKkr7ug4CU", 1000, 1498, "Two teammates arm in arm, grinning, beside the pitch"),
    szn3(391, "1AUGnmBGfRSzEFKXeTc5DCU9csmfvgpks", 1600, 1068, "Teammates celebrating together on the pitch"),
    szn3(228, "1h5cWffIE9JH0FHzbnSDRkc1bqbhLb6P-", 1600, 1068, "Players talking it over beside the pitch after a game"),
    szn3(172, "1DwAYd9odQLQE6rsGxokeS5B4Ogp3Kqha", 1000, 1498, "A supporter taking a drink by the sponsor stand"),
    szn3(348, "1TTmm9V6BUoSSza1L1vtgruYrdtKIWlCM", 1600, 1068, "A team lined up with arms folded, the keeper holding the ball"),
  ],
  "szn-1": [
    h("szn-1", 45, "19lDPli6MCtqJeC2YjS5xFK4NaFmEfCv5", 1600, 1066, "Three players fight for the ball in the afternoon sun"),
    h("szn-1", 85, "1cJdde9irsHzEXpsp1QQmU3QmE7ej6nei", 1600, 1066, "A header in a crowded box as defenders close in"),
    h("szn-1", 211, "173v5CMv6YtU2SmH24Y15S0iDBPaY6hAI", 1600, 1066, "A player stretches into a slide to reach the ball"),
    h("szn-1", 47, "1-oJBL_rzkjZz7AezyD_br_QDiNhU0324", 1600, 1066, "Players tangle by the net as one leaps for a header"),
    h("szn-1", 235, "1XQMCfG7mKIpl2uSf6dCD_x2RUjhWlWgv", 1600, 1066, "A team poses together on the pitch at dusk"),
    h("szn-1", 289, "1SX2uOIlJYDsbhL8J3qqChnnlqGEJDlZq", 1600, 1066, "Two players battle for the ball under the floodlight"),
    h("szn-1", 427, "1i064DUMjSIfK7dpB4yysTU5HWwReseXB", 1600, 1066, "A player drives forward with the ball at night"),
    h("szn-1", 3, "1D_Xm73FLnNHnAIrdRduwXD0-ME7TWQsF", 1600, 1066, "A player looks on from the pitch under the Frontier flags"),
  ],
  "szn-2": [
    h("szn-2", 99, "1L4H_xPPE7KoKG1FaQFpoaDDmgc_zxtuQ", 1000, 1500, "Three players crowd the ball in a tight duel"),
    h("szn-2", 457, "16oWrK0iO8HgTs46ybbtkOcP6DsurTAil", 1600, 1066, "Two players collide chasing the ball at night"),
    h("szn-2", 285, "1sOQNjj0UzypsXBN5sK4rWbJmnwJxqhL1", 1000, 1500, "A keeper dives at a striker's feet in the goalmouth"),
    h("szn-2", 491, "1I48NUXRP-eiuQypciBo7z1aOi9Ybcg9A", 1600, 1066, "A player in number 8 watches through the fence"),
    h("szn-2", 131, "1x3blIrHzjyGgxPRX7v3udKehu7INlwfs", 1000, 1500, "A player shields the ball against the fence"),
    h("szn-2", 157, "1nUfVnXXpVaoiHbLUzj3a9VNc0cEipzwN", 1000, 1500, "A player runs at the defence as a crowd watches from the side"),
    h("szn-2", 201, "1X0NuIWUHNK-e27iokUoIc5AEBBEjf_H2", 1000, 1500, "Players chase the ball in front of the spectators"),
    h("szn-2", 549, "1e_mP9KkCMI7-xfL4Z50BUkjNPKVZp2EU", 1600, 1066, "The keeper in 28 gets set as play comes towards him"),
    h("szn-2", 3, "1iaptTKEfbJOpfbgmfsRP_a1ZKO0C8NaW", 1600, 1066, "The 4x4 Series banner at the SZN 2 finals"),
    h("szn-2", 29, "13yuf8US444mZddg6B2Ps0QSF46KRdIuS", 1000, 1500, "The host on the microphone at the SZN 2 night"),
    h("szn-2", 55, "12IU7FEQXXgqy1sdCjfwfM--Hc0k6oELp", 1000, 1500, "A player walks off smiling after a game"),
    h("szn-2", 7, "1SWSZxacifyShkIQldaPF-86_maWDshmn", 1000, 1500, "The SZN 2 trophies and medals on the table"),
  ],
  "szn-4": [
    h("szn-4", 863, "1WHyisFdZLE3k6uWmcKghwRkZsLsJmGUp", 1600, 1068, "The champions lift the trophy with their arms in the air"),
    h("szn-4", 423, "1kTU8P75sCeiGAjlBcY5hLQADvUbliVbE", 1600, 1068, "A penalty taker in number 10 strikes at the keeper"),
    h("szn-4", 445, "1jqAwvgxiTiRCp3hPG15FoOpJj5Rweaap", 1600, 1068, "The keeper gets down to save a penalty"),
    h("szn-4", 467, "18omyvByQlDDZGosNG4QTrBKodynNs2B3", 1600, 1068, "Players embrace after the match"),
    h("szn-4", 413, "11rlOH15JnOCTDvSvyDX55bojB0O9ZWNy", 1600, 1068, "A player runs up to take a penalty"),
    h("szn-4", 865, "1qSHCZm-xpu5apqduX0KOJcI7l9_uwxyR", 1600, 1068, "Medals round their necks, the winning team celebrates"),
    h("szn-4", 53, "1ObXefodyfkbPFapUNY1jW7xy_aD3JFR3", 1600, 1068, "Players congratulate each other through the net"),
    h("szn-4", 55, "140lYYQGLAYGxrLi4hB9cWlh2unUyeHnp", 1600, 1068, "A smiling player among teammates after the whistle"),
    h("szn-4", 245, "1D-p-BxHYPu1Dg0zY4Bce21Qryfks4aCo", 1600, 1068, "The referee talks to both captains before kick-off"),
    h("szn-4", 603, "1PdzuiDHk_-i9gWLUCshtm6yAW5cdLUdQ", 1600, 1068, "Two players challenge for the ball at night"),
    h("szn-4", 7, "1FIYcKgOa7y8T7_sxVSDrpXpTsb9WBwJh", 1600, 1068, "Players warm up in the afternoon"),
    h("szn-4", 591, "16IGmprPF7c-AVnOWwiZj-uCt7mLtH1FE", 1000, 1498, "The referee with the two captains under the lights"),
  ],
  "szn-6": [
    h("szn-6", 202, "1unncBX9MTheK2uULfvdXZZXUsfqfTeql", 1600, 1158, "The SZN 6 champions raise the trophy under the gazebo"),
    h("szn-6", 174, "18ETYuNNo-nZ49QoPrOMVYpBM99u6ftoq", 1600, 1173, "The winning team lined up with the trophy at night"),
    h("szn-6", 133, "1KC4brnuKyxYSvM7A11JsMcz2qfg5-W9B", 1600, 1514, "A player slides in for a tackle under the floodlights"),
    h("szn-6", 52, "1xu-gD-GCYUTyVq74BQSKxpmV66gPO3mA", 1600, 1066, "Hands in for a team huddle"),
    h("szn-6", 51, "1VrewJM-ODZlD4wuDMUmWHZxFsA65q0rs", 1000, 1369, "A team huddles before kick-off"),
    h("szn-6", 158, "1DtV8s2plzp7eP9myVGecl9tP3Cnnzy4g", 1600, 1394, "Teammates high-five on the pitch at night"),
    h("szn-6", 156, "1RzdorPABbZo3rjHQfSSZq74eTCE6tlKN", 1600, 1585, "A player shapes to shoot beside the fence"),
    h("szn-6", 108, "19kd_8b9Wypxt-64Rz7COOopxuMF9vaAZ", 1600, 1430, "A group of friends pose together at the SZN 6 day"),
    h("szn-6", 98, "1PF2O4ce_CZehHbECE66M_byuMHh0QX5a", 1600, 1321, "Players close down the ball in the afternoon"),
    h("szn-6", 25, "1gMkadnyg9-0mTc3ViB1NpJDQLnS1Tgyk", 1000, 1315, "The referee points as a player strikes the ball"),
    h("szn-6", 71, "1WeNFfS69EXu-vkTsuhsVHVSS9fONJAed", 1600, 1491, "A keeper waits by the post as a player ties his boot"),
  ],
  "division-0": [
    h("division-0", 61, "1qlBSEdIjR0yAXUfEwhITppvC8_ByTFs4", 1600, 1068, "Players with controllers in hand on the sofa, eyes on the screen"),
    h("division-0", 17, "175f2P8wflIR3FETlchtr1xndnKV_Ovtn", 1600, 1066, "Players lean back watching the match on screen"),
    h("division-0", 22, "1OeLZ14Z2dqLKZO808Xt3mTI9gIznlZH8", 1600, 1066, "A crowd gathers round to watch a game"),
    h("division-0", 4, "1bxzukRztmjihLamA0zvoanjdDOM5RbVP", 1000, 1500, "Two players face the big screen at Pixels N Pints"),
    h("division-0", 39, "1fiZhtw6WC--MHQA3c0ZeH2vfYhMExVc4", 1600, 1066, "Players walk through Pixels N Pints between games"),
    h("division-0", 32, "13yOs8lJ0vzfFS-PMPzgqspVM18emhs9E", 1000, 1500, "A controller in hand in front of the screen"),
    h("division-0", 51, "1lMlZd5oSn3iseruaTAv-LBKb9CF_TJU2", 1000, 1498, "A player lit by the window mid-game"),
    h("division-0", 64, "1UbDzE3k16EgZLjMp5VTfmgsDyzx9EdF2", 1600, 1068, "The Division 0 winner receives the trophy"),
    h("division-0", 57, "1db9u4q27JZvyH1_1g0hZAV7_Rg-Z015N", 1000, 1498, "A player checks his phone between games"),
  ],
  "wa-final-esp-arg": [
    h("wa-final-esp-arg", 118, "1WISocyZjLY3_pBxk4WTSaAWa_HmtMMA6", 1600, 1068, "Argentina fans wave flags and smile for the camera"),
    h("wa-final-esp-arg", 12, "1PUriRcYkqqaB-tiyZmXWrqzaqL0NlYx4", 1600, 1068, "A fan in a Messi shirt throws her arm up at the screen"),
    h("wa-final-esp-arg", 209, "1ml3eVf1OSxDwryEMn2OI9W3-llVJFMMn", 1000, 1498, "Two fans hug and dance in front of the big screen"),
    h("wa-final-esp-arg", 214, "1LWyMXYmaAVJs0yFKpcLP_e1GljEANOZC", 1600, 1068, "A fan holds an Argentina flag over her head watching the final"),
    h("wa-final-esp-arg", 123, "1YF0PsQ-HceBEgg9PH2z3mgK88n8zEWvy", 1600, 1068, "A long table of supporters with flags raised"),
    h("wa-final-esp-arg", 196, "1CMlY9kp8XIV0-TjuH8GjynO2vIAsQRn1", 1600, 1068, "The crowd leaps up as the goal goes in"),
    h("wa-final-esp-arg", 9, "1l-Y_GoJzq7tjAW1NKX39tsgoIQ8h0Q2e", 1600, 1068, "Spain and Argentina fans side by side with their flags"),
    h("wa-final-esp-arg", 204, "19qXuWgVRRjg9lTs1bO41VzxEphGfbY-S", 1600, 1068, "Fans on their feet waving flags in the garden"),
    h("wa-final-esp-arg", 35, "1QPc0ISb7UZiZW_DTY7AskM7eS6wE8Tur", 1600, 1068, "A fan in a Messi 10 shirt raises a glass"),
    h("wa-final-esp-arg", 228, "1vNeTinJ7p5l_jVPaVG15NIvFnjlulJUg", 1000, 1498, "A Spain fan smiles with her flag"),
    h("wa-final-esp-arg", 27, "1FgxaWjYJAgrvxBzWiEVc3TLPjGZPV4OR", 1600, 1068, "Supporters film and cheer from their seats"),
    h("wa-final-esp-arg", 21, "16nSTE6F6vMuGtWcMTqHZhftazvpgo2wW", 1600, 1068, "The crowd fills the courtyard in front of the screen"),
  ],
  "wa-semi-eng-arg": [
    h("wa-semi-eng-arg", 101, "16yNPalrUQF7mjkXyQD2ZUJof3y-Iooxx", 1600, 1068, "A fan screams in celebration in front of the screen"),
    h("wa-semi-eng-arg", 119, "1pP7hM151AXb_RJeYQ6Dzs10zgF4yNdzv", 1600, 1068, "Two fans throw their arms up at a goal"),
    h("wa-semi-eng-arg", 115, "1pjSuL2w_OwGwmTxEWxaNcG8qJ9iAPWcb", 1600, 1068, "The room jumps to its feet as the ball goes in"),
    h("wa-semi-eng-arg", 13, "1M0f1F1tS-arC5yIkhW6kii_f91c0o3Sp", 1600, 1068, "England fans watch the match intently at the bar"),
    h("wa-semi-eng-arg", 103, "1--1nVFxvNGoFXaspJrfgRm5PlYuCcgwK", 1600, 1068, "Argentina fans shout at the screen"),
    h("wa-semi-eng-arg", 131, "1bhKgfeVdi1aBhPI156QlInjuCLl1Rlul", 1600, 1068, "A fan punches the air in front of the big screen"),
    h("wa-semi-eng-arg", 139, "1Mqkno3TvJqlvQxslgEde8U2oT5P5ayat", 1600, 1068, "A packed crowd on its feet with arms raised"),
    h("wa-semi-eng-arg", 17, "12eNs8xwwU6-yevDQGefutBXRvNx_gr2c", 1600, 1068, "A group of friends pose at the bar"),
    h("wa-semi-eng-arg", 24, "1P2jk_ICwH7smVRjdta5S5rUBS4jmZ6Ij", 1600, 1068, "Rows of fans watch the match under the lights"),
    h("wa-semi-eng-arg", 7, "1b1GEngKfd-y52_e4qfJBDIpEBUwtaniE", 1000, 1498, "The crowd gathered round the big screen outside"),
  ],
  "wa-semi-esp-fra": [
    h("wa-semi-esp-fra", 16, "1i5InGqlri96WGdvCETGNo2BHTlRfkdNw", 1600, 1068, "A fan shouts at the screen with his arms out"),
    h("wa-semi-esp-fra", 20, "1HoStxG2W5eB5Mty9-QZ6o__mAfoVJh12", 1600, 1068, "A fan in an England shirt reacts to a chance"),
    h("wa-semi-esp-fra", 40, "1U4vQuI3ntVXYKy1yruOSl5gHRe090xDO", 1600, 1068, "A table of fans groans at a near miss"),
    h("wa-semi-esp-fra", 47, "1hiCg_toOM1X0HbIjivrIk817yimLhDa5", 1600, 1068, "Fans on their feet cheering at the bar"),
    h("wa-semi-esp-fra", 33, "1PeSabsF2JSDuiaioANDvjfryhCl0HUZt", 1600, 1068, "A fan in a Yamal 10 shirt celebrates"),
    h("wa-semi-esp-fra", 35, "1fC_qim5dU49v1rHuG6PnlNrIkMD1dYER", 1600, 1068, "A fan holds up a flag at the bar"),
    h("wa-semi-esp-fra", 25, "1kc_oK9Qicax9ifwp8e2sZ5OCxoHovKH9", 1600, 1068, "Friends pose together with drinks"),
    h("wa-semi-esp-fra", 30, "1Urzz0Q_gU9sGutAGjtsU3r2DrWbCbi3v", 1600, 1068, "A fan leans back and cheers"),
    h("wa-semi-esp-fra", 3, "1DeRB5N1-7Lh4Vzt19IbXbi_mFbYgn6-W", 1600, 1068, "The packed Main Sports Bar watching the semi-final"),
    h("wa-semi-esp-fra", 13, "1AJWkCbWXsBxTQAKvRxFNoP5g0anH-OHK", 1000, 1498, "Two friends pose by the bar"),
  ],
  "wa-norway-england": [
    h("wa-norway-england", 75, "1QISUdDS1KaQSlX9aaZ1j1f4T_yaIH-UZ", 1600, 1520, "Friends leap up and cheer at a goal"),
    h("wa-norway-england", 40, "13SAY5-hUFXISqziiTJ8XFna5ZZKhhdNH", 1600, 1065, "A fan claps his hands above his head"),
    h("wa-norway-england", 49, "1NRDqRWXcQPS9geyPh1b0jOOWyewq9cDk", 1600, 1471, "A table of fans jumps up in celebration"),
    h("wa-norway-england", 68, "1lI6z7fIQJl5rVV4BnVRUuIjIuhFXwbX7", 1600, 1065, "A smiling England fan in front of a cheering crowd"),
    h("wa-norway-england", 64, "1t1BNuVOA_RAef4kINl37y4hU573JaDmv", 1600, 1065, "A fan smiles up at the screen"),
    h("wa-norway-england", 16, "1u9_JXBbQ3vl4efHq1ksABAxvLJ9TWTB6", 1000, 1284, "Two friends smile from their seats"),
    h("wa-norway-england", 92, "12O3cIdI58z9E-bnfFSyZLgcvhuhD0iH4", 1600, 1065, "Fans laugh together round a table"),
    h("wa-norway-england", 57, "13rl72Apn4z5sSUwya86OB9jpyZ3L90vt", 1600, 1065, "Fans react with hands raised at a chance"),
    h("wa-norway-england", 86, "1iEFb1qPo6OQvnTNnRH4WsPF5dCBO-3m9", 1600, 1463, "Two fans chat at a table"),
    h("wa-norway-england", 2, "1cavedGagFsC4PoLNbR4j9AJm5T38Tg8K", 1600, 1065, "A packed room watches the match"),
  ],
  "wa-ucl-final-night": [
    h("wa-ucl-final-night", 99, "1n_ezv3lvqatgFEYUr7jlEb5lPrjWsFk-", 1600, 1068, "Arsenal fans with arms raised in celebration"),
    h("wa-ucl-final-night", 41, "1XkMdh6w-ZFpXYPTcq49TfrwnZwfVV7G_", 1600, 1068, "Young Arsenal fans grin at the screen"),
    h("wa-ucl-final-night", 27, "1VYE2bv2Jt0D8SSlbUVOY7aRcX2b6qxo6", 1600, 1068, "A father and son in Arsenal shirts give a thumbs up"),
    h("wa-ucl-final-night", 108, "1J5Bf-5G_n30mQmS-bK3wR2PoXhUXUff_", 1600, 1068, "A fan dances between the tables"),
    h("wa-ucl-final-night", 24, "1OdCaJ5BNfZ4MoTv_OMx9vYw6pGDrUcz8", 1600, 1068, "Friends hug and laugh during the match"),
    h("wa-ucl-final-night", 104, "16LIpqrdD35BAK9y2p2JAfFjr3w0CBDbU", 1600, 1068, "Fans cheer from their seats"),
    h("wa-ucl-final-night", 40, "1lZHJcg6kOFbX_PNVDOrREXmXpTTJK1qs", 1600, 1068, "Fans throw their hands up in the garden"),
    h("wa-ucl-final-night", 12, "1qehKL2_1PWp-p_XenZB3O2MyNgo9W2eT", 1600, 1068, "Three friends smile and chat at a table"),
    h("wa-ucl-final-night", 138, "1rVveggzKJnQUCraCJsbEErJnItwf9kvG", 1000, 1498, "Fans watch with hands on their heads"),
  ],
};

/* The gallery's opening reel: the strongest frame across albums, one or two
   per album, each opening the album it came from. Picked 2026-09-24 from the
   highlight sets above; none repeat the home page's photos. */
export type ReelFrame = { src: string; w: number; h: number; alt: string; albumId: string | null };

const lead = (album: string, n: number): ReelFrame => {
  const f = highlights[album].find((x) => x.n === n)!;
  // A 420px-tall copy: the reel shows each frame at most 300px tall, and the
  // full highlight file tripled the gallery's first load.
  return { src: `/gallery/reel/${album}-${n}.webp`, w: Math.round((f.w / f.h) * 420), h: 420, alt: f.alt, albumId: album };
};

export const reel: ReelFrame[] = [
  lead("szn-6", 202),
  lead("wa-final-esp-arg", 118),
  lead("szn-1", 45),
  lead("wa-semi-eng-arg", 101),
  lead("szn-4", 423),
  lead("wa-norway-england", 75),
  lead("szn-3", 222),
  lead("wa-ucl-final-night", 99),
  lead("szn-2", 457),
  lead("division-0", 61),
];

/* The picture an album card and its hero lead with. A season with a recorded
   champion keeps its winners photo; otherwise the album's own lead highlight,
   because the stored covers are wide team shots that a portrait card crops to
   an empty pitch (SZN 1, SZN 2). Null when there is neither.
   "card" serves the lead as an 800px copy in public/gallery/cover/: a card is
   at most ~400px wide, and the full 1600px frame cost the gallery its mobile
   LCP. "full" is for the album's full-screen hero. */
export function coverFor(album: { id: string; champion: string | null; photo: string | null; photoAlt: string | null }, size: "card" | "full" = "card") {
  const lead = highlights[album.id]?.[0];
  if (album.photo && (album.champion || !lead)) return { src: album.photo, alt: album.photoAlt ?? "" };
  if (!lead) return null;
  return { src: size === "card" ? `/gallery/cover/${album.id}.webp` : lead.src, alt: lead.alt };
}
