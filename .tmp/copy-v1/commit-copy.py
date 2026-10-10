from pathlib import Path
import subprocess, hashlib, json
def git(*args): return subprocess.check_output(['git',*args],text=True,encoding='utf-8').strip()
assert git('branch','--show-current')=='copy-v1'
assert not git('diff','--cached','--name-only'), 'Existing staged work must be preserved'
protected=['.mcp.json','t3-numbers-1440.png','skills-lock.json']
hashes={f:hashlib.sha256(Path(f).read_bytes()).hexdigest() for f in protected}
files=[
 'app/collaborate/page.tsx','app/community/page.tsx','app/contact/page.tsx','app/events/page.tsx','app/gallery/page.tsx','app/globals.css','app/layout.tsx','app/not-found.tsx','app/who-we-are/page.tsx',
 'components/acts/Closing.tsx','components/acts/CommunityTeaser.tsx','components/acts/Competitions.tsx','components/acts/Events.test.tsx','components/acts/Events.tsx','components/acts/Hero.tsx','components/acts/Numbers.tsx','components/acts/Partners.tsx','components/acts/WhoWeAre.tsx','components/motion/MomentMotionRuntime.tsx','components/pages/ContactRoutes.tsx',
 'content.js','lib/community.test.ts','lib/community.ts','lib/content-data.ts','lib/og.tsx','docs/copy-v1-review.md',
]
assert set(git('diff','--name-only').splitlines())-set(protected)<=set(files)
subprocess.run(['git','add','--',*files],check=True)
staged=git('diff','--cached','--name-only').splitlines()
assert set(staged)==set(files)
assert not set(staged)&set(protected)
subprocess.run(['git','diff','--cached','--check'],check=True)
subprocess.run(['git','commit','-m','Apply signed-off Ticket 1 website copy'],check=True)
assert hashes=={f:hashlib.sha256(Path(f).read_bytes()).hexdigest() for f in protected}
result={'branch':git('branch','--show-current'),'commit':git('rev-parse','HEAD'),'files':staged,'protectedHashes':hashes}
Path('.tmp/copy-v1/commit-result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'branch':result['branch'],'commit':result['commit'],'files':len(staged),'protectedFilesUnchanged':True}))
