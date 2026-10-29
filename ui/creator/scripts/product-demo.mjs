import {_electron} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','product-demo-'+Date.now());
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const app=await _electron.launch({executablePath:path.resolve('out/v0.3.0/Kivou-win32-x64/Kivou.exe'),args:[],env,timeout:60000});
try{
 const page=await app.firstWindow();await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor();assert.equal((await page.evaluate(()=>window.kivou.probe())).ready,true);await page.reload();
 await page.getByRole('button',{name:'Playbooks & brand',exact:true}).click();await page.getByLabel('Brand notes',{exact:true}).fill('Audience: independent filmmakers and freelance editors. Voice: concrete, thoughtful, optimistic. No inflated claims.');await page.getByRole('button',{name:'Save brand notes',exact:true}).click();await page.getByText(/Brand notes saved locally/).waitFor();await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(qa,'product-playbooks.png'),fullPage:true});
 await page.getByRole('button',{name:'Talk to Kivou',exact:true}).click();await page.getByLabel('Name your project').fill('A calmer launch film');await page.getByLabel('What should Kivou remember?').fill('An original Kivou product demo. Windows companion, saved project context and creator workflows.');await page.getByLabel('Message Kivou').fill('Write three short opening hooks for a 20-second Kivou launch film. Kivou is a Windows AI companion with a top-screen island, saved conversations and reusable creator playbooks. One line per hook.');await page.getByRole('button',{name:'Add brand notes',exact:true}).click();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Send message',exact:true}).click();
 const deadline=Date.now()+300000;let result;while(Date.now()<deadline){result=(await page.evaluate(()=>window.kivou.runs()))[0];if(result&&result.status!=='running')break;await new Promise(r=>setTimeout(r,500));}assert.equal(result?.status,'completed',result?.error);
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(qa,'product-conversation.png')});
 fs.writeFileSync(path.join(qa,'product-demo.json'),JSON.stringify({at:new Date().toISOString(),passed:true,appVersion:await app.evaluate(({app})=>app.getVersion()),realModelCalls:1,input:'Original product-launch brief and authored demonstration brand notes; no client data',screenshots:['qa/product-playbooks.png','qa/product-conversation.png'],resultSaved:true},null,2)+'\n');console.log('Original product demo captured from actual packaged app with a real model response.');
}finally{await app.close();}
