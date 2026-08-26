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
    },
  ],
};
