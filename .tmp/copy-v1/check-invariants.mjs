import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import current from '../../content.js';
const oldSource=execFileSync('git',['show','main:content.js'],{encoding:'utf8'});
const before=(await import('data:text/javascript;base64,'+Buffer.from(oldSource).toString('base64'))).default;
assert.deepEqual(current.contact,before.contact);
assert.equal(current.league.teamMessage,before.league.teamMessage);
assert.equal(current.league.freeAgentMessage,before.league.freeAgentMessage);
assert.deepEqual(current.seasons,before.seasons);
assert.deepEqual(current.watchAlongs,before.watchAlongs);
assert.deepEqual(current.events,before.events);
assert.deepEqual(current.people,before.people);
assert.deepEqual(current.stats,before.stats);
assert.deepEqual(current.partners,before.partners);
for(let i=0;i<current.competitions.length;i++) {
  const {name,photoAlt,...now}=current.competitions[i];
  const {name:oldName,photoAlt:oldAlt,...old}=before.competitions[i];
  assert.deepEqual(now,old);
  assert.equal(name,i===0?'Ground Zero':oldName);
}
const result={pass:true,checks:['all WhatsApp drafts and contact data unchanged','album IDs, image paths and Drive URLs unchanged','seasons and recorded/unknown champions unchanged','watch-alongs, stats, partners, people and upcoming events unchanged']};
writeFileSync('.tmp/copy-v1/invariants.json',JSON.stringify(result,null,2));
console.log(result.checks.join('\n'));
