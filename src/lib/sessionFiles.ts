import type {
  CompressionCore,
  ContextPiece,
  SourceTool,
} from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import {
  buildAgentsMd,
  buildClaudeMd,
  buildGeminiMd,
  buildHandoffMarkdown,
} from "@/lib/markdown";
import { redactSensitiveText } from "@/lib/security";

// One shared session = one markdown file in the private memory workspace:
// projects/<folder-slug>/sessions/<created>-<tool>-<id>.md
// Only the compression core is stored; exports are rebuilt on import.

export const SESSION_FILE_TYPE = "boradori-session";
// Bump when the file layout changes. Files without `format` are version 1,
// and a newer version is skipped so an old app never misreads it.
export const SESSION_FILE_FORMAT = 1;
export const MAX_SESSION_TEXT = 50_000;

const coreSections: Array<{ key: keyof CompressionCore; title: string }> = [
  { key: "northStar", title: "North star · 북극성" },
  { key: "sessionSummary", title: "Session summary · 세션 요약" },
  { key: "confirmedDecisions", title: "Confirmed decisions · 확정된 결정" },
  { key: "proposedIdeas", title: "Proposed ideas · 제안" },
  { key: "openQuestions", title: "Open questions · 열린 질문" },
  { key: "nextActions", title: "Next actions · 다음 액션" },
];

const pieceIdPattern = /^[A-Za-z0-9-]{8,64}$/;
const deviceNamePattern = /^[A-Za-z0-9._-]{1,40}$/;

export function isValidPieceId(id: string) {
  return pieceIdPattern.test(id);
}

export function isValidDeviceName(name: string) {
  return deviceNamePattern.test(name);
}

// Marks (\p{M}) are kept so scripts such as Devanagari are not split up.
// Cutting to length happens before trimming dashes, so a slug never ends in
// one and slugging a slug returns it unchanged.
export function projectSlug(projectName: string) {
  const slug = projectName
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

export function isValidFolderSlug(folder: string) {
  return folder === projectSlug(folder);
}

export function sessionFolder(folderSlug: string) {
  return `projects/${folderSlug}/sessions`;
}

export function sessionFileName(piece: ContextPiece) {
  const created = new Date(piece.createdAt);
  const stamp = Number.isNaN(created.getTime())
    ? "00000000-000000"
    : created.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
  const tool = piece.sourceTool.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return `${stamp}-${tool || "tool"}-${piece.id.slice(0, 8)}.md`;
}

// The summary template is written in the UI language of the moment the piece
// was created, so it tells us which language the exports should use.
function inferLocale(summary: string): Locale {
  return /^(Context imported from |.+ does not have raw context yet)/.test(
    summary,
  )
    ? "en"
    : "ko";
}

// Markers carry part of the session id, which does not exist yet when text
// is pasted, so pasted text cannot fake a marker and cut a section short.
function sectionMarker(
  key: keyof CompressionCore,
  id: string,
  edge: "start" | "end",
) {
  return `<!-- boradori:${key}:${edge}:${id.slice(0, 8)} -->`;
}

function frontmatterLine(key: string, value: string | number) {
  return `${key}: ${JSON.stringify(value)}`;
}

export function serializeSessionFile(
  piece: ContextPiece,
  projectName: string,
  device: string,
) {
  const locale = inferLocale(piece.result.sessionSummary);
  const lines = [
    "---",
    frontmatterLine("type", SESSION_FILE_TYPE),
    frontmatterLine("format", SESSION_FILE_FORMAT),
    frontmatterLine("id", piece.id),
    frontmatterLine("title", redactSensitiveText(piece.title)),
    frontmatterLine("project", projectName),
    frontmatterLine("source_tool", piece.sourceTool),
    frontmatterLine("device", piece.device ?? device),
    frontmatterLine("created_at", piece.createdAt),
    frontmatterLine("character_count", piece.characterCount),
    frontmatterLine("locale", locale),
    "---",
    "",
    `# ${redactSensitiveText(piece.title)}`,
  ];

  for (const section of coreSections) {
    lines.push(
      "",
      `## ${section.title}`,
      "",
      sectionMarker(section.key, piece.id, "start"),
      redactSensitiveText(piece.result[section.key]).trim(),
      sectionMarker(section.key, piece.id, "end"),
    );
  }

  return `${lines.join("\n")}\n`;
}

function parseFrontmatter(text: string) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);

  if (!match) {
    return null;
  }

  const values: Record<string, unknown> = {};

  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(": ");

    if (separator === -1) {
      continue;
    }

    try {
      values[line.slice(0, separator)] = JSON.parse(line.slice(separator + 2));
    } catch {
      return null;
    }
  }

  return values;
}

function readSection(text: string, key: keyof CompressionCore, id: string) {
  const start = text.indexOf(`${sectionMarker(key, id, "start")}\n`);
  const end = text.indexOf(sectionMarker(key, id, "end"), start);

  if (start === -1 || end === -1) {
    return null;
  }

  return text
    .slice(start + sectionMarker(key, id, "start").length + 1, end)
    .replace(/\n$/, "")
    .slice(0, MAX_SESSION_TEXT);
}

// Files in the private repo can be edited by hand or on another device, so
// anything that does not look like a session file is skipped, not trusted.
export function parseSessionFile(text: string): ContextPiece | null {
  const meta = parseFrontmatter(text.replace(/\r\n/g, "\n"));

  if (
    !meta ||
    meta.type !== SESSION_FILE_TYPE ||
    (meta.format ?? 1) !== SESSION_FILE_FORMAT ||
    typeof meta.id !== "string" ||
    !isValidPieceId(meta.id) ||
    typeof meta.title !== "string" ||
    typeof meta.project !== "string" ||
    typeof meta.source_tool !== "string" ||
    typeof meta.created_at !== "string"
  ) {
    return null;
  }

  const id = meta.id;
  const normalized = text.replace(/\r\n/g, "\n");
  const sections = coreSections.map(({ key }) => [
    key,
    readSection(normalized, key, id),
  ]);

  // A file with a broken marker is skipped so it cannot blank out the
  // complete copy of the session that is still in the tray.
  if (sections.some(([, value]) => value === null)) {
    return null;
  }

  const core = Object.fromEntries(sections) as CompressionCore;
  const locale: Locale = meta.locale === "en" ? "en" : "ko";
  const sourceTool = meta.source_tool.slice(0, 40) as SourceTool;
  const input = {
    projectName: meta.project.slice(0, 120),
    sourceTool,
    locale,
  };

  return {
    id,
    title: meta.title.slice(0, 120),
    sourceTool,
    characterCount:
      typeof meta.character_count === "number" ? meta.character_count : 0,
    createdAt: meta.created_at,
    device:
      typeof meta.device === "string" && isValidDeviceName(meta.device)
        ? meta.device
        : undefined,
    result: {
      ...core,
      handoffMarkdown: buildHandoffMarkdown(input, core),
      agentsMd: buildAgentsMd(input, core),
      claudeMd: buildClaudeMd(input, core),
      geminiMd: buildGeminiMd(input, core),
    },
  };
}
