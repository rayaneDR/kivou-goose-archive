import {_electron} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const qa=path.resolve('../../qa');
const profile=path.join(qa,'private','packaged-live-'+Date.now());
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const app=await _electron.launch({executablePath:path.resolve('out/Kivou-win32-x64/Kivou.exe'),args:[],env,timeout:60_000});
try{
 const page=await app.firstWindow();await page.getByRole('button',{name:'My workspace',exact:true}).click();await page.getByRole('heading',{name:'What are we making?'}).waitFor();
 const provider=await page.evaluate(()=>window.kivou.probe());if(!provider.ready)throw new Error(provider.message);
 const start=Date.now();const run=await page.evaluate(()=>window.kivou.start({workflow:'content',topic:'A little order before the edit',audience:'Independent video creators',language:'English',text:'Write a 20-second creator video about making a read-only inventory of footage before starting an edit. Keep original files unchanged. This is an original demonstration, not a paid client project. Use only this supplied idea; no research is needed.'}));
 const deadline=Date.now()+300_000;
 while(Date.now()<deadline){const current=await page.evaluate(id=>window.kivou.run(id),run.id);if(current.status!=='running')break;await new Promise(resolve=>setTimeout(resolve,750));}
 const result=await page.evaluate(id=>window.kivou.run(id),run.id);if(result.status!=='completed')throw new Error(result.error||result.status);
 await page.getByRole('button',{name:new RegExp(result.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).click();await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(qa,'packaged-content-real.png')});
 const evidence={at:new Date().toISOString(),passed:true,status:result.status,provider:'Actual packaged Kivou.exe → bundled Goose1.56.0 → bundled ACP2.3.0 → installed Codex ChatGPT',elapsedMs:Date.now()-start,runId:run.id,hooks:result.result.hooks.length,files:result.files,synthetic:false,input:'Original demonstration text; no client data',source:'Same packaged runtime that will be zipped'};
 fs.writeFileSync(path.join(qa,'packaged-model.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
}finally{await app.close();}
