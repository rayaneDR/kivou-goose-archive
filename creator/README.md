# Kivou workflow backend

Dependency-free Node ESM, used only from the Electron main process. This is an additive module for the Goose v1.56.0 fork; it does not replace the Rust agent or ACP/MCP interfaces.

```js
import {CreatorService} from './service.mjs';

const service = new CreatorService({
  dataDir: '/absolute/application-data/kivou',
  gooseBinary: '/absolute/bundled/goose',
  codexCommand: '/absolute/path/to/codex',
  codexAcpCommand: '/absolute/path/to/codex-acp',
  codexGuardScript: '/absolute/packaged/creator/codex-guard.mjs',
  nodeCommand: '/absolute/path/to/node',
});
await service.initialize();
service.subscribe(run => console.log(run.id, run.status));
await service.probeProvider();
const run = await service.start({
  workflow: 'content',
  topic: 'Making room for creative work',
  audience: 'Independent creators',
  text: 'A small, clear workspace makes it easier to start.',
  language: 'English',
});
```

## Integration contract

- `initialize()` restores recorded runs and marks unfinished ones `interrupted`; it never replays model calls.
- `probeProvider()` checks runtime availability, ChatGPT Codex login and the ACP adapter. It does not make a paid/model call. A successful probe is not proof of model access.
- `start(input)` returns a persisted `CreatorRun` immediately. Progress arrives via `subscribe`; poll `getRun(id)` if preferred. Only one run executes at a time.
- `cancel(id)` requests cancellation and terminates only that run's spawned process tree on Windows. The terminal state arrives through the usual change subscription.
- `exportRun(id, trustedDirectory)` creates a unique child directory and copies only deliverables/status/events/partial output. It never overwrites an existing export.
- `listRuns()`, `getRun(id)` and `getStatus()` return copies. Complete TypeScript interfaces are in `service.d.mts`.

The Electron main process must choose `dataDir` and executable paths itself. It must grant asset folders and export folders through native folder pickers and validate renderer requests against those grants. Do not expose arbitrary option mutation or arbitrary filesystem reads over IPC. Render generated Markdown as text or sanitized Markdown; it is untrusted model output.

### Workflows

| Workflow | Required input | Output |
| --- | --- | --- |
| `research` | `topic`, `audience`; optional `urls` (max 10), `language` | Linked brief, supplied/model-suggested source labels, uncertainties; always unverified and human review required |
| `content` | `topic`, `audience`, `text`; optional `language` | Three hooks, script, shot list, captions, YouTube/Instagram/LinkedIn copy |
| `assets` | main-process-authorized `sourceDir` | Metadata inventory and proposed names; no file-content reading, moves, renames or deletion |

Outputs live in `dataDir/runs/<uuid>/`: `state.json`, `events.jsonl`, `result.json`, `result.md`. Model runs also keep `partial-response.txt` and an isolated profile/recipe. Asset runs periodically save `partial-manifest.json`; this is explicitly marked incomplete. Source folders containing app data, or contained within app data, are rejected to avoid recursive self-inventory. Junctions and symlinks at the selected root are rejected; nested links and selected configuration directories are skipped. The inventory limit is 10,000 files. Inputs and source pages cannot authorize tool execution or publication.

## Model boundary

AI runs use the upstream bundled Goose CLI with `codex-acp`, `current`, `--no-profile`, `--no-session`, `--output-format stream-json`, and empty recipe extensions. Content uses `GOOSE_MODE=chat`; Research uses `GOOSE_MODE=approve`. In this pinned upstream provider, **both map to Codex read-only**. Research needs the latter because Goose's Chat bridge suppresses all assistant text after an ACP tool-start notification, even for native web search. This change does not relax the Codex guard: shell/MCP/plugins remain disabled and Codex approvals remain `never`. Goose configuration is isolated per run. Common paid-provider API key environment variables are removed. API-key-only Codex login does not enable workflows; there is no automatic paid fallback. The existing Codex CLI performs its own normal account authentication; no auth files are copied into the app or exports.

Content Pack uses **only supplied text** and disables native web search as well as other tools. Research Brief enables only the provider's native `web_search=live` setting while keeping MCP, shell, browser automation and plugins disabled. If that native search is unavailable or denied, the model must return a draft with no source evidence and an explicit uncertainty instead of retrying other tools. The model's output still requires human review. Commentary can precede a final JSON answer in the upstream stream; the parser accepts only a real complete JSON object at the end and never invents a fallback result from denied tool messages.

The adapter is directed through `codex-guard.mjs` via a small Windows command wrapper. The guard uses ordinary CLI `mcp list --json` internally and inspects only each entry's name and enabled bit. All transport/configuration fields are discarded without being inspected, logged, returned or persisted. It applies `enabled=false` to **each** configured name, then runs the check again and refuses the model session if any entry is still enabled. An empty `mcp_servers={}` alone does not clear inherited servers because Codex merges config tables.

The actual app-server starts with strict configuration and explicit per-invocation overrides: plugins, apps, hooks, remote plugins, shell/unified execution, image generation, computer/browser use and automatic skill-MCP installation disabled; host skill discovery skipped; permissions read-only; approvals never; notification commands empty. The per-run root marker prevents ancestor project configuration from being imported. Normal `CODEX_HOME` and CLI authentication remain unchanged. No app code reads or copies `auth.json` or user configuration files. A fixed policy receipt proves the adapter invoked the guard; without it, the workflow cannot be marked complete. It contains no MCP names or credentials. See [ISOLATION.md](ISOLATION.md) for evidence and limits.

The service does not claim that source links prove retrieval or a fact. All research sources remain `unverified; human review required`, with `provenance` explicitly set to `user-supplied URL` or `model-suggested URL`. Every source has `retrievalStatus: not-independently-observed`. The model's statement that it read a page is not independent evidence. If provider web search is unavailable, the model must disclose that; no independent web access is invented. All public publishing remains outside these workflows.

Credential-shaped API tokens, authorization headers and common key assignments are redacted from persisted model text, status errors and exports. This is defense in depth, not a substitute for avoiding secret input. Run recipes/profile are private local app data and are not exported.

## Verification

```powershell
node --test creator/tests/*.test.mjs
```

Tests exercise real filesystem behavior and controlled process-event fixtures, including Unicode preservation, junction confinement, separate exports, provider gating, isolated execution configuration, cancellation, interruption, malformed output and provenance. Fixtures do not establish live Codex/Goose compatibility. A real model workflow and Windows application test must be recorded separately before release.
