# Kivou on Windows

## Current status

Windows x64 is the tested target. Kivou 0.3 includes the native island, saved project conversations, playbooks, explicit brand notes and local answer search. The focused build, packaged lifecycle checks, real conversation calls and full-process recovery checks passed. Source is public at [rayaneDR/kivou](https://github.com/rayaneDR/kivou). See [Verification](VERIFICATION.md) and published [Releases](https://github.com/rayaneDR/kivou/releases) for download status.

## Requirements

- Windows x64.
- Node.js 24+ available in PATH.
- Codex CLI installed and signed in with ChatGPT through its normal login flow.
- Model availability and sufficient usage allowance on your own account.

The ACP adapter is an application dependency and is included when packaging. Model access and an account subscription are not bundled with Kivou. No automatic paid API fallback is enabled.

## Run from source

From the root of a checkout, the supplied helper downloads and extracts the official pinned [Windows Goose v1.56.0 runtime](https://github.com/aaif-goose/goose/releases/download/v1.56.0/goose-x86_64-pc-windows-msvc.zip), checks its version and sets `KIVOU_GOOSE_BINARY` for that PowerShell session:

```powershell
.\scripts\prepare-kivou-runtime.ps1
& $env:KIVOU_GOOSE_BINARY --version
codex login status
cd ui/creator
npm ci
npm run build
npm start
```

The Goose version must be `1.56.0`. The source baseline is commit `9949cf926cd42f1d128b9991ed23a496ecace896`; Rust code is unchanged. The helper caches downloads under `ui/creator/.runtime` and prints the archive SHA-256. Alternatively, extract the pinned archive yourself and set `KIVOU_GOOSE_BINARY` to its absolute `goose.exe` path. The creator app uses the official binary rather than requiring a local Rust build.

If the Codex CLI is not signed in, run `codex login` and complete authentication yourself. Do not put tokens in a README, issue, prompt or demo. An API-key-only login is not enabled by the initial service.

`npm ci` must permit Electron's normal dependency installation step. If your npm policy skips it and `npm start` reports a missing Electron executable, follow your package manager's dependency-script controls and run the installed Electron package's setup script:

```powershell
node node_modules/electron/install.js
```

This downloads the Electron runtime; it does not install a model or sign in to a provider.

## Connect and try a workflow

Open the connection screen and run the availability check. A ready probe means executable/login checks passed, not that the model has processed your request. Real Content Pack and Research Brief calls have completed with Goose 1.56.0, Codex ChatGPT and ACP adapter 2.3.0. Account limits still apply.

Try Asset Manifest on a small synthetic folder. It inventories metadata and proposes names without changing originals. Then use Content Pack with text you are comfortable sending to your provider. Research Brief can request provider-native search; a live call has completed, but sources always remain unverified until you check them. Kivou has not independently observed retrieval of each model-returned URL.

Outputs persist under local app data. Export asks for a destination and creates a new child directory; earlier exports remain untouched.

## Package Windows x64

From `ui/creator`, with the runtime path still set:

```powershell
npm run build
npm run package:windows
```

The packaging script requires `KIVOU_GOOSE_BINARY`, checks its version and copies it alongside the app's adapter/runtime resources. It records provenance in `RUNTIME.json`. Packaging produces an application directory; it does not establish a successful launch, create a public GitHub release or claim a tested installer.

The packaged Windows smoke test passed native folder IPC, deterministic inventory, provider availability, reload persistence and Unicode handling. After any final runtime changes, rerun that test before creating the ZIP and SHA-256. A standalone live AI call is not presented as a complete live-model cycle through the packaged UI. No macOS or Linux release claim is made by this Windows build.

When a verified release is published, download its ZIP and checksum from [the release page](https://github.com/rayaneDR/kivou/releases), verify with `Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\\path\\to\\download.zip'`, extract the whole folder, and keep the executable, resources and DLLs together.

## Checks for contributors

From the root:

```powershell
node --test creator/tests/*.test.mjs
```

From `ui/creator`:

```powershell
npm run typecheck
npm run build
```

The full original `ui/desktop` workspace remains preserved, but its dependency installation encountered npm networking and optional cross-platform dependency failures in this environment. The new focused creator build is independent of that workspace. No successful full upstream build or Rust test suite is claimed.

## Troubleshooting

| Symptom | Next check |
| --- | --- |
| Missing Goose runtime | Confirm `KIVOU_GOOSE_BINARY` during development and `1.56.0` output |
| Missing Electron executable | Check npm script policy and the Electron setup step above |
| Missing ACP adapter | Complete `npm ci`; do not substitute an unrelated global adapter |
| Login succeeds but workflow fails | Inspect the redacted error, account limits and adapter compatibility |
| Folder cannot be inventoried | Choose a real accessible folder; linked roots and app-data overlap are rejected |
| Run was interrupted | Review retained partial output; start a new run explicitly if needed |
| Export fails | Choose a writable destination; earlier exports are not replaced |

[Data handling](DATA-HANDLING.md) · [Provider/isolation evidence](../../creator/ISOLATION.md) · [Verification](VERIFICATION.md)

## Island and project conversations

`Ctrl + Alt + K` toggles the island if Windows grants the shortcut. If another app owns it, use **Show island** in the workspace or tray. The compact island starts without taking focus. Expand it to ask a consented quick question, inspect real run state, cancel or continue in the workspace. Escape collapses it. The expanded body scrolls on a constrained display.

Island notes keep the last successful context after a full restart, cancellation or failure. Closing the workspace hides it and leaves the tray/island available; **Quit Kivou** in the tray exits. No auto-start is installed.

Project conversations have a name and optional brief. The connected model receives that project's prior messages when you allow a follow-up. General chat does not use tools. Use the explicit creator workflows for research or structured content. At 20 turns or 80,000 characters of context, start another project with a summary. Model login and usage limits remain the user's responsibility.

The portable package includes the ACP adapter. Its unused bundled optional Codex native binary is excluded: Kivou requires your separately installed, signed-in Codex CLI and always routes it through its isolation guard. Actual packaged model calls validated that path.

## Playbooks, brand notes and search

Open **Playbooks & brand** to use an included prompt, duplicate it, or save up to 30 custom playbooks. A lowercase `/command idea` in a conversation expands locally into editable instructions. Review it, add notes if useful, and explicitly consent before sending. Adding notes to a slash request also expands the command locally first. No shell or environment substitutions run.

Brand notes hold up to 8,000 characters and are saved in local `library.json`. **Add brand notes** inserts the actual text into the composer for review. Saved notes alone never cause a model request. Search in the Projects rail matches saved project titles, messages and answer text; it is local keyword search.

Versioned package output is `ui/creator/out/v0.3.0/Kivou-win32-x64`. To switch from an already open preview, use its tray **Quit Kivou** command before opening the new executable. Existing saved runs remain in the same user-data folder. No automatic update or auto-start is installed.
