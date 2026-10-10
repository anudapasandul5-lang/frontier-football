from pathlib import Path
note = '''\n### 2026-10-07 - Ticket 2 scrapbook implemented and committed\n\nOwner approved refined mock: "go for it have a nice flow to it". Implemented and committed 4fb1876 on copy-v1 (seven files). Who We Are run-so-far record replaced with four tilted photo pins connected by string; oversized Bricolage, bone/ink, paper outlines, hover lift and GSAP reveal/photo drift. Second pin opens /who-we-are/4x4-series, six seasons chronologically with known facts only, existing album links and a return anchor. Ground Zero credit/watermark preserved. Reduced motion is static and JS-off content is server-rendered.\n\nVerification: 222 tests / 15 files pass, npx tsc --noEmit passes, production build 45 pages, placeholder gate clean (145 files). Both pages captured at 320/400/700/1440; no overflow or unloaded visible images. Tablet overlap corrected using fluid board height. Normal motion and keyboard checks at 400/1440 pass: all cards reveal, skipped cards reveal after anchor jumps, return navigation works, six album routes return 200, reduced-motion toggle restores static transforms, focus outline 3 px. Other pin destinations return 200. Final header wording matches approved All six seasons; count is checked against parsed facts.\n\nPreview http://localhost:4173/who-we-are#run-heading and /who-we-are/4x4-series (production export). Report docs/scrapbook-v1-review.md. Evidence .tmp/scrapbook-v1/production/: who/series/board-{320,400,700,1440}.png, flow-{400,1440}.png, audit.json, flow.json. Browser emulation only; physical devices not verified.\n\nConcurrent edits to Events, Community, Collaborate, globals, facts/tests and Our story were preserved outside this commit. Who We Are was staged by hunk to keep the independently edited Our story section uncommitted. QA used the shared working tree. Protected .mcp.json, t3-numbers-1440.png and skills-lock.json untouched. No push, merge or deploy. Ticket 2 complete locally.\n'''
vault=Path('C:/Users/anuda/OneDrive/Desktop/Obsidian/Claude Brain')
for relative in ['Projects/Frontier Football/STATUS.md','Sessions/log.md']:
    path=vault/relative
    text=path.read_text(encoding='utf-8')
    if text.startswith('---'):
        end=text.index('---',3)+3
        text=text[:end]+'\n'+note+text[end:]
    else:
        text=note+text
    path.write_text(text,encoding='utf-8')
handoff=Path('.tmp/scrapbook-v1/HANDOFF.md')
handoff.write_text(note+'\n---\nEarlier mock history:\n'+handoff.read_text(encoding='utf-8'),encoding='utf-8')
