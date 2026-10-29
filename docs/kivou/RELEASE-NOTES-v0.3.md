# Kivou 0.3.0 — Windows island preview

Your AI companion, right where you work.

This preview adds a native top-screen island to Kivou: quick consented messages, actual run state, cancellation and a direct return to the workspace. Project conversations keep a brief and earlier context; island notes survive a full quit/relaunch and recover after cancelled turns.

New in 0.3: reusable creator Playbooks and custom slash commands, explicit local brand notes, and keyword search across saved project messages and answers. Commands expand into editable text before model submission; adding notes first also expands locally. Current packaged checks passed at 1440/900/390 widths, plus an earlier real expanded-playbook model response.

The creator workflows remain available: Research Brief, Content Pack and metadata-only Asset Manifest. Conversation answers can become a Content Pack. Results and separate Markdown/JSON exports remain local.

## Install

1. Download `Kivou.exe` and verify it against `SHA256SUMS-v0.3.0.txt`.
2. Open `Kivou.exe`. It extracts its bundled runtime into a temporary directory; the first launch can take about a minute on a slower PC.
3. AI work requires Node.js 24+ and your separately installed Codex CLI signed in with an eligible ChatGPT account. The ACP adapter is bundled. Your account limits apply; no paid API fallback is enabled.
4. Use the island, or open a project conversation. `Ctrl + Alt + K` toggles the island when the shortcut is available. Workspace/tray controls are also provided.

Closing the workspace hides it; use tray > Quit Kivou to exit. Asset Manifest works without a model. This is an unsigned Windows x64 portable preview; other platforms and an installer are not tested.

## Verification

32 creator/runtime tests and the focused UI build passed. The actual packaged v0.3 executable passed saved-library, Unicode notes, visible command expansion, notes-first expansion, answer search and narrow no-results checks. An earlier expanded-playbook model response and a separate original product-demonstration reply are real; the final corrected local-flow checks made no model calls. The unchanged island/conversation core also has actual packaged v0.2 baseline checks, including full-process recovery. Independent reviewers scored their requested fixes resolved. Full evidence and limits are in `docs/kivou/VERIFICATION.md`.

General conversation is advice/drafting without tools. Research source suggestions remain unverified. There is no automatic app operation, posting or messaging. No full Goose/Coucou parity claim is made.

The inline README 24-second English introduction shows the native island, real project conversation and Playbooks/brand interface, with original demonstration input and original audio. Editable Remotion source is in `promo/`.

Kivou is an independent Apache-2.0 distribution built on Goose v1.56.0. Original history, license and notices remain. Full source is available in the repository and GitHub's source archives for this release tag.
