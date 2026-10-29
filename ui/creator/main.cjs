const {app,BrowserWindow,ipcMain,dialog,shell} = require('electron');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
let win,service,islandController,library;
const chosenFolders=new Set();
app.setName('Kivou');
if(process.env.KIVOU_USER_DATA) app.setPath('userData',process.env.KIVOU_USER_DATA);
if(!app.requestSingleInstanceLock())app.exit(0);
app.on('second-instance',()=>{if(win&&!win.isDestroyed()){if(win.isMinimized())win.restore();win.show();win.focus();}});
const appData = process.env.KIVOU_DATA_DIR || path.join(app.getPath('userData'),'creator');
process.env.GOOSE_DISABLE_TELEMETRY='1';
function sender(event) { if(!win || event.sender!==win.webContents)throw new Error('Unknown application window.'); }
function findCodex(){
  if(process.env.KIVOU_CODEX_COMMAND)return process.env.KIVOU_CODEX_COMMAND;
  let commands=[];try{commands=execFileSync('where.exe',['codex'],{encoding:'utf8',windowsHide:true}).split(/\r?\n/).filter(Boolean);}catch{return undefined;}
  const direct=commands.find(p=>p.toLowerCase().endsWith('.exe'));if(direct)return direct;
  for(const shim of commands){
    const packages=path.join(path.dirname(shim),'node_modules','@openai');
    for(const pkg of ['codex','codex-win32-x64'])for(const suffix of ['vendor/x86_64-pc-windows-msvc/codex/codex.exe','vendor/codex.exe','bin/codex.exe']){
      const candidate=path.join(packages,pkg,suffix);if(fs.existsSync(candidate))return candidate;
    }
  }
  return undefined;
}
app.whenReady().then(async()=>{
  const servicePath=app.isPackaged?path.join(__dirname,'service.mjs'):path.resolve(__dirname,'../../creator/service.mjs');
  const {CreatorService}=await import(pathToFileURL(servicePath).href);
  const gooseBinary=app.isPackaged?path.join(process.resourcesPath,'bin','goose.exe'):process.env.KIVOU_GOOSE_BINARY;
  const codexCommand=findCodex();
  const codexAcpCommand=app.isPackaged?path.join(process.resourcesPath,'bin','codex-acp.cmd'):process.env.KIVOU_ACP_COMMAND||path.join(__dirname,'node_modules','.bin','codex-acp.cmd');
  service=new CreatorService({dataDir:appData,gooseBinary,codexCommand,codexAcpCommand});
  await service.initialize();
  const libraryPath=app.isPackaged?path.join(__dirname,'library.mjs'):path.resolve(__dirname,'../../creator/library.mjs');
  const {LibraryService}=await import(pathToFileURL(libraryPath).href);library=new LibraryService(appData);
  const handle=(name,fn)=>ipcMain.handle('kivou:'+name,(event,...args)=>{sender(event);return fn(...args);});
  handle('library',()=>library.get());handle('saveNotes',notes=>library.saveNotes(notes));handle('savePlaybook',item=>library.savePlaybook(item));handle('removePlaybook',id=>library.removePlaybook(id));
  handle('showIsland',()=>islandController?.show());
  handle('status',()=>service.getStatus());handle('probe',async()=>{const result=await service.probeProvider();islandController?.update();return result;});
  handle('runs',()=>service.listRuns());handle('run',id=>service.getRun(id));
  handle('start',input=>{
    if(!input||typeof input!=='object')throw new Error('Invalid workflow input.');
    if(input.workflow==='assets'&&!chosenFolders.has(input.sourceDir))throw new Error('Choose the asset folder using the native folder picker.');
    return service.start(input);
  });
  handle('cancel',id=>service.cancel(id,'workspace-button'));
  handle('chooseFolder',async()=>{
    const selected=await dialog.showOpenDialog(win,{title:'Choose a folder to inventory',properties:['openDirectory']});
    if(selected.canceled)return null;
    const folder=path.resolve(selected.filePaths[0]);chosenFolders.add(folder);return folder;
  });
  handle('export',async id=>{
    service.getRun(id);
    const selected=await dialog.showOpenDialog(win,{title:'Choose where to export this delivery',properties:['openDirectory','createDirectory']});
    return selected.canceled?null:service.exportRun(id,selected.filePaths[0]);
  });
  handle('openRun',async id=>{const run=service.getRun(id);const error=await shell.openPath(run.directory);if(error)throw new Error(error);return true;});
  win=new BrowserWindow({title:'Kivou',width:1400,height:940,minWidth:780,minHeight:650,backgroundColor:'#f6f5f0',show:false,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{const current=win.webContents.getURL();if(current&&url.split('#')[0]!==current.split('#')[0])event.preventDefault();});
  service.subscribe(run=>{if(win&&!win.isDestroyed())win.webContents.send('kivou:change',run);});
  win.once('ready-to-show',()=>win.show());
  if(!app.isPackaged&&process.env.KIVOU_DEV_URL)await win.loadURL(process.env.KIVOU_DEV_URL);
  else await win.loadFile(path.join(__dirname,'dist','index.html'));
  islandController=await require('./island-controller.cjs').createIsland({service,workspace:win});
}).catch(error=>{dialog.showErrorBox('Kivou could not start',error.message);app.quit();});
app.on('window-all-closed',()=>app.quit());
app.on('before-quit',()=>{const id=service?.getStatus().activeRunId;if(id)void service.cancel(id,'application-quit');});
