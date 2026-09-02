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
   Turf Wars and Division 0 are not seasons of the 4x4 Series, so they live in
   their own `competitions` list further down instead of in `seasons`.

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
  // Every season of the 4x4 Series, newest first. The first one in this list
  // is drawn as the big wide card at the top of the grid.
  seasons: [
    {
      // The season number. Shows on the card as "SZN 6". Just the number.
      season: 6,
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
      photoAlt: "The SZN 6 champions lined up on the pitch beside the trophy.",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 6 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1CstLyLWgy79Yqp0d-NQ3Rnux1-MAbxeR",
    },
    {
      season: 5,
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // No picture yet. The SZN 5 champions post is a ThePapare photograph
      // with their photographer's copyright watermark printed across it, so it
      // is not ours to crop and re-use. Ask ThePapare, or use a photo of your
      // own, then point this line at it.
      photo: "TODO",
      photoAlt: "TODO",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 5 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "TODO",
    },
    {
      season: 4,
      champion: "Pantera FC",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      photo: "/champions/szn-4.webp",
      photoAlt: "The SZN 4 champions holding the trophy together after the final.",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 4 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1aqiStgYq6IRnL-Ev2GdEDWDu4HgzrpZu",
    },
    {
      season: 3,
      champion: "Ramadan FC",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      photo: "/champions/szn-3.webp",
      photoAlt: "The SZN 3 champions wearing their medals, with the trophy.",
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
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // A match-action frame from the SZN 2 Drive folder - not a champions
      // photo (the winner is still unknown), just proof there was a season.
      photo: "/champions/szn-2.webp",
      photoAlt: "A SZN 2 player lines up a shot as an opponent closes in.",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 2 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "https://drive.google.com/drive/folders/1G5VcXwTNeIMI_K7eSrRf0ndZalg_8S66",
    },
    {
      season: 1,
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      // A match-action frame from the SZN 1 Drive folder, badge-cropped per
      // docs/HOUSE-RULES.md section 6 (17% off the bottom clears the Frontier
      // crest and the REIGNITE wordmark).
      photo: "/champions/szn-1.webp",
      photoAlt: "SZN 1 players challenge for the ball in the cage under floodlights.",
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
      // The name shown on the card. A competition with no name is skipped, so
      // this is the one line that must be filled in.
      name: "Turf Wars",
      // A short line under the champion. Use it for when it ran, or for what
      // kind of competition it is.
      note: "Aug 2025",
      // The team that won it.
      champion: "TODO",
      // The team that finished second.
      runnerUp: "TODO",
      // Picture of the winning team.
      photo: "/champions/turf-wars.webp",
      photoAlt: "The Turf Wars champions with their hands on the trophy.",
      // Link to the full photo folder for Turf Wars on Google Drive.
      // Paste the folder's share link here. Leave it as "TODO" and the card
      // still shows, saying the photos are on the way.
      driveFolder: "TODO",
    },
    {
      name: "Division 0",
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
  watchAlongs: [
    {
      // The name shown on the card. This is the one line that must be filled in.
      name: "Final: Spain vs Argentina",
      // A short line under the name. The month, or which matches it covered.
      note: "TODO",
      // A picture from the night. Put the file in the public/champions/ folder
      // and write its name here, the same way the champion photos work.
      photo: "/champions/wa-final-esp-arg.webp",
      photoAlt: "A fan raises an arm as the room watches the match on the big screen.",
      // The Google Drive folder holding the photos from this night.
      driveFolder: "https://drive.google.com/drive/folders/1hOfEz1uHcPT0fx8Ca4Dv86bhcj7WMMsU",
    },
    {
      name: "Semi-final: England vs Argentina",
      note: "TODO",
      photo: "/champions/wa-semi-eng-arg.webp",
      photoAlt: "A packed watch-along crowd reacts to the match on screen.",
      driveFolder: "https://drive.google.com/drive/folders/1MFdyJn1AwLtSq_Flkg8PB_EqFX1a15CV",
    },
    {
      name: "Semi-final: Spain vs France",
      note: "TODO",
      photo: "/champions/wa-semi-esp-fra.webp",
      photoAlt: "Two fans celebrate with their arms up at the watch-along.",
      driveFolder: "https://drive.google.com/drive/folders/15y_x5dnOdsGQvmjPm0JaIqeLpoGWB5BM",
    },
    {
      name: "Norway vs England",
      note: "TODO",
      photo: "/champions/wa-norway-england.webp",
      photoAlt: "A fan cheers with both arms raised, phone in hand, mid-match.",
      driveFolder: "https://drive.google.com/drive/folders/1CZXXR7ZNFmPaOFudf8wDXNlPFlaKnxlh",
    },
    {
      // Not part of the same run of matches as the four above, but it is still
      // a night in front of a screen, so it belongs in this group.
      name: "UCL Final Night",
      note: "TODO",
      photo: "/champions/wa-ucl-final-night.webp",
      photoAlt: "Fans in red shirts cheer with their arms raised at the watch-along.",
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
    { name: "@drinkhypebam", logo: "/partners/hype-bam.svg", url: "TODO" },
    { name: "ThePapare", logo: "/partners/thepapare.png", url: "TODO" },
    { name: "@absystudios", logo: "/partners/absy-studios.png", url: "TODO" },
    { name: "@zone360.lk", logo: "TODO", url: "TODO" },
    { name: "@athlete360_sl", logo: "/partners/athlete-360.png", url: "TODO" },
  ],

  // ==========================================================================
  // LINKS - everywhere else Frontier lives, in the order they matter.
  //
  // Instagram is first because following Frontier there is the one thing we
  // want a visitor to do. Keep it first.
  //
  // The other three have no address yet. Leave them as TODO and they simply do
  // not appear on the site. Paste a real link in and that one shows up on its
  // own, in the order it sits in this list. Nothing else needs changing.
  // ==========================================================================
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
    // The Sofascore page carrying Frontier's results. Named in a post, but the
    // address itself was never written down.
    { name: "Sofascore", url: "TODO" },
    // The WhatsApp community invite link, if one exists.
    { name: "WhatsApp", url: "TODO" },
  ],
};
