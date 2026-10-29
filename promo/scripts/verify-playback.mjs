import {chromium} from '../../ui/creator/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve('..');const scratch=path.join(root,'qa/private');fs.mkdirSync(scratch,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage();await page.goto('http://localhost:4400/Kivou',{waitUntil:'domcontentloaded',timeout:60000});await page.getByText('Kivou',{exact:true}).first().waitFor({timeout:60000});
 const studioLoaded=true;const html=path.join(scratch,'media-playback.html');fs.writeFileSync(html,'<!doctype html><video controls muted src="'+pathToFileURL(path.join(root,'docs/media/kivou-introduction.mp4')).href+'"></video>');
 await page.goto(pathToFileURL(html).href);await page.locator('video').evaluate(async video=>{await video.play();});await page.waitForFunction(()=>document.querySelector('video').currentTime>1);
 const playback=await page.locator('video').evaluate(video=>({duration:video.duration,width:video.videoWidth,height:video.videoHeight,time:video.currentTime,paused:video.paused,error:video.error?.message||null}));
 if(playback.error||playback.paused||playback.width!==1920)throw new Error('Encoded video playback failed.');
 const result={at:new Date().toISOString(),passed:true,studioLoaded,playback,scope:'Actual Microsoft Edge playback, muted; generated audio not subjectively auditioned',captures:'Actual packaged Electron interface, original demonstration input and real model replies; synthetic inventory fixture'};
 fs.writeFileSync(path.join(root,'qa/promo-v0.2.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
