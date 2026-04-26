"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ContextMap } from "@/components/ContextMap";
import { ResultPanel } from "@/components/ResultPanel";
import {
  CompressionResult,
  ContextPiece,
  SourceTool,
  generateMergedCompression,
  generateMockCompression,
} from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";

const STORAGE_KEY = "context-boradori-context-pieces-v1";
const NORTH_STAR_STORAGE_KEY = "context-boradori-north-star-v1";
const locales: Locale[] = ["ko", "en"];
const defaultNorthStars: Record<Locale, string> = {
  ko: uiText.ko.context.defaultNorthStar,
  en: uiText.en.context.defaultNorthStar,
};

const sourceTools: SourceTool[] = [
  "ChatGPT",
  "Codex",
  "Claude",
  "Claude Code",
  "Gemini",
  "Gemini CLI",
  "Other",
];

const sampleContext: Record<Locale, string> = {
  ko: `프로젝트: 맥락 보라돌이
결정: MVP는 실제 LLM API 없이 mock compression으로 먼저 만든다.
confirmed: public hackathon repo이므로 API key와 raw private context는 저장하지 않는다.
제안: 나중에 Vercel AI SDK streamText()로 실제 압축을 붙일 수 있다.
TODO: 붙여넣기 폼, 결과 패널, handoff.md 다운로드를 구현해야 한다.
다음: Vercel에 배포해서 데모 링크를 확보한다.
브랜드: 보라돌이는 맥락을 모으고, 이해하고, 압축하고, 연결하는 AI context librarian이다.
열린 질문: IndexedDB 저장은 MVP에 포함할까?`,
  en: `Project: Context Boradori
Decision: The MVP should use mock compression first, without a real LLM API.
confirmed: Because this is a public hackathon repo, API keys and raw private context should not be stored.
Proposal: Later, real compression can be added with the Vercel AI SDK streamText() flow.
TODO: Implement paste form, result panels, and handoff.md downloads.
Next: Deploy to Vercel and secure a live demo link.
Brand: Boradori is an AI context librarian that collects, understands, compresses, and connects context.
Open question: Should IndexedDB storage be part of the MVP?`,
};

const parallelSamples: Record<Locale, Array<{
  title: string;
  sourceTool: SourceTool;
  rawContext: string;
}>> = {
  ko: [
    {
      title: "ChatGPT 기획 맥락",
      sourceTool: "ChatGPT",
      rawContext: `프로젝트: 맥락 보라돌이
결정: 제품 핵심은 여러 AI 도구의 작업 맥락을 공통 프로젝트 기억으로 합치는 것이다.
제안: 화면에는 모으다, 이해하다, 압축하다, 연결하다 흐름을 명확히 보여준다.
TODO: 해커톤 제출용으로 GitHub repo, live demo, backup demo video를 준비해야 한다.
열린 질문: raw context를 어디까지 브라우저에 저장할 수 있을까?`,
    },
    {
      title: "Codex 구현 맥락",
      sourceTool: "Codex",
      rawContext: `confirmed: MVP는 Next.js App Router, TypeScript, Tailwind CSS로 구현한다.
결정: 외부 AI API와 유료 DB 없이 브라우저에서 mock compression을 실행한다.
TODO: copy/download 버튼, AGENTS.md export, CLAUDE.md export, GEMINI.md export를 유지한다.
다음: 여러 source tool의 압축 결과를 병합하는 common context flow를 추가한다.`,
    },
    {
      title: "Claude 리뷰 맥락",
      sourceTool: "Claude",
      rawContext: `제안: 공통맥락 병합 결과에는 확정된 결정과 미확정 아이디어를 분리해서 보여준다.
확인 필요: GitHub를 DB처럼 쓰는 대신 public repo에는 정제된 handoff만 export하는 편이 안전하다?
next: 대상 도구를 선택하면 ChatGPT, Codex, Claude, Gemini에 맞는 handoff copy를 생성한다.
idea: 나중에 충돌 감지와 diff view를 붙이면 병렬 AI 작업 관리가 더 강해진다.`,
    },
  ],
  en: [
    {
      title: "ChatGPT planning context",
      sourceTool: "ChatGPT",
      rawContext: `Project: Context Boradori
Decision: The core product is merging work context from multiple AI tools into shared project memory.
Proposal: The screen should clearly show the flow: collect, understand, compress, connect.
TODO: Prepare GitHub repo, live demo, and backup demo video for hackathon submission.
Open question: How much raw context should be stored in the browser?`,
    },
    {
      title: "Codex implementation context",
      sourceTool: "Codex",
      rawContext: `confirmed: The MVP uses Next.js App Router, TypeScript, and Tailwind CSS.
Decision: Run mock compression in the browser without external AI APIs or paid databases.
TODO: Keep copy/download buttons plus AGENTS.md, CLAUDE.md, and GEMINI.md exports working.
Next: Add a common context flow that merges compressed results from multiple source tools.`,
    },
    {
      title: "Claude review context",
      sourceTool: "Claude",
      rawContext: `Proposal: The merged common context should separate confirmed decisions from unconfirmed ideas.
Open question: Instead of using GitHub as a database, should public repos only receive cleaned handoff exports?
next: When the target tool is selected, generate handoff copy for ChatGPT, Codex, Claude, or Gemini.
idea: Conflict detection and diff views would make parallel AI work management stronger later.`,
    },
  ],
};

const mergedDownloads = [
  { key: "handoffMarkdown" as const, filename: "common-handoff.md" },
  { key: "agentsMd" as const, filename: "AGENTS.md" },
  { key: "claudeMd" as const, filename: "CLAUDE.md" },
  { key: "geminiMd" as const, filename: "GEMINI.md" },
];

function createPieceId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createContextPiece(
  projectName: string,
  sourceTool: SourceTool,
  rawContext: string,
  title: string,
  northStar: string,
  locale: Locale,
): ContextPiece {
  return {
    id: createPieceId(),
    title,
    sourceTool,
    characterCount: rawContext.trim().length,
    createdAt: new Date().toISOString(),
    result: generateMockCompression({
      projectName,
      sourceTool,
      rawContext,
      northStar,
      locale,
    }),
  };
}

function isStoredContextPiece(value: unknown): value is ContextPiece {
  if (!value || typeof value !== "object") {
    return false;
  }

  const piece = value as Partial<ContextPiece>;

  return (
    typeof piece.id === "string" &&
    typeof piece.title === "string" &&
    typeof piece.sourceTool === "string" &&
    typeof piece.characterCount === "number" &&
    typeof piece.createdAt === "string" &&
    !!piece.result &&
    typeof piece.result.sessionSummary === "string" &&
    typeof piece.result.handoffMarkdown === "string"
  );
}

function formatCreatedAt(value: string, locale: Locale) {
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

function previewSummary(result: CompressionResult) {
  const compact = result.sessionSummary.replace(/\s+/g, " ").trim();

  if (compact.length <= 180) {
    return compact;
  }

  return `${compact.slice(0, 180).trim()}...`;
}

type ContextFormProps = {
  locale: Locale;
};

export function ContextForm({ locale }: ContextFormProps) {
  const text = uiText[locale].context;
  const numberLocale = locale === "ko" ? "ko-KR" : "en-US";
  const [projectName, setProjectName] = useState("맥락 보라돌이");
  const [sourceTool, setSourceTool] = useState<SourceTool>("Codex");
  const [targetTool, setTargetTool] = useState<SourceTool>("Codex");
  const [projectNorthStars, setProjectNorthStars] =
    useState<Record<Locale, string>>(defaultNorthStars);
  const [rawContext, setRawContext] = useState("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [contextPieces, setContextPieces] = useState<ContextPiece[]>([]);
  const [mergedResult, setMergedResult] = useState<CompressionResult | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const characterCount = useMemo(
    () => rawContext.trim().length,
    [rawContext],
  );
  const totalPieceCharacters = useMemo(
    () =>
      contextPieces.reduce((total, piece) => total + piece.characterCount, 0),
    [contextPieces],
  );
  const projectNorthStar = projectNorthStars[locale];
  const effectiveNorthStar = projectNorthStar.trim() || text.defaultNorthStar;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);

          if (Array.isArray(parsed)) {
            setContextPieces(
              parsed.filter(isStoredContextPiece).slice(0, 12),
            );
          }
        }

        const storedNorthStars = locales.reduce<Partial<Record<Locale, string>>>(
          (values, nextLocale) => {
            const storedNorthStar = window.localStorage.getItem(
              `${NORTH_STAR_STORAGE_KEY}-${nextLocale}`,
            );

            if (storedNorthStar?.trim()) {
              values[nextLocale] = storedNorthStar;
            }

            return values;
          },
          {},
        );

        setProjectNorthStars((current) => ({
          ...current,
          ...storedNorthStars,
        }));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProjectName((currentProjectName) => {
        if (locale === "en" && currentProjectName === "맥락 보라돌이") {
          return "Context Boradori";
        }

        if (locale === "ko" && currentProjectName === "Context Boradori") {
          return "맥락 보라돌이";
        }

        return currentProjectName;
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [locale]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      if (contextPieces.length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(contextPieces.slice(0, 12)),
      );
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [contextPieces, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const northStarStorageKey = `${NORTH_STAR_STORAGE_KEY}-${locale}`;

    try {
      window.localStorage.setItem(northStarStorageKey, projectNorthStar);
    } catch {
      window.localStorage.removeItem(northStarStorageKey);
    }
  }, [projectNorthStar, isHydrated, locale]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(
      generateMockCompression({
        projectName,
        sourceTool,
        rawContext,
        northStar: effectiveNorthStar,
        locale,
      }),
    );
  }

  function handleSourceToolChange(nextSourceTool: SourceTool) {
    setSourceTool(nextSourceTool);
    setRawContext("");
    setResult(null);
  }

  function handleAddContextPiece() {
    if (characterCount === 0) {
      return;
    }

    const nextPiece = createContextPiece(
      projectName,
      sourceTool,
      rawContext,
      text.pieceTitle(sourceTool, contextPieces.length + 1),
      effectiveNorthStar,
      locale,
    );

    setContextPieces((pieces) => [nextPiece, ...pieces].slice(0, 12));
    setResult(nextPiece.result);
    setMergedResult(null);
    setRawContext("");
  }

  function handleLoadParallelSamples() {
    const samplePieces = parallelSamples[locale].map((sample) =>
      createContextPiece(
        projectName,
        sample.sourceTool,
        sample.rawContext,
        sample.title,
        effectiveNorthStar,
        locale,
      ),
    );

    setContextPieces((pieces) => [...samplePieces, ...pieces].slice(0, 12));
    setResult(samplePieces[0]?.result ?? null);
    setMergedResult(null);
    setRawContext("");
  }

  function handleMergeContext() {
    setMergedResult(
      generateMergedCompression({
        projectName,
        targetTool,
        pieces: [...contextPieces].reverse(),
        northStar: effectiveNorthStar,
        locale,
      }),
    );
  }

  function handleRemoveContextPiece(pieceId: string) {
    setContextPieces((pieces) =>
      pieces.filter((piece) => piece.id !== pieceId),
    );
    setMergedResult(null);
  }

  function handleClearContextPieces() {
    setContextPieces([]);
    setMergedResult(null);
  }

  function handleClearContext() {
    setRawContext("");
    setResult(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/80 bg-white/90 shadow-[0_24px_70px_rgba(106,70,226,0.18)] backdrop-blur">
      <div className="border-b border-[#E6E0FF] bg-[#FCFAFF] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
              {text.workspaceLabel}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#2D185D]">
              {text.workspaceTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6B7B]">
              {text.workspaceDescription}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-2 text-center sm:min-w-[21rem]">
            {[
              [
                text.metrics.pieces,
                contextPieces.length.toLocaleString(numberLocale),
              ],
              [
                text.metrics.characters,
                totalPieceCharacters.toLocaleString(numberLocale),
              ],
              [text.metrics.target, targetTool],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-[#E6E0FF] bg-white px-3 py-2"
              >
                <dt className="text-xs font-semibold text-[#6B6B7B]">
                  {label}
                </dt>
                <dd className="mt-1 truncate text-sm font-bold text-[#3b168c]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ol className="mt-4 hidden gap-2 sm:grid sm:grid-cols-3">
          {[
            ["01", text.steps[0], characterCount > 0],
            ["02", text.steps[1], contextPieces.length > 0],
            ["03", text.steps[2], Boolean(mergedResult)],
          ].map(([step, label, isActive]) => (
            <li
              key={step.toString()}
              className={`rounded-lg border p-3 ${
                isActive
                  ? "border-[#8A5CF6] bg-[#F5F1FF]"
                  : "border-[#E6E0FF] bg-white/70"
              }`}
            >
              <p className="text-xs font-bold text-[#8A5CF6]">{step}</p>
              <p className="mt-1 text-sm font-bold text-[#2D185D]">{label}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <label className="order-2 space-y-2 rounded-lg border border-[#E6E0FF] bg-white p-3 lg:order-1">
            <span className="text-sm font-bold text-[#3b168c]">
              {text.northStarLabel}
            </span>
            <textarea
              value={projectNorthStar}
              onChange={(event) =>
                setProjectNorthStars((current) => ({
                  ...current,
                  [locale]: event.target.value,
                }))
              }
              rows={4}
              className="min-h-24 w-full rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] px-3 py-2 text-sm leading-6 text-[#333333] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8A5CF6] focus:bg-white focus:ring-4 focus:ring-[#B094FF]/25"
              placeholder={text.defaultNorthStar}
            />
            <p className="text-xs leading-5 text-[#6B6B7B]">
              {text.northStarHelp}
            </p>
          </label>

          <div className="order-1 lg:order-2">
            <ContextMap
              pieces={contextPieces}
              projectName={projectName}
              targetTool={targetTool}
              result={mergedResult}
              northStar={effectiveNorthStar}
              locale={locale}
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#FFC857] bg-[#FFF8DE] p-3 text-sm leading-6 text-[#624600]">
          {text.securityNote}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.86fr)] xl:items-start">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-[#E6E0FF] bg-white p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
                  {text.sourceLabel}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#2D185D]">
                  {text.sourceTitle}
                </h3>
              </div>
              <span className="rounded-lg bg-[#F5F1FF] px-3 py-2 font-mono text-xs font-bold text-[#3b168c]">
                {characterCount.toLocaleString(numberLocale)} {text.chars}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3b168c]">
                  {text.projectNameLabel}
                </span>
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 text-[#333333] outline-none transition focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
                  placeholder={text.projectNamePlaceholder}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3b168c]">
                  {text.sourceToolLabel}
                </span>
                <select
                  value={sourceTool}
                  onChange={(event) =>
                    handleSourceToolChange(event.target.value as SourceTool)
                  }
                  className="h-11 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 text-[#333333] outline-none transition focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
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
              <span className="text-sm font-semibold text-[#3b168c]">
                {text.rawContextLabel}
              </span>
              <textarea
                value={rawContext}
                onChange={(event) => setRawContext(event.target.value)}
                rows={10}
                className="min-h-56 w-full rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] px-4 py-3 text-sm leading-6 text-[#333333] outline-none transition placeholder:text-[#9ca3af] focus:border-[#8A5CF6] focus:bg-white focus:ring-4 focus:ring-[#B094FF]/25"
                placeholder={text.rawContextPlaceholder}
              />
            </label>

            {characterCount > 12000 ? (
              <p className="rounded-lg border border-[#ffb0c6] bg-[#fff1f5] p-3 text-sm text-[#9f1239]">
                {text.longContextWarning}
              </p>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <button
                type="button"
                onClick={handleAddContextPiece}
                disabled={characterCount === 0}
                className="h-11 rounded-lg bg-[#6A46E2] px-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(106,70,226,0.22)] transition hover:bg-[#5A32C8] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#B094FF]/40"
              >
                {text.addToCommon}
              </button>
              <button
                type="submit"
                className="h-11 rounded-lg bg-[#2D185D] px-4 text-sm font-bold text-white transition hover:bg-[#201044] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/40"
              >
                {text.previewCompression}
              </button>
              <button
                type="button"
                onClick={() => setRawContext(sampleContext[locale])}
                className="h-11 rounded-lg border border-[#E6E0FF] bg-white px-4 text-sm font-bold text-[#3b168c] transition hover:bg-[#F5F1FF] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/25"
              >
                {text.loadSample}
              </button>
              <button
                type="button"
                onClick={handleClearContext}
                disabled={characterCount === 0 && result === null}
                className="h-11 rounded-lg border border-[#E6E0FF] bg-white px-4 text-sm font-bold text-[#6B6B7B] transition hover:bg-[#F5F1FF] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#B094FF]/25"
              >
                {text.clearInput}
              </button>
            </div>
          </form>

          <section className="space-y-4 rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
                  {text.commonTrayLabel}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#2D185D]">
                  {text.commonTrayTitle}
                </h3>
              </div>
              <span
                className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3b168c]"
                aria-live="polite"
              >
                {contextPieces.length.toLocaleString(numberLocale)}
              </span>
            </div>

            <div className="grid gap-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3b168c]">
                  {text.targetToolLabel}
                </span>
                <select
                  value={targetTool}
                  onChange={(event) =>
                    setTargetTool(event.target.value as SourceTool)
                  }
                  className="h-11 w-full rounded-lg border border-[#E6E0FF] bg-white px-3 text-[#333333] outline-none transition focus:border-[#8A5CF6] focus:ring-4 focus:ring-[#B094FF]/25"
                >
                  {sourceTools.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleMergeContext}
                  disabled={contextPieces.length === 0}
                  className="h-11 rounded-lg bg-[#6A46E2] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#5A32C8] disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-4 focus:ring-[#B094FF]/40"
                >
                  {text.mergeCommon}
                </button>
                <button
                  type="button"
                  onClick={handleLoadParallelSamples}
                  className="h-11 rounded-lg border border-[#8DE5B4] bg-[#ECFFF5] px-4 text-sm font-bold text-[#126B42] transition hover:bg-[#D9FFEA] focus:outline-none focus:ring-4 focus:ring-[#8DE5B4]/30"
                >
                  {text.addParallelSamples}
                </button>
              </div>
            </div>

            {contextPieces.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#B094FF] bg-white p-5 text-sm leading-6 text-[#6B6B7B]">
                {text.emptyTray}
              </div>
            ) : (
              <div className="space-y-3">
                <ul className="max-h-[31rem] space-y-3 overflow-auto pr-1">
                  {contextPieces.map((piece) => (
                    <li
                      key={piece.id}
                      className="rounded-lg border border-[#E6E0FF] bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-[#F5F1FF] px-2 py-1 text-xs font-bold text-[#3b168c]">
                              {piece.sourceTool}
                            </span>
                            <span className="text-xs font-semibold text-[#6B6B7B]">
                              {piece.characterCount.toLocaleString(
                                numberLocale,
                              )}{" "}
                              {text.chars} ·{" "}
                              {formatCreatedAt(piece.createdAt, locale)}
                            </span>
                          </div>
                          <h4 className="mt-2 truncate text-sm font-bold text-[#2D185D]">
                            {piece.title}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveContextPiece(piece.id)}
                          className="h-8 shrink-0 rounded-lg border border-[#FFB0C6] bg-white px-3 text-xs font-bold text-[#9F1239] transition hover:bg-[#FFF1F5] focus:outline-none focus:ring-4 focus:ring-[#FFB0C6]/25"
                        >
                          {text.delete}
                        </button>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#56536B]">
                        {previewSummary(piece.result)}
                      </p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handleClearContextPieces}
                  className="h-10 w-full rounded-lg border border-[#E6E0FF] bg-white px-4 text-sm font-bold text-[#6B6B7B] transition hover:bg-[#F5F1FF] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/25"
                >
                  {text.clearTray}
                </button>
              </div>
            )}
          </section>
        </div>

        {mergedResult ? (
          <ResultPanel
            result={mergedResult}
            title={text.mergedTitle}
            description={text.mergedDescription(
              contextPieces.length.toLocaleString(numberLocale),
              targetTool,
            )}
            downloads={mergedDownloads}
            initialSection="handoffMarkdown"
            locale={locale}
          />
        ) : null}

        {result ? (
          <ResultPanel
            result={result}
            title={text.pieceResultTitle}
            description={text.pieceResultDescription}
            initialSection="sessionSummary"
            locale={locale}
          />
        ) : null}
      </div>
    </div>
  );
}
