import {
  buildAgentsMd,
  buildClaudeMd,
  buildGeminiMd,
  buildHandoffMarkdown,
} from "@/lib/markdown";
import type { Locale } from "@/lib/i18n";
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
  northStar?: string;
  locale?: Locale;
};

export type CompressionCore = {
  northStar: string;
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
  northStar?: string;
  locale?: Locale;
};

const decisionPattern = /(결정|확정|confirmed|decided|decision)/i;
const nextActionPattern = /(todo|해야|할 일|\bnext\b(?!\.js)|다음|액션|action)/i;
const questionPattern = /(\?|질문|궁금|확인 필요|open question)/i;
const proposedPattern = /(제안|아이디어|idea|proposal|proposed|maybe|고려|나중에|옵션)/i;
const proposedPrefixPattern =
  /^(제안|아이디어|idea|proposal|proposed|maybe|고려|나중에|옵션)\s*[:：]/i;
const fallbackPattern =
  /(찾지 못했습니다|아직 입력되지 않았습니다|빈 handoff 초안|No clearly confirmed decisions were found|No proposed ideas were found|No open questions were found|No next actions were found|does not have raw context yet|empty handoff draft)/i;

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

function extractDecisionLines(lines: string[]) {
  return uniqueLines(
    lines.filter(
      (line) => decisionPattern.test(line) && !proposedPrefixPattern.test(line),
    ),
  );
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

function localeCode(locale: Locale) {
  return locale === "ko" ? "ko-KR" : "en-US";
}

function buildSummary(input: CompressionInput, redactedContext: string) {
  const locale = input.locale ?? "ko";
  const projectName = input.projectName.trim() || "Untitled project";
  const compact = redactedContext.replace(/\s+/g, " ").trim();

  if (!compact) {
    if (locale === "en") {
      return `${projectName} does not have raw context yet. This is an empty handoff draft based only on the project name and source tool.`;
    }

    return `${projectName}에 대한 raw context가 아직 입력되지 않았습니다. 프로젝트 이름과 source tool만 기준으로 빈 handoff 초안을 만들었습니다.`;
  }

  const excerpt =
    compact.length > 900 ? `${compact.slice(0, 900).trim()}...` : compact;

  if (locale === "en") {
    return `Context imported from ${input.sourceTool} for ${projectName}. ${input.rawContext.length.toLocaleString(localeCode(locale))} characters were organized locally with rule-based mock compression.

Key excerpt:
${excerpt}`;
  }

  return `${input.sourceTool}에서 가져온 ${projectName} 맥락입니다. 원문 ${input.rawContext.length.toLocaleString(localeCode(locale))}자를 브라우저 안에서 규칙 기반으로 정리했습니다.

핵심 발췌:
${excerpt}`;
}

function buildNorthStar(
  projectName: string,
  targetTool?: SourceTool,
  northStar?: string,
  locale: Locale = "ko",
) {
  if (northStar?.trim()) {
    return northStar.trim();
  }

  const project = projectName.trim() || "Untitled project";
  const target = targetTool ? `${targetTool}에서 ` : "";

  if (locale === "en") {
    const targetPrefix = targetTool ? `In ${targetTool}, ` : "";

    return `${targetPrefix}preserve ${project}'s confirmed direction, connect scattered context into one shared memory, and carry it forward into consistent next actions.`;
  }

  return `${target}${project}의 확정된 방향을 지키면서, 흩어진 맥락을 하나의 공통 기억으로 연결하고 다음 액션까지 일관되게 이어간다.`;
}

export function generateMockCompression(
  input: CompressionInput,
): CompressionResult {
  const locale = input.locale ?? "ko";
  const redactedContext = redactSensitiveText(input.rawContext);
  const lines = normalizeLines(redactedContext);

  const base: CompressionCore = {
    northStar: buildNorthStar(
      input.projectName,
      input.sourceTool,
      input.northStar,
      locale,
    ),
    sessionSummary: buildSummary(input, redactedContext),
    confirmedDecisions: toBulletList(
      extractDecisionLines(lines),
      locale === "en"
        ? "No clearly confirmed decisions were found."
        : "명확히 확정된 결정사항을 찾지 못했습니다.",
    ),
    proposedIdeas: toBulletList(
      extractLines(lines, proposedPattern),
      locale === "en"
        ? "No proposed ideas were found."
        : "제안 단계로 분류할 만한 내용을 찾지 못했습니다.",
    ),
    openQuestions: toBulletList(
      extractLines(lines, questionPattern),
      locale === "en"
        ? "No open questions were found."
        : "열린 질문을 찾지 못했습니다.",
    ),
    nextActions: toBulletList(
      extractLines(lines, nextActionPattern),
      locale === "en"
        ? "No next actions were found."
        : "다음 액션을 찾지 못했습니다.",
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
  const locale = input.locale ?? "ko";
  const projectName = input.projectName.trim() || "Untitled project";
  const pieces = input.pieces;
  const sourceTools = [...new Set(pieces.map((piece) => piece.sourceTool))];

  const sourceSummaries =
    pieces.length === 0
      ? locale === "en"
        ? "- No collected context pieces yet."
        : "- 아직 수집된 맥락 조각이 없습니다."
      : pieces
          .map((piece) => {
            const summary = previewText(piece.result.sessionSummary, 260);
            return `- [${piece.sourceTool}] ${piece.title}: ${summary}`;
          })
          .join("\n");

  const base: CompressionCore = {
    northStar: buildNorthStar(
      projectName,
      input.targetTool,
      input.northStar,
      locale,
    ),
    sessionSummary:
      locale === "en"
        ? `${projectName} shared context. ${pieces.length.toLocaleString(
            localeCode(locale),
          )} AI work context pieces were merged into a handoff that ${input.targetTool} can continue from.

## Source summaries
${sourceSummaries}`
        : `${projectName}의 공통맥락입니다. ${pieces.length.toLocaleString(
            localeCode(locale),
          )}개의 AI 작업 맥락을 모아 ${input.targetTool}에서 이어받을 수 있는 형태로 병합했습니다.

## 소스별 요약
${sourceSummaries}`,
    confirmedDecisions: mergeSection(
      pieces,
      "confirmedDecisions",
      locale === "en"
        ? "No clearly confirmed decisions were found across the collected context pieces."
        : "여러 맥락 조각에서 명확히 확정된 결정사항을 찾지 못했습니다.",
    ),
    proposedIdeas: mergeSection(
      pieces,
      "proposedIdeas",
      locale === "en"
        ? "No proposed ideas were found across the collected context pieces."
        : "여러 맥락 조각에서 제안 단계로 분류할 만한 내용을 찾지 못했습니다.",
    ),
    openQuestions: mergeSection(
      pieces,
      "openQuestions",
      locale === "en"
        ? "No open questions requiring human review were found after merge."
        : "공통맥락 병합 후에도 사람이 확인해야 할 열린 질문을 찾지 못했습니다.",
    ),
    nextActions: mergeSection(
      pieces,
      "nextActions",
      locale === "en"
        ? `${input.targetTool} should read the shared context and confirm the next work scope.`
        : `${input.targetTool}에서 공통맥락을 읽고 다음 작업 범위를 확정합니다.`,
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
    locale,
  };

  return {
    ...base,
    handoffMarkdown: buildHandoffMarkdown(mergedInput, base),
    agentsMd: buildAgentsMd(mergedInput, base),
    claudeMd: buildClaudeMd(mergedInput, base),
    geminiMd: buildGeminiMd(mergedInput, base),
  };
}
