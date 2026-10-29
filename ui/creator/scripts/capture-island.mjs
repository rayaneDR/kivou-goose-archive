import fs from 'node:fs';
export async function captureIsland(app,page,file){
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 const url=await app.evaluate(async({BrowserWindow})=>{const window=BrowserWindow.getAllWindows().find(w=>w.getTitle()==='Kivou Island');return (await window.capturePage()).toDataURL();});
 fs.writeFileSync(file,Buffer.from(url.split(',')[1],'base64'));
}
