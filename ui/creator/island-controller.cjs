const {BrowserWindow,ipcMain,screen,globalShortcut,Tray,Menu,app}=require('electron');
const path=require('node:path');
const {loadParent,saveParent}=require('./island-state.cjs');

async function createIsland({service,workspace}){
 let expanded=false;let quitting=false;let islandParent=loadParent(service);let islandPending;let continuityError=null;
 const island=new BrowserWindow({title:'Kivou Island',width:320,height:64,frame:false,transparent:true,resizable:false,maximizable:false,minimizable:false,alwaysOnTop:true,skipTaskbar:true,show:false,hasShadow:false,webPreferences:{preload:path.join(__dirname,'island-preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 function position(){if(island.isDestroyed())return;const display=screen.getDisplayNearestPoint(screen.getCursorScreenPoint());const area=display.workArea;const width=Math.min(expanded?460:320,area.width);const height=Math.min(expanded?580:64,area.height-24);island.setBounds({x:Math.round(area.x+(area.width-width)/2),y:area.y+12,width,height});}
 function snapshot(){const runs=service.listRuns();const active=runs.find(r=>r.id===service.getStatus().activeRunId&&r.status==='running');const summarize=r=>r?{id:r.id,conversationId:r.conversationId,workflow:r.workflow,title:r.input.topic||r.title,status:r.status,progress:r.progress,error:r.error,preview:r.result?.markdown?.slice(0,800)||''}:null;return {active:summarize(active),latest:summarize(runs[0]),providerReady:service.getStatus().provider.ready,shortcutRegistered,continuityError};}
 function update(){if(!island.isDestroyed())island.webContents.send('kivou-island:change',snapshot());}
 function collapse(){expanded=false;position();island.webContents.send('kivou-island:expanded',false);}
 function expand(){expanded=true;position();island.webContents.send('kivou-island:expanded',true);island.show();island.focus();}
 function show(){collapse();island.showInactive();update();}
 function open(){workspace.show();workspace.focus();const run=service.listRuns().find(r=>r.id===service.getStatus().activeRunId)||service.listRuns()[0];workspace.webContents.send('kivou:navigate',run?.workflow==='assistant'?run.conversationId||run.id:null);collapse();}
 async function ask(value){
  if(!value||value.consent!==true||typeof value.message!=='string'||value.message.length>4000)throw new Error('Enter a message and allow it to be sent to your connected model.');
  const previous=islandParent?service.getRun(islandParent):null;
  const run=await service.start({workflow:'assistant',topic:'Island notes',projectBrief:'Quick notes started from Kivou Island.',message:value.message,...(previous?.status==='completed'?{parentRunId:previous.id}:{})});
  islandPending=run.id;return {id:run.id};
 }
 const methods={snapshot,expand,collapse,open,ask,hide:()=>island.hide(),cancel:async()=>{const id=service.getStatus().activeRunId;if(id)await service.cancel(id,'island-button');}};
 for(const [name,fn]of Object.entries(methods))ipcMain.handle('kivou-island:'+name,(event,...args)=>{if(event.sender!==island.webContents)throw new Error('Unknown island window.');return fn(...args);});
 island.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 island.webContents.on('will-navigate',event=>event.preventDefault());
 island.on('close',event=>{if(!quitting){event.preventDefault();island.hide();}});
 const shortcutRegistered=globalShortcut.register('CommandOrControl+Alt+K',()=>{if(!island.isVisible())show();else if(expanded)collapse();else expand();});
 const tray=new Tray(path.join(__dirname,'icon.png'));tray.setToolTip('Kivou');
 tray.setContextMenu(Menu.buildFromTemplate([{label:'Open Kivou',click:open},{label:'Show island',click:show},{type:'separator'},{label:'Quit Kivou',click:()=>{quitting=true;app.quit();}}]));tray.on('double-click',open);
 const unsubscribe=service.subscribe(run=>{
  if(run.id===islandPending&&run.status!=='running'){
    if(run.status==='completed'){islandParent=run.id;try{saveParent(service,run.id);continuityError=null;}catch{continuityError='Island context could not be saved. Continue this project in the workspace.';}}
    islandPending=undefined;
  }
  update();
 });
 const onDisplayChange=()=>position();screen.on('display-metrics-changed',onDisplayChange);screen.on('display-removed',onDisplayChange);
 await island.loadFile(path.join(__dirname,'island.html'));show();
 app.on('before-quit',()=>{quitting=true;});
 app.once('will-quit',()=>{unsubscribe();globalShortcut.unregister('CommandOrControl+Alt+K');tray.destroy();screen.removeListener('display-metrics-changed',onDisplayChange);screen.removeListener('display-removed',onDisplayChange);});
 workspace.on('close',event=>{if(!quitting){event.preventDefault();workspace.hide();show();}});
 return {show,update,island,shortcutRegistered};
}
module.exports={createIsland};
