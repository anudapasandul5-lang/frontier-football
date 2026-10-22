$ErrorActionPreference='Stop'
$taskVault='C:/Users/anuda/Desktop/Claude Brain'
$taskLock=Join-Path $taskVault 'agent-config/hooks/vault-lock.ps1'
& powershell -NoProfile -ExecutionPolicy Bypass -File $taskLock acquire 'Projects/Frontier Football/STATUS.md'
if($LASTEXITCODE -ne 0){throw 'Project status lock unavailable'}
try{
  $taskStatus=Join-Path $taskVault 'Projects/Frontier Football/STATUS.md'
  $taskText=[IO.File]::ReadAllText($taskStatus)
  $taskText=$taskText.Replace('last_updated: 2026-10-08','last_updated: 2026-10-14')
  $taskText=$taskText.Replace('## Decisions (read first)',"## Decisions (read first)`n`n- 2026-10-14: Home hero is reserved for video; photo selection applies below it and across inner pages. Local WebP exports from Drive and attached disk are approved (supersedes the Drive-IDs-only decision). Preserve originals, event identity and photographer marks/credit.`n- 2026-10-14: Prefer clean football frames for large editorial photos; restrict noisy watch-party originals to restrained complete-frame displays. Apply selected photos locally; no publication performed.")
  $taskText=$taskText.Replace('- Photos stay on Google Drive; the repo stores only IDs.','- Source originals stay on Drive/disk; the site uses local reviewed exports (2026-10-14).')
  [IO.File]::WriteAllText($taskStatus,$taskText,[Text.UTF8Encoding]::new($false))
}finally{& powershell -NoProfile -ExecutionPolicy Bypass -File $taskLock release 'Projects/Frontier Football/STATUS.md' | Out-Null}
& powershell -NoProfile -ExecutionPolicy Bypass -File $taskLock acquire 'wiki/hot.md'
if($LASTEXITCODE -ne 0){throw 'Hot cache lock unavailable'}
try{
  $taskHot=Join-Path $taskVault 'wiki/hot.md'
  $taskText=[IO.File]::ReadAllText($taskHot).Replace('Last refreshed: **2026-10-13**','Last refreshed: **2026-10-14**')
  $taskText=$taskText.Replace('- **Frontier Football**: photo picks on branch `pictures` with a preview; real-phone check pending. Repo not on this PC. [[Projects/Frontier Football/STATUS]]','- **Frontier Football**: reviewed photo replacements applied locally on `photo-selection-2026-10-14`; build and 224 tests pass. Home hero stays video. Actual browser layout/performance review pending because local preview permission was declined. Repo: `C:\Users\anuda\orca\frontier-football`. No commit/push/deployment. [[Projects/Frontier Football/STATUS]]')
  [IO.File]::WriteAllText($taskHot,$taskText,[Text.UTF8Encoding]::new($false))
}finally{& powershell -NoProfile -ExecutionPolicy Bypass -File $taskLock release 'wiki/hot.md' | Out-Null}
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $taskVault 'agent-config/hooks/commit.ps1') 'Record Frontier reviewed photo application' 'Projects/Frontier Football/STATUS.md' 'wiki/hot.md'
