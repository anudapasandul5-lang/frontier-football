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
      driveFolder: "TODO",
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
      driveFolder: "TODO",
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
      driveFolder: "TODO",
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
      photo: "TODO",
      photoAlt: "TODO",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 2 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "TODO",
    },
    {
      season: 1,
      champion: "TODO",
      note: "TODO",
      runnerUp: "TODO",
      goldenBoot: "TODO",
      goldenGlove: "TODO",
      photo: "TODO",
      photoAlt: "TODO",
      // Link to this season's full photo folder on Google Drive. Paste the
      // folder's share link here and a card for SZN 1 appears on the photos
      // page with a working button. Leave it as "TODO" and the card still shows,
      // saying the photos are on the way.
      driveFolder: "TODO",
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
      driveFolder: "TODO",
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
      name: "World Cup",
      // A short line under the name. The month, or which matches it covered.
      note: "TODO",
      // A picture from the night. Put the file in the public/champions/ folder
      // and write its name here, the same way the champion photos work.
      photo: "TODO",
      photoAlt: "TODO",
      // The Google Drive folder holding every photo from the watch-alongs.
      driveFolder: "TODO",
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
  // WHERE THESE CAME FROM
  //   Every one is a real photograph or a real clip from Frontier's Instagram.
  //   Posters and announcement graphics were deliberately left out: they carry
  //   their own lettering and their own colours, which fight the site's. Four
  //   otherwise good photographs were dropped because a Frontier badge is
  //   burned into the corner of the picture. Two more were dropped because
  //   ThePapare's photographer's copyright notice is printed across them, and
  //   that is not ours to crop off. See docs/HOUSE-RULES.md.
  // ==========================================================================
  gallery: [
    {
      src: "/gallery/01.webp",
      alt: "A player slides in to challenge for the ball on a fenced turf pitch.",
      width: 1080,
      height: 782,
    },
    {
      src: "/gallery/02.webp",
      alt: "A player in a training bib sits at the side of the pitch, watching the game.",
      width: 675,
      height: 1200,
    },
    {
      // A clip. `poster` is the still that shows until someone opens it.
      src: "/gallery/03.mp4",
      poster: "/gallery/03.webp",
      alt: "A player rests a boot on the ball beside a training cone under floodlights.",
      width: 1200,
      height: 678,
    },
    {
      src: "/gallery/04.webp",
      alt: "A crowd watching a match together on a screen indoors.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/05.webp",
      alt: "A packed room of people watching a match on a big screen.",
      width: 1080,
      height: 721,
    },
    {
      src: "/gallery/06.webp",
      alt: "A player with both hands on their head during a game, lit from behind.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/07.webp",
      alt: "A player in a 4x4 Series shirt, photographed close up.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/08.webp",
      alt: "Players on a floodlit pitch at night, seen from the far end.",
      width: 1080,
      height: 720,
    },
    {
      src: "/gallery/09.webp",
      alt: "Two people hold up a football shirt beside a pitch.",
      width: 640,
      height: 1136,
    },
    {
      src: "/gallery/10.mp4",
      poster: "/gallery/10.webp",
      alt: "Two players compete for the ball during a game.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/11.webp",
      alt: "Two spectators watching the game closely from the sideline.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/12.webp",
      alt: "A player strikes a ball on a paved promenade lined with palm trees.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/13.webp",
      alt: "A person in a Sri Lanka jacket, photographed in low light.",
      width: 720,
      height: 406,
    },
    {
      src: "/gallery/14.webp",
      alt: "Players celebrating together after a game, one lifted on another's back.",
      width: 675,
      height: 1200,
    },
    {
      src: "/gallery/15.webp",
      alt: "A host speaks into a microphone beside a player at a pitch-side stand.",
      width: 675,
      height: 1200,
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
  // TO ADD A PARTNER: copy a { ... } line and change the name.
  // TO REMOVE ONE: delete its line.
  // ==========================================================================
  partners: [
    { name: "@main.sportsbar", logo: "TODO", url: "TODO" },
    { name: "@address.lk", logo: "TODO", url: "TODO" },
    { name: "@iodexsrilanka", logo: "TODO", url: "TODO" },
    { name: "@nutrimax.iso", logo: "TODO", url: "TODO" },
    { name: "Sofascore", logo: "TODO", url: "TODO" },
    { name: "@shirtshack.lk", logo: "TODO", url: "TODO" },
    { name: "@drinkhypebam", logo: "TODO", url: "TODO" },
    { name: "ThePapare", logo: "TODO", url: "TODO" },
    { name: "@absystudios", logo: "TODO", url: "TODO" },
    { name: "@zone360.lk", logo: "TODO", url: "TODO" },
    { name: "@athlete360_sl", logo: "TODO", url: "TODO" },
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
    // Frontier's TikTok. Nobody has given us the address yet. Add the @name
    // as the handle when you add the link.
    { name: "TikTok", handle: "TODO", url: "TODO" },
    // The Sofascore page carrying Frontier's results. Named in a post, but the
    // address itself was never written down.
    { name: "Sofascore", url: "TODO" },
    // The WhatsApp community invite link, if one exists.
    { name: "WhatsApp", url: "TODO" },
  ],
};
