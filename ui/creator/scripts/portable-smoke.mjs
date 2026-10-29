import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {createServer} from 'node:net';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const qa=path.resolve('../../qa');const profile=path.join(qa,'private','single-exe-'+Date.now());
fs.mkdirSync(profile,{recursive:true});
const startedAt=Date.now();
const exe=path.resolve(process.env.KIVOU_SINGLE_EXE_PATH||'../../releases/portable-v0.3.0/Kivou.exe');assert.ok(fs.existsSync(exe));
const digest=createHash('sha256');for await(const chunk of fs.createReadStream(exe))digest.update(chunk);const artifactSha256=digest.digest('hex');
const port=await new Promise(resolve=>{const server=createServer();server.listen(0,'127.0.0.1',()=>{const value=server.address().port;server.close(()=>resolve(value));});});
const env={...process.env,KIVOU_USER_DATA:profile,KIVOU_DATA_DIR:path.join(profile,'creator')};delete env.ELECTRON_RUN_AS_NODE;
const child=spawn(exe,['--remote-debugging-address=127.0.0.1','--remote-debugging-port='+port],{env,stdio:'ignore',windowsHide:true});
let browser;
try{
 const deadline=Date.now()+300000;while(Date.now()<deadline){try{browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:2000});break;}catch{await new Promise(resolve=>setTimeout(resolve,500));}}
 assert.ok(browser,'Self-contained launcher must extract and open the actual Electron application.');
 let page;for(let attempt=0;attempt<120;attempt++){page=browser.contexts()[0].pages().find(p=>p.url().includes('/dist/index.html'));if(page)break;await new Promise(r=>setTimeout(r,250));}
 assert.ok(page);const launchMs=Date.now()-startedAt;await page.getByRole('heading',{name:'Think it through with Kivou.'}).waitFor({timeout:60000});
 await page.getByRole('button',{name:'Playbooks & brand',exact:true}).click();await page.getByRole('heading',{name:'A good process, worth keeping.'}).waitFor();assert.equal((await page.evaluate(()=>window.kivou.library())).playbooks.length,3);
 await page.getByRole('button',{name:'Model connection',exact:true}).click();await page.getByRole('button',{name:'Check connection',exact:true}).click();await page.getByText('Ready to create',{exact:true}).waitFor({timeout:90000});
 await page.getByRole('button',{name:'Talk to Kivou',exact:true}).click();await page.getByLabel('Name your project').fill('Single-file launch check');await page.getByLabel('Message Kivou').fill('Give one short, original greeting to a creator opening Kivou. No tools or research needed.');await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Send message',exact:true}).click();
 const stop=Date.now()+300000;let run;while(Date.now()<stop){run=(await page.evaluate(()=>window.kivou.runs()))[0];if(run&&run.status!=='running')break;await new Promise(resolve=>setTimeout(resolve,500));}assert.equal(run?.status,'completed',run?.error);assert.ok(run.result.markdown);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(qa,'portable-self-contained.png')});
 const evidence={at:new Date().toISOString(),passed:true,format:'Single-file NSIS portable EXE',artifact:'Kivou.exe',artifactSha256,artifactBytes:fs.statSync(exe).size,selfExtractionLaunched:true,launchMs,libraryReady:true,providerReady:true,realModelCalls:1,modelRunCompleted:true,status:run.status,input:'Original one-line greeting request; no client material',scope:'Actual self-contained Kivou.exe, isolated test profile; user running preview untouched'};
 fs.writeFileSync(path.join(qa,'portable-self-contained.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
}finally{
 if(browser){try{await Promise.race([(async()=>{await (await browser.newBrowserCDPSession()).send('Browser.close');await browser.close();})(),new Promise(resolve=>setTimeout(resolve,2500))]);}catch{}}
 if(child.exitCode===null){try{execFileSync('taskkill.exe',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}}
}
