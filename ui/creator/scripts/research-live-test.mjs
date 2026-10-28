import {CreatorService} from '../../../creator/service.mjs';
import path from 'node:path';
import fs from 'node:fs';
const service=new CreatorService({dataDir:path.resolve('../../qa/private/research-live'),gooseBinary:process.env.KIVOU_GOOSE_BINARY,codexCommand:process.env.KIVOU_CODEX_COMMAND,codexAcpCommand:path.resolve('node_modules/.bin/codex-acp.cmd'),timeoutMs:240_000});
await service.initialize();const provider=await service.probeProvider();if(!provider.ready)throw new Error(provider.message);
const start=Date.now();const run=await service.start({workflow:'research',topic:'Accessible captions for short creator videos',audience:'Independent video creators',urls:['https://www.w3.org/WAI/media/av/captions/'],language:'English'});
await new Promise(resolve=>{const off=service.subscribe(r=>{if(r.id===run.id&&r.status!=='running'){off();resolve();}});});
const result=service.getRun(run.id);const evidence={at:new Date().toISOString(),status:result.status,error:result.error,elapsedMs:Date.now()-start,sourceCount:result.result?.sources?.length||0,sourceStatus:result.result?.sourceStatus||null,nativeWebSearchConfigured:'live',retrievalIndependentlyObserved:false,scope:'Actual model call, source claims remain unverified by Kivou; no client material',runId:run.id};
fs.writeFileSync(path.resolve('../../qa/research-live.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));if(result.status!=='completed')process.exitCode=1;
