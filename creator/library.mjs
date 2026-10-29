import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const builtInPlaybooks=Object.freeze([
 {id:'builtin-hooks',command:'hooks',name:'Find the hook',description:'Three distinct openings, with a reason to keep watching.',prompt:'Act as an experienced short-form editor. From the idea below, write three distinct opening hooks: a direct promise, a surprising angle, and a relatable problem. Explain the visual opening for each. Avoid invented numbers, customers or factual claims. Keep it practical.\n\nIdea: $ARGUMENTS',builtIn:true},
 {id:'builtin-critique',command:'critique',name:'Give it a second look',description:'Honest, specific feedback before the work gets expensive.',prompt:'Give a constructive critique of the supplied idea or draft. State what is already working, the three most important weaknesses, and concrete improvements with a short rewritten example. Distinguish taste from factual problems. Ask at most one essential question if context is missing. Do not invent evidence.\n\nDraft: $ARGUMENTS',builtIn:true},
 {id:'builtin-repurpose',command:'repurpose',name:'Make more from one idea',description:'Adapt supplied material for a short, a post and a caption.',prompt:'Adapt only the supplied material into: a 30-second video outline, a concise professional post, and three caption options. Keep the core idea consistent, adjust the format for each destination, and flag factual gaps instead of filling them in.\n\nMaterial: $ARGUMENTS',builtIn:true},
]);
const text=(value,name,limit,optional=false)=>{if(optional&&value==='')return '';if(typeof value!=='string'||!value.trim()||value.length>limit)throw new Error(`${name} must contain 1–${limit} characters.`);return value.trim();};
function validatePlaybook(value){
 if(!value||typeof value!=='object')throw new Error('Enter a valid playbook.');
 if(typeof value.command!=='string'||!/^[a-z][a-z0-9-]{1,31}$/.test(value.command))throw new Error('Command must be 2–32 lowercase letters, numbers or hyphens, starting with a letter.');
 return {id:value.id,command:value.command,name:text(value.name,'Playbook name',100),description:text(value.description,'Description',300),prompt:text(value.prompt,'Instructions',12000),builtIn:false};
}
export class LibraryService{
 constructor(dataDir){if(!path.isAbsolute(dataDir))throw new Error('Library requires an absolute app data directory.');this.root=dataDir;this.file=path.join(dataDir,'library.json');}
 load(){
  if(!fs.existsSync(this.file))return {version:1,brandNotes:'',playbooks:[]};
  const stat=fs.lstatSync(this.file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2_000_000)throw new Error('The library must be a regular local file smaller than 2 MB.');
  let data;try{data=JSON.parse(fs.readFileSync(this.file,'utf8'));}catch{throw new Error('The saved library could not be read. Its existing file has been kept.');}
  if(data.version!==1||typeof data.brandNotes!=='string'||data.brandNotes.length>8000||!Array.isArray(data.playbooks)||data.playbooks.length>30)throw new Error('The saved library has an unsupported format. Its existing file has been kept.');
  const seen=new Set(builtInPlaybooks.map(p=>p.command));
  data.playbooks=data.playbooks.map(value=>{const item=validatePlaybook(value);if(typeof item.id!=='string'||!/^[a-f0-9-]{36}$/.test(item.id)||seen.has(item.command))throw new Error('The saved playbook library is inconsistent. Its existing file has been kept.');seen.add(item.command);return item;});
  return data;
 }
 persist(data){
  const temporary=this.file+'.'+crypto.randomUUID()+'.tmp';fs.writeFileSync(temporary,JSON.stringify(data,null,2)+'\n',{flag:'wx',mode:0o600});fs.renameSync(temporary,this.file);
 }
 get(){const data=this.load();return {brandNotes:data.brandNotes,playbooks:[...builtInPlaybooks,...data.playbooks]};}
 saveNotes(value){const data=this.load();data.brandNotes=text(value,'Brand notes',8000,true);this.persist(data);return this.get();}
 savePlaybook(value){
  const data=this.load();const item=validatePlaybook(value);
  if(item.id!==undefined&&(!/^[a-f0-9-]{36}$/.test(item.id)||!data.playbooks.some(p=>p.id===item.id)))throw new Error('Choose an existing custom playbook to edit.');
  if([...builtInPlaybooks,...data.playbooks].some(p=>p.command===item.command&&p.id!==item.id))throw new Error('That slash command is already in your library. Choose another.');
  if(!item.id&&data.playbooks.length>=30)throw new Error('The library holds up to 30 custom playbooks. Edit or remove one first.');
  item.id=item.id||crypto.randomUUID();data.playbooks=[...data.playbooks.filter(p=>p.id!==item.id),item];this.persist(data);return this.get();
 }
 removePlaybook(id){const data=this.load();if(!data.playbooks.some(p=>p.id===id))throw new Error('Only saved custom playbooks can be removed.');data.playbooks=data.playbooks.filter(p=>p.id!==id);this.persist(data);return this.get();}
}
