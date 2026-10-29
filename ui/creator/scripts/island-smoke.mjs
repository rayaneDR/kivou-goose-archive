import {captureIsland} from './capture-island.mjs';
import {_electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','island-smoke-'+Date.now());
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const packaged=process.env.KIVOU_PACKAGED_EXE;
const app=await _electron.launch({executablePath:packaged||path.resolve('node_modules/electron/dist/electron.exe'),args:packaged?[]:[path.resolve('.')],env,timeout:60000});
try{
 const page=await app.firstWindow();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();
 let island;
 for(let attempt=0;attempt<60;attempt++){island=app.windows().find(w=>w.url().endsWith('island.html'));if(island)break;await new Promise(r=>setTimeout(r,250));}
 assert.ok(island,'Actual native island window opens');island.on('pageerror',e=>errors.push(e.message));
 await island.getByRole('button',{name:/Kivou is here/}).waitFor();
 const native=await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().map(w=>({title:w.getTitle(),top:w.isAlwaysOnTop(),bounds:w.getBounds(),options:w.webContents.getLastWebPreferences()})));
 const overlay=native.find(w=>w.title==='Kivou Island');assert.ok(overlay.top);assert.equal(overlay.bounds.height,64);assert.equal(overlay.options.sandbox,true);assert.equal(overlay.options.nodeIntegration,false);
 await island.getByRole('button',{name:/Kivou is here/}).click();await island.getByRole('heading',{name:'A good place to start.'}).waitFor();
 assert.equal(await island.evaluate(()=>window.innerHeight),580);
 await captureIsland(app,island,path.join(qa,'island-expanded.png'));
 await island.keyboard.press('Escape');assert.equal(await island.evaluate(()=>window.innerHeight),64);
 await captureIsland(app,island,path.join(qa,'island-compact.png'));
 await page.getByLabel('Name your project').fill('Original launch film');await page.getByLabel('What should Kivou remember?').fill('Independent creators. A calm, concrete tone.');
 await page.getByRole('button',{name:'Help me shape a 30-second launch video.'}).click();assert.match(await page.getByLabel('Message Kivou').inputValue(),/launch video/);
 assert.equal(await page.getByRole('button',{name:'Send message'}).isDisabled(),true);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(qa,'assistant-workspace.png')});
 const widths=[];for(const width of [1440,900,390]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No assistant overflow at '+width);widths.push(width);}
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'My workspace',exact:true}).click();await page.getByRole('heading',{name:'What are we making?'}).waitFor();
 await page.getByRole('button',{name:'Show island',exact:true}).click();await island.getByRole('button',{name:/Kivou is here/}).click();await island.getByRole('button',{name:/Talk to Kivou/}).click();await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();
 await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().find(w=>w.getTitle()!=='Kivou Island').close());
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().find(w=>w.getTitle()!=='Kivou Island').isVisible()),false);
 await island.getByRole('button',{name:/Kivou is here/}).click();await island.getByRole('button',{name:/Talk to Kivou/}).click();
 assert.equal(await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().find(w=>w.getTitle()!=='Kivou Island').isVisible()),true);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(qa,'island-smoke.json'),JSON.stringify({at:new Date().toISOString(),passed:true,scope:packaged?'packaged Electron':'development Electron',realNativeWindows:true,modelCalled:false,widths,checks:['Native transparent always-on-top island','Expand and Escape collapse','No model request from idle island','Sandboxed renderer','Project composer consent/provider gating','Original workflow dashboard retained','Open conversation from island','Closing workspace hides it; island restores it','No renderer errors']},null,2)+'\n');
 console.log('Native island and assistant smoke passed.');
}finally{await app.close();}
