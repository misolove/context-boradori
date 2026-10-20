// Exchanges shared session files with the private memory repository:
// commits this device's new files under projects/*/sessions/, pulls other
// devices' commits, and pushes. Nothing outside the session folders is
// committed, so other work in the memory repo is left alone.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const SESSIONS = ":(glob)projects/*/sessions/**";

function loadConfig() {
  const configPath = path.join(process.cwd(), ".boradori", "config.json");

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"));

    if (
      typeof config.memoryWorkspacePath === "string" &&
      path.isAbsolute(config.memoryWorkspacePath) &&
      /^[A-Za-z0-9._-]{1,40}$/.test(config.deviceName ?? "")
    ) {
      return config;
    }
  } catch {
    // Reported below.
  }

  console.error(
    `No valid ${configPath}. See "기기 간 세션 공유" in README.md for the format.`,
  );
  process.exit(1);
}

const { memoryWorkspacePath: workspace, deviceName } = loadConfig();

function git(...args) {
  return execFileSync("git", ["-C", workspace, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
}

// -z keeps non-ASCII project folders (e.g. Korean names) unquoted. Rename
// and copy entries carry the old path as an extra field, which is skipped.
const statusFields = git(
  "status",
  "--porcelain=v1",
  "-z",
  "--untracked-files=all",
  "--",
  SESSIONS,
).split("\0");
const changed = [];

for (let index = 0; index < statusFields.length; index += 1) {
  const entry = statusFields[index];

  if (!entry) {
    continue;
  }

  changed.push(entry.slice(3));

  if (/^[RC]/.test(entry)) {
    index += 1;
  }
}

if (changed.length > 0) {
  git("add", "--all", "--", ...changed);
  git(
    "commit",
    "--quiet",
    "-m",
    `Sync ${changed.length} session file(s) from ${deviceName}`,
    "--",
    ...changed,
  );
}

const before = git("rev-parse", "HEAD").trim();
git("pull", "--quiet", "--rebase", "--autostash");
const incoming = git(
  "diff",
  "--name-only",
  "--diff-filter=A",
  before,
  "HEAD",
  "--",
  SESSIONS,
)
  .split("\n")
  .filter(Boolean).length;
const ahead = Number(git("rev-list", "--count", "@{u}..HEAD").trim());

if (ahead > 0) {
  git("push", "--quiet");
}

console.log(
  `Sent ${changed.length} session file(s), received ${incoming}. ` +
    (incoming > 0
      ? 'Click "공유 폴더와 동기화" in the app to load them.'
      : "Nothing new from other devices."),
);
