import Markdown from 'react-markdown';
export default function Answer({text}:{text:string}){
 return <Markdown skipHtml components={{
  h1:({children})=><h2>{children}</h2>,
  a:({href,children})=><span className="answer-link">{children}{href?<> <span className="answer-url">({href})</span></>:null}</span>,
  img:()=>null,
 }}>{text}</Markdown>;
}
