# Kivou architecture

## Stack and ownership

Kivou retains the pinned goose Rust backend, CLI and ACP/MCP foundation, plus the unchanged general-purpose desktop source. The creator distribution is a separate focused Electron/React application in `ui/creator`, with a dependency-free Node ESM workflow service, a narrow preload bridge and a creator UI. No new cloud service, account database or billing system is required.

The dedicated app avoids building unrelated upstream desktop dependencies and its large cross-platform workspace. Its TypeScript/Vite build has passed. The original upstream dependency installation failed on npm networking and optional cross-platform packages; that failure is retained as a baseline limit, not reported as a successful full upstream build.

The backend integration contract is authoritative in `creator/service.d.mts` and [creator/README.md](../creator/README.md). The focused desktop entry is `ui/creator/main.cjs`; its sandboxed preload exposes the limited `kivou:*` IPC calls. The main process checks the sender window, owns runtime paths and folder grants, and keeps generated content out of Node execution.

## Calls and data flow

| Action | Input | Result | Boundary |
| --- | --- | --- | --- |
| Initialize | Main-selected app data directory and runtime paths | Restored run history/status | No model call or automatic replay |
| Probe provider | Main-selected Goose/Codex/ACP commands | Provider availability and repair message | Login readiness is not inference success |
| Start research/content | Validated topic, audience, text/URLs, language | Persisted run and progress updates | One run at a time; model access required |
| Start assets | Native-picker-authorized source directory | Metadata manifest/proposed names | No file-content reading or source mutation |
| Cancel | Existing active run ID | Cancellation request and terminal run update | Terminate only this run's process tree |
| Export | Existing run ID and picker-authorized destination | New unique child directory and file list | No overwrite; no runtime profile/credentials exported |

Main chooses trusted paths. Renderer requests cannot select arbitrary executable paths or widen file grants. Generated content is untrusted and is displayed as text or sanitized Markdown.

AI execution launches the upstream Goose CLI using `codex-acp`, model `current`, isolated per-run configuration, no profile/session reuse and empty recipe extensions. Content Pack uses supplied text with native web search disabled. Research Brief enables only provider-native search and has completed one actual call; returned links remain unverified regardless of model claims. Content uses Goose `chat` bridge mode; Research uses `approve` because the pinned Chat bridge suppresses final text after ACP tool-start notifications. Both map to Codex read-only, with unchanged shell/MCP/plugin restrictions and Codex approvals `never`.

The adapter invokes `creator/codex-guard.mjs`. The guard checks ordinary CLI MCP metadata, retaining names/enabled bits only, disables inherited MCP entries and checks again before startup. It disables plugins/apps/hooks, shell execution and host skills for the workflow. CLI authentication remains with Codex; credentials are not read or copied by the app. A fixed run-policy receipt is required before marking AI work complete. [Isolation evidence](../creator/ISOLATION.md) records the behavior and limits. There is no automatic paid-provider fallback.

## Local records

Each run uses a UUID directory beneath app data. Records include `state.json`, `events.jsonl`, `result.json` and `result.md`. Partial model text or a partial asset manifest is retained when available. Runtime recipes/profile are private local implementation records, excluded from delivery exports.

States are `running`, `completed`, `cancelled`, `failed` and `interrupted`. Initialization changes an unfinished persisted run to interrupted without starting a process. Export uses a separate unique directory, so repeated exports retain earlier versions. No relational schema or server migration is needed for v1.

Research results always mark sources unverified and distinguish user-supplied URLs from model-suggested URLs, with retrieval status `not-independently-observed`. A source URL does not establish that it was fetched or that associated text is true. Content results are validated for three hooks, script, shot list, captions and platform copy before they become complete deliverables.

## Failure and resource handling

- Reject unsupported/empty inputs before execution and explain missing provider setup.
- Permit one active task; never silently queue parallel model processes on an 8 GB machine.
- Keep completed/partial records when a process fails, times out or is cancelled.
- Reject linked source roots; skip nested links and configuration directories. Reject app-data/source overlap to avoid self-inventory.
- Use run-scoped process termination and never kill unrelated Codex or Goose sessions.
- Redact token-shaped material from persisted model text and errors. Do not export isolated profiles, command environments or credential stores.
- No automatic sending or public publishing is part of these workflow APIs.

## Integration and verification order

1. Preserve upstream baseline and license; establish the official Windows runtime starts.
2. Verify the service with controlled process fixtures and real temporary filesystem tests.
3. Connect a single creator workflow through the preload bridge and prove an exported result survives restart.
4. Complete research, content and asset UI states with keyboard/narrow-window checks.
5. Run one actual Codex ACP workflow and record latency, outcome and memory observations separately from fixtures.
6. Package Windows x64, launch the portable build with a clean test profile, then produce checksums and release notes.

The Windows distribution bundles the official pinned Goose backend and the ACP adapter with the new Electron application. Node.js and a normally authenticated Codex CLI remain user prerequisites. Rust code is unchanged; no local Rust rebuild, full upstream test suite or custom Rust executable is claimed by this build path.
