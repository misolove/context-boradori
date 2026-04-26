"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { CompressionResult } from "@/lib/compression";
import { downloadMarkdownFile } from "@/lib/markdown";

type ResultPanelProps = {
  result: CompressionResult;
  title?: string;
  description?: string;
  downloads?: ResultDownload[];
  initialSection?: keyof CompressionResult;
};

const resultSections: Array<{
  key: keyof CompressionResult;
  title: string;
}> = [
  { key: "sessionSummary", title: "세션 요약" },
  { key: "confirmedDecisions", title: "확정된 결정사항" },
  { key: "proposedIdeas", title: "제안되었지만 확정되지 않은 내용" },
  { key: "openQuestions", title: "열린 질문" },
  { key: "nextActions", title: "다음 액션" },
  { key: "handoffMarkdown", title: "다음 AI를 위한 Handoff" },
  { key: "agentsMd", title: "AGENTS.md export" },
  { key: "claudeMd", title: "CLAUDE.md export" },
  { key: "geminiMd", title: "GEMINI.md export" },
];

type ResultDownload = {
  key: keyof CompressionResult;
  filename: string;
};

const defaultDownloads: ResultDownload[] = [
  { key: "handoffMarkdown", filename: "handoff.md" },
  { key: "agentsMd", filename: "AGENTS.md" },
  { key: "claudeMd", filename: "CLAUDE.md" },
  { key: "geminiMd", filename: "GEMINI.md" },
];

export function ResultPanel({
  result,
  title = "압축 결과",
  description = "모든 결과는 브라우저에서 만든 mock 정리본입니다.",
  downloads = defaultDownloads,
  initialSection = "sessionSummary",
}: ResultPanelProps) {
  const [activeKey, setActiveKey] =
    useState<keyof CompressionResult>(initialSection);
  const activeSection =
    resultSections.find((section) => section.key === activeKey) ??
    resultSections[0];
  const activeContent = result[activeSection.key];

  return (
    <section className="space-y-4" aria-label="압축 결과">
      <div className="rounded-lg border border-[#E6E0FF] bg-[#F7F4FF] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2D185D]">{title}</h2>
            <p className="text-sm text-[#6B6B7B]">{description}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {downloads.map((download) => (
              <button
                key={download.filename}
                type="button"
                onClick={() =>
                  downloadMarkdownFile(download.filename, result[download.key])
                }
                className="h-9 rounded-lg bg-[#6A46E2] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5A32C8] focus:outline-none focus:ring-2 focus:ring-[#B094FF]"
              >
                {download.filename}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {resultSections.map((section) => {
            const isActive = section.key === activeSection.key;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveKey(section.key)}
                className={`min-h-10 rounded-lg px-3 py-2 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#B094FF] ${
                  isActive
                    ? "bg-[#6A46E2] text-white shadow-sm"
                    : "border border-[#E6E0FF] bg-[#FCFAFF] text-[#3b168c] hover:bg-[#F5F1FF]"
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>

        <article className="mt-3 rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-bold text-[#2D185D]">
              {activeSection.title}
            </h3>
            <CopyButton text={activeContent} />
          </div>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#E6E0FF] bg-white p-4 font-mono text-xs leading-6 text-[#333333]">
            {activeContent}
          </pre>
        </article>
      </div>
    </section>
  );
}
