import type {CreatorInput,CreatorRun,CreatorStatus,ProviderStatus} from '../../../creator/service.mjs';
export type {CreatorInput,CreatorRun,CreatorStatus,ProviderStatus};
export interface KivouBridge {
 status():Promise<CreatorStatus>;probe():Promise<ProviderStatus>;runs():Promise<CreatorRun[]>;run(id:string):Promise<CreatorRun>;
 start(input:CreatorInput):Promise<CreatorRun>;cancel(id:string):Promise<CreatorRun>;chooseFolder():Promise<string|null>;
 exportRun(id:string):Promise<{directory:string;files:string[]}|null>;openRun(id:string):Promise<boolean>;
 onChange(callback:(run:CreatorRun)=>void):()=>void;
}
declare global{interface Window{kivou?:KivouBridge}}
