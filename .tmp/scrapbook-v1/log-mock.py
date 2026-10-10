from pathlib import Path
vault = Path('C:/Users/anuda/OneDrive/Desktop/Obsidian/Claude Brain')
note = '''\n### 2026-10-07 - Ticket 2 static mock ready for approval\n\nCreated a local static scrapbook/season-grid mock using existing content.js photos and facts. Four numbered tilted photo pins follow the reference order and connect with an ink string; bone/ink palette and current type preserved. Ground Zero watermark and credit retained; unknown dates/champions omitted. All six season cards reuse existing album IDs. Desktop 1440 and phone 400 inspected; all images load and no phone overflow. Fixed desktop bottom clearance and phone pin overlap. No implementation in app/ yet.\n\nPreview http://localhost:4173/__scrapbook-mock; generated out/ file is temporary and disappears on build. Mock sources/screenshots and next-step handoff in repo .tmp/scrapbook-v1/, regeneration helper .tmp/copy-v1/scrapbook-mock.py. Await owner mock approval, required by the signed-off plan, before Ticket 2 implementation. Story refinement already committed as 3925d7b; protected files unchanged.\n'''
for relative in ['Projects/Frontier Football/STATUS.md', 'Sessions/log.md']:
    path = vault / relative
    content = path.read_text(encoding='utf-8')
    if content.startswith('---'):
        end = content.index('---', 3) + 3
        content = content[:end] + '\n' + note + content[end:]
    else:
        content = note + content
    path.write_text(content, encoding='utf-8')
