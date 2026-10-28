# Kivou 0.1.0 — Windows preview

Kivou brings a creator's rough idea, source notes and asset inventory into a local delivery workflow. It is an independent open-source distribution built on Goose v1.56.0.

- **Research Brief:** a draft with linked source suggestions and explicit uncertainties. Sources remain unverified until reviewed.
- **Content Pack:** three hooks, a script, shot list, captions and platform copy from your supplied text.
- **Asset Manifest:** inventory filenames and sizes, propose organization, and leave originals untouched.
- Separate Markdown/JSON deliveries, cancellation, retained partial results, and exports that never overwrite earlier exports.

Extract the entire Windows x64 ZIP and open `Kivou.exe`. AI workflows require Node.js 24+ and an installed Codex CLI signed in with your own ChatGPT account. Your account limits apply. Asset Manifest works without a model; no automatic paid API fallback is enabled.

Validation includes 24 creator tests, packaged Electron workflow/persistence checks, and real Content/Research model calls. The actual packaged executable completed a Content Pack. The bundled English product video was rendered with Remotion from real interface captures; demonstration files are synthetic.

This is an unsigned portable preview. Other platforms and an installer have not been tested. See `docs/kivou/VERIFICATION.md` for evidence, prior failures and limitations. Check the attached `SHA256SUMS.txt` before extracting downloaded files.

Apache-2.0; upstream history, license and contributor notices are retained. Kivou is not an official Goose release.
