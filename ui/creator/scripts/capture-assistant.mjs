import {_electron} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {captureIsland} from './capture-island.mjs';
const qa=path.resolve('../../qa');const review=path.resolve('../../.impeccable/review/island');fs.mkdirSync(review,{recursive:true});
const candidates=fs.readdirSync(path.join(qa,'private')).filter(n=>n.startsWith('assistant-live-')).sort().reverse();
const profile=candidates.find(name=>{const folder=path.join(qa,'private',name,'creator','runs');return fs.existsSync(folder)&&fs.readdirSync(folder).length>=3;});
if(!profile)throw new Error('A completed real conversation profile is required.');
const env={...process.env,KIVOU_USER_DATA:path.join(qa,'private',profile),KIVOU_DATA_DIR:path.join(qa,'private',profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const app=await _electron.launch({executablePath:path.resolve('out/Kivou-win32-x64/Kivou.exe'),args:[],env,timeout:60000});
try{
 const page=await app.firstWindow();await page.getByRole('button',{name:'Original launch study',exact:true}).click();
 for(const width of [1440,900,390]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(review,width+'.png'),fullPage:true});if(width===1440)await page.screenshot({path:path.join(qa,'assistant-conversation-viewport.png')});}
 let island;for(let i=0;i<60;i++){island=app.windows().find(w=>w.url().endsWith('island.html'));if(island)break;await new Promise(r=>setTimeout(r,200));}
 await island.getByRole('button',{name:/Your work is ready/}).click();await captureIsland(app,island,path.join(review,'expanded.png'));
 console.log('Captured current packaged assistant at 1440/900/390 and native expanded island. No model call.');
}finally{await app.close();}
