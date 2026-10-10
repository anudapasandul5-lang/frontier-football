from pathlib import Path
import subprocess

def git(*args, **kwargs):
    return subprocess.check_output(['rtk', 'proxy', 'git', *args], **kwargs)

assert git('branch', '--show-current', text=True).strip() == 'copy-v1'
# Reproduce only our page edit against HEAD. The working copy also received
# an independent Our story redesign during this task; leave it in place and
# outside our commit.
program = Path('.tmp/scrapbook-v1/apply-page.py').read_text(encoding='utf-8')
program = program.replace("s = p.read_text(encoding='utf-8')", "s = subprocess.check_output(['rtk','proxy','git','show','HEAD:app/who-we-are/page.tsx'],text=True,encoding='utf-8')")
program = program.replace("p.write_text(s, encoding='utf-8')", 'expected = s')
namespace = {'subprocess': subprocess}
exec(program, namespace)
expected = namespace['expected']
working = Path('app/who-we-are/page.tsx').read_text(encoding='utf-8')
start = '      {/* Signed-off story copy'
end = '      <section data-tone="ink" data-chapter="The run so far"'
normalized = working[:working.index(start)] + expected[expected.index(start):expected.index(end)] + working[working.index(end):]
assert normalized == expected, 'Unexpected concurrent change outside Our story; inspect before staging.'
blob = git('hash-object', '-w', '--stdin', input=expected.encode('utf-8')).decode().strip()
git('update-index', '--cacheinfo', f'100644,{blob},app/who-we-are/page.tsx')
staged = set(git('diff', '--cached', '--name-only', text=True).splitlines())
wanted = {'app/who-we-are/page.tsx', 'app/who-we-are/4x4-series/page.tsx', 'components/motion/AboutMotion.tsx', 'components/pages/Scrapbook.tsx', 'components/pages/Scrapbook.module.css', 'components/pages/Scrapbook.test.tsx', 'docs/scrapbook-v1-review.md'}
assert staged == wanted, staged
print('Only seven scrapbook ticket files staged; concurrent story changes remain unstaged.')
