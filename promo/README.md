# Kivou product introduction

Editable Remotion source for the English Kivou motion-graphics ad: **24 seconds, 1920 × 1080, 30 fps**. The product is an open-source creator assistant built on Goose. Canonical repository: [rayaneDR/kivou](https://github.com/rayaneDR/kivou).

## Preview and render

Requires Node.js 24, npm, Python 3, and Chrome/Edge or Remotion's browser download.

```powershell
cd promo
npm ci
python scripts/synthesize-audio.py
npm run dev
```

Studio opens the composition `Kivou`. The source keeps each scene on its own named timeline item and the text/graphics independently editable. Actual Kivou captures are included in `public/research.png`, `public/content.png` and `public/assets.png`; Research/Content show preview forms and Asset Manifest shows local inventory of clearly labeled demonstration files. `STORYBOARD.md` describes the edit.

```powershell
# Optional: use installed Microsoft Edge instead of downloading a render browser.
$env:REMOTION_BROWSER_EXECUTABLE = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm run render
```

The render script refuses to export when required screenshots/audio are missing. Output: `out/kivou-introduction.mp4`. It uses H.264 4:2:0 and one render worker. The checked artifact is also included at [`../docs/media/kivou-introduction.mp4`](../docs/media/kivou-introduction.mp4). The project does not upload or publish the result. See `QA.md` for the actual codec metadata, playback check and checksum.

## Original assets and truthfulness

- Screenshots must come from the actual application using demonstrative content with no personal data. They are not generated mockups.
- `scripts/synthesize-audio.py` creates the deterministic, original pulse/chime bed in `public/kivou-original.wav`; no samples or third-party music are used.
- The geometric K mark and motion design are original. No Goose logo is repurposed.
- Albert Sans is included under its SIL Open Font License; see `public/FONT-LICENSE.txt`.
- No user counts, revenue, unlimited AI or automated-publication claims appear in the ad.

Remotion dependencies retain [their own license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md). Kivou's authored source and original sound design follow the repository's Apache-2.0 license.
