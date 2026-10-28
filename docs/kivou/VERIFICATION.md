# Verification record

This record separates source inspection, controlled fixtures, a development application, live inference and a packaged distributable. It does not treat one as proof of another.

## Observed results

| Check | Result and evidence | Limit |
| --- | --- | --- |
| Source identity | goose v1.56.0 / `9949cf926cd42f1d128b9991ed23a496ecace896` | Inherited Rust and desktop source preserved |
| Official Windows CLI | `goose.exe --version` returned `1.56.0` | Runtime command, not a local Rust build |
| Original desktop baseline | Isolated upstream executable reached `React ready` in its log | No completed visual interaction cycle claimed for that original app |
| Original desktop dependencies | npm networking/optional cross-platform package failures | Full upstream workspace build did not pass |
| Focused creator dependencies | `ui/creator` installation completed | Separate from original upstream workspace |
| Creator build | `npm run build` in `ui/creator` passed TypeScript and Vite | Source build, not packaged-app proof |
| Creator tests | Root `node --test creator/tests/*.test.mjs`: 24/24 passed on the final creator runtime | Controlled process fixtures/filesystem cases; real calls recorded separately |
| Packaged Electron | [desktop-smoke.json](../../qa/desktop-smoke.json), passed; provider availability true | Packaged app exercised deterministic inventory, not a whole live AI cycle through its UI |
| Real Content Pack | [live-model.json](../../qa/live-model.json), completed via Goose 1.56.0 / Codex ChatGPT / ACP 2.3.0 | One live content run; no live research proof |
| Real Research Brief | [research-approve-live.json](../../qa/research-approve-live.json), completed in 45.683 seconds with 1 W3C source | Source status remains unverified; retrieval not independently observed |
| Windows app directory | Packaged smoke passed after adapter-shim fix | Final repackage after Research-mode fix and ZIP still pending |
| Public GitHub repository/release | Not yet verified | Intended canonical repository is `rayaneDR/kivou`; no publication receipt yet |
| English Remotion product ad | [MP4](../media/kivou-introduction.mp4), 24seconds /1080p/30 fps; [QA](../../promo/QA.md) passed still and actual Edge playback checks | Uses real preview-form captures and actual inventory over synthetic files; not an AI-result demonstration |

## Packaged smoke scope

The recorded packaged Electron test exercised all three workflow forms, AI gating on connection and consent, the native folder-selection bridge, and an actual Asset Manifest run over three synthetic files including an Arabic filename. It checked originals unchanged, persisted results after renderer reload, provider availability, no renderer errors, and no horizontal overflow at 1440, 900 and 390 pixels.

This combines synthetic input files with real deterministic inventory and Electron IPC. It does not mock an AI response or establish a physical mobile device test. [Actual dashboard capture](../../qa/dashboard.png). The packaged check follows a previous development smoke; the current JSON explicitly records `scope: packaged app`.

## Live model outcome and earlier failure

The recorded Content Pack completed in **40.678 seconds**, returned three hooks and produced `result.md`, `result.json`, `state.json` and `events.jsonl`. The input was an original demonstration brief with no client material. The result was a real provider response, not a synthetic test response.

An earlier actual content attempt failed on a denied tool call. The recipe was corrected to transform only supplied text with tools/web search disabled; the later run succeeded. The failure is not presented as a first-pass success or silently replaced with invented output.

The content run's `serviceRssBytes` value is **49,438,720 bytes for the Node service process only**. It is not total Electron/Goose/Codex memory consumption or peak memory. The packaged smoke separately recorded Electron-process working set **447,516 KB**, peak **469,252 KB**, during a deterministic workflow with **no active model process**. These scopes must not be combined into a total live-AI memory benchmark.

## Research failure and correction

The first actual Research call failed after 64.912 seconds without a valid JSON deliverable; [research-live.json](../../qa/research-live.json) records that failure. The pinned Goose Chat bridge suppresses assistant text after ACP tool-start notifications, including native search. Research was changed to Goose `approve` bridge mode, which still maps to Codex read-only in this provider. MCP, shell and plugins remained disabled; Codex approvals remained `never`.

The corrected call completed in **45.683 seconds**, producing one W3C source entry. Its recorded runtime policy enables only native web search, and `retrievalIndependentlyObserved` remains false. A returned source is not presented as verified retrieval or verified fact.

## Video artifact

`docs/media/kivou-introduction.mp4` is **5,212,909 bytes**, **24.000 seconds**, **720 frames**, **1920×1080**, **30 fps**, with H.264 video and AAC stereo audio. SHA-256: `020118aef84958413daade729f4334c4172ee5f07a5be34e5bf275249367d6d7`.

The encoded video was inspected at selected frames and loaded in Microsoft Edge; playback advanced beyond one second, unpaused, with no media error. It contains original synthesized audio and actual application captures. Research/Content are labelled preview forms; Asset Manifest uses synthetic fixture filenames and a real deterministic result. [Complete promo QA](../../promo/QA.md).

## Evidence still required

| Check | Remaining evidence |
| --- | --- |
| Final automated rerun | Completed: 24/24 passing creator tests |
| Final packaged rerun | Completed after Research/guard fixes; provider check and deterministic workflow passed |
| Packaged live model workflow | Completed through actual Kivou.exe: [packaged-model.json](../../qa/packaged-model.json), 50.928 seconds and 3 hooks |
| Portable ZIP | Completed: [release.json](../../qa/release.json), Windows archive CRC verified, SHA-256 recorded |
| Research source verification | No independent per-URL retrieval mechanism implemented; sources remain unverified |
| Full application resources | Whole-process-tree observation if a total-memory claim is made |
| Public artifacts | Secret/path review and GitHub success receipts |

## What is covered by fixtures

Creator tests cover input/result validation, Unicode preservation, directory-link confinement, unique exports, provider gating, isolated configuration, cancellation, interruption, malformed output and research provenance. Runtime-isolation checks are described in [creator/ISOLATION.md](../../creator/ISOLATION.md). Their controlled process events do not establish live provider availability.

Research source labels are always `unverified`, with `user-supplied URL` or `model-suggested URL` provenance and `not-independently-observed` retrieval status. No current source-retrieval proof is inferred merely from model text.

No full Rust test suite, successful full original desktop build, code-signing status, other-OS compatibility, whole-app live-AI memory figure or public release success is asserted by these results. GitHub fork/repository creation is unavailable in the connected toolset, CLI authentication is unavailable, and browser control was stopped when its URL could not be verified. The intended `rayaneDR/kivou` repository was not found; no public repository or release is claimed.

## Bounded REA artifact analysis

[REA summary](../../qa/rea-summary.json) and [shipped-file SHA manifest](../../qa/rea-shipped-manifest.json) describe an exact extraction from the final packaged app. REA analyzed main/preload/service/guard as inert JavaScript. It observed one browser window, one bridge and ten exposed bridge members; dynamic IPC binding and runtime enforcement remain outside its static proof. It did not analyze renderer dependencies or the native Rust binary. Actual packaged tests provide separate runtime evidence.

The independent visual review recommendations were implemented: heading focus on navigation, a polite progress region and asset-table semantics. Final packaged DOM assertions passed; no human screen-reader session is claimed.

## Local release artifacts

The Windows ZIP is 382,979,300 bytes; the full inherited-source ZIP is 322,004,905 bytes. Both were generated from the tested package/source and hashed; the Windows ZIP passed full CRC validation. Source archive commit: `861b3f1b3d2cbc5561d679fd39ce1580622fc83e`. Later documentation/evidence commits do not change the packaged implementation. The public repository and release remain uncreated until owner-operated GitHub authentication completes.
