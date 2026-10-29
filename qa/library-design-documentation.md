# Library design documentation check

2026-10-29. The v0.3 playbooks, explicit brand notes, and saved-answer keyword search are an ordinary extension of the approved Operate world (seed:0671bf2e8f5a4b43). Under `new-work.md` section 7, `DESIGN.md` is preserved and the absent `.impeccable/design.json` remains absent. No new world or durable system change is being documented as approved.

## Evidence checked

Read `document.md`, current `PRODUCT.md` and `DESIGN.md`, `ui/creator/src/LibraryView.tsx`, `Assistant.tsx`, the appended `style.css` rules, `creator/library.mjs`, and `qa/library-finish-review.md` including its focused final verdict. Opened the current packaged captures `qa/library-1440.png`, `qa/library-900.png`, `qa/library-390.png`, `qa/library-no-results-900.png`, and `qa/library-no-results-390.png`. The three library captures show their named layouts through the brand-note controls; both no-results captures visibly show feedback beneath the search field. No app or browser was launched, no application source was edited, and no runtime tests or model calls were made by this documentation pass.

## Five-line system summary

1. World: a calm independent studio worktable holds reusable creator processes and user-written brand context.
2. Color and identity: paper `#f6f5f0`, ink `#24251f`, citron `#dce664`, DM Sans, and the original K remain the incumbent vocabulary.
3. Layout: a selection list and prompt editor share the desktop library; narrow windows wrap the list and stack the editor fields, retaining the existing workspace shell.
4. Components: fine separators, flat tonal selected rows, rounded labeled fields, ink primary buttons, and quiet secondary actions extend existing primitives.
5. Behavior: visible editable instructions and deliberately added notes precede consented model sending; local keyword search gives visible no-match feedback at narrow widths.

## Contract and actual behavior

`LibraryView.tsx` exposes included prompts as read-only with Duplicate, and custom prompts with Edit, Save, and Remove. The user’s own brand notes are saved locally and explicitly added to a conversation; the notes are not automatically inferred. `creator/library.mjs` supplies three included playbooks and validates/persists custom playbooks and notes in the local library, independently of model execution.

`Assistant.tsx` locally expands a leading slash command into the editable composer. Add brand notes uses the same expansion helper before prefixing notes, so the instructions remain visible when notes are added first. Both actions obtain only local library data; the separate model-start branch requires consent and provider readiness. Search normalizes and matches local saved titles, input messages, and answer Markdown; it is keyword search, not semantic retrieval. The dedicated narrow-window search-empty rule and status role preserve the no-match explanation.

These interaction and layout observations describe this extension; they are not new global token definitions. Static images do not establish live keyboard traversal, screenreader behavior, or every validation state.

## Verdict and drift not canonized

The finish reviewer’s final **ship** disposition scores the two P2 corrections only: notes-first slash expansion and visible narrow-window no-results feedback. This report does not broaden that result into a new whole-surface audit or upstream feature-parity claim. Synthetic search data visible in the captures remains demonstration evidence; it is not a product claim. The reviewer distinguishes current zero-model-call fix verification from an earlier real-model demonstration.

Pre-existing `DESIGN.md` remains a prose record without normative token frontmatter, and the schema-v2 sidecar remains absent. The reviewer also reports a context-launcher root-resolution mismatch. None is repaired or turned into a system convention here. Existing limitations noted in the island documentation, including the unconfirmed runtime significance of full-document sticky-composer overlap, are not newly scored or canonized by this library check. No additional defect hunt was performed.
