import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "island-compact.png",
  "island-expanded.png",
  "assistant.png",
  "content.png",
  "assets.png",
  "kivou-original.wav",
];
const missing = required.filter(
  (asset) => !existsSync(path.join(root, "public", asset)),
);
if (missing.length) {
  throw new Error(
    `Final render needs actual application captures and original audio: ${missing.join(", ")}`,
  );
}
mkdirSync(path.join(root, "out"), { recursive: true });
const remotionCli = path.join(
  root,
  "node_modules",
  "@remotion",
  "cli",
  "remotion-cli.js",
);
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
const args = [
  remotionCli,
  "render",
  "src/index.ts",
  "Kivou",
  "out/kivou-introduction.mp4",
  '--props={"capturesReady":true}',
  "--codec=h264",
  "--crf=18",
  "--pixel-format=yuv420p",
  "--concurrency=1",
  "--overwrite",
];
if (browser) args.push(`--browser-executable=${browser}`);
const result = spawnSync(process.execPath, args, {
  cwd: root,
  stdio: "inherit",
  windowsHide: true,
});
process.exit(result.status ?? 1);
