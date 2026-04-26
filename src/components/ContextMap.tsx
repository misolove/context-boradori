"use client";

import type {
  CompressionResult,
  ContextPiece,
  SourceTool,
} from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";

type ContextMapProps = {
  pieces: ContextPiece[];
  projectName: string;
  targetTool: SourceTool;
  result: CompressionResult | null;
  northStar?: string;
  locale: Locale;
};

function stripBulletPrefix(line: string) {
  return line.replace(/^[-*#>\d.)\s]+/, "").trim();
}

function extractPreviewLines(
  text: string | undefined,
  ignorePattern: RegExp,
  limit = 2,
) {
  if (!text) {
    return [];
  }

  return text
    .split(/\r?\n/)
    .map(stripBulletPrefix)
    .filter(Boolean)
    .filter((line) => !ignorePattern.test(line))
    .slice(0, limit);
}

function sourceDistribution(pieces: ContextPiece[]) {
  return pieces.reduce<Record<string, number>>((counts, piece) => {
    counts[piece.sourceTool] = (counts[piece.sourceTool] ?? 0) + 1;
    return counts;
  }, {});
}

function MapList({
  title,
  items,
  fallback,
}: {
  title: string;
  items: string[];
  fallback: string;
}) {
  const visibleItems = items.length > 0 ? items : [fallback];

  return (
    <div className="rounded-lg border border-[#E6E0FF] bg-white p-3">
      <h4 className="text-sm font-bold text-[#2D185D]">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-[#56536B]">
        {visibleItems.map((item) => (
          <li key={item} className="line-clamp-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContextMap({
  pieces,
  projectName,
  targetTool,
  result,
  northStar: pinnedNorthStar,
  locale,
}: ContextMapProps) {
  const text = uiText[locale].contextMap;
  const distribution = sourceDistribution(pieces);
  const sources = Object.entries(distribution);
  const project = projectName.trim() || text.untitledProject;
  const northStar =
    pinnedNorthStar?.trim() ||
    result?.northStar ||
    text.fallbackNorthStar(project, targetTool);
  const decisions = extractPreviewLines(
    result?.confirmedDecisions,
    text.ignorePattern,
  );
  const questions = extractPreviewLines(
    result?.openQuestions,
    text.ignorePattern,
  );
  const actions = extractPreviewLines(result?.nextActions, text.ignorePattern);

  return (
    <section
      className="rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] p-3 shadow-sm sm:p-4"
      aria-label={text.ariaLabel}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
            {text.eyebrow}
          </p>
          <h3 className="mt-1 text-lg font-bold text-[#2D185D]">
            {text.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#6B6B7B]">
            {text.description}
          </p>
        </div>
        <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#3b168c]">
          {project}
        </span>
      </div>

      <div className="mt-3 grid gap-3 2xl:grid-cols-[0.82fr_1.25fr_0.82fr] 2xl:items-center">
        <div className="rounded-lg border border-[#E6E0FF] bg-white p-3">
          <h4 className="text-sm font-bold text-[#2D185D]">
            {text.sourceTools}
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.length > 0 ? (
              sources.map(([tool, count]) => (
                <span
                  key={tool}
                  className="rounded-lg bg-[#F5F1FF] px-3 py-2 text-sm font-bold text-[#3b168c]"
                >
                  {tool} {count}
                </span>
              ))
            ) : (
              <span className="text-sm leading-6 text-[#6B6B7B]">
                {text.noSources}
              </span>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-[#B094FF] bg-white p-4 text-center">
          <div className="pointer-events-none absolute left-6 right-6 top-1/2 hidden h-px bg-[#DCCBFF] 2xl:block" />
          <div className="relative mx-auto flex min-h-36 max-w-md flex-col items-center justify-center rounded-lg border border-[#E6E0FF] bg-[#F7F4FF] p-4 shadow-sm">
            <svg
              aria-hidden="true"
              className="mb-2 h-10 w-10"
              viewBox="0 0 64 64"
              fill="none"
            >
              <path
                d="M32 6L38.2 24.8H58L42 36.2L48.2 55L32 43.4L15.8 55L22 36.2L6 24.8H25.8L32 6Z"
                fill="#FFD766"
                stroke="#6A46E2"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="32" r="7" fill="#6A46E2" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
              {text.northStarLabel}
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#2D185D] sm:text-base">
              {northStar}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-[#E6E0FF] bg-white p-3">
          <h4 className="text-sm font-bold text-[#2D185D]">
            {text.targetTool}
          </h4>
          <div className="mt-3 rounded-lg bg-[#2D185D] px-3 py-4 text-center text-base font-bold text-white">
            {targetTool}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6B6B7B]">
            {text.targetDescription}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <MapList
          title={text.decisionsTitle}
          items={decisions}
          fallback={text.decisionsFallback}
        />
        <MapList
          title={text.questionsTitle}
          items={questions}
          fallback={text.questionsFallback}
        />
        <MapList
          title={text.actionsTitle}
          items={actions}
          fallback={text.actionsFallback}
        />
      </div>
    </section>
  );
}
