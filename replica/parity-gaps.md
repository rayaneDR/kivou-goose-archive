# Kivou scope correction — 2026-10-29

The owner says the current result does not match the intended product. Public Windows release remains a draft while the revised island and conversation experience is verified. No claim of full Goose parity or superiority is justified by the current evidence.

## Observed difference

The packaged `ui/creator` app exposes three bounded creator workflows. It does not expose the general-purpose upstream desktop interface merely because upstream source remains in the repository.

| Capability | Current packaged Kivou | Source evidence / remaining work |
| --- | --- | --- |
| Creator workflow forms and review/export | Implemented and tested | `ui/creator/src/App.tsx`, `creator/service.mjs` |
| General assistant conversation | Not implemented in focused creator UI | Upstream `ui/desktop/src/components/ChatSessionsContainer.tsx`, `hooks/useChatSession.ts`; integration and runtime tests needed |
| General session browser | Creator runs only | Upstream `components/sessions/SessionsView.tsx`; conversation/session persistence needs explicit integration |
| Broad model/provider configuration | Codex ACP only | Upstream `components/settings/SettingsView.tsx`; expanding providers requires setup and failure-path tests |
| User-managed extensions/tools | Intentionally disabled in bounded creator runs | Requires explicit permissions, tool approval and confinement design before enablement |
| General workspace assistant | Metadata folder grant only | Requires an explicit user-selected workspace and approval boundaries for writes/execution |
| Kivou identity | Original focused UI and repository default branch | GitHub fork attribution correctly remains; upstream contribution credits must remain |

A full Goose-like product requires a broader core assistant loop than the three-form v0.1 creator slice. Rebranding alone does not implement these capabilities. The owner clarified that CLOBER was a typo and explicitly requested a Dynamic Island-like agent, with Coucou as a behavior reference. The new v0.2 adds native island and saved project conversations. Broader tool execution and provider parity remain separate, unimplemented scope.

## Implemented correction
Native Electron island: compact/expanded, live run state, direct consented model messages, cancel, restore workspace and tray/shortcut access. Project conversation: server-owned history, saved brief, follow-up context, safe Markdown rendering and handoff to creator workflows. Final packaged verification is recorded separately in qa/island-smoke.json and qa/assistant-live.json.
