# Kivou build evidence

| Area | Evidence recorded | Status |
| --- | --- | --- |
| Baseline | Source pinned at goose v1.56.0 / `9949cf926cd42f1d128b9991ed23a496ecace896`; official CLI returned `1.56.0` | Observed |
| Baseline desktop | Official executable launched with isolated profile; startup log reached `React ready` | Startup observed; visual pending |
| Provider | Codex CLI ChatGPT login; ACP 2.3.0; real Content Pack complete in 40.678 seconds and corrected Research in 45.683 seconds | Actual provider responses; research URLs unverified |
| Dependencies | Original upstream desktop install failed on npm networking/optional cross-platform packages; focused `ui/creator` installation completed | Separate focused build path |
| Workflow service | Earlier 22-test checkpoint passed; 23 cases now implemented; final rerun pending | Controlled-process and filesystem evidence |
| S01–S07 | Three workflow forms and connection/consent gates; actual inventory and persisted results; zero renderer errors/overflow at 1440/900/390 | Packaged Electron smoke passed; final Research-fix repackage pending |
| Build | `npm run build` in `ui/creator` passed TypeScript and Vite | Source build passed |
| Docs | Original English README, provenance, architecture and Windows verification checklist | Written |
| Video | 24-second 1080p MP4; real captures; frame inspection and Edge playback passed | Source in promo; final MP4 in docs/media |
| Release | Windows packaged smoke passed; final Research-fix repackage next | ZIP and GitHub publication pending |

This record distinguishes source inspection, startup logs, fixtures, live inference and packaged-app verification. None substitutes for the others.

The first actual content attempt failed on a denied tool call. After the content recipe was restricted to supplied text, a later run succeeded. The first Research call failed because the Goose Chat bridge suppressed final output after tool-start notifications; using the approve bridge retained the same Codex read-only restrictions and allowed a valid result. Neither is claimed as first-pass success.

The live-model RSS value measures the service process only. Packaged-smoke Electron memory excludes active model processes. Canonical public repository target: `rayaneDR/kivou`; no publication receipt exists. The 43 inherited workflows are preserved outside the active workflows directory; Kivou's active CI is manual-only.
