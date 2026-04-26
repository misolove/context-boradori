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

const decisionPattern = /(결정|확정|confirmed|decided|decision)/i;
const nextActionPattern = /(todo|해야|할 일|next|다음|액션|action)/i;
const questionPattern = /(\?|질문|궁금|확인 필요|open question)/i;
const proposedPattern = /(제안|아이디어|idea|proposal|proposed|maybe|고려|나중에|옵션)/i;

function normalizeLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*#>\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function uniqueLines(lines: string[]) {
  return [...new Set(lines)].slice(0, 8);
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
