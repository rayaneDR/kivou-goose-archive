import {_electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','island-recovery-'+Date.now());
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
let app;
async function launch(){app=await _electron.launch({executablePath:path.resolve('out/Kivou-win32-x64/Kivou.exe'),args:[],env,timeout:60000});const page=await app.firstWindow();await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();assert.equal((await page.evaluate(()=>window.kivou.probe())).ready,true);let island;for(let i=0;i<60;i++){island=app.windows().find(w=>w.url().endsWith('island.html'));if(island)break;await new Promise(r=>setTimeout(r,200));}return {page,island};}
async function waitFor(page,id){const deadline=Date.now()+300000;while(Date.now()<deadline){const run=await page.evaluate(id=>window.kivou.run(id),id);if(run.status!=='running')return run;await new Promise(r=>setTimeout(r,500));}throw new Error('Recovery live test timed out.');}
try{
 const first=await launch();const initial=await first.island.evaluate(()=>window.island.ask({consent:true,message:'Remember our demonstration codeword AmberRiver935. Reply with that word only.'}));
 assert.equal((await waitFor(first.page,initial.id)).status,'completed');const pointer=JSON.parse(fs.readFileSync(path.join(profile,'creator','island-state.json'),'utf8'));assert.equal(pointer.parentRunId,initial.id);
 await app.close();app=null;
 const second=await launch();const cancelled=await second.island.evaluate(()=>window.island.ask({consent:true,message:'This turn will be cancelled before completion.'}));await second.island.evaluate(()=>window.island.cancel());assert.equal((await waitFor(second.page,cancelled.id)).status,'cancelled');
 const follow=await second.island.evaluate(()=>window.island.ask({consent:true,message:'What was our codeword before the cancelled turn? Reply with only that word.'}));const final=await waitFor(second.page,follow.id);assert.equal(final.status,'completed');assert.match(final.result.markdown,/AmberRiver935/);assert.equal(final.input.parentRunId,initial.id);assert.equal(final.conversationId,initial.id);
 const result={at:new Date().toISOString(),passed:true,scope:'actual packaged Kivou.exe',realModelCalls:2,fullQuitAndRelaunch:true,persistedParent:true,cancelledTurnPreserved:true,continuedFromLastSuccessfulTurn:true,recallVerified:true,input:'Original demonstration codeword; no client data'};fs.writeFileSync(path.join(qa,'island-recovery-live.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{if(app)await app.close();}
