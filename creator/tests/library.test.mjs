import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {LibraryService} from '../library.mjs';
const folder=()=>fs.mkdtempSync(path.join(os.tmpdir(),'kivou-library-'));
const playbook={name:'My review',command:'my-review',description:'My original repeatable process',prompt:'Review this draft: $ARGUMENTS'};
test('custom playbooks and Unicode brand notes survive a new library instance',()=>{
 const root=folder();const service=new LibraryService(root);assert.equal(service.get().playbooks.length,3);
 service.saveNotes('Darija / العربية. Keep the voice concrete.');const saved=service.savePlaybook(playbook);const item=saved.playbooks.find(p=>!p.builtIn);
 assert.ok(item.id);assert.equal(new LibraryService(root).get().brandNotes,'Darija / العربية. Keep the voice concrete.');
 service.savePlaybook({...item,name:'Updated review'});assert.equal(service.get().playbooks.find(p=>p.id===item.id).name,'Updated review');service.removePlaybook(item.id);assert.equal(service.get().playbooks.length,3);
});
test('commands cannot collide, mutate builtins or introduce filesystem paths',()=>{
 const service=new LibraryService(folder());assert.throws(()=>service.savePlaybook({...playbook,command:'hooks'}),/already/);
 assert.throws(()=>service.savePlaybook({...playbook,command:'../../private'}),/lowercase/);
 assert.throws(()=>service.savePlaybook({...playbook,id:'builtin-hooks'}),/existing custom/);
 assert.throws(()=>service.removePlaybook('builtin-hooks'),/custom/);assert.throws(()=>service.saveNotes('x'.repeat(8001)),/8000/);
});
test('corrupt library files are preserved and never silently overwritten',()=>{
 const root=folder();const file=path.join(root,'library.json');fs.writeFileSync(file,'not JSON');const service=new LibraryService(root);
 assert.throws(()=>service.saveNotes('New notes'),/kept/);assert.equal(fs.readFileSync(file,'utf8'),'not JSON');
});
