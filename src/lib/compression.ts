import {
  buildAgentsMd,
  buildClaudeMd,
  buildGeminiMd,
  buildHandoffMarkdown,
} from "@/lib/markdown";
import { redactSensitiveText } from "@/lib/security";

export type SourceTool =
  | "ChatGPT"
  | "Codex"
  | "Claude"
  | "Claude Code"
  | "Gemini"
  | "Gemini CLI"
  | "Other";

export type CompressionInput = {
  projectName: string;
  sourceTool: SourceTool;
  rawContext: string;
};

export type CompressionCore = {
  sessionSummary: string;
  confirmedDecisions: string;
  proposedIdeas: string;
  openQuestions: string;
  nextActions: string;
};

export type CompressionResult = CompressionCore & {
  handoffMarkdown: string;
  agentsMd: string;
  claudeMd: string;
  geminiMd: string;
};

export type ContextPiece = {
  id: string;
  title: string;
  sourceTool: SourceTool;
  characterCount: number;
  createdAt: string;
  result: CompressionResult;
};

export type MergeInput = {
  projectName: string;
  targetTool: SourceTool;
  pieces: ContextPiece[];
};

const decisionPattern = /(결정|확정|confirmed|decided|decision)/i;
const nextActionPattern = /(todo|해야|할 일|next|다음|액션|action)/i;
const questionPattern = /(\?|질문|궁금|확인 필요|open question)/i;
const proposedPattern = /(제안|아이디어|idea|proposal|proposed|maybe|고려|나중에|옵션)/i;
const fallbackPattern =
  /(찾지 못했습니다|아직 입력되지 않았습니다|빈 handoff 초안)/;

function normalizeLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*#>\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function uniqueLines(lines: string[]) {
  return [...new Set(lines)].slice(0, 8);
}

function uniqueMergedLines(lines: string[]) {
  return [...new Set(lines)].slice(0, 14);
}

function extractLines(lines: string[], pattern: RegExp) {
  return uniqueLines(lines.filter((line) => pattern.test(line)));
}

function toBulletList(lines: string[], fallback: string) {
  if (lines.length === 0) {
    return `- ${fallback}`;
  }

  return lines.map((line) => `- ${line}`).join("\n");
}

function sectionLines(text: string) {
  return normalizeLines(text).filter((line) => !fallbackPattern.test(line));
}

function previewText(text: string, maxLength: number) {
  const compact = text.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength).trim()}...`;
}

function mergeSection(
  pieces: ContextPiece[],
  key: keyof CompressionCore,
  fallback: string,
) {
  const merged = pieces.flatMap((piece) =>
    sectionLines(piece.result[key]).map(
      (line) => `[${piece.sourceTool}] ${line}`,
    ),
  );

  return toBulletList(uniqueMergedLines(merged), fallback);
}

function buildSummary(input: CompressionInput, redactedContext: string) {
  const projectName = input.projectName.trim() || "Untitled project";
  const compact = redactedContext.replace(/\s+/g, " ").trim();

  if (!compact) {
    return `${projectName}에 대한 raw context가 아직 입력되지 않았습니다. 프로젝트 이름과 source tool만 기준으로 빈 handoff 초안을 만들었습니다.`;
  }

  const excerpt =
    compact.length > 900 ? `${compact.slice(0, 900).trim()}...` : compact;

  return `${input.sourceTool}에서 가져온 ${projectName} 맥락입니다. 원문 ${input.rawContext.length.toLocaleString("ko-KR")}자를 브라우저 안에서 규칙 기반으로 정리했습니다.

핵심 발췌:
${excerpt}`;
}

export function generateMockCompression(
  input: CompressionInput,
): CompressionResult {
  const redactedContext = redactSensitiveText(input.rawContext);
  const lines = normalizeLines(redactedContext);

  const base: CompressionCore = {
    sessionSummary: buildSummary(input, redactedContext),
    confirmedDecisions: toBulletList(
      extractLines(lines, decisionPattern),
      "명확히 확정된 결정사항을 찾지 못했습니다.",
    ),
    proposedIdeas: toBulletList(
      extractLines(lines, proposedPattern),
      "제안 단계로 분류할 만한 내용을 찾지 못했습니다.",
    ),
    openQuestions: toBulletList(
      extractLines(lines, questionPattern),
      "열린 질문을 찾지 못했습니다.",
    ),
    nextActions: toBulletList(
      extractLines(lines, nextActionPattern),
      "다음 액션을 찾지 못했습니다.",
    ),
  };

  return {
    ...base,
    handoffMarkdown: buildHandoffMarkdown(input, base),
    agentsMd: buildAgentsMd(input, base),
    claudeMd: buildClaudeMd(input, base),
    geminiMd: buildGeminiMd(input, base),
  };
}

export function generateMergedCompression(input: MergeInput): CompressionResult {
  const projectName = input.projectName.trim() || "Untitled project";
  const pieces = input.pieces;
  const sourceTools = [...new Set(pieces.map((piece) => piece.sourceTool))];

  const sourceSummaries =
    pieces.length === 0
      ? "- 아직 수집된 맥락 조각이 없습니다."
      : pieces
          .map((piece) => {
            const summary = previewText(piece.result.sessionSummary, 260);
            return `- [${piece.sourceTool}] ${piece.title}: ${summary}`;
          })
          .join("\n");

  const base: CompressionCore = {
    sessionSummary: `${projectName}의 공통맥락입니다. ${pieces.length.toLocaleString(
      "ko-KR",
    )}개의 AI 작업 맥락을 모아 ${input.targetTool}에서 이어받을 수 있는 형태로 병합했습니다.

## 소스별 요약
${sourceSummaries}`,
    confirmedDecisions: mergeSection(
      pieces,
      "confirmedDecisions",
      "여러 맥락 조각에서 명확히 확정된 결정사항을 찾지 못했습니다.",
    ),
    proposedIdeas: mergeSection(
      pieces,
      "proposedIdeas",
      "여러 맥락 조각에서 제안 단계로 분류할 만한 내용을 찾지 못했습니다.",
    ),
    openQuestions: mergeSection(
      pieces,
      "openQuestions",
      "공통맥락 병합 후에도 사람이 확인해야 할 열린 질문을 찾지 못했습니다.",
    ),
    nextActions: mergeSection(
      pieces,
      "nextActions",
      `${input.targetTool}에서 공통맥락을 읽고 다음 작업 범위를 확정합니다.`,
    ),
  };

  const mergedInput = {
    projectName,
    sourceTool:
      sourceTools.length > 0
        ? `Merged from ${sourceTools.join(", ")}`
        : "Merged context",
    targetTool: input.targetTool,
    sourceCount: pieces.length,
    mode: "merged" as const,
  };

  return {
    ...base,
    handoffMarkdown: buildHandoffMarkdown(mergedInput, base),
    agentsMd: buildAgentsMd(mergedInput, base),
    claudeMd: buildClaudeMd(mergedInput, base),
    geminiMd: buildGeminiMd(mergedInput, base),
  };
}
