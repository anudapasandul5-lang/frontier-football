from pathlib import Path

def edit(file, old, new):
    p = Path(file)
    text = p.read_text(encoding='utf-8')
    assert old in text, (file, old)
    p.write_text(text.replace(old, new), encoding='utf-8')

# Display name only: album identities and URLs remain unchanged.
for file in ['content.js', 'app/who-we-are/page.tsx', 'components/acts/Numbers.tsx', 'components/acts/Competitions.tsx']:
    edit(file, 'Frontier Football Tournament', 'Ground Zero')

edit('components/acts/WhoWeAre.tsx', 'A main stage for Sri Lanka’s football community.', 'A platform for Sri Lanka’s football community.')
edit('components/acts/WhoWeAre.tsx', 'Built to spotlight talent and unite everyone who shares a passion for the game.', 'A place for players, fans and brands to show up, get seen and be part of something bigger than the final whistle.')
edit('components/acts/Numbers.tsx', 'lines={["Counted", "so far."]}', 'lines={["Milestones."]}')
edit('components/acts/Numbers.tsx', 'It started with the Ground Zero. Six seasons of the 4 x 4 Series have run since, and the big\n                games get watched together.', '{raw.milestones}')
edit('content.js', '  seasons: [', '  milestones: "It started with Ground Zero, one night on turf in Colombo. Then came Turf Wars, the 4 x 4 Series, watch parties and Division 0, our FC 26 tournament. Every one added another chapter. The numbers below show how far it has come.",\n  aboutIntro: "Frontier Football started in Colombo in 2024 with one night on turf and a simple dream: Sri Lankan football deserves the biggest stage. Two years in, it is a large, growing community.",\n\n  seasons: [')
edit('components/acts/CommunityTeaser.tsx', '''          <SplitReveal
            as="p"
            lines={["Sunday", "League."]}
            step={80}
            className="community-mark font-display leading-[0.8] font-bold uppercase"
          />
''', '')
edit('components/acts/CommunityTeaser.tsx', 'Bring a team or come alone as a free agent. Sundays, with Frontier.', 'Bring your team, or come alone and find one. Every Sunday, there is a place for you with Frontier.')
edit('components/acts/CommunityTeaser.tsx', 'See the league', 'See how to join')
edit('components/acts/Closing.tsx', 'Small-sided football and the culture around it, in Colombo.', 'Small-sided football and the culture around it, from the heart of Sri Lanka.')
edit('components/acts/Partners.tsx', 'parseContent, partners, stats', 'parseContent, partners')
edit('components/acts/Partners.tsx', 'import { CountUpFigure } from "@/components/motion/CountUpFigure";\n', '')
edit('components/acts/Partners.tsx', '  const count = stats(data).find((s) => s.label === "Partners");\n', '')
p=Path('components/acts/Partners.tsx'); s=p.read_text(encoding='utf-8'); start=s.index('          {count ? ('); end=s.index('\n        </h2>',start); s=s[:start]+s[end:]; p.write_text(s,encoding='utf-8')

edit('app/who-we-are/page.tsx', 'Since the Ground Zero', 'Since Ground Zero')
edit('app/who-we-are/page.tsx', 'Frontier started in Colombo in 2024 so small sided football here had somewhere to happen. It began with one\n          night on turf and it is six seasons deep now.', '{raw.aboutIntro}')
edit('app/who-we-are/page.tsx', 'A main stage.', 'A platform.')
edit('app/who-we-are/page.tsx', "Frontier Football has evolved into a main stage for Sri Lanka&apos;s football community, built to spotlight talent and\n            unite everyone who shares a passion for the game.", 'Frontier Football is a platform for Sri Lanka’s football community. We spotlight talent and bring together everyone who loves the game.')
edit('app/who-we-are/page.tsx', 'Our mission is to create a space where players can shine, get recognised, and grow their presence within a\n            community that goes beyond casual play. Through tournaments, collaborations and engaging digital content,\n            Frontier Football has grown into a platform where football culture and brands naturally align.', 'We build the space where players shine, get recognised and grow, in a community that goes well beyond casual play. Through tournaments, collaborations and digital content, football culture and brands meet here.')
edit('app/who-we-are/page.tsx', '''          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed">
            The Ground Zero first, then the 4x4 Series, with the watch parties running alongside it. Where a champion, a month or
            a venue is missing, nobody has written it down yet.
          </p>
''', '')

edit('app/community/page.tsx', 'lines={["Play with", "Frontier."]}', 'lines={["More than", "a game."]}')
edit('app/community/page.tsx', 'Every format Frontier has run, and the league you can join now.', 'Your next game starts here. Join the league.')
edit('lib/community.ts', 'label: "Register a team"', 'label: "Register team"')
edit('lib/community.ts', 'label: "Join as a free agent"', 'label: "Join solo player"')
edit('lib/community.test.ts', '"Register a team"', '"Register team"')
edit('lib/community.test.ts', '"Join as a free agent"', '"Join solo player"')

edit('app/collaborate/page.tsx', 'parseContent, partners, reach, stats', 'parseContent, partners, reach')
edit('app/collaborate/page.tsx', '  const count = stats(data).find((s) => s.label === "Partners");\n', '')
edit('app/collaborate/page.tsx', 'Frontier runs small-sided football in Colombo and the culture that comes with it. Here is who sees it, what a\n          partner gets, and who is already standing alongside us.', 'Frontier brings together football, community and culture in Colombo. See who we reach, how partners can get involved, and who is already with us.')
p=Path('app/collaborate/page.tsx'); s=p.read_text(encoding='utf-8'); start=s.index('            <SplitReveal\n              id="partners-heading"'); end=s.index('            <Marquee',start); s=s[:start]+s[end:]; s=s.replace('<p className="micro mb-4">Already alongside us</p>','<h2 id="partners-heading" className="micro mb-4">Already alongside us</h2>'); p.write_text(s,encoding='utf-8')
edit('app/collaborate/page.tsx', 'One message is all it takes to start.', 'One message is all it takes.')
offers = {
 'Reach a focused football audience through live event exposure and consistent digital content reach.': 'Put your brand in front of a focused football audience, live at our events and every day through our content.',
 'Align your brand with a growing football movement built on passion, culture and community.': 'Stand with a growing football movement built on passion, culture and community.',
 'Activate your brand your way, through tailored on-ground presence and digital storytelling.': 'Show up your way: on the ground at our events, or through stories we tell together online.',
 'Place your product directly into the hands of players and fans for real-world brand impact.': 'Get your product into the hands of players and fans, where it counts.',
 'Gain strong on-site branding, event mentions and dedicated social content that keeps your brand visible beyond match day.': 'Strong on-site branding, event mentions and dedicated social content, so your brand stays visible well past match day.',
}
for old,new in offers.items(): edit('content.js',old,new)
edit('content.js', '{ label: "When", value: "TODO" }', '{ label: "When", value: "Every Sunday, 7 pm to 10 pm" }')
edit('content.js', '{ label: "Where", value: "TODO" }', '{ label: "Where", value: "Club Fusion, Borella" }')
edit('content.js', 'time: "7pm - 10pm"', 'time: "7 pm to 10 pm"')
edit('content.js', 'venue: "Changes each week"', 'venue: "Club Fusion, Borella"')
edit('content.js', '  league: {', '  league: {\n    sessionLine: "Every Sunday, 7 pm to 10 pm, at Club Fusion, Borella. Community sessions, open to everyone.",')

edit('app/contact/page.tsx', 'For Sunday League,{" "}', 'Playing Sunday League?{" "}')
edit('app/contact/page.tsx', 'register a team or join as a free agent', 'Register team or join solo player')
edit('app/contact/page.tsx', '. Brands: see{" "}', '. Brands, head to{" "}')
edit('app/not-found.tsx', 'or the link is wrong.', 'or the link is off.')
edit('app/gallery/page.tsx', 'function Reel({ albums, total }: { albums: number; total: number })', 'function Reel()')
edit('app/gallery/page.tsx', 'lines={["What it", "feels like."]}', 'lines={["The experience."]}')
edit('app/gallery/page.tsx', '{n(albums)} albums and {n(total)} photographs from every Frontier night, on the pitch and in front of the screen.', 'What it feels like.')
edit('app/gallery/page.tsx', '  const albums = chapters.flatMap((c) => c.albums);\n  const total = albums.reduce((s, a) => s + a.count, 0);\n', '')
edit('app/gallery/page.tsx', '<Reel albums={albums.length} total={total} />', '<Reel />')
edit('app/layout.tsx', 'Small-sided football and the culture around it, in Colombo.', 'Frontier Football is Sri Lanka’s football community. Tournaments, Sunday League and the culture around the game, in Colombo.')

edit('components/acts/Events.tsx', 'Next up.', 'Our events')
edit('components/acts/Events.tsx', '        <ResultsTable', '        <p className="max-w-[58ch] text-lg leading-relaxed">Watch parties, game nights, community sessions and our football events. See what is coming up and be there.</p>\n        <ResultsTable')

# Existing home event presentation, extended by one row.
edit('components/acts/Competitions.tsx', 'blue Frontier Football\n   Tournament', 'blue Ground Zero')
edit('components/acts/Competitions.tsx', '"blue" | "green" | "red"', '"blue" | "green" | "red" | "yellow"')
edit('components/acts/Competitions.tsx', '  red: "hover:bg-red focus-visible:bg-red",', '  red: "hover:bg-red focus-visible:bg-red",\n  yellow: "hover:bg-yellow focus-visible:bg-yellow",')
edit('components/acts/Competitions.tsx', 'Where it began', 'Where it all began.')
edit('components/acts/Competitions.tsx', 'Six seasons. One venue.', 'Six seasons. One venue. A new standard.')
edit('components/acts/Competitions.tsx', 'Played on PS5.', 'Played on the virtual pitch.')
edit('components/acts/Competitions.tsx', '  const shot =', '''  const party = data.watchAlongs.find((event) => event.photo?.startsWith("/champions/wa-"));
  if (party)
    rows.push({
      tone: "yellow",
      name: "Watch Parties",
      line: "The big games, watched together.",
      photo: { src: party.photo!, alt: party.photoAlt ?? "" },
    });

  const shot =''')
edit('components/acts/Competitions.tsx', '          Competitions\n', '          Events\n')
edit('app/globals.css', '''  .comp:has(.comp__item[data-i="2"]:is(:hover, :focus-visible)) .comp__stage figure[data-i="2"] {''', '''  .comp:has(.comp__item[data-i="2"]:is(:hover, :focus-visible)) .comp__stage figure[data-i="2"],
  .comp:has(.comp__item[data-i="3"]:is(:hover, :focus-visible)) .comp__stage figure[data-i="3"] {''')
