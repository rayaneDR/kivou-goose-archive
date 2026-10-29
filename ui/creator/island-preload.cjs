const {contextBridge,ipcRenderer}=require('electron');
const invoke=(name,...args)=>ipcRenderer.invoke('kivou-island:'+name,...args);
contextBridge.exposeInMainWorld('island',{
 ask:value=>invoke('ask',value),
 snapshot:()=>invoke('snapshot'),expand:()=>invoke('expand'),collapse:()=>invoke('collapse'),
 open:()=>invoke('open'),cancel:()=>invoke('cancel'),hide:()=>invoke('hide'),
 onExpanded:callback=>{const listener=(_event,value)=>callback(value);ipcRenderer.on('kivou-island:expanded',listener);return()=>ipcRenderer.removeListener('kivou-island:expanded',listener);},
 onChange:callback=>{const listener=(_event,value)=>callback(value);ipcRenderer.on('kivou-island:change',listener);return()=>ipcRenderer.removeListener('kivou-island:change',listener);}
});
