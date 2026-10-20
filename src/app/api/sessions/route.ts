import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CompressionCore, ContextPiece } from "@/lib/compression";
import { loadBoradoriConfig } from "@/lib/server/boradoriConfig";
import {
  MAX_SESSION_TEXT,
  isValidPieceId,
  parseSessionFile,
  serializeSessionFile,
  sessionFileName,
  sessionFolder,
} from "@/lib/sessionFiles";

export const dynamic = "force-dynamic";

const MAX_PIECES_PER_SYNC = 200;
const MAX_SESSION_FILE_BYTES = 400_000;
const localHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
const coreKeys: Array<keyof CompressionCore> = [
  "northStar",
  "sessionSummary",
  "confirmedDecisions",
  "proposedIdeas",
  "openQuestions",
  "nextActions",
];

// This route writes into the private workspace, so it only answers the local
// app itself. The custom header forces a CORS preflight that other sites
// cannot pass, and the Host check stops DNS rebinding.
function isTrustedLocalRequest(request: Request) {
  const host = request.headers.get("host") ?? "";
  const origin = request.headers.get("origin");

  if (
    !localHosts.has(host.replace(/:\d+$/, "")) ||
    request.headers.get("x-boradori-sync") !== "1"
  ) {
    return false;
  }

  try {
    return !origin || new URL(origin).host === host;
  } catch {
    return false;
  }
}

function toSharablePiece(value: unknown): ContextPiece | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const piece = value as Partial<ContextPiece>;
  const result = piece.result as Partial<CompressionCore> | undefined;

  if (
    typeof piece.id !== "string" ||
    !isValidPieceId(piece.id) ||
    typeof piece.title !== "string" ||
    piece.title.length > 120 ||
    typeof piece.sourceTool !== "string" ||
    piece.sourceTool.length > 40 ||
    typeof piece.createdAt !== "string" ||
    typeof piece.characterCount !== "number" ||
    !result ||
    !coreKeys.every(
      (key) =>
        typeof result[key] === "string" &&
        (result[key] as string).length <= MAX_SESSION_TEXT,
    )
  ) {
    return null;
  }

  return piece as ContextPiece;
}

async function readSessions(directory: string) {
  let names: string[];

  try {
    names = await readdir(directory);
  } catch {
    return [];
  }

  const pieces: ContextPiece[] = [];

  for (const name of names.filter((entry) => entry.endsWith(".md"))) {
    const text = await readFile(path.join(directory, name), "utf8");

    if (text.length > MAX_SESSION_FILE_BYTES) {
      continue;
    }

    const piece = parseSessionFile(text);

    if (piece) {
      pieces.push(piece);
    }
  }

  return pieces.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || 0,
  );
}

export async function GET(request: Request) {
  if (!isTrustedLocalRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const config = await loadBoradoriConfig();

  return Response.json(
    config ? { enabled: true, device: config.deviceName } : { enabled: false },
  );
}

// Writes local pieces that the shared folder does not have yet, then returns
// every session in the folder. Existing files are never overwritten, so a
// session edited in the private repo stays as edited.
export async function POST(request: Request) {
  if (!isTrustedLocalRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const config = await loadBoradoriConfig();

  if (!config) {
    return Response.json({ enabled: false }, { status: 404 });
  }

  let body: { projectName?: unknown; pieces?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const projectName =
    typeof body.projectName === "string" ? body.projectName.trim() : "";

  if (
    !projectName ||
    projectName.length > 120 ||
    !Array.isArray(body.pieces) ||
    body.pieces.length > MAX_PIECES_PER_SYNC
  ) {
    return Response.json({ error: "invalid request" }, { status: 400 });
  }

  const folder = sessionFolder(projectName);
  const directory = path.resolve(config.workspacePath, folder);

  if (!directory.startsWith(config.workspacePath + path.sep)) {
    return Response.json({ error: "invalid project" }, { status: 400 });
  }

  if (body.pieces.length > 0) {
    await mkdir(directory, { recursive: true });
  }

  let written = 0;

  for (const value of body.pieces) {
    const piece = toSharablePiece(value);

    if (!piece) {
      continue;
    }

    try {
      await writeFile(
        path.join(directory, sessionFileName(piece)),
        serializeSessionFile(piece, projectName, config.deviceName),
        { encoding: "utf8", flag: "wx" },
      );
      written += 1;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
    }
  }

  return Response.json({
    enabled: true,
    device: config.deviceName,
    folder,
    written,
    pieces: await readSessions(directory),
  });
}
