"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { CompressionResult } from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";
import { downloadMarkdownFile } from "@/lib/markdown";

type ResultPanelProps = {
  result: CompressionResult;
  title?: string;
  description?: string;
  downloads?: ResultDownload[];
  initialSection?: keyof CompressionResult;
  locale?: Locale;
};

function getResultSections(locale: Locale): Array<{
  key: keyof CompressionResult;
  title: string;
}> {
  const sections = uiText[locale].result.sections;

  return [
    { key: "northStar", title: sections.northStar },
    { key: "sessionSummary", title: sections.sessionSummary },
    { key: "confirmedDecisions", title: sections.confirmedDecisions },
    { key: "proposedIdeas", title: sections.proposedIdeas },
    { key: "openQuestions", title: sections.openQuestions },
    { key: "nextActions", title: sections.nextActions },
    { key: "handoffMarkdown", title: sections.handoffMarkdown },
    { key: "agentsMd", title: sections.agentsMd },
    { key: "claudeMd", title: sections.claudeMd },
    { key: "geminiMd", title: sections.geminiMd },
  ];
}

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
  title,
  description,
  downloads = defaultDownloads,
  initialSection = "sessionSummary",
  locale = "ko",
}: ResultPanelProps) {
  const text = uiText[locale].result;
  const resultSections = getResultSections(locale);
  const panelTitle = title ?? text.defaultTitle;
  const panelDescription = description ?? text.defaultDescription;
  const [activeKey, setActiveKey] =
    useState<keyof CompressionResult>(initialSection);
  const activeSection =
    resultSections.find((section) => section.key === activeKey) ??
    resultSections[0];
  const activeContent = result[activeSection.key];

  return (
    <section className="space-y-4" aria-label={text.ariaLabel}>
      <div className="rounded-lg border border-[#E6E0FF] bg-[#F7F4FF] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2D185D]">{panelTitle}</h2>
            <p className="text-sm text-[#6B6B7B]">{panelDescription}</p>
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
            <CopyButton
              text={activeContent}
              label={text.copy}
              copiedLabel={text.copied}
            />
          </div>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#E6E0FF] bg-white p-4 font-mono text-xs leading-6 text-[#333333]">
            {activeContent}
          </pre>
        </article>
      </div>
    </section>
  );
}
