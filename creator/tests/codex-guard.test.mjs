import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {guardConfig,configArgs,verifyGuard} from '../codex-guard.mjs';

function metadataProcess(entries,{exit=0}={}){
  const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.kill=()=>true;
  setImmediate(()=>{child.stdout.write(JSON.stringify(entries));child.stderr.write('do not log private transport metadata');child.emit('close',exit);});return child;
}

test('overlays each known server and leaves credentials or transports out of policy',async()=>{
  const calls=[];let count=0;
  const config=await verifyGuard('/trusted/codex',{},(binary,args,env,options)=>{
    calls.push({binary,args,options});
    return metadataProcess([{name:'normal',enabled:count++===0,url:'https://private.example/?token=SECRET',env:{PRIVATE_KEY:'SECRET'}},{name:'name.with.dot',enabled:false}]);
  },'/trusted/run');
  assert.equal(calls.length,2);assert.equal(calls[0].options.cwd,'/trusted/run');assert.equal(config.mcp_servers.normal.enabled,false);assert.equal(config.mcp_servers['name.with.dot'].enabled,false);
  assert.ok(!JSON.stringify(config).includes('SECRET'));assert.ok(!JSON.stringify(config).includes('private.example'));
  assert.equal(config.features.plugins,false);assert.equal(config.features.apps,false);assert.equal(config.features.hooks,false);assert.equal(config.features.shell_tool,false);assert.equal(config.features.unified_exec,false);assert.equal(config.features.skip_host_skill_discovery,true);
});

test('fails closed when CLI cannot apply required isolation or a server remains enabled',async()=>{
  await assert.rejects(verifyGuard('/trusted/codex',{},()=>metadataProcess([],{exit:1})),/does not support/);
  await assert.rejects(verifyGuard('/trusted/codex',{},()=>metadataProcess([{name:'unsafe',enabled:true}])),/remained enabled/);
  let count=0;await assert.rejects(verifyGuard('/trusted/codex',{},()=>metadataProcess(count++===0?[]:[{name:'new-unexpected',enabled:false}])),/remained enabled/);
});

test('empty table is never assumed to remove inherited servers; second check is mandatory',async()=>{
  let calls=0;const config=await verifyGuard('/trusted/codex',{},()=>{calls++;return metadataProcess([{name:'already-disabled',enabled:false}]);});
  assert.equal(calls,2);assert.equal(config.mcp_servers['already-disabled'].enabled,false);
});

test('inline TOML table preserves exact MCP names including dots and quotes',()=>{
  const args=configArgs(guardConfig(['name.with.dot','name"quoted']));const value=args.find(arg=>arg.startsWith('mcp_servers='));
  assert.match(value,/"name\.with\.dot"=\{"enabled"=false\}/);assert.match(value,/name\\"quoted/);
  assert.throws(()=>guardConfig(['bad\nname']),/Invalid/);
});

test('content disables web tools and research permits only the native web-search setting',()=>{
  const content=guardConfig([],'content');const research=guardConfig([],'research');assert.equal(content.web_search,'disabled');assert.equal(research.web_search,'live');
  for(const policy of [content,research]){assert.equal(policy.features.browser_use,false);assert.equal(policy.features.shell_tool,false);assert.equal(policy.features.plugins,false);assert.equal(policy.features.view_image,false);}
});
