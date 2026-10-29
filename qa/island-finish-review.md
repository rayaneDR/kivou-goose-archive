disposition: fix

Inputs missing: no surface direction-contract file or QUALITY BAR card was supplied; this review uses the explicitly pinned local Operate extension, PRODUCT.md and incumbent DESIGN.md. No approved comp applies. Scope: static packaged captures and source/evidence review; no app/browser launched, no independent model calls, no human screenreader test.

## persistence

Pass for product/design records and saved workspace conversation evidence. PRODUCT.md accurately limits general conversation to advice/drafting and separates live research. DESIGN.md matches the retained paper/ink/citron system and self-hosted DM Sans. qa/assistant-live.json reports three actual packaged model calls, context recall, renderer-reload persistence and handoff; qa/island-smoke.json separately reports deterministic native lifecycle checks. Fail for durable quick-note continuity: ui/creator/island-controller.cjs:5 initializes islandParent only in process memory, and :16–18 use only that pointer to attach earlier notes. A restart discards it; a failed/cancelled latest island turn also causes the next note to drop the prior successful chain. Workspace records may survive, but the island silently starts another conversation.

## fidelity

All six required captures opened and validated: .impeccable/review/island/{1440,900,390,expanded}.png and qa/island-{compact,expanded}.png. Workspace captures start at document top; island captures show the actual transparent native viewport. The empty transparent area below rounded island content is expected, not a broken black content region.

| Element | Status | Evidence |
|---|---|---|
| TYPE | match | DM Sans, clear workspace heading/body hierarchy and legible island labels; island.css now sets functional secondary text to 11px. |
| MATERIAL | match | Crisp original vector K and flat UI surfaces; no imitation physical assets or asset substitution. |
| GROUND | match | Workspace inherits #f6f5f0 and #24251f; compact companion uses the same ink family and citron action/status roles, consistent with its desktop overlay purpose. |
| Compact/expanded companion | match | qa/island-compact.png, qa/island-expanded.png: recognizable top handle, open state, consent, direct note entry and workspace handoff. |
| Responsive workspace | adaptation | 900 and 390 captures stack the project context above conversation; this serves PRODUCT.md's Windows preview and DESIGN.md's narrow-window reflow. The 900 full-document capture places the sticky composer over part of the transcript; static evidence alone cannot distinguish full-page capture treatment from an actual reading obstruction, so this is not scored a confirmed defect. |
| Consented model interaction | match | Visible unchecked disclosure in all composer captures; controller :15 requires consent; Assistant.tsx gates send on consent, connection and one active run. |
| Durable island notes | contradicted | Consent says “this note and earlier island notes”; controller :5, :16–18 silently omit saved earlier context after process restart or a failed latest turn. |
| Expanded controls at constrained work-area height | contradicted | controller :7 clamps the window to workArea.height−24, while island.css sets .island overflow:hidden/max-height:100dvh without a scrollable expanded container. At a short work area, including high Windows scaling, lower consent/actions/footer can be cut off and cannot be scrolled into view. Tall result/error states compound this. Current screenshots prove idle and short completed states only. |

## ceiling

The compact K-led presence and restrained workspace belong to one identity. No comp or quality-board comparison is available. Existing screenshots establish idle and short completed finish; running, failure, long preview, small native work-area and full-process restart are source-reviewed only. No full Goose/Coucou parity or autonomous computer-operation claim is supported or made. Existing glyph arrows/minus are a minor icon-system inconsistency against the craft floor, below the two functional fixes here.

## material_fixes

1. [P2 — durable context/consent truth] Restore a persisted island conversation identity and resolve its latest successful parent, including after cancellation/failure; alternatively explicitly label and create a new session with an accessible way to resume saved notes. Resolution: after a full quit/relaunch, a consented follow-up recalls a prior island fact; a cancelled turn followed by another note retains the last successful context. Evidence: island-controller.cjs:5, :16–18 and island.html quick-consent text.
2. [P2 — reachable controls] Give expanded content an actual bounded scroll path or adapt the layout to its available native height, keeping the compact handle reachable. Resolution: at a 480px work-area height and with long completed preview/error text, note consent, send, workspace handoff, stop when active, and hide can all be reached by keyboard and scrolling without clipped focus. Evidence: island-controller.cjs:7; island.css .island and #expanded. Recapture the same required files after the batch and provide constrained-height evidence for this fix.

## keep

Keep the original geometric K, inherited warm workspace/ink companion/citron language, English action copy, explicit model consent, separate research workflow, real saved records and honest packaged-test distinction; do not dilute these while resolving the two island lifecycle/layout defects.

---

## verdict

Focused verdict pass, 2026-10-29; this scores the two listed P2 fixes only. Opened and validated refreshed .impeccable/review/island/expanded.png and qa/island-constrained.png. No app/browser launch or new general defect hunt.

1. **Resolved — durable island context.** island-state.cjs restores a completed Island notes parent from an atomically written pointer, falling back to saved eligible completed notes. island-controller.cjs keeps pending turns separate and promotes only successful completions; cancellation/failure preserves the successful parent. qa/island-recovery-live.json records two real packaged-model calls, full quit/relaunch, preserved cancellation context and verified recall. qa/rea-island-manifest.json records source/package equality. This meets the requested continuity/recovery criterion at the supplied test scope.
2. **Resolved — reachable expanded controls.** island.css now uses a fixed flex handle with an independently scrolling expanded region (flex:1, min-height:0, overflow-y:auto). qa/island-constrained.png shows the fixed handle, visible scrollbar, long synthetic content and reachable consent, note entry, workspace handoff and Hide footer at the bottom. qa/island-constrained.json records a 480px work area, 456px native window, scrolling, reached footer and working Hide. The refreshed normal expanded capture remains intact. This meets the constrained-height reachability criterion; keyboard and active Stop reachability are supported by the same scrolling container and source structure, not a separate human keyboard test.

## remaining

Clear for the two scored findings. No fix-induced regression observed in the provided normal and constrained island captures. This ship verdict covers those fixes, not a new whole-surface or feature-parity review.

disposition: ship
