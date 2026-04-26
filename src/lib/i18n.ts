import type { CompressionResult } from "@/lib/compression";

export type Locale = "ko" | "en";

export const localeStorageKey = "context-boradori-locale-v1";

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
};

export const htmlLang: Record<Locale, string> = {
  ko: "ko",
  en: "en",
};

export const uiText = {
  ko: {
    languageToggle: {
      ariaLabel: "언어 전환",
      current: "KO",
      next: "EN",
      helper: "English",
    },
    nav: {
      productLabel: "제품",
      live: "Vercel live",
    },
    hero: {
      title: "맥락 보라돌이",
      subtitle: "여러 AI 맥락을 하나로 모아 넘기는 친구",
      description:
        "ChatGPT, Claude, Codex, Gemini에서 진행한 내용을 공통맥락으로 병합하고, 다음 AI가 바로 이어받을 handoff로 정리해드려요.",
      pill: "로컬 mock 병합 · 외부 API 호출 없음",
      steps: [
        ["붙여넣기", "source"],
        ["수집함", "tray"],
        ["병합하기", "merge"],
        ["내보내기", "export"],
      ],
    },
    brand: {
      eyebrow: "Brand system",
      title: "보라돌이의 일은 맥락을 엮는 것",
      body: "아침에 만든 브랜드 보드의 핵심을 앱에 흡수했습니다. 귀엽지만 똑똑한 AI context librarian이라는 방향을 색, 카피, 아이콘 모티프로 유지합니다.",
      features: [
        ["모은다", "흩어진 맥락을 한 곳에 수집해요."],
        ["이해한다", "핵심을 파악하고 구조화해요."],
        ["압축한다", "다음 AI가 읽기 쉽게 간결하게 만들어요."],
        ["연결한다", "맥락을 이어 새로운 작업으로 넘겨요."],
      ],
      assets: {
        identityTitle: "브랜드 아이덴티티",
        identity: "맥락 보라돌이 브랜드 아이덴티티 보드",
        conceptTitle: "컨셉 보드",
        concept: "맥락 보라돌이 캐릭터 컨셉 보드",
      },
    },
    context: {
      workspaceLabel: "Context workspace",
      workspaceTitle: "맥락 작업대",
      workspaceDescription:
        "여러 AI 도구에서 나온 맥락을 조각으로 모으고, 다음 도구가 이어받을 공통 handoff로 정리합니다.",
      metrics: {
        pieces: "조각",
        characters: "수집 문자",
        target: "대상",
      },
      steps: ["붙여넣기", "수집함", "Handoff"],
      securityNote:
        "API 키, 비밀번호, 토큰, 개인 금융정보는 붙여넣지 마세요. 현재 데모는 외부 AI API를 호출하지 않고, 수집함은 이 브라우저에만 저장됩니다.",
      defaultNorthStar:
        "확정된 결정은 지키고, 열린 질문은 분리하며, 다음 AI가 같은 방향으로 이어서 실행하게 만든다.",
      northStarLabel: "프로젝트 북극성",
      northStarHelp:
        "이 문장이 공통맥락 지도와 모든 handoff export의 기준점이 됩니다.",
      sourceLabel: "Source",
      sourceTitle: "소스 맥락",
      projectNameLabel: "프로젝트 이름",
      projectNamePlaceholder: "예: 맥락 보라돌이",
      sourceToolLabel: "출처 AI 도구",
      rawContextLabel: "Raw context",
      rawContextPlaceholder:
        "여기에 ChatGPT, Claude, Codex, Gemini의 작업 맥락을 붙여넣으세요.",
      longContextWarning:
        "맥락이 꽤 깁니다. MVP mock 압축은 앞부분과 규칙 기반 라인을 중심으로 정리합니다.",
      addToCommon: "공통맥락에 추가",
      previewCompression: "미리보기 압축",
      loadSample: "샘플 불러오기",
      clearInput: "입력 비우기",
      commonTrayLabel: "Common tray",
      commonTrayTitle: "공통맥락 수집함",
      targetToolLabel: "넘겨줄 대상 AI 도구",
      mergeCommon: "공통맥락 병합",
      addParallelSamples: "병렬 샘플 추가",
      emptyTray:
        "아직 수집된 맥락이 없습니다. 샘플을 추가하거나 왼쪽 입력을 공통맥락에 추가해보세요.",
      delete: "삭제",
      clearTray: "수집함 비우기",
      chars: "chars",
      justNow: "방금",
      mergedTitle: "공통맥락 병합 결과",
      mergedDescription: (count: string, target: string) =>
        `${count}개 맥락 조각을 ${target}에 넘기기 위한 mock handoff입니다.`,
      pieceResultTitle: "현재 조각 압축 결과",
      pieceResultDescription:
        "현재 입력 또는 최근 추가된 맥락 조각의 mock 정리본입니다.",
      pieceTitle: (tool: string, count: number) => `${tool} 맥락 ${count}`,
    },
    contextMap: {
      ariaLabel: "공통맥락 지도",
      eyebrow: "Shared context map",
      title: "공통맥락 지도",
      description:
        "모든 소스 도구가 같은 북극성을 향하도록 맥락의 흐름을 시각화합니다.",
      untitledProject: "Untitled project",
      sourceTools: "소스 도구",
      noSources: "아직 수집된 소스가 없습니다.",
      targetTool: "이어받을 도구",
      targetDescription:
        "이 도구는 북극성, 결정사항, 열린 질문, 다음 액션을 기준으로 이어받습니다.",
      northStarLabel: "North Star",
      fallbackNorthStar: (project: string, target: string) =>
        `${target}에서 ${project}의 확정된 방향을 지키며 다음 액션까지 이어갑니다.`,
      decisionsTitle: "지켜야 할 결정",
      decisionsFallback: "병합 후 확정된 결정이 이곳에 표시됩니다.",
      questionsTitle: "흔들릴 수 있는 질문",
      questionsFallback: "확인할 질문이 있으면 이곳에 표시됩니다.",
      actionsTitle: "다음 항로",
      actionsFallback: "다음 액션이 정리되면 이곳에 표시됩니다.",
      ignorePattern: /찾지 못했습니다|아직 입력되지 않았습니다/,
    },
    result: {
      ariaLabel: "압축 결과",
      defaultTitle: "압축 결과",
      defaultDescription: "모든 결과는 브라우저에서 만든 mock 정리본입니다.",
      sections: {
        northStar: "북극성",
        sessionSummary: "세션 요약",
        confirmedDecisions: "확정된 결정사항",
        proposedIdeas: "제안되었지만 확정되지 않은 내용",
        openQuestions: "열린 질문",
        nextActions: "다음 액션",
        handoffMarkdown: "다음 AI를 위한 Handoff",
        agentsMd: "AGENTS.md export",
        claudeMd: "CLAUDE.md export",
        geminiMd: "GEMINI.md export",
      } satisfies Record<keyof CompressionResult, string>,
      copy: "복사",
      copied: "복사됨",
    },
  },
  en: {
    languageToggle: {
      ariaLabel: "Switch language",
      current: "EN",
      next: "KO",
      helper: "한국어",
    },
    nav: {
      productLabel: "Product",
      live: "Vercel live",
    },
    hero: {
      title: "Context Boradori",
      subtitle: "A friendly hub for carrying AI context forward",
      description:
        "Paste work from ChatGPT, Claude, Codex, or Gemini, merge it into shared project context, and export a handoff the next AI can continue from.",
      pill: "Local mock merge · no external API calls",
      steps: [
        ["Paste", "source"],
        ["Collect", "tray"],
        ["Merge", "shared"],
        ["Export", "handoff"],
      ],
    },
    brand: {
      eyebrow: "Brand system",
      title: "Boradori connects scattered context",
      body: "The brand system keeps the cute-but-smart AI context librarian direction from the concept boards: friendly, useful, and built around collecting, understanding, compressing, and connecting work.",
      features: [
        ["Collect", "Gather scattered context in one place."],
        ["Understand", "Find the important structure and intent."],
        ["Compress", "Make it concise enough for the next AI to read."],
        ["Connect", "Turn context into a useful next handoff."],
      ],
      assets: {
        identityTitle: "Brand identity",
        identity: "Context Boradori brand identity board",
        conceptTitle: "Concept board",
        concept: "Context Boradori character concept board",
      },
    },
    context: {
      workspaceLabel: "Context workspace",
      workspaceTitle: "Context Workspace",
      workspaceDescription:
        "Collect context fragments from multiple AI tools and turn them into a shared handoff for the next tool.",
      metrics: {
        pieces: "Pieces",
        characters: "Characters",
        target: "Target",
      },
      steps: ["Paste", "Tray", "Handoff"],
      securityNote:
        "Do not paste API keys, passwords, tokens, or private financial information. This demo does not call external AI APIs, and the tray is stored only in this browser.",
      defaultNorthStar:
        "Keep confirmed decisions, isolate open questions, and move every AI tool toward the same next action.",
      northStarLabel: "Project north star",
      northStarHelp:
        "This sentence becomes the anchor for the common-context map and every handoff export.",
      sourceLabel: "Source",
      sourceTitle: "Source context",
      projectNameLabel: "Project name",
      projectNamePlaceholder: "Example: Context Boradori",
      sourceToolLabel: "Source AI tool",
      rawContextLabel: "Raw context",
      rawContextPlaceholder:
        "Paste context from ChatGPT, Claude, Codex, Gemini, or another AI tool.",
      longContextWarning:
        "This context is quite long. The MVP mock compression focuses on the beginning and rule-matched lines.",
      addToCommon: "Add to common context",
      previewCompression: "Preview compression",
      loadSample: "Load sample",
      clearInput: "Clear input",
      commonTrayLabel: "Common tray",
      commonTrayTitle: "Common Context Tray",
      targetToolLabel: "Target AI tool",
      mergeCommon: "Merge common context",
      addParallelSamples: "Add parallel samples",
      emptyTray:
        "No context has been collected yet. Add samples or paste source context into the common tray.",
      delete: "Delete",
      clearTray: "Clear tray",
      chars: "chars",
      justNow: "just now",
      mergedTitle: "Merged Common Context",
      mergedDescription: (count: string, target: string) =>
        `${count} context pieces merged into a mock handoff for ${target}.`,
      pieceResultTitle: "Current Piece Compression",
      pieceResultDescription:
        "A mock summary for the current input or most recently added context piece.",
      pieceTitle: (tool: string, count: number) => `${tool} context ${count}`,
    },
    contextMap: {
      ariaLabel: "Common context map",
      eyebrow: "Shared context map",
      title: "Common Context Map",
      description:
        "Visualize how every source tool points toward the same north star.",
      untitledProject: "Untitled project",
      sourceTools: "Source tools",
      noSources: "No source context has been collected yet.",
      targetTool: "Target tool",
      targetDescription:
        "This tool continues from the north star, decisions, open questions, and next actions.",
      northStarLabel: "North Star",
      fallbackNorthStar: (project: string, target: string) =>
        `In ${target}, keep ${project}'s confirmed direction intact and carry it into the next action.`,
      decisionsTitle: "Decisions to preserve",
      decisionsFallback: "Confirmed decisions will appear here after merge.",
      questionsTitle: "Open questions",
      questionsFallback: "Questions that need attention will appear here.",
      actionsTitle: "Next route",
      actionsFallback: "Next actions will appear here after merge.",
      ignorePattern: /not find|No raw context|No collected context/i,
    },
    result: {
      ariaLabel: "Compression result",
      defaultTitle: "Compression Result",
      defaultDescription:
        "All results are mock summaries generated locally in this browser.",
      sections: {
        northStar: "North Star",
        sessionSummary: "Session Summary",
        confirmedDecisions: "Confirmed Decisions",
        proposedIdeas: "Proposed Ideas",
        openQuestions: "Open Questions",
        nextActions: "Next Actions",
        handoffMarkdown: "Handoff for the Next AI",
        agentsMd: "AGENTS.md export",
        claudeMd: "CLAUDE.md export",
        geminiMd: "GEMINI.md export",
      } satisfies Record<keyof CompressionResult, string>,
      copy: "Copy",
      copied: "Copied",
    },
  },
} as const;
