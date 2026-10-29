# Kivou verification

## Current Windows 0.2 preview — 2026-10-29

| Check | Observed evidence | Boundary |
| --- | --- | --- |
| Creator/runtime tests | 29 passing, 0 failing: `node --test creator/tests/*.test.mjs` | Controlled process and filesystem fixtures, not 29 live model calls |
| TypeScript/Vite | `npm run build` passed | Focused `ui/creator`, not a fresh build of every upstream Rust/desktop package |
| Native island | [Packaged smoke](../../qa/island-smoke.json) | Actual transparent always-on-top window, expand/collapse, workspace restore, consent gating |
| Original workflow regression | [Desktop smoke](../../qa/desktop-smoke.json) | Real deterministic inventory of synthetic files; originals unchanged; 1440/900/390 widths |
| Project conversation | [Actual packaged model run](../../qa/assistant-live.json) | Three real Codex calls, context recall, persisted reload, content handoff and direct island note |
| Island restart/cancellation | [Actual packaged recovery](../../qa/island-recovery-live.json) | Two real calls across full quit/relaunch and an intervening cancelled turn; last successful context retained |
| Short native work area | [Constrained check](../../qa/island-constrained.json) | Actual packaged window, simulated 480px work area and long synthetic failure/partial response; footer reachable by scrolling |
| Independent design review | [Review and focused verdict](../../qa/island-finish-review.md) | Two material findings fixed and scored resolved; `ship` covers those fixes, not a full security or feature-parity audit |
| Dependency audit | Runtime `npm audit --omit=dev --json`: 0 vulnerabilities | A point-in-time package audit, not a whole-product security guarantee |
| Shipped JavaScript | [REA summary](../../qa/rea-island-summary.json), [SHA manifest](../../qa/rea-island-manifest.json) | Exact packaged extraction; dynamic IPC, renderer dependencies and native Rust not proven by static analysis |
| English product video | [Playback receipt](../../qa/promo-v0.2.json), [promo QA](../../promo/QA.md) | 24s, 1080p/30fps; actual interface captures and real model replies over original demonstration input; inventory synthetic |

No paid client material or synthetic payment is part of this evidence. Model calls used the existing ChatGPT login through Goose/Codex ACP; account limits apply.

## Prior failures and their resolution

- The original upstream desktop was launched to a `React ready` log; the full original dependency build did not complete. Kivou's separate focused UI build and packaged app were tested instead. No full Rust build/test claim is made.
- A prior Research call failed after a native tool event suppressed the final text in Goose Chat mode. Research uses the approve bridge mode while Codex remains read-only. The corrected call completed; source suggestions remain unverified.
- The first assistant trial returned useful Markdown but the deliverable parser expected JSON. General conversation now accepts the actual Markdown reply and wraps it in the local JSON run record. Structured creator workflows retain their schema checks.
- An island label remained working after completion and native collapse could leave the renderer expansion state stale. Native and renderer state are synchronized; the packaged lifecycle test passes.
- One early packaged assistant test was cancelled before completion; its old capture did not identify the initiating UI action. Later instrumented actual packaged tests passed. Cancellation records now identify workspace, island or application-quit origin.
- A transparent Playwright screenshot was tiled. Published native island captures use `BrowserWindow.capturePage` after font/frame settle and were opened for visual validation.
- Independent review found that island context was process-local and constrained-height content could be clipped. Both are fixed and verified through full-process recovery and constrained-height tests.

## Scope and remaining limits

Windows x64 only is tested. The portable build is unsigned. Codex CLI and Node.js 24+ must already be installed for AI work; the ACP adapter is bundled, and its unused optional native Codex copy is excluded. There is no paid API fallback.

General conversation is drafting/advice with no shell, file access, MCP, plugins or automatic publishing. A project is bounded to 20 turns and 80,000 characters of context. Research suggestions are not independently retrieved or verified by Kivou. Asset inventory is metadata-only.

No physical phone test, human screen-reader session, code-signing, whole-process-tree live-AI memory benchmark, other-platform support or full Goose/Coucou parity is asserted. Native work-area constraints were simulated in the test process, not by changing the user's display settings.

Public source is at [rayaneDR/kivou](https://github.com/rayaneDR/kivou), default branch `kivou`. Release upload/publication receipts are recorded separately in [publishing.json](../../qa/publishing.json); a draft or uploading asset is not a public download.
