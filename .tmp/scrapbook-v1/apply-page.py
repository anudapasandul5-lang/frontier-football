from pathlib import Path
p = Path('app/who-we-are/page.tsx')
s = p.read_text(encoding='utf-8')
s = s.replace('import { Fragment } from "react";\n', '')
s = s.replace('import { journey, parseContent, people }', 'import { parseContent, people }')
s = s.replace('import { AboutMotion }', 'import { Scrapbook } from "@/components/pages/Scrapbook";\nimport { AboutMotion }', 1)
start = s.index('type Stop = ')
end = s.index('export default function WhoWeAre()')
s = s[:start] + 'const h2 = "font-display text-[clamp(2.125rem,5.4vw,5.25rem)] leading-[0.9] font-bold uppercase";\n\n' + s[end:]
start = s.index('  const stops = ')
end = s.index('  const crew = ')
s = s[:start] + s[end:]
start = s.index('      <section data-tone="ink" data-chapter="The run so far"')
end = s.index('\n      {/* Absent while', start)
s = s[:start] + '''      <section data-tone="ink" data-chapter="The run so far" aria-labelledby="run-heading" className="overflow-x-clip py-[clamp(4rem,12vh,8rem)]">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-12">
          <SplitReveal id="run-heading" lines={["The run", "so far"]} className="max-w-[850px] scroll-mt-24 font-display text-[clamp(4.5rem,12vw,10.625rem)] leading-[0.86] font-bold uppercase" />
          <Scrapbook data={data} />
        </div>
      </section>
''' + s[end:]
p.write_text(s, encoding='utf-8')
