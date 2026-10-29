import {_electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {captureIsland} from './capture-island.mjs';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','island-constrained-'+Date.now());const id=crypto.randomUUID();const folder=path.join(profile,'creator','runs',id);fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync(path.join(folder,'state.json'),JSON.stringify({id,conversationId:id,workflow:'assistant',title:'Long failure example',input:{topic:'Long failure example',message:'Synthetic stress fixture.',projectBrief:''},status:'failed',error:'A deliberately long synthetic failure message. '.repeat(100),progress:'Interrupted',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),files:[],result:{title:'Partial response',markdown:'Long synthetic partial response. '.repeat(100),nextSteps:[]}}));
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const app=await _electron.launch({executablePath:path.resolve('out/Kivou-win32-x64/Kivou.exe'),args:[],env,timeout:60000});
try{
 const page=await app.firstWindow();await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();let island;for(let i=0;i<60;i++){island=app.windows().find(w=>w.url().endsWith('island.html'));if(island)break;await new Promise(r=>setTimeout(r,200));}
 await app.evaluate(({screen})=>{const original=screen.getDisplayNearestPoint.bind(screen);screen.getDisplayNearestPoint=point=>{const display=original(point);return {...display,workArea:{...display.workArea,height:480}};};});
 await island.getByRole('button',{name:/Kivou needs your attention/}).click();assert.equal(await island.evaluate(()=>innerHeight),456);
 const scroll=await island.locator('#expanded').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight}));assert.ok(scroll.scroll>scroll.client);
 await island.getByRole('button',{name:'Hide island',exact:true}).scrollIntoViewIfNeeded();await captureIsland(app,island,path.join(qa,'island-constrained.png'));await island.getByRole('button',{name:'Hide island',exact:true}).click();
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().find(w=>w.getTitle()==='Kivou Island').isVisible()),false);
 const result={at:new Date().toISOString(),passed:true,scope:'actual packaged app with synthetic work-area and long-content fixtures',workAreaHeight:480,nativeHeight:456,scrollable:true,footerReached:true,hideControlWorked:true,modelCalled:false};fs.writeFileSync(path.join(qa,'island-constrained.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await app.close();}
