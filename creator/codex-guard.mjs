import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const FEATURES = {plugins:false,apps:false,hooks:false,remote_plugin:false,shell_tool:false,unified_exec:false,skip_host_skill_discovery:true,skill_mcp_dependency_install:false,image_generation:false,view_image:false,computer_use:false,browser_use:false};

export function guardConfig(names,workflow='content') {
  if (!Array.isArray(names) || names.length > 1000 || names.some(name => typeof name !== 'string' || name.length > 500 || /[\r\n\u0000]/.test(name))) throw new Error('Invalid MCP server name inventory.');
  return {features:FEATURES, mcp_servers:Object.fromEntries(names.map(name => [name,{enabled:false}])),
    project_root_markers:['.kivou-root'], orchestrator:{mcp:{enabled:false}}, default_permissions:':read-only', sandbox_mode:'read-only', approval_policy:'never', notify:[],web_search:workflow==='research'?'live':'disabled'};
}

function toml(value) {
  if (Array.isArray(value)) return `[${value.map(toml).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).map(([key,item]) => `${JSON.stringify(key)}=${toml(item)}`).join(',')}}`;
  return JSON.stringify(value);
}

export function configArgs(config) {
  return Object.entries(config).flatMap(([key,value]) => ['-c',`${key}=${toml(value)}`]);
}

function run(binary,args,env,{capture=false,cwd}={}) {
  return spawn(binary,args,{env,cwd,windowsHide:true,stdio:capture?['ignore','pipe','pipe']:['pipe','pipe','pipe']});
}

async function mcpMetadata(binary,env,overrides,spawnProcess=run,cwd) {
  return await new Promise((resolve,reject)=>{
    const child=spawnProcess(binary,[...configArgs(overrides),'mcp','list','--json'],env,{capture:true,cwd});
    let json='';let bytes=0;
    const timer=setTimeout(()=>{child.kill();reject(new Error('Codex MCP isolation check timed out.'));},20_000);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data',chunk=>{bytes+=Buffer.byteLength(chunk);if(bytes>8_000_000){child.kill();reject(new Error('Codex MCP metadata exceeded its supported size.'));return;}json+=chunk;});
    // MCP list can contain transport settings. Only names and enabled bits are inspected;
    // never forward, log, persist or return the remaining data, including stderr.
    child.stderr.resume();
    child.on('error',()=>{clearTimeout(timer);reject(new Error('Codex MCP isolation check could not start.'));});
    child.on('close',code=>{
      clearTimeout(timer);
      if(code!==0){reject(new Error('Codex does not support the required isolation configuration. No model session was started.'));return;}
      try{
        const entries=JSON.parse(json);json='';
        if(!Array.isArray(entries))throw new Error();
        const result=entries.map(entry=>({name:entry.name,enabled:entry.enabled}));
        if(result.some(entry=>typeof entry.name!=='string'||typeof entry.enabled!=='boolean'))throw new Error();
        resolve(result);
      }catch{reject(new Error('Codex MCP isolation metadata could not be verified.'));}
    });
  });
}

export async function verifyGuard(binary,env=process.env,spawnProcess=run,cwd) {
  const workflow=env.KIVOU_WORKFLOW==='research'?'research':'content';
  const base=guardConfig([],workflow);
  const inventory=await mcpMetadata(binary,env,base,spawnProcess,cwd);
  const config=guardConfig(inventory.map(entry=>entry.name),workflow);
  const checked=await mcpMetadata(binary,env,config,spawnProcess,cwd);
  if(checked.some(entry=>entry.enabled!==false)||checked.some(entry=>!Object.hasOwn(config.mcp_servers,entry.name)))throw new Error('An inherited MCP server remained enabled. No model session was started.');
  return config;
}

export async function main() {
  const binary=process.env.KIVOU_REAL_CODEX;
  if(!binary)throw new Error('The trusted Codex CLI path was not configured.');
  if(process.argv.length!==3||process.argv[2]!=='app-server')throw new Error('Unsupported ACP startup arguments. Kivou refused a possible policy override.');
  const env={...process.env}; delete env.CODEX_CONFIG; delete env.KIVOU_REAL_CODEX;
  const config=await verifyGuard(binary,env);
  env.CODEX_CONFIG=JSON.stringify(config);
  const child=run(binary,['--strict-config',...configArgs(config),...process.argv.slice(2)],env);
  child.once('spawn',()=>{
    const receipt=process.env.KIVOU_GUARD_RECEIPT;
    if(receipt && path.isAbsolute(receipt)){
      try{fs.writeFileSync(receipt,JSON.stringify({policy:'kivou-read-only-v1',mcpDisabled:true,pluginsDisabled:true,shellDisabled:true,hostSkillsDisabled:true,webSearch:config.web_search})+'\n',{flag:'wx',mode:0o600});}
      catch(error){
        try{
          if(error.code!=='EEXIST'||fs.lstatSync(receipt).isSymbolicLink())throw error;
          const existing=JSON.parse(fs.readFileSync(receipt,'utf8'));
          if(existing.policy!=='kivou-read-only-v1'||!existing.mcpDisabled||!existing.pluginsDisabled||!existing.shellDisabled||existing.webSearch!==config.web_search)throw error;
        }catch{child.kill();process.stderr.write('Kivou could not record its isolated runtime policy.\n');process.exitCode=1;}
      }
    }
  });
  process.stdin.pipe(child.stdin);child.stdout.pipe(process.stdout);child.stderr.pipe(process.stderr);
  child.on('error',()=>{process.stderr.write('Kivou could not start its isolated Codex session.\n');process.exitCode=1;});
  child.on('close',code=>{process.exitCode=code??1;});
  const stop=()=>child.kill();process.on('SIGTERM',stop);process.on('SIGINT',stop);
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  main().catch(error=>{process.stderr.write(`${error.message}\n`);process.exitCode=1;});
}
