# Kivou 0.2.0 — Windows island preview

Your AI companion, right where you work.

This preview adds a native top-screen island to Kivou: quick consented messages, actual run state, cancellation and a direct return to the workspace. Project conversations keep a brief and earlier context; island notes survive a full quit/relaunch and recover after cancelled turns.

The creator workflows remain available: Research Brief, Content Pack and metadata-only Asset Manifest. Conversation answers can become a Content Pack. Results and separate Markdown/JSON exports remain local.

## Install

1. Download `Kivou-v0.2.0-windows-x64.zip` and verify it against `SHA256SUMS-v0.2.0.txt`.
2. Extract the whole folder and open `Kivou.exe`.
3. AI work requires Node.js 24+ and your separately installed Codex CLI signed in with an eligible ChatGPT account. The ACP adapter is bundled. Your account limits apply; no paid API fallback is enabled.
4. Use the island, or open a project conversation. `Ctrl + Alt + K` toggles the island when the shortcut is available. Workspace/tray controls are also provided.

Closing the workspace hides it; use tray > Quit Kivou to exit. Asset Manifest works without a model. This is an unsigned Windows x64 portable preview; other platforms and an installer are not tested.

## Verification

29 creator/runtime tests passed. The actual packaged executable passed native lifecycle and inventory checks, three real conversation/island calls, and two real calls across full quit/relaunch with an intervening cancelled turn. A constrained-height test verified scrolling and reachable controls. Independent review scored its two requested fixes resolved. Full evidence and limitations are in `docs/kivou/VERIFICATION.md`.

General conversation is advice/drafting without tools. Research source suggestions remain unverified. There is no automatic app operation, posting or messaging. No full Goose/Coucou parity claim is made.

The attached 24-second English introduction uses actual Kivou captures, real model replies over an original demonstration brief, synthetic inventory files and original audio. Editable Remotion source is in `promo/`.

Kivou is an independent Apache-2.0 distribution built on Goose v1.56.0. Original history, license and notices remain. Full source is available in the repository and GitHub's source archives for this release tag.
