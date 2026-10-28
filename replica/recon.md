# Kivou recon map

## Agreed target

Windows x64 creator assistant, based on a licensed fork of goose v1.56.0. Audience: independent creators and freelancers who need a research brief or content delivery pack. The core loop is **choose workflow → provide inputs → run → review → export**.

The user explicitly chose a fork over a clean-room recreation. Replica's mapping and verification discipline is used here; source reuse is disclosed and governed by the upstream Apache-2.0 license. This is not represented as original implementation of the inherited goose runtime.

## Sources and evidence

| Source | What it establishes | Limits |
| --- | --- | --- |
| https://github.com/aaif-goose/goose/tree/v1.56.0 | Exact upstream release source | Source inspection does not establish runtime success |
| https://github.com/aaif-goose/goose/blob/v1.56.0/CUSTOM_DISTROS.md | Documented distribution/customization approach | Does not guarantee a fork builds |
| https://goose-docs.ai/docs/guides/acp-providers/ | Codex ACP setup and provider boundaries | Current documentation may differ from a pinned release |
| https://learn.chatgpt.com/docs/auth | Official Codex account authentication methods | Does not establish this account's remaining capacity |
| https://github.com/aaif-goose/goose/releases/tag/v1.56.0 | Released Windows artifacts | No fork executable has been validated yet |
| Local `creator/service.d.mts`, `creator/README.md` and `ui/creator` | Implemented service and focused desktop integration | Packaged-path retest remains separate |
| Local `qa/desktop-smoke.json`, `qa/live-model.json` and `qa/research-approve-live.json` | Packaged Electron smoke and actual Content Pack/Research calls | Research retrieval remains unverified; final ZIP/publication pending |

Recorded source commit: `9949cf926cd42f1d128b9991ed23a496ecace896`.

## Baseline observed

- Official prebuilt `goose.exe --version` returned `1.56.0`.
- Official desktop executable was launched with an isolated profile. Its log reached `React ready`; visual usability has not been confirmed by this record.
- Installed Codex CLI reports a ChatGPT login. A real Content Pack through Goose 1.56/Codex ACP 2.3.0 completed in 40.678 seconds. A corrected Research call completed in 45.683 seconds with one unverified W3C source suggestion; this adds actual inference evidence beyond the login check.
- Original upstream dependency installation failed on npm networking/optional cross-platform packages. The separate focused `ui/creator` installation and TypeScript/Vite build passed.

## Screen inventory

These stable Kivou target IDs describe the focused creator application. Development and packaged smoke tests exercised the three forms, connection/consent gates, native folder bridge, actual asset inventory and persisted result reload. The final repackage check after the Research bridge fix remains pending.

| ID | Screen | Entry | Purpose | Required states |
| --- | --- | --- | --- | --- |
| S01 | Welcome and model connection | First launch/settings | Explain data flow, detect provider, repair setup | Checking, ready, missing CLI/adapter/login, unavailable model |
| S02 | Creator dashboard | App start after welcome | Choose workflow; inspect recent runs | Empty, recent runs, active run, recovered interrupted run |
| S03 | Research Brief form | Dashboard | Collect topic, audience, links and output language | Empty, invalid URL/input, ready, model unavailable |
| S04 | Content Pack form | Dashboard | Collect idea/transcript, audience and output language | Empty, invalid input, ready, model unavailable |
| S05 | Asset Manifest selection | Dashboard/native folder picker | Grant metadata inventory scope | No selection, cancelled picker, selected, denied, unsupported link |
| S06 | Run and result review | Workflow submission/run history | Show progress, cancel, inspect output and provenance | Running, completed, cancelled, failed, interrupted, partial result |
| S07 | Export result | Result review/native folder picker | Create a separate delivery directory | Cancelled picker, exporting, exported, permission error |

## User flows

- **F01 Research:** S01 → S02 → S03 → S06 → S07. Missing source evidence stays labelled unverified; unavailable provider blocks execution.
- **F02 Content:** S02 → S04 → S06 → S07. Transcript is text supplied by the user; no media ingestion or transcription is implied.
- **F03 Assets:** S02 → S05 → S06 → S07. Metadata inventory only; original files are untouched.
- **F04 Recovery:** restart → S02 → S06. Incomplete recorded runs become interrupted; a model call is never replayed automatically.
- **F05 Cancellation:** S06 running → cancel → cancelled state with retained partial output. A second run is rejected while a first run owns the execution slot.

Happy-path click counts will be measured from the working UI; inventing counts before rendering would not establish a baseline.

## Components and data

Repeated components: workflow chooser, labelled input/textarea, language selector, source list, folder picker button, provider status/repair panel, run-status indicator, result viewer, cancel control and export feedback. Keyboard and narrow-window behavior require verification.

The implemented local service defines `CreatorInput`, `CreatorRun`, `CreatorResult`, `ProviderStatus` and `CreatorStatus`. A run has an immutable ID, workflow, timestamps, status, input, progress, output paths and optional result/error. Results carry `reviewRequired` and, for research, always-unverified source status, provenance, retrieval status and uncertainties. Evidence: `creator/service.d.mts`; actual Content Pack and corrected Research calls are recorded separately from fixtures. Per-URL retrieval is not independently observed.

## Boundaries and size

Out of scope: media generation, transcription, billing, hosted accounts, social publishing, unattended external actions, a multi-agent team UI and support claims for untested operating systems. No upstream brand assets are promoted as a new Kivou identity.

Size: M, a focused fork customization. Screenshots, actual Content Pack/Research calls, packaged smoke and a verified 24-second Remotion video now exist. Final repackage, ZIP and GitHub publication remain to finish. Existing evidence does not establish market demand or an exhaustive feature match to upstream.
