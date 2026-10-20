import type { ContextPiece, SourceTool } from "@/lib/compression";
import { sectionLines } from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";

export type SessionDigest = {
  nodeId: string;
  piece: ContextPiece;
  gist: string;
  decisions: string[];
  questions: string[];
  actions: string[];
  ideas: string[];
};

type SessionMermaidInput = {
  digests: SessionDigest[];
  projectName: string;
  northStar: string;
  targetTool: SourceTool;
  isMerged: boolean;
  locale: Locale;
};

const labelPrefixPattern = /^[\p{L}\s]{1,16}[:：]\s+/u;
const excerptPattern = /(?:핵심 발췌|Key excerpt):\s*([\s\S]*)$/;

function stripLabelPrefix(line: string) {
  return line.replace(labelPrefixPattern, "").trim() || line;
}

function clip(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).trim()}…`;
}

function summaryExcerpt(summary: string) {
  const excerpt = summary.match(excerptPattern)?.[1];
  return sectionLines(excerpt ?? "")[0] ?? "";
}

// The session summary opens with the same boilerplate for every piece, so the
// gist prefers the first concrete decision, action, idea, or question instead.
export function digestPiece(piece: ContextPiece, index: number): SessionDigest {
  const decisions = sectionLines(piece.result.confirmedDecisions);
  const questions = sectionLines(piece.result.openQuestions);
  const actions = sectionLines(piece.result.nextActions);
  const ideas = sectionLines(piece.result.proposedIdeas);
  const firstLine =
    decisions[0] ??
    actions[0] ??
    ideas[0] ??
    questions[0] ??
    summaryExcerpt(piece.result.sessionSummary);

  return {
    nodeId: `s${index}`,
    piece,
    gist: firstLine ? stripLabelPrefix(firstLine) : "",
    decisions: decisions.map(stripLabelPrefix),
    questions: questions.map(stripLabelPrefix),
    actions: actions.map(stripLabelPrefix),
    ideas: ideas.map(stripLabelPrefix),
  };
}

// Node ids follow the order sessions were collected. Pieces added in one batch
// share a timestamp, so the stable sort keeps their tray order.
export function digestPieces(pieces: ContextPiece[]) {
  return [...pieces]
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || 0)
    .map(digestPiece);
}

export function formatCreatedAt(value: string, locale: Locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return uiText[locale].context.justNow;
  }

  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Mermaid entity codes keep pasted text from breaking the diagram syntax or
// being read as HTML inside the label. `%` is encoded so a pasted
// `%%{init: ...}%%` cannot act as a directive and break the whole map.
function mermaidText(value: string, maxLength: number) {
  return clip(value, maxLength)
    .replace(/#/g, "#35;")
    .replace(/%/g, "#37;")
    .replace(/&/g, "#38;")
    .replace(/"/g, "#quot;")
    .replace(/</g, "#lt;")
    .replace(/>/g, "#gt;")
    .replace(/`/g, "#96;");
}

function groupByTool(digests: SessionDigest[]) {
  const groups = new Map<string, SessionDigest[]>();

  for (const digest of digests) {
    const group = groups.get(digest.piece.sourceTool) ?? [];
    group.push(digest);
    groups.set(digest.piece.sourceTool, group);
  }

  return [...groups.entries()];
}

export function buildSessionMermaid({
  digests,
  projectName,
  northStar,
  targetTool,
  isMerged,
  locale,
}: SessionMermaidInput) {
  const text = uiText[locale].sessionMap;
  const project =
    projectName.trim() || uiText[locale].contextMap.untitledProject;
  const lines = [
    "flowchart LR",
    `  %% ${mermaidText(project, 60)} · Context Boradori session map`,
  ];

  groupByTool(digests).forEach(([tool, group], groupIndex) => {
    lines.push(
      `  subgraph tool${groupIndex}["${mermaidText(tool, 24)} · ${group.length}"]`,
    );

    for (const digest of group) {
      const { piece } = digest;
      const label = [
        `<b>${mermaidText(piece.title, 40)}</b>`,
        `<small>${mermaidText(
          [formatCreatedAt(piece.createdAt, locale), piece.device]
            .filter(Boolean)
            .join(" · "),
          48,
        )}</small>`,
        mermaidText(digest.gist || text.gistFallback, 64),
        `<small>${text.counts(
          digest.decisions.length,
          digest.questions.length,
          digest.actions.length,
        )}</small>`,
      ].join("<br/>");

      lines.push(`    ${digest.nodeId}["${label}"]`);
    }

    lines.push("  end");
  });

  const hubLabel = [
    `<b>★ ${text.hub} → ${mermaidText(targetTool, 24)}</b>`,
    `<small>${isMerged ? text.hubMerged : text.hubPending}</small>`,
    mermaidText(northStar, 56),
  ].join("<br/>");

  lines.push(`  hub{{"${hubLabel}"}}`);

  for (const digest of digests) {
    lines.push(`  ${digest.nodeId} --> hub`);
  }

  // Session nodes take the theme colors: classDef styles are inlined with
  // !important, which would block the hover and selection highlight.
  lines.push(
    "  classDef hub fill:#FFF4CC,stroke:#6A46E2,stroke-width:2px,color:#2D185D",
    "  class hub hub",
  );

  return lines.join("\n");
}
