"""Package the already-tested Windows directory; never publishes or overwrites a release."""
from pathlib import Path
import datetime
import hashlib
import json
import shutil
import subprocess
import zipfile

root = Path(__file__).resolve().parent.parent
app = root / 'ui/creator/out/Kivou-win32-x64'
releases = root / 'releases'
releases.mkdir(exist_ok=True)
smoke = json.loads((root / 'qa/desktop-smoke.json').read_text(encoding='utf-8'))
live = json.loads((root / 'qa/packaged-model.json').read_text(encoding='utf-8'))
assert smoke['passed'] and smoke['scope'] == 'packaged app' and smoke['providerAvailable']
assert live['passed'] and live['status'] == 'completed'
assert (app / 'Kivou.exe').is_file()
for name in ['service.mjs', 'codex-guard.mjs']:
    assert (root / 'creator' / name).read_bytes() == (app / 'resources/app' / name).read_bytes()
assert (root / 'ui/creator/main.cjs').read_bytes() == (app / 'resources/app/main.cjs').read_bytes()
(app / 'START-HERE.txt').write_text(
    'Kivou 0.1.0 - Windows x64 preview\n\n'
    'Extract the entire folder and open Kivou.exe. Keep resources and DLLs beside it.\n'
    'Asset Manifest works without a model. AI workflows require Node.js 24+ and\n'
    'Codex CLI installed and signed in with your own ChatGPT account. Account limits apply.\n'
    'There is no paid API fallback. Review drafts and unverified sources before sharing.\n\n'
    'Built on Goose v1.56.0, Apache-2.0. Credits and runtime identity: licenses/ and RUNTIME.json.\n'
    'Source repository target: https://github.com/rayaneDR/kivou\n'
    'This is an unsigned portable preview, not a tested installer.\n', encoding='utf-8')
shutil.copyfile(root / 'docs/media/kivou-introduction.mp4', app / 'Kivou-introduction.mp4')
portable = releases / 'Kivou-v0.1.0-windows-x64.zip'
with zipfile.ZipFile(portable, 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for file in sorted(app.rglob('*')):
        if file.is_file():
            assert not file.is_symlink()
            archive.write(file, Path('Kivou') / file.relative_to(app))
with zipfile.ZipFile(portable) as archive:
    assert archive.testzip() is None
commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
source = releases / 'Kivou-v0.1.0-source.zip'
assert not source.exists()
subprocess.run(['git', 'archive', '--format=zip', '--prefix=Kivou-source/', str(commit), '-o', str(source)], cwd=root, check=True)
def digest(file):
    result = hashlib.sha256()
    with file.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()
files = [{'file': file.name, 'bytes': file.stat().st_size, 'sha256': digest(file)} for file in [portable, source]]
checksums = releases / 'SHA256SUMS.txt'
checksums.write_text(''.join(f"{entry['sha256']}  {entry['file']}\n" for entry in files), encoding='utf-8')
manifest = {'recordedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'product': 'Kivou', 'version': '0.1.0', 'sourceCommit': commit, 'upstreamTag': 'v1.56.0', 'upstreamCommit': '9949cf926cd42f1d128b9991ed23a496ecace896', 'platform': 'Windows x64', 'zipCRCVerified': True, 'packagedSmokeVerified': True, 'packagedModelVerified': True, 'publicationStatus': 'not-published', 'files': files}
(root / 'qa/release.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps(manifest, indent=2))
