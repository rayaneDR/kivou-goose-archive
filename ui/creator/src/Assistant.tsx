import Answer from './Answer';
import {useEffect,useRef,useState} from 'react';
import {ArrowUp,ArrowUpRight,Check,Download,FileText,LoaderCircle,MessageSquare,Plus,Search,Square} from 'lucide-react';
import type {CreatorRun,CreatorStatus} from './bridge';

type Props={runs:CreatorRun[];status:CreatorStatus|null;onConnect:()=>void;onCreate:(workflow:'content'|'research',topic:string,text:string)=>void;initialConversation?:string;onStarted:()=>Promise<void>};
const api=window.kivou;
export default function Assistant({runs,status,onConnect,onCreate,initialConversation,onStarted}:Props){
 const [conversation,setConversation]=useState<string|null>(initialConversation||null);
 const [message,setMessage]=useState('');const [project,setProject]=useState('');const [brief,setBrief]=useState('');
 const [consent,setConsent]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(initialConversation)setConversation(initialConversation);},[initialConversation]);
 const chats=runs.filter(r=>r.workflow==='assistant');
 const projects=[...new Map([...chats].reverse().map(r=>[r.conversationId||r.id,{id:r.conversationId||r.id,title:r.input.topic||r.title}])).values()].reverse();
 const turns=chats.filter(r=>(r.conversationId||r.id)===conversation).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
 const last=turns.at(-1);const previous=[...turns].reverse().find(r=>r.status==='completed');
 const active=!!status?.activeRunId;const title=turns[0]?.input.topic||project||'Your next good idea';
 useEffect(()=>{end.current?.scrollIntoView({block:'nearest',behavior:'instant'});},[last?.id,last?.status]);
 function fresh(){setConversation(null);setProject('');setBrief('');setMessage('');setConsent(false);setError('');setNotice('');}
 async function send(event:React.FormEvent){
  event.preventDefault();if(!api||!message.trim()||busy||active||!consent)return;
  setBusy(true);setError('');try{
   const run=await api.start({workflow:'assistant',message,language:'English',...(previous?{parentRunId:previous.id}:{topic:project.trim()||message.slice(0,80),projectBrief:brief})});
   setConversation(run.conversationId||run.id);setMessage('');await onStarted();
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 }
 async function exportAnswer(run:CreatorRun){if(!api)return;try{const result=await api.exportRun(run.id);if(result)setNotice('Answer and conversation context exported to a new delivery folder.');}catch(e){setError(String(e));}}
 return <div className="assistant-layout">
  <aside className="project-rail" aria-label="Saved projects"><div className="section-heading"><h2>Projects</h2><button className="icon-button" aria-label="New project" onClick={fresh}><Plus size={19}/></button></div><p>Keep a thought going.</p>
   {projects.length?projects.map(p=><button key={p.id} className={'project-item '+(conversation===p.id?'selected':'')} onClick={()=>{setConversation(p.id);setError('');setNotice('');setConsent(false);}}><MessageSquare size={16}/><span>{p.title}</span></button>):<div className="project-empty">Your conversations stay here, on this device.</div>}
   <div className="project-context"><h3>Project context</h3>{turns.length?<><strong>{title}</strong><p>{turns[0].input.projectBrief||'No extra brief. Kivou uses the messages in this project.'}</p><span><Check size={14}/> {turns.length} / 20 turns · saved locally</span></>:<><label htmlFor="project-name">Name your project</label><input id="project-name" value={project} onChange={e=>setProject(e.target.value)} maxLength={120} placeholder="e.g. My first product film"/><label htmlFor="project-brief">What should Kivou remember?</label><textarea id="project-brief" value={brief} onChange={e=>setBrief(e.target.value)} maxLength={10000} rows={4} placeholder="Your audience, tone, constraints, goals…"/></>}</div>
  </aside>
  <section className="conversation" aria-label="Kivou conversation"><header className="conversation-header"><div><h1>{turns.length?title:'Think it through with Kivou'}<span className="accent-period">.</span></h1><p>{turns.length?'One project. The context stays with you.':'A second pair of eyes for the work you care about.'}</p></div><button className="secondary-button" onClick={fresh}><Plus size={16}/> New project</button></header>
   {error&&<p className="error-banner" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}
   <div className="conversation-messages" aria-live="polite" aria-relevant="additions text">
    {!turns.length&&<div className="assistant-welcome"><div className="assistant-emblem" aria-hidden="true">k<span>.</span></div><h2>Start with the messy version.</h2><p>An idea, a difficult decision, a script that isn't quite there.<br/>We'll make the next step clearer.</p><div className="starter-prompts">{['Help me shape a 30-second launch video.','Critique my idea before I spend time on it.','Plan a week of content around one topic.'].map(prompt=><button key={prompt} onClick={()=>setMessage(prompt)}>{prompt}<ArrowUpRight size={16}/></button>)}</div></div>}
    {turns.map(turn=><article className="conversation-turn" key={turn.id}><div className="user-message"><span>You</span><p dir="auto">{turn.input.message}</p></div><div className="assistant-message"><span className="assistant-author"><span className="mini-k">k.</span> Kivou {turn.status==='running'&&<LoaderCircle className="spin" size={15}/>}</span>{turn.result?<><div className="answer-text" dir="auto"><Answer text={turn.result.markdown}/></div>{turn.result.nextSteps?.length?<div className="next-steps">{turn.result.nextSteps.map(step=><button key={step} disabled={active} onClick={()=>setMessage(step)}>{step}<ArrowUpRight size={14}/></button>)}</div>:null}<div className="answer-actions"><button onClick={()=>onCreate('content',title,turn.result!.markdown)}><FileText size={15}/> Make a content pack</button><button onClick={()=>onCreate('research',title,turn.result!.markdown)}><Search size={15}/> Research this</button><button onClick={()=>void exportAnswer(turn)}><Download size={15}/> Export answer</button></div></>:turn.status==='running'?<div className="assistant-working"><p>{turn.progress}</p><button className="secondary-button" onClick={()=>void api?.cancel(turn.id).catch(e=>setError(String(e)))}><Square size={13}/> Stop</button></div>:<div className="assistant-failure"><p>{turn.error||'This turn was interrupted. Your previous answers are saved.'}</p><button className="secondary-button" onClick={()=>setMessage(turn.input.message||'')}>Try this message again</button></div>}</div></article>)}<div ref={end}/>
   </div>
   <form className="conversation-composer" onSubmit={send}><label htmlFor="assistant-message" className="sr-only">Message Kivou</label><textarea id="assistant-message" rows={3} maxLength={16000} placeholder="Ask, sketch an idea, or pick up where you left off…" value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.currentTarget.form?.requestSubmit();}}}/><div className="composer-bottom"><span>Ctrl + Enter to send</span><button className="send-message" aria-label="Send message" disabled={!api||!message.trim()||!consent||!status?.provider.ready||active||busy}>{busy?<LoaderCircle size={18} className="spin"/>:<ArrowUp size={20}/>}</button></div><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Send this project's brief and conversation to my connected model. Files stay local.</span></label>{!status?.provider.ready&&<button type="button" className="connect-inline" onClick={onConnect}>Connect Codex to start a conversation <ArrowUpRight size={14}/></button>}<p className="composer-footnote">Drafts and advice, with your context. Use Research Brief for live source suggestions. Nothing is published or sent to others.</p></form>
  </section>
 </div>;
}
