# Contributing to Kivou

Kivou changes target [rayaneDR/kivou](https://github.com/rayaneDR/kivou), branch `kivou`. The original Goose contribution guide remains at the repository root for upstream work.

Useful contributions include reproducible Windows fixes, accessible island/conversation interactions, original creator playbooks, and tests for saved context or separate exports. Keep a pull request focused: explain the problem, expected behavior, change and relevant verification. A mock response or synthetic search record must not be presented as a successful model run.

Start with Node.js 24+ and [the Windows guide](WINDOWS.md). Run the creator tests from the repository root, then build the focused UI:

```powershell
node --test creator/tests/*.test.mjs
cd ui/creator
npm ci
npm run build
npm start
```

Packaging writes to `ui/creator/out/v<VERSION>/Kivou-win32-x64`. Keep a running preview separate from a new build. Verify a package with the relevant smoke scripts before distributing it. Do not claim support for an untested platform.

Use original demonstration briefs and synthetic files in tests. Remove credentials, personal paths and client material from screenshots and reports. Never attach an entire user-data directory.

Preserve Apache-2.0, upstream notices and honest attribution. Public agent behavior may inform Kivou's design; proprietary characters, sounds and branding are not contributions to copy into it.
