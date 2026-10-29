import type {CreatorInput,CreatorRun,CreatorStatus,ProviderStatus} from '../../../creator/service.mjs';
export type {CreatorInput,CreatorRun,CreatorStatus,ProviderStatus};
export interface Playbook{id:string;command:string;name:string;description:string;prompt:string;builtIn:boolean}
export interface Library{brandNotes:string;playbooks:Playbook[]}
export interface KivouBridge {
 library():Promise<Library>;saveNotes(notes:string):Promise<Library>;savePlaybook(item:Omit<Playbook,'id'|'builtIn'>&{id?:string}):Promise<Library>;removePlaybook(id:string):Promise<Library>;
 showIsland?():Promise<void>;onNavigate?(callback:(conversationId:string|null)=>void):()=>void;
 status():Promise<CreatorStatus>;probe():Promise<ProviderStatus>;runs():Promise<CreatorRun[]>;run(id:string):Promise<CreatorRun>;
 start(input:CreatorInput):Promise<CreatorRun>;cancel(id:string):Promise<CreatorRun>;chooseFolder():Promise<string|null>;
 exportRun(id:string):Promise<{directory:string;files:string[]}|null>;openRun(id:string):Promise<boolean>;
 onChange(callback:(run:CreatorRun)=>void):()=>void;
}
declare global{interface Window{kivou?:KivouBridge}}
