"use client";

import type { Mermaid } from "mermaid";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import type { ContextPiece, SourceTool } from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";
import {
  buildSessionMermaid,
  digestPieces,
  formatCreatedAt,
} from "@/lib/sessionMap";

type SessionMapProps = {
  pieces: ContextPiece[];
  projectName: string;
  northStar: string;
  targetTool: SourceTool;
  isMerged: boolean;
  selectedPieceId: string | null;
  onSelectPiece: (pieceId: string) => void;
  onOpenPiece: (pieceId: string) => void;
  locale: Locale;
};

type RenderedDiagram = {
  code: string;
  ok: boolean;
};

let mermaidLoader: Promise<Mermaid> | null = null;

// Mermaid is large, so it is only fetched once a session map is on screen.
function loadMermaid() {
  mermaidLoader ??= import("mermaid")
    .then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        look: "classic",
        layout: "dagre",
        htmlLabels: true,
        fontFamily:
          "Geist, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', Arial, sans-serif",
        themeVariables: {
          fontSize: "13px",
          primaryColor: "#FFFFFF",
          primaryTextColor: "#2D185D",
          primaryBorderColor: "#B094FF",
          nodeBorder: "#B094FF",
          lineColor: "#8A5CF6",
          clusterBkg: "#FCFAFF",
          clusterBorder: "#E6E0FF",
          titleColor: "#3b168c",
        },
        flowchart: {
          curve: "basis",
          useMaxWidth: false,
          wrappingWidth: 190,
          nodeSpacing: 16,
          rankSpacing: 36,
          padding: 12,
        },
      });

      return mermaid;
    })
    .catch((error: unknown) => {
      mermaidLoader = null;
      throw error;
    });

  return mermaidLoader;
}

function SessionList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-lg border border-[#E6E0FF] bg-white p-3">
      <h5 className="text-xs font-bold text-[#2D185D]">
        {title} <span className="text-[#8A5CF6]">{items.length}</span>
      </h5>
      <ul className="mt-2 space-y-1.5 text-sm leading-5 text-[#56536B]">
        {items.length > 0 ? (
          items.slice(0, 3).map((item) => (
            <li key={item} className="line-clamp-2">
              {item}
            </li>
          ))
        ) : (
          <li className="text-[#9a97ad]">{emptyLabel}</li>
        )}
      </ul>
    </div>
  );
}

export function SessionMap({
  pieces,
  projectName,
  northStar,
  targetTool,
  isMerged,
  selectedPieceId,
  onSelectPiece,
  onOpenPiece,
  locale,
}: SessionMapProps) {
  const text = uiText[locale].sessionMap;
  const contextText = uiText[locale].context;
  const numberLocale = locale === "ko" ? "ko-KR" : "en-US";
  const renderPrefix = `session-map-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const renderCount = useRef(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState<RenderedDiagram | null>(null);

  const digests = useMemo(() => digestPieces(pieces), [pieces]);
  const code = useMemo(
    () =>
      buildSessionMermaid({
        digests,
        projectName,
        northStar,
        targetTool,
        isMerged,
        locale,
      }),
    [digests, projectName, northStar, targetTool, isMerged, locale],
  );
  const status =
    rendered?.code === code ? (rendered.ok ? "ready" : "error") : "loading";
  const selected = digests.find(
    (digest) => digest.piece.id === selectedPieceId,
  );
  // The gist usually repeats the first decision, question, or action below.
  const selectedGistIsListed = selected
    ? [
        selected.decisions[0],
        selected.questions[0],
        selected.actions[0],
      ].includes(selected.gist)
    : false;

  useEffect(() => {
    let cancelled = false;
    renderCount.current += 1;
    const svgId = `${renderPrefix}-${renderCount.current}`;

    loadMermaid()
      .then((mermaid) => mermaid.render(svgId, code))
      .then(({ svg }) => {
        const canvas = canvasRef.current;

        if (cancelled || !canvas) {
          return;
        }

        canvas.innerHTML = svg;

        const pieceByNode = new Map(
          digests.map((digest) => [digest.nodeId, digest.piece]),
        );

        // Flowchart nodes render as `<g id="{svgId}-flowchart-{nodeId}-{n}">`.
        canvas.querySelectorAll("g.node").forEach((node) => {
          const nodeId = node.id.match(/-flowchart-(.+)-\d+$/)?.[1];
          const piece = pieceByNode.get(nodeId ?? "");

          if (!piece) {
            return;
          }

          node.classList.add("session-node");
          node.setAttribute("data-piece-id", piece.id);
          node.setAttribute("tabindex", "0");
          node.setAttribute("role", "button");
          node.setAttribute(
            "aria-label",
            uiText[locale].context.openSession(piece.title),
          );
        });

        setRendered({ code, ok: true });
      })
      .catch(() => {
        document.getElementById(`d${svgId}`)?.remove();

        if (!cancelled) {
          setRendered({ code, ok: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, digests, locale, renderPrefix]);

  useEffect(() => {
    canvasRef.current?.querySelectorAll("[data-piece-id]").forEach((node) => {
      const isSelected = node.getAttribute("data-piece-id") === selectedPieceId;
      node.classList.toggle("is-selected", isSelected);
      node.setAttribute("aria-pressed", String(isSelected));
    });
  }, [selectedPieceId, rendered]);

  function pieceIdFromEvent(event: MouseEvent | KeyboardEvent) {
    return (event.target as Element)
      .closest("[data-piece-id]")
      ?.getAttribute("data-piece-id");
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    const pieceId = pieceIdFromEvent(event);

    if (pieceId) {
      onSelectPiece(pieceId);
    }
  }

  function handleCanvasKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const pieceId = pieceIdFromEvent(event);

    if (pieceId) {
      event.preventDefault();
      onSelectPiece(pieceId);
    }
  }

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
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6B6B7B]">
            {text.description}
          </p>
        </div>
        <div className="shrink-0 whitespace-nowrap">
          <CopyButton
            text={code}
            label={text.copyMermaid}
            copiedLabel={text.copied}
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 2xl:grid-cols-[minmax(0,1fr)_20rem] 2xl:items-start">
        <div className="relative min-h-40 overflow-x-auto rounded-lg border border-[#E6E0FF] bg-white p-3">
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onKeyDown={handleCanvasKeyDown}
            className={`session-map-canvas mx-auto w-max transition-opacity ${
              status === "ready" ? "opacity-100" : "opacity-40"
            }`}
          />
          {status !== "ready" ? (
            <p
              className={`absolute inset-x-3 top-3 text-sm leading-6 ${
                status === "error" ? "text-[#9F1239]" : "text-[#6B6B7B]"
              }`}
              aria-live="polite"
            >
              {status === "error" ? text.error : text.loading}
            </p>
          ) : null}
        </div>

        <div
          className="rounded-lg border border-[#E6E0FF] bg-[#F7F4FF] p-3"
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A5CF6]">
            {text.peekLabel}
          </p>
          {selected ? (
            <div className="mt-2 space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-[#3b168c]">
                    {selected.piece.sourceTool}
                  </span>
                  <span className="text-xs font-semibold text-[#6B6B7B]">
                    {formatCreatedAt(selected.piece.createdAt, locale)} ·{" "}
                    {selected.piece.characterCount.toLocaleString(numberLocale)}{" "}
                    {contextText.chars}
                    {selected.piece.device ? ` · ${selected.piece.device}` : ""}
                  </span>
                </div>
                <h4 className="mt-2 text-base font-bold text-[#2D185D]">
                  {selected.piece.title}
                </h4>
                {selectedGistIsListed ? null : (
                  <p className="mt-1 text-sm leading-6 text-[#56536B]">
                    {selected.gist || text.gistFallback}
                  </p>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-3 2xl:grid-cols-1">
                <SessionList
                  title={text.decisions}
                  items={selected.decisions}
                  emptyLabel={text.none}
                />
                <SessionList
                  title={text.questions}
                  items={selected.questions}
                  emptyLabel={text.none}
                />
                <SessionList
                  title={text.actions}
                  items={selected.actions}
                  emptyLabel={text.none}
                />
              </div>
              <button
                type="button"
                onClick={() => onOpenPiece(selected.piece.id)}
                className="h-10 w-full rounded-lg bg-[#6A46E2] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#5A32C8] focus:outline-none focus:ring-4 focus:ring-[#B094FF]/40"
              >
                {text.openDetail}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[#6B6B7B]">
              {text.peekEmpty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
