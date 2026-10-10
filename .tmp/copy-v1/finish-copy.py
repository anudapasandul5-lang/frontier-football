from pathlib import Path

def edit(file, old, new):
    p=Path(file); s=p.read_text(encoding='utf-8'); assert old in s,(file,old); p.write_text(s.replace(old,new),encoding='utf-8')

p=Path('app/events/page.tsx'); s=p.read_text(encoding='utf-8')
start=s.index('const FACTS = ['); end=s.index('const recorded =',start); s=s[:start]+s[end:]
s=s.replace('lines={["Come and", "play."]}', 'lines={["Join the", "action."]}')
start=s.index('              <a href="#results-heading"'); end=s.index('\n            </>',start)
s=s[:start]+'''              {nights.length > 0 ? (
                <a href="#join" className={`${heroButton} bg-yellow text-ink`}>
                  <Roll>Join us</Roll>
                </a>
              ) : null}
              {results.length > 0 ? (
                <a href="#hall-of-fame" className={`${heroButton} border-2 border-bone hover:bg-bone hover:text-ink`}>
                  <Roll>Hall of Fame</Roll>
                </a>
              ) : null}'''+s[end:]
s=s.replace('Frontier runs every week, and there is usually something bigger on the way. Here is when we play and what is\n          coming up.', 'Frontier runs every week, and something bigger is usually on the way. Here is when we play and what is coming up.')
start=s.index('      {results.length > 0 ? (',s.index('      <PhotoStrip')); end=s.index('      {nights.length > 0 ? (',start)
results=s[start:end]; s=s[:start]+s[end:]
results=results.replace('data-chapter="Results"','id="hall-of-fame" data-chapter="Hall of Fame"').replace('lines={["Every result."]}', 'lines={["Hall of Fame"]}')
results=results.replace('          <ResultsTable', '          <p className="mb-8 max-w-[58ch] text-lg leading-relaxed">The winners of every Frontier event, and the stats behind them.</p>\n          <ResultsTable')
s=s.replace('data-chapter="Every week"', 'id="join" data-chapter="Join us"').replace('            Every week\n','            Join us\n')
start=s.index('          <ul className="grid'); end=s.index('          {askHref ?',start)
s=s[:start]+'''          <p className="max-w-[58ch] text-lg leading-relaxed">{raw.league.sessionLine}</p>
'''+s[end:]
s=s.replace('      <NextPage current="/events" />',results+'      <NextPage current="/events" />')
p.write_text(s,encoding='utf-8')

# Text-only event stories; no collage or new component.
edit('content.js', '  aboutIntro:', '''  communityStories: [
    { name: "Ground Zero", body: "It all began here. One night on turf in Colombo, in 2024. Players came with something to prove, the crowd came to see it, and nobody who was there forgot it. Every Frontier night since traces back to this one." },
    { name: "4 x 4 Series", body: "Six seasons. One venue. The same turf, new rivalries every season, and a place that started to feel like home. Every season added more faces, more goals and more stories worth telling." },
    { name: "Watch Parties", body: "The big games hit different when you watch them together. Strangers turned into friends, every goal got a roar, and every heartbreak was shared by the whole room." },
    { name: "Division 0", body: "Football without the grass. Controllers in hand, Division 0 gave the game another pitch. The pride was the same, the bragging rights were the same and so was the love of the game." },
  ],
  aboutIntro:''')
edit('app/community/page.tsx', 'import { PastActivities } from "@/components/pages/PastActivities";', 'import { SplitReveal } from "@/components/primitives/SplitReveal";')
edit('app/community/page.tsx', '      <PastActivities />', '''      <section data-tone="ink" data-chapter="Every event we have done" aria-labelledby="past-heading" className="frame py-[clamp(4rem,12vh,8rem)]">
        <SplitReveal id="past-heading" lines={["Every event we have done"]} className="mb-10 font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.88] font-bold uppercase" />
        <ol className="border-t-2 border-ink">
          {raw.communityStories.map((story) => (
            <li key={story.name} className="grid gap-6 border-b border-ink/20 py-7 sm:grid-cols-2 sm:gap-8">
              <h3 className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.75rem)] leading-none font-bold uppercase">{story.name}</h3>
              <p className="max-w-[58ch] text-lg leading-relaxed">{story.body}</p>
            </li>
          ))}
        </ol>
      </section>''')

# Current facts supersede the old notes, without changing historical records.
edit('content.js', '// 2026-09-24. The albumId below keeps the old spelling so URLs hold.', '// 2026-09-24, then Ground Zero on 2026-10-07. The albumId stays unchanged.')
edit('content.js', '// 7-10pm, venue changes week to week. Format and price to follow from the', '// 7-10pm. On 2026-10-07 the owner confirmed Club Fusion, Borella. Format and price to follow from the')
