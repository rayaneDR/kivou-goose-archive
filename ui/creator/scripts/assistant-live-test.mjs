import {captureIsland} from './capture-island.mjs';
import {_electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','assistant-live-'+Date.now());
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const packaged=process.env.KIVOU_PACKAGED_EXE;
const app=await _electron.launch({executablePath:packaged||path.resolve('node_modules/electron/dist/electron.exe'),args:packaged?[]:[path.resolve('.')],env,timeout:60000});
try{
 const page=await app.firstWindow();await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();
 const provider=await page.evaluate(()=>window.kivou.probe());assert.equal(provider.ready,true,provider.message);
 await page.reload();await page.getByLabel('Name your project').fill('Original launch study');await page.getByLabel('What should Kivou remember?').fill('Independent filmmakers. Calm, concise advice. This is a demonstration, not client work.');
 await page.getByLabel('Message Kivou').fill('Our private project codeword is IndigoQuartz482. Remember it. Suggest a concise three-point plan for an original 20-second video about organizing an editing desk.');
 await page.getByRole('checkbox').check();const start=Date.now();await page.getByRole('button',{name:'Send message',exact:true}).click();
 async function completed(count){const deadline=Date.now()+300000;while(Date.now()<deadline){const turns=await page.evaluate(()=>window.kivou.runs());const chats=turns.filter(r=>r.workflow==='assistant');if(chats.length>=count&&!chats.some(r=>r.status==='running')){assert.ok(chats.every(r=>r.status==='completed'),chats.find(r=>r.error)?.error);return chats.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));}await new Promise(r=>setTimeout(r,700));}throw new Error('Live assistant timed out.');}
 const first=await completed(1);assert.ok(first[0].result.markdown);
 await page.getByLabel('Message Kivou').fill('What was the exact project codeword in my previous message? Put only that word in your markdown answer.');await page.getByRole('button',{name:'Send message',exact:true}).click();
 const turns=await completed(2);assert.match(turns[1].result.markdown,/IndigoQuartz482/);assert.equal(turns[1].conversationId,turns[0].id);
 await page.reload();await page.getByRole('button',{name:'Original launch study',exact:true}).click();await page.locator('.answer-text').last().waitFor();assert.match(await page.locator('.answer-text').last().innerText(),/IndigoQuartz482/);
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(qa,'assistant-real-conversation.png'),fullPage:true});
 const island=app.windows().find(w=>w.url().endsWith('island.html'));assert.ok(island);const snapshot=await island.evaluate(()=>window.island.snapshot());assert.equal(snapshot.latest.id,turns[1].id);assert.equal(snapshot.latest.status,'completed');
 await island.getByRole('button',{name:/Your work is ready/}).click();await captureIsland(app,island,path.join(qa,'island-real-answer.png'));
 await page.getByRole('button',{name:'Make a content pack',exact:true}).last().click();await page.getByLabel('Your idea or transcript').waitFor();assert.match(await page.getByLabel('Your idea or transcript').inputValue(),/IndigoQuartz482/);
 await island.getByLabel('Ask Kivou').fill('Suggest one concise opening line for a fictional editing-desk video. Use only this idea, no tools.');
 await island.getByRole('checkbox').check();await island.getByRole('button',{name:'Send note',exact:true}).click();
 const islandActive=await island.evaluate(()=>window.island.snapshot());assert.ok(islandActive.active);assert.equal(islandActive.active.workflow,'assistant');
 const all=await completed(3);const islandTurn=all.find(r=>r.input.topic==='Island notes');assert.ok(islandTurn?.result.markdown);
 await captureIsland(app,island,path.join(qa,'island-real-answer.png'));
 const result={at:new Date().toISOString(),passed:true,scope:packaged?'actual packaged Kivou.exe':'development Electron',elapsedMs:Date.now()-start,realModelCalls:3,provider:'Goose v1.56.0 / Codex ACP / existing ChatGPT login',sameProject:true,secondTurnRecallsFirst:true,persistedAfterRendererReload:true,islandShowsActualResult:true,contentHandoff:true,directIslandMessage:true,runIds:all.map(r=>r.id),input:'Original synthetic project brief; real model responses, no mocked answers'};
 fs.writeFileSync(path.join(qa,'assistant-live.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await app.close();}
