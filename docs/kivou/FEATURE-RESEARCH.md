# Agent feature research — 2026-10-29

This is a selection of established public agent projects and official documentation, not a proof of the best repository on the Internet. The goal is useful creator work on an approximately 8 GB Windows PC with no new paid services. No source or proprietary assets were copied for the additions below.

| Reference | Observed feature | Kivou adaptation | Status |
| --- | --- | --- | --- |
| [OpenCode commands](https://opencode.ai/docs/commands/) | Reusable named prompt templates and slash commands | Original creator Playbooks, custom local commands, visible expansion before sending | Implemented; packaged local checks and real-model response verified |
| [Goose recipes](https://goose-docs.ai/docs/guides/recipes/) | Reusable workflows, parameters and saved recipes | Three original included creator playbooks plus editable custom text instructions | Implemented; no new tool permissions granted |
| [OpenClaw memory architecture](https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory-architecture.md) | Curated memory and recall with explicit storage boundaries | User-written brand notes, deliberately inserted into a visible message; local keyword search across saved project messages/answers | Implemented; no embeddings or hidden automatic recall |
| [OpenHands](https://github.com/OpenHands/OpenHands) | General development-agent platform | Studied as a broader reference; no container stack or autonomous system tools added to the focused creator preview | Deferred; outside the selected creator slice |
| [Coucou](https://github.com/Louis-CFM/coucou) | Top-screen companion and agent interaction | Original native Kivou island, durable quick notes, status and workspace continuation | Packaged and real-model checks passed in v0.2 |

## Selected v0.3 additions

1. Playbooks: included original hooks, critique and repurpose prompts; custom name/command/instructions, edit, remove and reuse. `/command idea` expands locally into an editable message. Review happens before model submission.
2. Brand notes: local user-authored audience/voice/context, saved across restart. An explicit button inserts the actual notes into the composer; the normal model consent remains required.
3. Search: keyword matching over saved project titles, user messages and assistant answers. This is local keyword search, not semantic or web search.

Custom playbooks are instructions only. Kivou does not import this chat's installed skills, execute playbook shell syntax or inherit another agent's credentials. The core model integration and one-active-run limit remain unchanged.

Verification: [packaged library checks](../../qa/library-smoke.json), [earlier actual expanded-prompt model run](../../qa/library-model.json), [review](../../qa/library-finish-review.md). Current corrected-flow checks are local/no-model and kept separate from the earlier real-model receipt.
