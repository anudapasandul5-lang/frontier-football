from pathlib import Path
import subprocess

root = Path.cwd()
subprocess.run(['rtk', 'proxy', 'git', 'diff', '--check'], check=True)
subprocess.run(['rtk', 'proxy', 'git', 'add', '--', 'app/who-we-are/page.tsx'], check=True)
subprocess.run(['rtk', 'proxy', 'git', 'commit', '-m', 'Match story background and enlarge its paragraphs'], check=True)
commit = subprocess.check_output(['rtk', 'proxy', 'git', 'rev-parse', '--short', 'HEAD'], text=True).strip()
vault = Path('C:/Users/anuda/OneDrive/Desktop/Obsidian/Claude Brain')
note = f'''\n### 2026-10-07 - Who We Are story refinement; Ticket 2 authorized\n\nOwner requested Our story match the surrounding bone background and larger body text. Changed only app/who-we-are/page.tsx: bone canvas, ink label/quote, paragraphs responsive 18–22 px. Production build passes (44 pages); desktop 1440 and phone 400 screenshots inspected, phone text wraps within the frame. Local commit {commit} on copy-v1. Evidence: repo .tmp/copy-v1/our-story-bone-{{1440,400}}.png. No push/merge/deploy; protected files untouched.\n\nOwner then explicitly authorized starting Ticket 2 scrapbook board and clickable 4 × 4 Series season page. Reference supplied: four pins ordered Ground Zero, 4 x 4 Series, Watch Parties, Division 0 with connecting string. Plan still requires a static mock approved before implementation. Keep bone/ink and Bricolage/Geist; facts/unknown handling from content.js; album IDs and URLs unchanged.\n'''
for relative in ['Projects/Frontier Football/STATUS.md', 'Sessions/log.md']:
    path = vault / relative
    content = path.read_text(encoding='utf-8')
    if content.startswith('---'):
        end = content.index('---', 3) + 3
        content = content[:end] + '\n' + note + content[end:]
    else:
        content = note + content
    path.write_text(content, encoding='utf-8')
