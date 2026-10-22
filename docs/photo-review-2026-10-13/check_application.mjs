import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import sharp from 'sharp';
const root=resolve(import.meta.dirname,'../..');
const records=JSON.parse(await readFile(resolve(root,'docs/photo-selection-2026-10-14.json'),'utf8'));
const variants=JSON.parse(await readFile(resolve(root,'lib/phone-variants.json'),'utf8'));
let count=0,bytes=0;
for(const r of records){
  const file=resolve(root,'public','.'+r.src);
  const meta=await sharp(file).metadata();
  assert.equal(meta.width,r.w,r.src);assert.equal(meta.height,r.h,r.src);
  assert.ok(meta.width<=r.sourceWidth&&meta.height<=r.sourceHeight,`No source enlargement: ${r.src}`);
  bytes+=(await stat(file)).size;count++;
  for(const w of (variants[r.src]??[]).slice(0,-1)){
    const variant=file.replace(/\.webp$/,`-${w}.webp`);
    assert.equal((await sharp(variant).metadata()).width,w,variant);
    assert.ok((await stat(variant)).mtimeMs>=(await stat(file)).mtimeMs,`Stale variant: ${variant}`);
    count++;
  }
}
console.log(`${records.length} selected assets and ${count-records.length} responsive copies decode, match dimensions and are not upscaled. Main selected exports: ${(bytes/1e6).toFixed(2)} MB.`);
