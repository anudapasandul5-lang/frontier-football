from pathlib import Path
note = '''\n### 2026-10-07 - Scrapbook mock refinement\n\nOwner said first mock was okay but asked for more visual impact matching the website. Refined static mock: oversized condensed Bricolage heading, larger photographs, removed board enclosure, offset paper outlines, fluid connecting string, stronger captions and hover lift (reduced-motion safe). Season grid now uses larger photos/type and open rows. Existing bone/ink, factual content and photo credits preserved. Desktop 1440 and mobile 400 inspected; all images load and no mobile overflow. Latest screenshots .tmp/scrapbook-v1/refined-{1440,400}.png; preview remains http://localhost:4173/__scrapbook-mock. Mock only; awaiting design approval under plan before implementation.\n'''
vault = Path('C:/Users/anuda/OneDrive/Desktop/Obsidian/Claude Brain')
for name in ['Projects/Frontier Football/STATUS.md', 'Sessions/log.md']:
    path = vault / name
    with path.open('a', encoding='utf-8') as file:
        file.write(note)
with Path('.tmp/scrapbook-v1/HANDOFF.md').open('a', encoding='utf-8') as file:
    file.write(note)
