# Independent Kivou UI review

Reviewed 2026-10-28. Evidence: `qa/dashboard.png`, `promo/public/research.png`, `content.png`, `assets.png`, plus a targeted read of `ui/creator/src/App.tsx` and `style.css`. No browser or native UI automation was performed in this review.

**Verdict:** the captured Windows preview has clear hierarchy, coherent original branding and understandable English controls. No material visual blocker appears in these four captures. One accessibility correction is recommended before claiming complete keyboard/screen-reader support.

## Findings

- **P2 — View changes and workflow progress have no explicit accessibility handoff.** `App.tsx` changes whole views through state without focusing the new heading, and the running/completed status and progress text lack a live region. A keyboard user can lose their useful focus position when the clicked control is removed; a screen-reader user is not explicitly notified when a long task completes. Add focus management to the new screen heading and one polite, atomic status region for workflow progress. Verify those behaviors with an actual keyboard/DOM test. This is code evidence, not an observed assistive-technology session.
- **P3 — The asset inventory is visually tabular but lacks table semantics.** The result uses `div`/`span` cells. A semantic table with column headers would make original path, proposed path and size easier to navigate with assistive technology. The displayed three-row sample itself is readable and aligned.

## What the captures establish

- The dashboard offers three distinct, task-named entry points and an honest empty state; no invented revenue, usage or customer numbers.
- Both AI forms make the audience/input requirements legible, show provider-consent language and explain why the disconnected primary action is unavailable.
- Research copy explicitly says suggested sources remain unverified. The captures do not imply a successful live search.
- The Asset Manifest separates original filenames from proposed paths and states that files were not moved. Open-folder and export actions are distinct. The sidebar uses a relative run location rather than an absolute personal home path.
- Visible focus styling is present in the source-input captures. CSS supplies `:focus-visible` rules and reduced-motion overrides. Their existence does not establish complete keyboard accessibility.

## Verification boundary

The packaged smoke record separately reports passing folder IPC, deterministic inventory, persistence and no horizontal overflow at 1440/900/390. This review did not rerun those checks or inspect narrow-width captures. It does not validate model reliability, research retrieval, export contents, installers, GitHub publication or market demand. Demonstration asset files are synthetic; their inventory is real.

## Implementation follow-up

Both recommended corrections were applied after this review: heading focus on view/run changes, a polite atomic workflow status region, and explicit table/row/columnheader/cell semantics for the inventory. The final packaged smoke test asserts heading focus, three column headers and a status region. This is DOM evidence, not a test with a human screen-reader user.
