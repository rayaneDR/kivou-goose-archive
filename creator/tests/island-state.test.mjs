import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
const {loadParent,saveParent}=createRequire(import.meta.url)('../../ui/creator/island-state.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'kivou-island-state-'));
const run=(id,status='completed',topic='Island notes')=>({id,status,workflow:'assistant',input:{topic,projectBrief:'Quick notes started from Kivou Island.'}});
const service=runs=>({root,listRuns:()=>runs,getRun:id=>{const r=runs.find(r=>r.id===id);if(!r)throw new Error('Missing');return r;}});
test('island persists a successful parent across a new service instance',()=>{
 const s=service([run('first')]);saveParent(s,'first');assert.equal(loadParent(service([run('first')])),'first');assert.equal(fs.readdirSync(root).filter(n=>n.endsWith('.tmp')).length,0);
});
test('cancelled, failed and unrelated notes never replace successful context',()=>{
 const s=service([run('cancelled','cancelled'),run('failed','failed'),run('other','completed','Other project'),run('first')]);
 assert.throws(()=>saveParent(s,'cancelled'),/completed/);assert.equal(loadParent(s),'first');
 fs.writeFileSync(path.join(root,'island-state.json'),JSON.stringify({parentRunId:'missing'}));assert.equal(loadParent(s),'first');
 fs.writeFileSync(path.join(root,'island-state.json'),'malformed');assert.equal(loadParent(service([run('other','completed','Other project')])) ,undefined);
});
