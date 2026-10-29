# Promo verification

## Completed

- Blank Remotion Studio started and opened before composition edits; browser test found the scaffold composition.
- Authored Kivou composition verified in Studio: 1920 × 1080, 30 fps, 720 frames / 24 seconds.
- `npm run lint` passed (ESLint + TypeScript).
- Opening frame 60 and closing frame 630 rendered with installed Microsoft Edge and visually inspected: text is readable, complete and inside the frame; canonical repository URL is correct.
- Final render preflight rejected missing actual screenshots as intended.
- The generated sound bed is 24 seconds, stereo PCM, 48 kHz. It uses only original synthesized tones.
- Narrow `zod: 4.6.6` override fixes the dependency audit finding in the freshly scaffolded Remotion toolchain. Subsequent `npm audit --omit=dev --json` reported 0 vulnerabilities.
- Remotion prints a version warning because its preferred Zod pin is 4.5.4. The security-patched 4.6.6 override is intentional; lint and still rendering pass with it. No runtime schema features are used by this composition.

## Actual capture checks — 2026-10-28

- Inspected `public/research.png`, `public/content.png`, and `public/assets.png` supplied from the real Electron renderer. Provenance: `../qa/desktop-smoke.json`.
- Research and Content show filled preview forms, not completed model responses. The ad labels both shots “Preview form · Connect your model to run”.
- Asset Manifest shows real deterministic inventory over synthetic fixture files; the ad labels this “Sample files · Actual local inventory”. The fixtures are not real client footage.
- Rendered frames 180, 315 and 450 with those actual captures and visually inspected all three. Headlines, supporting copy, notes and screenshot boundaries fit; no placeholder is visible in real-capture mode.
- Final MP4 exported successfully after recapturing the Asset Manifest screen with a relative `Kivou/runs/...` location. Inspected frame 450 extracted from the encoded MP4: no absolute home path is visible, and text/capture boundaries remain complete.

## Final artifact

- `../docs/media/kivou-introduction.mp4`: **5,212,909 bytes**, **24.000 seconds**, **720 frames**, **1920 × 1080**, **30 fps**.
- Video: H.264, full-range 4:2:0 (`yuvj420p` reported by FFprobe). Audio: AAC stereo, 48 kHz.
- Actual Microsoft Edge playback test loaded the MP4, reported the correct dimensions/duration, and advanced past one second with `paused=false` and no media error. Playback was muted for the automated check.
- SHA-256: `020118aef84958413daade729f4334c4172ee5f07a5be34e5bf275249367d6d7`.
- `public/captures.json` records the source captures currently in the repository. Fixture timestamps/run IDs were recaptured during work; the MP4 uses a sanitized capture from that same real renderer, not a claim of bit-for-bit reproducibility of changing fixture IDs.
- No GitHub/YouTube publication was performed by the promo task.

## v0.2 island edit — 2026-10-29

The current MP4 supersedes the historical v0.1 artifact above. It shows actual native compact/expanded island captures, an actual saved project conversation with real model replies, and actual deterministic inventory over synthetic files. Research/Content preview form scenes were replaced. `npm run lint` passed before the final scene-label-only correction. Frame 180 was rendered and visually inspected; all text and screenshot bounds fit. Microsoft Edge loaded Studio and played the encoded MP4 beyond one second with no error: [receipt](../qa/promo-v0.2.json). FFprobe reports 24.000 seconds, 1920×1080, 30fps, H.264/AAC stereo 48kHz. Current size: 4628407 bytes; SHA-256: `9b4ec27ee6ee7e38fb1a207ce27e3667698358bac825abde25e5cafc0f81bf02`. PNG capture origins are embedded; provenance scan found zero missing records across promo/public and docs/media.

## v0.3 creator library edit — 2026-10-29

Current MP4 supersedes earlier artifacts above: 4952832 bytes; SHA-256 `891fe6f0544a5aea1446cabbdb56de7692f9d46e639a44008d3cc3ec28abe2b8`. Native island, project conversation and Playbooks/brand scenes use actual packaged application captures. The conversation is a real model reply to an original launch brief; brand notes are authored demonstration data. Frames 315 and 450 were rendered and opened: headline/supporting copy/capture bounds fit. Lint and TypeScript passed. Actual Edge Studio/video playback passed: [receipt](../qa/promo-v0.3.json), 24 seconds, 1920x1080, playback advanced >1 second without error. Earlier preview-form/inventory captures remain historical inputs, unused by this edit.
