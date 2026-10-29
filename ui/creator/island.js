const $=id=>document.getElementById(id);let expanded=false;
async function expand(){expanded=true;await window.island.expand();$('expanded').hidden=false;$('island').classList.add('open');$('toggle').setAttribute('aria-expanded','true');}
async function collapse(){expanded=false;$('expanded').hidden=true;$('island').classList.remove('open');$('toggle').setAttribute('aria-expanded','false');await window.island.collapse();$('toggle').focus();}
$('toggle').onclick=()=>expanded?collapse():expand();$('collapse').onclick=collapse;$('open').onclick=()=>window.island.open();$('stop').onclick=()=>window.island.cancel();$('hide').onclick=()=>window.island.hide();
document.addEventListener('keydown',event=>{if(event.key==='Escape')void collapse();});
function render(state){const run=state.active||state.latest;const working=!!state.active;const failed=run&&['failed','cancelled','interrupted'].includes(run.status);
 $('quick-send').disabled=working||!state.providerReady;
 if(state.continuityError){$('quick-error').textContent=state.continuityError;$('quick-error').hidden=false;}
 $('label').textContent=working?'Kivou is working':failed?'Kivou needs your attention':run?'Your work is ready':'Kivou is here';
 $('subtitle').textContent=run?run.title:'Your next idea, one click away';$('light').className='state-light'+(working?' running':failed?' failed':'');
 $('title').textContent=working?'Making a little progress.':failed?'Let’s pick it back up.':run?run.title:'A good place to start.';
 $('progress').textContent=run?(run.error||run.progress):'Bring an idea. Kivou keeps the conversation and helps you find your next step.';
 $('result').hidden=!run?.preview;$('result').textContent=run?.preview||'';$('stop').hidden=!working;
 $('connection').textContent=state.providerReady?'Codex connected · saved locally':'Connect your model in the workspace';
 $('open').firstChild.textContent=working?'Open current work ':run?'Continue in workspace ':'Talk to Kivou ';
}
window.island.onChange(render);window.island.snapshot().then(render);

$('quick-form').onsubmit=async event=>{event.preventDefault();$('quick-error').hidden=true;$('quick-send').disabled=true;try{await window.island.ask({message:$('quick-message').value,consent:$('quick-consent').checked});$('quick-message').value='';}catch(error){$('quick-error').textContent=error.message;$('quick-error').hidden=false;$('quick-send').disabled=false;}};

window.island.onExpanded(value=>{expanded=value;$('expanded').hidden=!value;$('island').classList.toggle('open',value);$('toggle').setAttribute('aria-expanded',String(value));});
