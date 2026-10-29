const {contextBridge, ipcRenderer} = require('electron');
const invoke = (method, ...args) => ipcRenderer.invoke('kivou:'+method, ...args);
contextBridge.exposeInMainWorld('kivou', {
  library:()=>invoke('library'),saveNotes:notes=>invoke('saveNotes',notes),savePlaybook:item=>invoke('savePlaybook',item),removePlaybook:id=>invoke('removePlaybook',id),
  showIsland:()=>invoke('showIsland'),
  onNavigate:callback=>{const listener=(_event,id)=>callback(id);ipcRenderer.on('kivou:navigate',listener);return()=>ipcRenderer.removeListener('kivou:navigate',listener);},
  status:()=>invoke('status'), probe:()=>invoke('probe'), runs:()=>invoke('runs'),
  run:(id)=>invoke('run',id), start:(input)=>invoke('start',input), cancel:(id)=>invoke('cancel',id),
  chooseFolder:()=>invoke('chooseFolder'), exportRun:(id)=>invoke('export',id), openRun:(id)=>invoke('openRun',id),
  onChange:(callback)=>{const listener=(_event,run)=>callback(run);ipcRenderer.on('kivou:change',listener);return()=>ipcRenderer.removeListener('kivou:change',listener);}
});
