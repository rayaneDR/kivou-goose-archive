const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const brief='Quick notes started from Kivou Island.';
function eligible(run){return run?.workflow==='assistant'&&run.status==='completed'&&run.input.projectBrief===brief&&run.input.topic==='Island notes';}
function loadParent(service){
 try{const saved=JSON.parse(fs.readFileSync(path.join(service.root,'island-state.json'),'utf8'));const run=service.getRun(saved.parentRunId);if(eligible(run))return run.id;}catch{/* Missing, interrupted or altered pointers fall back to saved successful notes. */}
 return service.listRuns().find(eligible)?.id;
}
function saveParent(service,id){
 const run=service.getRun(id);if(!eligible(run))throw new Error('Only completed island notes can become conversation context.');
 const target=path.join(service.root,'island-state.json');const temporary=target+'.'+crypto.randomUUID()+'.tmp';
 fs.writeFileSync(temporary,JSON.stringify({parentRunId:id})+'\n',{flag:'wx',mode:0o600});fs.renameSync(temporary,target);
}
module.exports={loadParent,saveParent};
