"use client";

import { FormEvent, useMemo, useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import {
  CompressionResult,
  SourceTool,
  generateMockCompression,
} from "@/lib/compression";

const sourceTools: SourceTool[] = [
  "ChatGPT",
  "Codex",
  "Claude",
  "Claude Code",
  "Gemini",
  "Gemini CLI",
  "Other",
];

const sampleContext = `프로젝트: 맥락 보라돌이
결정: MVP는 실제 LLM API 없이 mock compression으로 먼저 만든다.
confirmed: public hackathon repo이므로 API key와 raw private context는 저장하지 않는다.
제안: 나중에 Vercel AI SDK streamText()로 실제 압축을 붙일 수 있다.
TODO: 붙여넣기 폼, 결과 패널, handoff.md 다운로드를 구현해야 한다.
다음: Vercel에 배포해서 데모 링크를 확보한다.
브랜드: 보라돌이는 맥락을 모으고, 이해하고, 압축하고, 연결하는 AI context librarian이다.
열린 질문: IndexedDB 저장은 MVP에 포함할까?`;

export function ContextForm() {
  const [projectName, setProjectName] = useState("맥락 보라돌이");
  const [sourceTool, setSourceTool] = useState<SourceTool>("Codex");
  const [rawContext, setRawContext] = useState("");
  const [result, setResult] = useState<CompressionResult | null>(null);

  const characterCount = useMemo(
    () => rawContext.trim().length,
    [rawContext],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(
      generateMockCompression({
        projectName,
        sourceTool,
        rawContext,
      }),
    );
  }

  function handleSourceToolChange(nextSourceTool: SourceTool) {
    setSourceTool(nextSourceTool);
    setResult(null);
  }

  function handleClearContext() {
    setRawContext("");
    setResult(null);
  }

  return (
    <div className="rounded-lg border border-white/80 bg-white/85 p-4 shadow-[0_24px_70px_rgba(106,70,226,0.18)] backdrop-blur sm:p-5 lg:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-[#FFC857] bg-[#FFF8DE] p-3 text-sm leading-6 text-[#624600]">
          API 키, 비밀번호, 토큰, 개인 금융정보는 붙여넣지 마세요. 공개
          repo에는 raw context를 저장하지 않는 것을 권장합니다. 현재 데모는
          외부 AI API를 호출하지 않습니다.
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[#3b168c]">
              프로젝트 이름
            </span>
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              className="h-12 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 text-[#333333] outline-none transition focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
              placeholder="예: 맥락 보라돌이"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[#3b168c]">
              출처 AI 도구
            </span>
            <select
              value={sourceTool}
              onChange={(event) =>
                handleSourceToolChange(event.target.value as SourceTool)
              }
              className="h-12 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 text-[#333333] outline-none transition focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
            >
              {sourceTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <span className="text-sm font-semibold text-[#3b168c]">
              Raw context 붙여넣기
            </span>
            <span className="font-mono text-xs text-[#6B6B7B]">
              {characterCount.toLocaleString("ko-KR")} chars
            </span>
          </div>
          <textarea
            value={rawContext}
            onChange={(event) => setRawContext(event.target.value)}
            rows={12}
            className="min-h-64 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 py-3 text-sm leading-6 text-[#333333] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
            placeholder="여기에 ChatGPT, Claude, Codex, Gemini의 작업 맥락을 붙여넣으세요."
          />
        </label>

        {characterCount > 12000 ? (
          <p className="rounded-lg border border-[#ffb0c6] bg-[#fff1f5] p-3 text-sm text-[#9f1239]">
            맥락이 꽤 깁니다. MVP mock 압축은 앞부분과 규칙 기반 라인을
            중심으로 정리합니다.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="h-12 rounded-lg bg-[#6A46E2] px-5 text-base font-bold text-white shadow-[0_14px_30px_rgba(106,70,226,0.28)] transition hover:bg-[#5A32C8] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/40"
          >
            맥락 압축하기
          </button>
          <button
            type="button"
            onClick={() => setRawContext(sampleContext)}
            className="h-12 rounded-lg border border-[#E6E0FF] bg-white px-5 text-base font-bold text-[#3b168c] transition hover:bg-[#F5F1FF] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/25"
          >
            샘플 맥락 불러오기
          </button>
          <button
            type="button"
            onClick={handleClearContext}
            disabled={characterCount === 0 && result === null}
            className="h-12 rounded-lg border border-[#E6E0FF] bg-white px-5 text-base font-bold text-[#6B6B7B] transition hover:bg-[#F5F1FF] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#B094FF]/25"
          >
            입력 비우기
          </button>
        </div>
      </form>

      {result ? (
        <div className="mt-6">
          <ResultPanel result={result} />
        </div>
      ) : null}
    </div>
  );
}
