/* ===========================================================================
   FRONTIER FOOTBALL - SITE CONTENT
   ===========================================================================

   This is the file you edit to change what the Champions & Honours section
   shows on the website. You do not need to touch anything else.

   HOW TO EDIT
   -----------
   - Anything between quotes is text the website shows. Change the words
     inside the quotes, keep the quotes.
   - Anything after a // is a note to you. The website ignores those lines.
   - If we do not know something yet, leave it as "TODO". The website then
     leaves that line out completely rather than showing a blank or a guess.
   - Save the file and push it to GitHub. The site rebuilds itself.

   THE ONE RULE
   ------------
   Never type a champion, runner-up, Golden Boot or Golden Glove we are not
   sure about. A wrong name on the site is worse than a missing one. If you
   are unsure, leave "TODO" - or write "TODO: check with the lads", which the
   site still treats as unknown.

   ADDING A WHOLE SEASON
   ---------------------
   Copy one of the { ... } blocks below, paste it in the list where you want
   it to appear, and change the numbers and names. Newest season goes first.

   ADDING A COMPETITION THAT IS NOT A SEASON
   -----------------------------------------
   Tournaments like Division 0 are not seasons of the 4x4 Series, so they live
   in their own `competitions` list further down instead of in `seasons`.

   ADDING A CHAMPIONS PHOTO
   ------------------------
   Put the picture file in the `public/champions/` folder, then write its name
   in the `photo` line as "/champions/whatever-you-called-it.webp". Leave it as
   "TODO" and the card simply has no picture - nothing breaks.
   The pictures already there were cut out of the champions posts on Instagram:
   the poster wording and sponsor logos were trimmed off so only the team is
   left, which stops the old orange-and-blue artwork fighting our colours.
   =========================================================================== */

export default {
  // Signed-off website copy containing event facts (owner, 2026-10-07).
  milestones: "It started with Ground Zero, one night on turf in Colombo. Then came Turf Wars, the 4 x 4 Series, watch parties and Division 0, our FC 26 tournament. Every one added another chapter. The numbers below show how far it has come.",
  // Each story's collage on the Community page. Photos must be landscape.
  communityStories: [
    { name: "Ground Zero", body: "It all began here. One night on turf in Colombo, in 2024. Players came with something to prove, the crowd came to see it, and nobody who was there forgot it. Every Frontier night since traces back to this one.",
    credit: "Photos: ThePapare",
    photos: [
      { src: "/albums/frontier-futsal/9792a16def4ab58717fd323264cf486d.webp", alt: "Two players fight for the ball at Ground Zero" },
      { src: "/albums/frontier-futsal/028d44b1500220bc9a69eadecee302c8.webp", alt: "A player in yellow runs onto the ball at Ground Zero" },
      { src: "/albums/frontier-futsal/cd3591a33cca4c3591f1f01eb0437bfc.webp", alt: "Three players close in on the ball at Ground Zero" },
    ] },
    { name: "4 x 4 Series", body: "Six seasons. One venue. The same turf, new rivalries every season, and a place that started to feel like home. Every season added more faces, more goals and more stories worth telling.",
    photos: [
      { src: "/champions/szn-2.webp", alt: "The 4 x 4 Series SZN 2 champions" },
      { src: "/champions/szn-4.webp", alt: "The 4 x 4 Series SZN 4 champions" },
      { src: "/champions/szn-6.webp", alt: "The 4 x 4 Series SZN 6 champions" },
    ] },
    { name: "Watch Parties", body: "The big games hit different when you watch them together. Strangers turned into friends, every goal got a roar, and every heartbreak was shared by the whole room.",
    photos: [
      { src: "/champions/wa-semi-eng-arg.webp", alt: "Fans at the England v Argentina semi-final watch party" },
      { src: "/champions/wa-ucl-final-night.webp", alt: "Fans at the Champions League final watch party" },
      { src: "/champions/wa-final-esp-arg.webp", alt: "Spain and Argentina fans at the World Cup final watch party" },
    ] },
    { name: "Division 0", body: "Football without the grass. Controllers in hand, Division 0 gave the game another pitch. The pride was the same, the bragging rights were the same and so was the love of the game.",
    photos: [
      { src: "/champions/division-0.webp", alt: "Players at the Division 0 FC 26 tournament" },
      { src: "https://drive.google.com/thumbnail?id=12p617pNQRoxt3Ae0DsPqI1UMWX6dHeND&sz=w1200", alt: "A Division 0 match on the big screen, controllers in hand" },
      { src: "https://drive.google.com/thumbnail?id=1JySS8J-819N82HC7EiALOFOttBQ1uNul&sz=w1200", alt: "Players on the sofas mid-match at Division 0" },
      { src: "/who/division-0-crowd.webp", alt: "A crowd gathers round the console at Division 0" },
    ] },
  ],
  aboutIntro: "Frontier Football started in Colombo in 2024 with one night on turf and a simple dream: Sri Lankan football deserves the biggest stage. Two years in, it is a large, growing community.",

  // Every season of the 4x4 Series, newest first.
  seasons: [
    {
      // The season number. Shows on the card as "SZN 6". Just the number.
      season: 6,
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "szn-6",
      // The team that won. This is the main thing on the card. If it is TODO,
      // the card says "Not recorded yet" instead.
      champion: "Spain",
      // A short line under the champion, for anything unusual about the
      // season. Leave it as "TODO" if there is nothing to say.
      note: "World Cup Edition",
      // The team that finished second.
      runnerUp: "TODO",
      // Top scorer of the season.
      goldenBoot: "TODO",
      // Best goalkeeper of the season.
      goldenGlove: "TODO",
      // Picture of the winning team. Lives in `public/champions/`.
      photo: "/champions/szn-6.webp",
      // What the picture shows, read aloud to anyone using a screen reader.
      // Leave as "TODO" and a plain description is written for you.
      photoAlt: "The 4 x 4 Series SZN 6 champions lined up on the pitch beside the trophy.",
      // WHEN it ran and WHERE.
      //
      // Every date is still blank. Leave one as "TODO" and the About page's
      // timeline simply prints that line shorter - it never guesses a month.
      //
      // The venues came from the owner on 2026-09-03: every season of the 4x4
      // Series was played at Athlete 360 and Division 0 was at Pixels N Pints. The watch parties are still blank -
      // nobody has said which venue hosted which night.
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 6 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1CstLyLWgy79Yqp0d-NQ3Rnux1-MAbxeR",
    },
    {
      season: 5,
      // The photos are ThePapare's (album 13152), imported with
      // `npm run albums:papare -- szn-5`. They are watermarked, so the album
      // credits "Photos: ThePapare" and they are never used as a hero or a
      // card picture.
      albumId: "szn-5",
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // Clean frame at 24s of Frontier's own 026-DaDIerCqF4H.mp4 Instagram
      // post, whose caption identifies this SZN 5 event. ThePapare photos stay
      // in the credited album and are never cropped into a hero.
      photo: "/gallery/szn-5-hero.webp",
      photoAlt: "Two 4x4 Series trophies and medals set out after SZN 5.",
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 5 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "TODO",
    },
    {
      season: 4,
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "szn-4",
      champion: "Pantera FC",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      photo: "/champions/szn-4.webp",
      photoAlt: "The 4 x 4 Series SZN 4 champions holding the trophy together after the final.",
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 4 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1aqiStgYq6IRnL-Ev2GdEDWDu4HgzrpZu",
    },
    {
      season: 3,
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "szn-3",
      champion: "Ramadan FC",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      photo: "/champions/szn-3.webp",
      photoAlt: "The 4 x 4 Series SZN 3 champions wearing their medals, with the trophy.",
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 3 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1n3WeRh87N8bBVia1gQJ5pafeCrXkc9Bn",
    },

    // SZN 1 and SZN 2. Nothing about these two has been confirmed yet, so
    // every line is "TODO" and the cards show "Not recorded yet" rather than
    // a guess. Fill the names in as they come.
    {
      season: 2,
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "szn-2",
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // A match-action frame from the SZN 2 Drive folder - not a champions
      // photo (the winner is still unknown), just proof there was a season.
      photo: "/champions/szn-2.webp",
      photoAlt: "A 4 x 4 Series SZN 2 player lines up a shot as an opponent closes in.",
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 2 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1G5VcXwTNeIMI_K7eSrRf0ndZalg_8S66",
    },
    {
      season: 1,
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "szn-1",
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // A match-action frame from the SZN 1 Drive folder, badge-cropped per
      // docs/HOUSE-RULES.md section 6 (17% off the bottom clears the Frontier
      // crest and the REIGNITE wordmark).
      photo: "/champions/szn-1.webp",
      photoAlt: "4 x 4 Series SZN 1 players challenge for the ball in the cage under floodlights.",
      date: "TODO",
      venue: "Athlete 360",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 1 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/18fxPlbuFWK1KWtKPedgNnm3DbIxw4VKW",
    },
  ],

  // Competitions that are NOT seasons of the 4x4 Series. Each one gets its own
  // card at the end of the grid. To add another, copy a { ... } block below and
  // change the words. To take one off the site, delete its block.
  competitions: [
    {
      // Frontier's first tournament, from before the rebrand. Shown with no
      // year, on purpose. It ran as the "Frontier Futsal Tournament" (that is
      // ThePapare's title for the album); the owner renamed it here on
      // 2026-09-24, then Ground Zero on 2026-10-07. The albumId stays unchanged.
      name: "Ground Zero",
      // The photos are ThePapare's (album 10932), imported with
      // `npm run albums:papare -- frontier-futsal`. They are watermarked, so
      // the album credits "Photos: ThePapare" and they are never used as a
      // hero or a card picture.
      albumId: "frontier-futsal",
      // true = it ran before the 4x4 Series, so it comes first in the gallery
      // tabs and on the About page's timeline.
      beforeSeries: true,
      note: "TODO",
      // ThePapare's prize-giving photos show a women's and a men's winning
      // team, but not their names. Fill these in once confirmed.
      champion: "TODO",
      runnerUp: "TODO",
      // Owner-approved 2026-09-23: use a selected ThePapare photograph here,
      // preserving its visible Milinda Deshan/ThePapare watermark and album
      // credit. This file is already part of the curated local album.
      photo: "/albums/frontier-futsal/b36221d4200375031890d20c95f5162c.webp",
      photoAlt: "A player in black controls the ball against two defenders in teal at Ground Zero.",
      photoCredit: "Milinda Deshan / ThePapare",
      date: "TODO",
      // Club Fusion signage is visible in ThePapare's photos. Confirm before
      // writing it here.
      venue: "TODO",
      driveFolder: "TODO",
    },
    {
      // Back on the site (owner, 2026-10-07: "add turf wars throughout the
      // site"). It ran after Ground Zero and before the 4x4 Series.
      name: "Turf Wars",
      beforeSeries: true,
      // The owner's "Best 30 of the Album" picks, on Drive and synced
      // (2026-10-10). driveFolder stays TODO: paste a share link there only
      // if the owner wants one.
      albumId: "turf-wars",
      note: "TODO",
      champion: "TODO",
      runnerUp: "TODO",
      // The winners, from the picks folder on Drive (turf-wars album, #22 of
      // the owner's Best 30; 2026-10-10). Replaces the 800px poster crop.
      photo: "https://drive.google.com/thumbnail?id=1-XPBIHqU4dxudCRdUMej_PrAnIA9kZzA&sz=w1600",
      photoAlt: "The Turf Wars winners posed on the turf with their trophies and medals under the banner.",
      // Source: Frontier's own Turf Wars poster (Instagram cache, 2026-09-22):
      // "Club Fusion, Boralesgamuwa, July 26th 2025".
      date: "26 July 2025",
      venue: "Club Fusion",
      driveFolder: "TODO",
    },
    {
      // The name shown on the card. A competition with no name is skipped, so
      // this is the one line that must be filled in.
      name: "Division 0",
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "division-0",
      // "PS5 FC26 Tournament" is how it is described in the Instagram post
      // announcing it. Add the month here too once you confirm it: the recap
      // post went up on 28 July 2026, so it looks like July, but that is a
      // guess from a post date and is not written on the site.
      note: "PS5 FC26 tournament",
      champion: "TODO",
      runnerUp: "TODO",
      // Not the winners: a photo from the night itself, since no champions
      // picture was found. The description below says so honestly.
      photo: "/champions/division-0.webp",
      photoAlt: "Players on a sofa at the Division 0 console tournament, controller in hand.",
      date: "TODO",
      venue: "Pixels N Pints",
      // Link to the full photo folder for Division 0 on Google Drive.
      // Paste the folder's share link here. Leave it as "TODO" and the card
      // still shows, saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1fkDf7Igl7RtVIKxxxeuGikZqo6Eg7se1",
    },
  ],

  // ==========================================================================
  // WATCH-ALONGS - nights we all watched football together.
  //
  // These are NOT tournaments. A tournament is football Frontier ran, and it has
  // a champion. A watch-along is football Frontier watched: a screen, a venue and
  // a crowd. They get their own group on the gallery page so the two never sit
  // under the same heading.
  //
  // TO ADD ONE: copy a { ... } block, change the words. To take one off the
  // site, delete its block. A block with no name is skipped.
  //
  // ONE ENTRY OR MANY? Both work. If all your watch-along photos live in one
  // Drive folder, keep the single "World Cup" entry below and point it there. If
  // you kept a folder per match, make one block per match instead and name them
  // whatever you called them.
  // ==========================================================================
  // WHERE THE WATCH PARTIES SIT ON THE ABOUT PAGE'S TIMELINE.
  //
  // The watch parties did not happen after the seasons, they happened in the
  // middle of SZN 4, 5 and 6 (owner, 3 September 2026). Write the season number
  // they ran alongside here and the timeline grows a branch at that point.
  //
  // Put "TODO" instead and the branch simply hangs off the end of the run,
  // which is what it did before anybody said when they happened.
  watchAlongsAfter: 5,

  watchAlongs: [
    {
      // The name shown on the card. This is the one line that must be filled in.
      name: "Final: Spain vs Argentina",
      // Which album on this site the "View photos" button opens. It matches a
      // file in public/albums/, written by `npm run albums:sync`. Leave it as
      // "TODO" and the card still shows, saying the photos are on the way.
      albumId: "wa-final-esp-arg",
      // A short line under the name. The month, or which matches it covered.
      note: "TODO",
      // A picture from the night. Put the file in the public/champions/ folder
      // and write its name here, the same way the champion photos work.
      photo: "/champions/wa-final-esp-arg.webp",
      photoAlt: "Argentina and Spain fans crowd round a table with flags at the World Cup final watch-along.",
      date: "TODO",
      venue: "TODO",
      // The Google Drive folder holding the photos from this night.
      driveFolder: "https://drive.google.com/drive/folders/1hOfEz1uHcPT0fx8Ca4Dv86bhcj7WMMsU",
    },
    {
      name: "Semi-final: England vs Argentina",
      albumId: "wa-semi-eng-arg",
      note: "TODO",
      photo: "/champions/wa-semi-eng-arg.webp",
      photoAlt: "A packed crowd in Argentina shirts celebrates at the England vs Argentina watch-along.",
      date: "TODO",
      venue: "TODO",
      driveFolder: "https://drive.google.com/drive/folders/1MFdyJn1AwLtSq_Flkg8PB_EqFX1a15CV",
    },
    {
      name: "Semi-final: Spain vs France",
      albumId: "wa-semi-esp-fra",
      note: "TODO",
      photo: "/champions/wa-semi-esp-fra.webp",
      photoAlt: "Fans on their feet reacting to the Spain vs France semi-final.",
      date: "TODO",
      venue: "TODO",
      driveFolder: "https://drive.google.com/drive/folders/15y_x5dnOdsGQvmjPm0JaIqeLpoGWB5BM",
    },
    {
      name: "Norway vs England",
      albumId: "wa-norway-england",
      note: "TODO",
      photo: "/champions/wa-norway-england.webp",
      photoAlt: "An England fan in a 1966 shirt punches the air at the Norway vs England watch-along.",
      date: "TODO",
      venue: "TODO",
      driveFolder: "https://drive.google.com/drive/folders/1CZXXR7ZNFmPaOFudf8wDXNlPFlaKnxlh",
    },
    {
      // Not part of the same run of matches as the four above, but it is still
      // a night in front of a screen, so it belongs in this group.
      name: "UCL Final Night",
      albumId: "wa-ucl-final-night",
      note: "TODO",
      photo: "/champions/wa-ucl-final-night.webp",
      photoAlt: "Fans in red shirts cheer with their arms raised at the watch-along.",
      date: "TODO",
      venue: "TODO",
      driveFolder: "https://drive.google.com/drive/folders/1LI43OOBwg14x5l5h-E3OTw5f2z-kGyXe",
    },
  ],

  // ==========================================================================
  // THE HOME PAGE PICTURE ROW - the strip that scrolls sideways near the bottom
  // of the front page. It is a preview. The full sets live on the gallery page.
  //
  // HOW TO CHANGE A PICTURE
  //   Put the new file in the `public/gallery/` folder, then change the `src`
  //   line below to its name. Write a new `alt` line describing what the
  //   picture shows. That is all.
  //
  // WHAT EACH LINE MEANS
  //   src     the file. Ending in .mp4 makes it a clip, anything else a photo.
  //   poster  clips only. The still picture shown until someone taps play.
  //           A clip without one is left off the site.
  //   alt     read aloud to anyone using a screen reader. Describe only what
  //           you can actually see. Never name a team, a player, a place or a
  //           date unless it is written in the picture itself.
  //   width   the picture's size in pixels. These only reserve the right
  //   height  amount of space so the row does not jump about while the
  //           pictures load. If you swap a picture and do not know its size,
  //           delete both lines: the site holds a normal wide slot instead.
  //
  // EVERY PHOTOGRAPH HERE IS LANDSCAPE, ON PURPOSE
  //   The row sizes each card to the picture's own shape, so one upright
  //   picture in a row of wide ones makes the whole strip taller and leaves
  //   the wide ones looking shrunken beside it. Clips are the exception: the
  //   footage is phone-shot and mostly upright, so clips live behind the CLIPS
  //   button and appear nowhere else. If you add a photograph, add a wide one.
  //
  // WHERE THESE CAME FROM
  //   The photographs were picked out of Frontier's own Google Drive, from the
  //   season and watch-along folders the gallery page already links to. The two
  //   clips are from Frontier's Instagram, which is where the whole row used to
  //   come from. Posters and announcement graphics are still deliberately left
  //   out: they carry their own lettering and their own colours, which fight
  //   the site's. Two Instagram photographs remain unusable because ThePapare's
  //   photographer's copyright notice is printed across them, and that is not
  //   ours to crop off.
  //
  //   Most Drive photographs carry a burned-in Frontier, 4x4, HYPE, REIGNITE or
  //   MAIN mark in the bottom corners. Those marks were measured and cropped
  //   off before the files were saved, so nothing here ships a logo nobody
  //   meant to publish. Two otherwise good frames were dropped instead of
  //   cropped, because the badge sat too far up the picture to cut without
  //   cutting the subject too. See docs/HOUSE-RULES.md.
  // ==========================================================================
  gallery: [
    // ---- On the pitch ----
    {
      src: "/gallery/p01.webp",
      alt: "A player slides in to win the ball as an attacker shields it on the turf.",
      tag: "On the pitch",
      width: 1280,
      height: 921,
    },
    {
      src: "/gallery/p02.webp",
      alt: "Two players stretch for a loose ball in front of an open goal.",
      tag: "On the pitch",
      width: 1280,
      height: 708,
    },
    {
      src: "/gallery/p03.webp",
      alt: "A player strikes the ball under floodlights with palm trees behind the cage.",
      tag: "On the pitch",
      width: 1280,
      height: 708,
    },
    {
      src: "/gallery/p04.webp",
      alt: "Two players go one on one over the ball in the middle of the pitch.",
      tag: "On the pitch",
      width: 1280,
      height: 666,
    },
    {
      src: "/gallery/p05.webp",
      alt: "A player shoots while spectators watch from the sideline tents.",
      tag: "On the pitch",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p06.webp",
      alt: "A player shapes to shoot during a daytime match.",
      tag: "On the pitch",
      width: 1280,
      height: 853,
    },
    {
      src: "/gallery/p07.webp",
      alt: "Players crowd the ball in a tight midfield battle.",
      tag: "On the pitch",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p08.webp",
      alt: "Two players sprint shoulder to shoulder chasing the ball.",
      tag: "On the pitch",
      width: 1280,
      height: 658,
    },

    // ---- Off the pitch ----
    {
      src: "/gallery/p09.webp",
      alt: "A team lines up for a portrait on the pitch at dusk.",
      tag: "Off the pitch",
      width: 1280,
      height: 708,
    },
    {
      src: "/gallery/p10.webp",
      alt: "Two players embrace after the final whistle.",
      tag: "Off the pitch",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p11.webp",
      alt: "A winning side lifts the trophy in front of a Frontier banner.",
      tag: "Off the pitch",
      width: 1280,
      height: 658,
    },
    {
      src: "/gallery/p12.webp",
      alt: "Two teams line up with medals and the cup after the final.",
      tag: "Off the pitch",
      width: 1280,
      height: 658,
    },
    {
      src: "/gallery/p13.webp",
      alt: "Players crowd around the screens at the FIFA tournament.",
      tag: "Off the pitch",
      width: 1280,
      height: 853,
    },

    // ---- Watch-alongs ----
    {
      src: "/gallery/p14.webp",
      alt: "Fans throw their arms up as the match turns on the big screen.",
      tag: "Watch-alongs",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p15.webp",
      alt: "A room full of football shirts celebrating a goal together.",
      tag: "Watch-alongs",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p16.webp",
      alt: "A packed venue watching the match on the screens.",
      tag: "Watch-alongs",
      width: 1280,
      height: 649,
    },
    {
      src: "/gallery/p17.webp",
      alt: "Fans leap out of their seats in front of the projector screen.",
      tag: "Watch-alongs",
      width: 1280,
      height: 854,
    },
    {
      src: "/gallery/p18.webp",
      alt: "A full house watching the match under the green glow of the bar.",
      tag: "Watch-alongs",
      width: 1280,
      height: 854,
    },
    {
      src: "/gallery/p19.webp",
      alt: "Fans in football shirts raise their arms at the line-up reveal.",
      tag: "Watch-alongs",
      width: 1280,
      height: 854,
    },

    // ---- Clips. Only the CLIPS filter shows these. ----
    {
      // A clip. `poster` is the still that shows until someone opens it.
      src: "/gallery/v01.mp4",
      poster: "/gallery/v01.webp",
      alt: "A player rests a boot on the ball beside a training cone under floodlights.",
      tag: "On the pitch",
      width: 1200,
      height: 678,
    },
    {
      src: "/gallery/v02.mp4",
      poster: "/gallery/v02.webp",
      alt: "Two players compete for the ball during a game.",
      tag: "On the pitch",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/v03.mp4",
      poster: "/gallery/v03.webp",
      alt: "Someone walks through a watch-along venue while the match plays on the big screen.",
      tag: "Watch-alongs",
      width: 540,
      height: 960,
    },
    {
      src: "/gallery/v04.mp4",
      poster: "/gallery/v04.webp",
      alt: "Supporters in football shirts watching the match from armchairs, one grinning.",
      tag: "Watch-alongs",
      width: 540,
      height: 960,
    },
  ],

  // ==========================================================================
  // PARTNERS - the brands and places that have appeared alongside Frontier.
  //
  // THE WORD MATTERS. These are called "partners", not "sponsors". A sponsor is
  // someone who paid. Nobody has told us which of these paid and which did not,
  // so calling any of them a sponsor would be putting a money deal on the site
  // that we cannot back up. If you know that one of them sponsored Frontier,
  // tell whoever is building the site and they will add that properly.
  //
  // WHO PAID (owner, 2026-09-22): HypeBam, IODEX, Reignite, Seixed and
  // Address.lk paid money. ThePapare is a media partner; Red Bull gave product
  // and branding. The site still calls everyone "partner" until a
  // past-delivery section is designed (plan T5).
  //
  // THE NAMES are written exactly the way they appear in Frontier's own posts.
  // Nine of them are Instagram handles, so they start with an @. Sofascore and
  // ThePapare were written as company names rather than handles, so they do not.
  //
  // WHY EVERY LINK IS EMPTY. We worked out what each Instagram address probably
  // is, but nobody has clicked them to check. If one letter is wrong, the link
  // goes to a stranger's account with Frontier's name next to it. So they are
  // all left as TODO. Open the nine addresses in the handover note, check each
  // one is the right business, then paste it in below. The name turns into a
  // link the moment you do.
  //
  // ADDING A LOGO. Put the picture file in the `public/partners/` folder, then
  // write its name in the `logo` line, like "/partners/whoever.webp". The
  // picture replaces the text and nothing else on the page moves.
  //
  // THE LOGOS BELOW were traced from each brand's own website, Facebook page or
  // Instagram profile picture, then flattened to one flat cream colour so the
  // whole strip reads as one set on the dark band. Every mark is the brand's
  // own; nothing was invented. Replace any file in `public/partners/` with a
  // cleaner one from the brand and it drops straight in.
  //
  // STILL TEXT: @iodexsrilanka and @zone360.lk. No usable logo file exists
  // online for either (IODEX's site only carries its parent company's mark),
  // so both show as their name until someone supplies a real file.
  //
  // TO ADD A PARTNER: copy a { ... } line and change the name.
  // TO REMOVE ONE: delete its line.
  // ==========================================================================
  partners: [
    { name: "@main.sportsbar", logo: "/partners/main-sports-bar.png", url: "TODO" },
    { name: "@address.lk", logo: "/partners/address.png", url: "TODO" },
    { name: "@iodexsrilanka", logo: "TODO", url: "TODO" },
    { name: "@nutrimax.iso", logo: "/partners/nutrimax.png", url: "TODO" },
    { name: "Sofascore", logo: "/partners/sofascore.svg", url: "TODO" },
    { name: "@shirtshack.lk", logo: "/partners/shirt-shack.png", url: "TODO" },
    { name: "@drinkhypebam", logo: "/partners/hype-bam.png", url: "TODO" },
    { name: "ThePapare", logo: "/partners/thepapare.png", url: "TODO" },
    { name: "@absystudios", logo: "/partners/absy-studios.png", url: "TODO" },
    { name: "@zone360.lk", logo: "TODO", url: "TODO" },
    { name: "@athlete360_sl", logo: "/partners/athlete-360.png", url: "TODO" },
    // Added 2026-09-22 on the owner's word. Seixed co-presented Division 0 with
    // @address.lk; Reignite ran on-site stands; Red Bull did branding, an
    // activation and drinks at the Alpha Tournament. Names as brands, not
    // handles, until someone checks each handle.
    { name: "Seixed", logo: "TODO", url: "TODO" },
    { name: "Reignite", logo: "TODO", url: "TODO" },
    { name: "Red Bull", logo: "TODO", url: "TODO" },
  ],

  // ==========================================================================
  // LINKS - everywhere else Frontier lives, in the order they matter.
  //
  // Instagram is first because following Frontier there is the one thing we
  // want a visitor to do. Keep it first.
  //
  // The other four have no address yet. Leave one as TODO and it normally does
  // not appear on the site at all - a link that opens nothing is worse than no
  // link. Paste a real URL in and that tile turns live, in the order it sits in
  // this list. Nothing else needs changing.
  //
  // Facebook, LinkedIn, Sofascore and WhatsApp already have their platform mark
  // built in - the tile draws the logo the moment a real URL is here. Sofascore
  // has no logo and shows its name in the tile instead.
  //
  // `placeholder: true` is the exception: it draws the tile NOW, greyed and
  // unclickable, before the URL exists. On Facebook and LinkedIn today because
  // the owner asked to see them in place. Delete the line the moment the real
  // URL lands - a live tile beside two greyed ones is the point.
  // ==========================================================================
  // ==========================================================================
  // THE PEOPLE who run Frontier.
  //
  // THIS LIST IS EMPTY ON PURPOSE. Nobody has been named yet, and a card with a
  // made-up name on it is worse than no section at all. While the list is empty
  // the whole "who we are" part of the About page is simply not there - no
  // heading, no blank cards, nothing.
  //
  // TO ADD SOMEONE: delete the // in front of the four lines below and fill
  // them in. Copy the block again for each extra person.
  //
  //   name      what they are called. A person with no name is skipped.
  //   role      what they do at Frontier. Leave "TODO" and just the name shows.
  //   photo     a picture of them. Put the file in `public/people/` and write
  //             its name here, like "/people/whoever.webp". Leave it as "TODO"
  //             and the card is text only - nothing breaks.
  //   photoAlt  what the picture shows, read aloud to anyone using a screen
  //             reader. Leave as "TODO" and a plain description is written.
  //
  // ASK FIRST. Do not put somebody's name and face on the site before they have
  // said yes to it.
  // ==========================================================================
  people: [
    // Empty for the 2026-09-24 production release (owner: "hide held parts"):
    // the section stays off the page until a real person who has said yes is
    // added here (see ASK FIRST above).
    // { name: "TODO", role: "TODO", photo: "TODO", photoAlt: "TODO" },
  ],

  // ==========================================================================
  // SUNDAY FOOTBALL LEAGUE - the Community page's one live activity.
  //
  //   details   the facts a team needs before registering. Each one shows as a
  //             label and a value. Replace every TODO with the real answer;
  //             a TODO row is left off the page.
  //   teamMessage / freeAgentMessage
  //             what gets typed into WhatsApp for the person, one per button,
  //             so you can tell a team from a free agent before they type.
  //             Sent to contact.whatsapp below. Leave one as "TODO" and its
  //             button disappears.
  // ==========================================================================
  league: {
    sessionLine: "Every Sunday, 7 pm to 10 pm, at Club Fusion, Borella. Community sessions, open to everyone.",
    details: [
      // "TODO" hides a row (2026-09-24 production release: owner chose to hide
      // the unfinished details). Replace TODO with the real answer to show it.
      { label: "Starts", value: "TODO" },
      { label: "When", value: "Every Sunday, 7 pm to 10 pm" },
      { label: "Where", value: "Club Fusion, Borella" },
      { label: "Format", value: "TODO" },
      { label: "Entry", value: "TODO" },
    ],
    teamMessage: "Hi Frontier, I'd like to register a team for the Sunday Football League.",
    freeAgentMessage: "Hi Frontier, I'd like to join the Sunday Football League as a free agent.",
  },

  links: [
    // The main one. Verified live. The 'handle' is what gets printed big on
    // the page, so it is written the way people actually type it.
    {
      name: "Instagram",
      handle: "@frontierfootballl",
      url: "https://www.instagram.com/frontierfootballl/",
    },
    // Frontier's TikTok, supplied by the owner on 2026-08-28.
    // NOTE THE SPELLING: TikTok is @frontierfootball with ONE l at the end.
    // Instagram above is @frontierfootballl with THREE. They are genuinely
    // different handles and neither is a typo of the other - do not "correct"
    // one to match the other.
    {
      name: "TikTok",
      handle: "@frontierfootball",
      url: "https://www.tiktok.com/@frontierfootball",
    },
    // Frontier's Facebook page. Replace "TODO" with the page URL
    // (facebook.com/...) and delete the `placeholder` line to make it live.
    { name: "Facebook", url: "TODO", placeholder: true },
    // Frontier's LinkedIn page. Replace "TODO" with the company/page URL
    // (linkedin.com/...) and delete the `placeholder` line to make it live.
    { name: "LinkedIn", url: "TODO", placeholder: true },
    // The Sofascore page carrying Frontier's results. Named in a post, but the
    // address itself was never written down.
    { name: "Sofascore", url: "TODO" },
    // The WhatsApp community invite link, if one exists.
    { name: "WhatsApp", url: "TODO" },
  ],

  // ==========================================================================
  // CONTACT - what the contact page (/contact.html) offers.
  //
  //   whatsapp  the number people message, WITH the country code. Type it
  //             however you like - "+94 71 234 5678", "+94712345678",
  //             "(+94) 71-234-5678" all work, the spaces and dashes are
  //             stripped for you. This is the one field the page most wants.
  //   email     the address people can write to instead. It matters more than
  //             it looks: a WhatsApp link opened on a laptop that is not signed
  //             in to WhatsApp Web just shows a download page, and a brand
  //             reading the site on a laptop is exactly who this page is for.
  //   partnerMessage / playerMessage
  //             what gets typed into WhatsApp for the person before they send
  //             it. Two of them because the page has two buttons - one for a
  //             brand, one for someone wanting to play - so you can tell which
  //             one they pressed from the message that arrives.
  //
  // Leave whatsapp and email as "TODO" and the page still works: it falls back
  // to the Instagram link above and shows no dead buttons. Fill them in and the
  // buttons appear. Nothing else needs changing.
  // ==========================================================================
  contact: {
    // Supplied by the owner on 2026-09-04 as 0763431469, the way it is dialled
    // inside Sri Lanka. Written here in international form because wa.me needs
    // the country code: without it the link does not error, it opens a chat
    // with nobody. Leading 0 dropped, +94 added, which is the same number.
    whatsapp: "+94 76 343 1469",
    // Supplied by the owner on 2026-09-22, replacing the pre-rebrand
    // frontierfutsal@gmail.com. That old account still owns Frontier's Google
    // Drive; only the address printed on the site changed.
    email: "Info.frontierfootball@gmail.com",
    partnerMessage: "Hi Frontier, I'd like to talk about partnering.",
    playerMessage: "Hi Frontier, I'd like to join the next season.",
  },

  // ==========================================================================
  // COLLABORATE - what the collaborate page (/collaborate.html) shows a brand.
  //
  // This is the page the hero's yellow button sends people to, so it is the
  // page a brand decides on. Two lists:
  //
  //   reach   the numbers. How many people actually see Frontier. Each one is
  //           a `figure` (the number, written however you want it to appear -
  //           "12.4K", "1,200", "45,000") and a `label` saying what it counts.
  //           `asOf` is the date you measured it.
  //   offer   what a partner has really had from Frontier.
  //
  // BOTH LISTS SURVIVE BEING EMPTY. A reach row with either half still "TODO"
  // is left out. Empty the whole list and the numbers band is not on the page
  // at all - no heading, no zeroes, no blank boxes.
  //
  // NEVER GUESS A NUMBER. A follower count a brand can check in ten seconds is
  // the fastest way to lose one. Open Instagram, read the number, type the
  // number, and put today's date in `asOf`.
  // ==========================================================================
  collaborate: {
    reach: [
      // Source: the owner, in session on 2026-09-22. Replaces the invented
      // 2026-09-07 placeholders. Delete a row you cannot measure.
      { figure: "3.4M+", label: "Instagram views", asOf: "2026-09-22" },
      { figure: "914", label: "Instagram followers", asOf: "2026-09-22" },
      { figure: "400+", label: "Growing community", asOf: "2026-09-22" },
      { figure: "50+", label: "Partners", asOf: "2026-09-22" },
      { figure: "15+", label: "Events", asOf: "2026-09-22" },
    ],

    // What a partner has actually had from Frontier. Confirmed by the owner on
    // 2026-09-04. Only put things here that have really happened - this is the
    // part of the page a brand reads to decide whether to reply.
    //
    // "Co-presented", not "named after": Division 0 was announced as a PS5 FC26
    // World Cup Edition WITH @seixed and @address.lk. No competition has ever
    // carried a partner's name, and saying otherwise would be a claim nobody
    // can stand behind (docs/HOUSE-RULES.md sections 7 and 9).
    //
    // REPLACED WHOLESALE ON 2026-09-10 by the owner's call. These five are the
    // "Why collaborate with us" slide of the owner's own 4x4 Series proposal
    // deck, which the Sep-22 brief names as the content source for this page.
    // The four earlier lines were a record of what partners had already had;
    // these five are what Frontier offers. The heading above them, "What a
    // partner gets", reads correctly for either.
    //
    // EACH ROW IS A TITLE AND A BODY. Leave `body` as "TODO" and the row prints
    // as a title on its own; a row with no `title` is dropped entirely, the same
    // both-halves rule the reach rows follow.
    //
    // "football", not "futsal", in all site copy (owner, 2026-09-24; this
    // reverses the earlier call that kept "futsal" as the sport). The dead
    // pre-rebrand handle still never appears (HOUSE-RULES section 7).
    //
    // WHAT WAS DELIBERATELY NOT TAKEN FROM THE DECK. It says Alpha Tournament
    // was "sponsored by Red Bull" and Turf Wars by Hypebam. Hypebam is one of
    // the recorded eleven; Red Bull is not, anywhere on this site. Section 9
    // says never invent a sponsor and section 7 settled that all eleven are
    // called partners rather than sponsors, so putting Red Bull on the page
    // would be two rule breaks at once. It waits for the owner.
    // UPDATE 2026-09-22: the owner confirmed Red Bull (branding, activation and
    // drinks at Alpha Tournament; not paid), so it is now in PARTNERS below.
    offer: [
      {
        title: "Enhanced visibility",
        body: "Put your brand in front of a focused football audience, live at our events and every day through our content.",
        photo: "/home/moment-crowd.webp",
        alt: "A packed room at Main Sports Bar watching the match",
      },
      {
        title: "Community engagement",
        body: "Stand with a growing football movement built on passion, culture and community.",
        photo: "/home/moment-flags.webp",
        alt: "Fans with Argentina flags at a Frontier watch party",
      },
      {
        title: "Customizable opportunities",
        body: "Show up your way: on the ground at our events, or through stories we tell together online.",
        photo: "/home/moment-strike.webp",
        alt: "A player strikes the ball under the lights at a Frontier match",
      },
      {
        title: "Product distribution",
        body: "Get your product into the hands of players and fans, where it counts.",
        photo: "/pages/contact-trophies.webp",
        alt: "Trophies, medals and partner product boxes at a Frontier final",
      },
      {
        title: "Branding opportunities",
        body: "Strong on-site branding, event mentions and dedicated social content, so your brand stays visible well past match day.",
        photo: "/pages/collab-partner-can.webp",
        alt: "A giant partner drink can on display at Division 0",
      },
    ],
  },

  // ==========================================================================
  // SESSIONS - the nights that come round every week.
  //
  // This is the top half of the events page (/events.html). One block per
  // night. Every field except `day` can stay "TODO" and that line is simply
  // left out.
  //
  //   day     which night it is - "Thursday", "Sunday". A block with no day is
  //           skipped entirely.
  //   name    what the night is called, if it has a name of its own.
  //   time    when it starts and ends, written however you say it out loud -
  //           "8pm - 10pm", "20:00 till late".
  //   venue   where it is played.
  //   format  what it actually is - "4 v 4, rolling subs", "open run".
  //   price   what it costs a player. Write "Free" if it is free. Leave "TODO"
  //           and the line is left out, which is NOT the same as free.
  //   note    anything else a player needs to know before turning up.
  //
  // A BLOCK WITH ONLY A DAY IN IT IS NOT SHOWN. "Thursday" on its own tells a
  // player nothing, so a night needs at least one real detail before it goes
  // on the page. Fill in one field and it appears.
  // ==========================================================================
  // The invented 2026-09-07 Thursday/Sunday blocks were reset to TODO on
  // 2026-09-22. Later that day the owner confirmed Sunday is real: evenings,
  // 7-10pm. On 2026-10-07 the owner confirmed Club Fusion, Borella. Format and price to follow from the
  // owner. Thursday is not a session; its block stays TODO so it never renders.
  sessions: [
    {
      day: "Thursday",
      name: "TODO",
      time: "TODO",
      venue: "TODO",
      format: "TODO",
      price: "TODO",
      note: "TODO",
    },
    {
      day: "Sunday",
      name: "TODO",
      time: "7 pm to 10 pm",
      venue: "Club Fusion, Borella",
      format: "TODO",
      price: "TODO",
      note: "TODO",
    },
  ],

  // ==========================================================================
  // STATS - the four big numbers on the home page.
  //
  //   figure  the number exactly as it should print, "3.4M+" and all. The
  //           site never rounds it or works it out from anything else.
  //   label   what the number counts.
  //   asOf    the day the number was true. Change it when you change the
  //           figure, so nobody reads an old count as today's.
  //
  // A row with no figure or no label is left off the page.
  //
  // The FIRST row is printed as the one oversized number; the others stack
  // beside it. To make a different number the big one, move its row to the top.
  //
  // "Events" here means every night Frontier has ever hosted. It is NOT the
  // EVENTS list further down, which is only the dated ones still to come.
  // ==========================================================================
  // Source: the owner, in session on 2026-09-18.
  stats: [
    { figure: "3.4M+", label: "Social media views", asOf: "2026-09-18" },
    { figure: "50+", label: "Partners", asOf: "2026-09-18" },
    { figure: "400+", label: "In the community", asOf: "2026-09-18" },
    { figure: "15+", label: "Events", asOf: "2026-09-18" },
  ],

  // ==========================================================================
  // EVENTS - the one-off nights that have a date on them.
  //
  // The bottom half of the events page. Seasons, tournaments, watch-alongs -
  // anything with a date that has not happened yet.
  //
  //   name    what it is called. An event with no name is skipped.
  //   date    when it is, written however you want it to read - "Sat 20 Sep",
  //           "20 September 2026". Nothing works it out for you, so write the
  //           year if the year matters.
  //   venue   where it is.
  //   note    one line about it.
  //   url     a link to the post or the sign-up, if there is one. Leave "TODO"
  //           and the row is plain text rather than a link to nowhere.
  //
  // THIS LIST SHIPS EMPTY. With nothing in it the "What's coming up" section is
  // not on the page at all, and the weekly nights above carry it on their own.
  //
  // TAKE PAST EVENTS OUT. Nothing removes them for you - an event with a date
  // that has been and gone stays on the page until you delete its block.
  // ==========================================================================
  events: [
    // { name: "TODO", date: "TODO", venue: "TODO", note: "TODO", url: "TODO" },
  ],
};
