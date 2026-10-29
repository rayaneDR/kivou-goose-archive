import Answer from './Answer';
import {useEffect,useRef,useState} from 'react';
import {ArrowUp,ArrowUpRight,Check,Download,FileText,LoaderCircle,MessageSquare,Plus,Search,Square} from 'lucide-react';
import type {CreatorRun,CreatorStatus,Playbook} from './bridge';

type Props={runs:CreatorRun[];status:CreatorStatus|null;onConnect:()=>void;onCreate:(workflow:'content'|'research',topic:string,text:string)=>void;initialConversation?:string;onStarted:()=>Promise<void>;initialDraft?:string;onDraftUsed:()=>void};
const api=window.kivou;
function expandCommand(value:string,playbooks:Playbook[]):string|null{
 if(!value.trimStart().startsWith('/'))return null;
 const command=/^\/([a-z][a-z0-9-]*)(?:\s+([\s\S]*))?$/.exec(value.trim());
 if(!command)throw new Error('Use a saved slash command followed by your idea, for example /hooks my next video.');
 const playbook=playbooks.find(p=>p.command===command[1]);if(!playbook)throw new Error('Unknown playbook. Choose a command from Playbooks & brand.');
 const args=command[2]||'[Add your idea or draft here]';const expanded=playbook.prompt.includes('$ARGUMENTS')?playbook.prompt.replaceAll('$ARGUMENTS',()=>args):playbook.prompt+'\n\nYour input:\n'+args;
 if(expanded.length>16000)throw new Error('This playbook and input are too long. Shorten the input before expanding it.');return expanded;
}

export default function Assistant({runs,status,onConnect,onCreate,initialConversation,onStarted,initialDraft,onDraftUsed}:Props){
 const [conversation,setConversation]=useState<string|null>(initialConversation||null);
 const [message,setMessage]=useState('');const [project,setProject]=useState('');const [brief,setBrief]=useState('');
 const [consent,setConsent]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 const [search,setSearch]=useState('');
 const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(initialConversation)setConversation(initialConversation);},[initialConversation]);
 useEffect(()=>{if(initialDraft){setMessage(initialDraft);onDraftUsed();}},[initialDraft,onDraftUsed]);
 const chats=runs.filter(r=>r.workflow==='assistant');
 const projects=[...new Map([...chats].reverse().map(r=>[r.conversationId||r.id,{id:r.conversationId||r.id,title:r.input.topic||r.title}])).values()].reverse();
 const normalized=(value:string)=>value.normalize('NFKC').toLocaleLowerCase();
 const term=normalized(search.trim());
 const matchingProjects=projects.filter(project=>!term||chats.some(run=>(run.conversationId||run.id)===project.id&&normalized((run.input.topic||'')+' '+(run.input.message||'')+' '+(run.result?.markdown||'')).includes(term)));
 const turns=chats.filter(r=>(r.conversationId||r.id)===conversation).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 const last=turns.at(-1);const previous=[...turns].reverse().find(r=>r.status==='completed');
 const active=!!status?.activeRunId;const title=turns[0]?.input.topic||project||'Your next good idea';
 useEffect(()=>{end.current?.scrollIntoView({block:'nearest',behavior:'instant'});},[last?.id,last?.status]);
 function fresh(){setConversation(null);setProject('');setBrief('');setMessage('');setConsent(false);setError('');setNotice('');}
 async function send(event:React.FormEvent){
  event.preventDefault();if(!api||!message.trim()||busy||active)return;
  setBusy(true);setError('');try{
   if(message.trimStart().startsWith('/')){const library=await api.library();const expanded=expandCommand(message,library.playbooks);setMessage(expanded!);setNotice('Playbook expanded locally. Review the instructions, then send when ready.');return;}
   if(!consent||!status?.provider.ready)return;
   const run=await api.start({workflow:'assistant',message,language:'English',...(previous?{parentRunId:previous.id}:{topic:project.trim()||message.slice(0,80),projectBrief:brief})});
   setConversation(run.conversationId||run.id);setMessage('');await onStarted();
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 }
 async function exportAnswer(run:CreatorRun){if(!api)return;try{const result=await api.exportRun(run.id);if(result)setNotice('Answer and conversation context exported to a new delivery folder.');}catch(e){setError(String(e));}}
 async function addBrandNotes(){if(!api)return;setError('');try{const library=await api.library();if(!library.brandNotes){setNotice('Save your notes in Playbooks & brand first.');return;}const expanded=expandCommand(message,library.playbooks);const body=expanded??message;const prefix='Brand notes to use for this answer:\n'+library.brandNotes+'\n\n';if(body.startsWith(prefix))return;if(prefix.length+body.length>16000)throw new Error('The notes and message are too long. Trim the message before adding your notes.');setMessage(prefix+body);setNotice(expanded?'Playbook expanded and brand notes added locally. Review the message before sending.':'Brand notes added to the message. Review or edit them before sending.');}catch(e){setError(String(e));}}
 return <div className="assistant-layout">
  <aside className="project-rail" aria-label="Saved projects"><div className="section-heading"><h2>Projects</h2><button className="icon-button" aria-label="New project" onClick={fresh}><Plus size={19}/></button></div><p>Keep a thought going.</p><label className="sr-only" htmlFor="project-search">Search projects and answers</label><input id="project-search" className="project-search" type="search" maxLength={500} placeholder="Search projects & answers" value={search} onChange={e=>setSearch(e.target.value)}/>
   {matchingProjects.length?matchingProjects.map(p=><button key={p.id} className={'project-item '+(conversation===p.id?'selected':'')} onClick={()=>{setConversation(p.id);setError('');setNotice('');setConsent(false);}}><MessageSquare size={16}/><span>{p.title}</span></button>):<div className={'project-empty '+(search?'search-empty':'')} role={search?'status':undefined}>{search?'No matching projects or answers.':'Your conversations stay here, on this device.'}</div>}
   <div className="project-context"><h3>Project context</h3>{turns.length?<><strong>{title}</strong><p>{turns[0].input.projectBrief||'No extra brief. Kivou uses the messages in this project.'}</p><span><Check size={14}/> {turns.length} / 20 turns · saved locally</span></>:<><label htmlFor="project-name">Name your project</label><input id="project-name" value={project} onChange={e=>setProject(e.target.value)} maxLength={120} placeholder="e.g. My first product film"/><label htmlFor="project-brief">What should Kivou remember?</label><textarea id="project-brief" value={brief} onChange={e=>setBrief(e.target.value)} maxLength={10000} rows={4} placeholder="Your audience, tone, constraints, goals…"/></>}</div>
  </aside>
  <section className="conversation" aria-label="Kivou conversation"><header className="conversation-header"><div><h1>{turns.length?title:'Think it through with Kivou'}<span className="accent-period">.</span></h1><p>{turns.length?'One project. The context stays with you.':'A second pair of eyes for the work you care about.'}</p></div><button className="secondary-button" onClick={fresh}><Plus size={16}/> New project</button></header>
   {error&&<p className="error-banner" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}
   <div className="conversation-messages" aria-live="polite" aria-relevant="additions text">
    {!turns.length&&<div className="assistant-welcome"><div className="assistant-emblem" aria-hidden="true">k<span>.</span></div><h2>Start with the messy version.</h2><p>An idea, a difficult decision, a script that isn't quite there.<br/>We'll make the next step clearer.</p><div className="starter-prompts">{['Help me shape a 30-second launch video.','Critique my idea before I spend time on it.','Plan a week of content around one topic.'].map(prompt=><button key={prompt} onClick={()=>setMessage(prompt)}>{prompt}<ArrowUpRight size={16}/></button>)}</div></div>}
    {turns.map(turn=><article className="conversation-turn" key={turn.id}><div className="user-message"><span>You</span><p dir="auto">{turn.input.message}</p></div><div className="assistant-message"><span className="assistant-author"><span className="mini-k">k.</span> Kivou {turn.status==='running'&&<LoaderCircle className="spin" size={15}/>}</span>{turn.result?<><div className="answer-text" dir="auto"><Answer text={turn.result.markdown}/></div>{turn.result.nextSteps?.length?<div className="next-steps">{turn.result.nextSteps.map(step=><button key={step} disabled={active} onClick={()=>setMessage(step)}>{step}<ArrowUpRight size={14}/></button>)}</div>:null}<div className="answer-actions"><button onClick={()=>onCreate('content',title,turn.result!.markdown)}><FileText size={15}/> Make a content pack</button><button onClick={()=>onCreate('research',title,turn.result!.markdown)}><Search size={15}/> Research this</button><button onClick={()=>void exportAnswer(turn)}><Download size={15}/> Export answer</button></div></>:turn.status==='running'?<div className="assistant-working"><p>{turn.progress}</p><button className="secondary-button" onClick={()=>void api?.cancel(turn.id).catch(e=>setError(String(e)))}><Square size={13}/> Stop</button></div>:<div className="assistant-failure"><p>{turn.error||'This turn was interrupted. Your previous answers are saved.'}</p><button className="secondary-button" onClick={()=>setMessage(turn.input.message||'')}>Try this message again</button></div>}</div></article>)}<div ref={end}/>
   </div>
   <form className="conversation-composer" onSubmit={send}><label htmlFor="assistant-message" className="sr-only">Message Kivou</label><textarea id="assistant-message" rows={3} maxLength={16000} placeholder="Ask a question, or try /hooks followed by your idea…" value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.currentTarget.form?.requestSubmit();}}}/><div className="composer-bottom"><span>Ctrl + Enter</span><button type="button" className="brand-notes-action" onClick={()=>void addBrandNotes()}>Add brand notes</button><button className="send-message" aria-label={message.trimStart().startsWith('/')?'Expand playbook':'Send message'} disabled={!api||!message.trim()||active||busy||(!message.trimStart().startsWith('/')&&(!consent||!status?.provider.ready))}>{busy?<LoaderCircle size={18} className="spin"/>:<ArrowUp size={20}/>}</button></div><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Send this project's brief and conversation to my connected model. Files stay local.</span></label>{!status?.provider.ready&&<button type="button" className="connect-inline" onClick={onConnect}>Connect Codex to start a conversation <ArrowUpRight size={14}/></button>}<p className="composer-footnote">Drafts and advice, with your context. Use Research Brief for live source suggestions. Nothing is published or sent to others.</p></form>
  </section>
 </div>;
}
