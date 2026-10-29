# Kivou changes

## 0.3.0 — 2026-10-29

- Added reusable creator playbooks, custom slash commands, explicit local brand notes and keyword search over saved projects/messages/answers.
- Slash expansion and note insertion happen locally before consented model submission; notes-first commands expand correctly and narrow search feedback remains visible.
- 32 tests and the focused build passed. Actual packaged v0.3 library checks and an expanded-playbook real-model call passed; corrected local-flow checks are recorded separately.
- Updated the English product film with actual v0.3 creator/playbook captures and an original launch brief.
- Versioned build output keeps new packages separate from a preview already in use.

## 0.2.0 — 2026-10-29

- Added a native always-on-top Windows island, quick notes, live run state, cancel, tray access and workspace restore.
- Added named project conversations, saved briefs, follow-up context, Markdown answers and handoff to creator workflows.
- Preserved island context across full restart and cancelled/failed turns; made constrained-height content scrollable.
- Validated 29 tests, packaged deterministic workflows, three real assistant calls and two real recovery calls.
- Updated the English Remotion introduction with native island and conversation captures.
- The earlier 0.1 release draft was not published; it was superseded by the owner's island/agent direction.

# Kivou change log

## Unreleased — initial creator distribution

Based on goose v1.56.0, commit `9949cf926cd42f1d128b9991ed23a496ecace896`.

### Added

- Creator workflow service for Research Brief, Content Pack and Asset Manifest.
- Run state, structured and Markdown results, cancellation, interruption recovery and unique exports.
- Metadata-only asset inventory with proposed names and link confinement.
- Explicit source provenance and human-review labels for model-produced research.
- English creator documentation and the Replica recon/architecture/feature records.
- Focused Electron/React application in `ui/creator`, preserving the original desktop source separately.
- Codex runtime guard that disables inherited external tools/plugins while retaining normal CLI account authentication.

### Verified during development

- TypeScript/Vite build and development Electron smoke test.
- Three workflow forms, actual metadata inventory over synthetic files, Unicode preservation and persisted result reload.
- One real Content Pack through Goose 1.56/Codex ChatGPT/ACP 2.3.0, completed in 40.678 seconds after an earlier denied-tool failure was fixed.
- Packaged Electron smoke and provider availability, with deterministic inventory and persisted results.
- One corrected Research Brief in 45.683 seconds; returned sources remain unverified.
- 24-second English Remotion MP4 with actual captures, original audio and verified Edge playback.
- Inherited 43 GitHub workflows preserved in `.github/upstream-workflows`; active Kivou CI is manual-only.

### In progress

- Final repackage/smoke after the Research bridge correction, then portable ZIP/checksum.
- Final automated test rerun and actual GitHub source/release publication.

### Release boundary

No stable release or GitHub publication is claimed by this entry. The canonical public repository target is `rayaneDR/kivou`. Test fixtures do not establish model compatibility, and a successful source build does not establish that a portable executable launches. Results are recorded in [the verification log](docs/kivou/VERIFICATION.md).

Rust backend changes are outside this initial customization. No automatic publishing, subscription billing or paid API fallback is added.
