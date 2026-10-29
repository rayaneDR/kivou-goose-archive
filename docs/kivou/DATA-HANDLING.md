# Kivou data handling

Kivou's creator workflows use local run records. AI features still require a configured model provider, which receives the prompt and supplied content. Local storage does not mean offline inference.

## What each workflow handles

| Workflow | Read locally | Sent to the model | Stored as output |
| --- | --- | --- | --- |
| Research Brief | Form fields and optional URLs supplied by you | Topic, audience, language and supplied links | Draft brief, unverified source suggestions, uncertainties and run state |
| Content Pack | Idea or text transcript supplied by you | Topic, audience, language and supplied text | Hooks, script, shot list, captions, platform copy and run state |
| Asset Manifest | File names, sizes and modification times in the chosen folder | Nothing for deterministic inventory | Inventory and proposed names; originals remain in place |

Research enables only provider-native web search; an actual call completed with one W3C source suggestion. Content Pack disables web search. Research source links remain unverified and distinguish user-supplied from model-suggested URLs. Their retrieval status is `not-independently-observed`; a returned link or a model's claim of reading it is not independent evidence of retrieval or truth.

## Execution and credentials

The new service starts model work through the pinned Goose CLI with `codex-acp`. It uses a separate run configuration with empty recipe extensions; it does not copy this development chat's plugins or credential files into Kivou. Codex uses its normal existing account authentication. The initial workflow requires a ChatGPT login and does not fall back to a paid API key.

The adapter goes through a guard that checks ordinary CLI MCP metadata, uses only names/enabled bits and disables inherited MCP entries. Transport fields are discarded rather than logged or stored. Plugins, apps, hooks, shell execution and host skill discovery are disabled for workflow runs. The guard writes a fixed policy receipt, not a copy of user configuration. Research uses Goose's `approve` bridge mode to preserve final text after native-search notifications; in the pinned provider, this still maps to Codex read-only with the same guard restrictions. [Isolation evidence and limits](../../creator/ISOLATION.md).

Main-process code must grant source and export folders through a native picker. Renderer input alone cannot grant arbitrary filesystem access or select an executable. Asset inventory rejects linked roots, skips nested links and avoids app-data overlap. The source folder is read for metadata; the service does not move, rename or delete its contents.

## Retention and exports

Each task has a unique local run folder with timestamps, state and events. Completed output is stored as Markdown and JSON. Cancelled, failed or interrupted tasks retain partial material when available. Restarting the app does not replay unfinished model calls.

An export creates a new delivery directory. It includes deliverables and reviewable state, events or partial output; isolated runtime profiles, recipes, environment variables and credential stores are excluded. Treat a delivery folder as user data and inspect it before sharing it.

Credential-shaped strings are redacted from persisted model output and errors as a precaution. Redaction is not a promise that arbitrary sensitive text will be detected. Avoid entering secrets or content that you lack permission to send to your provider.

## Public artifacts

Screenshots, examples and product video use synthetic content. Personal paths, account details, client footage, prompts and raw private run logs do not belong in the public repository or release. The inherited goose application's broader settings and integrations are separate from the new creator workflow contract; do not assume every upstream capability has the same data boundary as Asset Manifest.

There is no publishing or message-sending step in the three creator workflows. Generated copy is a draft for the user to review.

## Project conversations and island continuity

A consented conversation request sends the project brief, current message and earlier successful turns from that project to Codex. The service reconstructs history from its own saved run records; the renderer cannot inject an arbitrary history array. Context is limited to 20 turns and 80,000 characters. A cancelled/failed turn remains visible in records but never replaces the last successful island context.

`island-state.json` stores only the last successful island run ID, alongside local run data. It is restored on restart; invalid pointers fall back to saved successful island notes. The island reads only Kivou run status/results. It does not monitor other applications, read the screen or clipboard, or import account/plugin credentials. A tray quit ends the app; no auto-start is installed.

Markdown rendering skips raw HTML and remote images. Model-suggested links are displayed as text rather than automatically opening browser windows. Local exports include the chosen answer's run record and brief, not the full linked conversation history.
