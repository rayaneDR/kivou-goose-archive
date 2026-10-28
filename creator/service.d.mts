export type Workflow = 'research' | 'content' | 'assets';
export type RunStatus = 'running' | 'completed' | 'cancelled' | 'failed' | 'interrupted';
export interface CreatorInput {
  workflow: Workflow;
  topic?: string;
  audience?: string;
  text?: string;
  urls?: string[];
  language?: string;
  sourceDir?: string;
}
export interface CreatorResult {
  title: string;
  markdown: string;
  reviewRequired: boolean;
  sourceStatus?: 'unverified';
  sources?: Array<{url:string; title:string; evidence:string; verification:string; provenance:'user-supplied URL'|'model-suggested URL'; retrievalStatus:'not-independently-observed'}>;
  uncertainties?: string[];
  hooks?: string[];
  script?: string;
  shotList?: string[];
  captions?: string[];
  platformCopies?: {youtube:string; instagram:string; linkedin:string};
  files?: Array<{path:string; bytes:number; modifiedAt:string; proposedPath:string}>;
  skipped?: string[];
}
export interface CreatorRun {
  id: string;
  workflow: Workflow;
  title: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  directory: string;
  input: CreatorInput;
  reviewRequired: boolean;
  files: string[];
  error: string | null;
  progress: string;
  result?: CreatorResult;
}
export interface ProviderStatus {
  ready: boolean;
  checkedAt: string | null;
  message: string;
  gooseVersion?: string | null;
  codexLoggedIn?: boolean;
  adapterAvailable?: boolean;
}
export interface CreatorStatus {
  activeRunId: string | null;
  provider: ProviderStatus;
  runsDirectory: string;
}
export interface CreatorOptions {
  dataDir: string;
  gooseBinary?: string;
  codexCommand?: string;
  codexAcpCommand?: string;
  codexGuardScript?: string;
  nodeCommand?: string;
  env?: Record<string,string | undefined>;
  onChange?: (run:CreatorRun) => void;
  timeoutMs?: number;
}
export class CreatorService {
  constructor(options: CreatorOptions);
  initialize(): Promise<CreatorStatus>;
  subscribe(listener:(run:CreatorRun)=>void):()=>void;
  getStatus():CreatorStatus;
  listRuns():CreatorRun[];
  getRun(id:string):CreatorRun;
  probeProvider():Promise<ProviderStatus>;
  start(input:CreatorInput):Promise<CreatorRun>;
  cancel(id:string):Promise<CreatorRun>;
  exportRun(id:string,directory:string):Promise<{directory:string;files:string[]}>;
}
export function validateInput(input:CreatorInput):CreatorInput;
export function validateModelResult(text:string,workflow:'research'|'content',suppliedUrls?:string[]):CreatorResult;
export function redact(value:unknown):string;
