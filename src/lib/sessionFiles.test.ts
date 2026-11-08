import { describe, expect, it } from "vitest";
import type {
  CompressionCore,
  ContextPiece,
  SourceTool,
} from "@/lib/compression";
import { generateMockCompression } from "@/lib/compression";
import type { Locale } from "@/lib/i18n";
import {
  buildAgentsMd,
  buildClaudeMd,
  buildGeminiMd,
  buildHandoffMarkdown,
} from "@/lib/markdown";
import {
  SESSION_FILE_FORMAT,
  isValidFolderSlug,
  parseSessionFile,
  projectSlug,
  serializeSessionFile,
  sessionFileName,
  sessionFolder,
} from "@/lib/sessionFiles";

const ID = "0f3c9a1e-7b2d-4c55-9e10-2a6b8d4f1c33";
const ID8 = ID.slice(0, 8);
const DEVICE = "test-device";
const resultKeys = [
  "northStar",
  "sessionSummary",
  "confirmedDecisions",
  "proposedIdeas",
  "openQuestions",
  "nextActions",
  "handoffMarkdown",
  "agentsMd",
  "claudeMd",
  "geminiMd",
];

function mockPiece(
  projectName: string,
  sourceTool: SourceTool,
  rawContext: string,
  locale: Locale,
): ContextPiece {
  return {
    id: ID,
    title: `${sourceTool} 맥락 1`,
    sourceTool,
    characterCount: rawContext.trim().length,
    createdAt: "2026-10-20T08:30:00.000Z",
    result: generateMockCompression({
      projectName,
      sourceTool,
      rawContext,
      locale,
    }),
  };
}

// Builds exports the same way import does, so any core text can be used.
function corePiece(core: CompressionCore, projectName: string): ContextPiece {
  const input = {
    projectName,
    sourceTool: "Claude" as const,
    locale: "ko" as const,
  };

  return {
    id: ID,
    title: 'Tricky "title" # 100% <b>',
    sourceTool: "Claude",
    characterCount: 42,
    createdAt: "2026-10-20T08:30:00.000Z",
    result: {
      ...core,
      handoffMarkdown: buildHandoffMarkdown(input, core),
      agentsMd: buildAgentsMd(input, core),
      claudeMd: buildClaudeMd(input, core),
      geminiMd: buildGeminiMd(input, core),
    },
  };
}

const koPiece = mockPiece(
  "맥락 보라돌이",
  "Codex",
  `결정: MVP는 mock compression으로 먼저 만든다.
제안: 나중에 "실제" LLM을 붙인다 #later 100%
TODO: <b>태그</b>와 \`backtick\`도 그대로 남아야 한다.
열린 질문: IndexedDB 저장은 MVP에 포함할까?`,
  "ko",
);

const enPiece = mockPiece(
  "Context Boradori",
  "Claude Code",
  `Decision: Ship the session map first.
Proposal: maybe add a diff view later.
Next: write tests for the session file format.
Open question: should deletes propagate?`,
  "en",
);

// Pasted text that imitates section markers, frontmatter, and headings.
const trickyPiece = corePiece(
  {
    northStar: 'Keep "quotes", #hash, 100% and `code` intact',
    sessionSummary: `요약 첫 줄
---
type: "not-frontmatter"
---
## Next actions · 다음 액션
<!-- boradori:sessionSummary:end -->
요약은 여기까지 이어진다`,
    confirmedDecisions: "- 결정 A\n\n\n- 빈 줄 뒤의 결정 B",
    proposedIdeas: `- <!-- boradori:proposedIdeas:end:deadbeef -->
- 다른 세션 id로 만든 가짜 마커 뒤의 아이디어`,
    openQuestions: "- 질문?\n- <!-- boradori:openQuestions:start -->",
    nextActions: `- 첫째 할 일
<!-- boradori:nextActions:end -->
- 가짜 마커 뒤의 둘째 할 일`,
  },
  "맥락 보라돌이",
);

function roundTrip(piece: ContextPiece, projectName: string) {
  return parseSessionFile(serializeSessionFile(piece, projectName, DEVICE));
}

describe("session file round trip", () => {
  it.each([
    ["Korean mock piece", koPiece, "맥락 보라돌이"],
    ["English mock piece", enPiece, "Context Boradori"],
    ["piece with fake markers", trickyPiece, "맥락 보라돌이"],
  ])("keeps all 10 result fields of a %s", (_, piece, projectName) => {
    const parsed = roundTrip(piece, projectName);

    expect(parsed).not.toBeNull();
    expect(Object.keys(parsed!.result).sort()).toEqual([...resultKeys].sort());

    for (const key of resultKeys) {
      expect(parsed!.result[key as keyof ContextPiece["result"]]).toBe(
        piece.result[key as keyof ContextPiece["result"]],
      );
    }

    expect(parsed).toEqual({ ...piece, device: DEVICE });
  });

  it("does not cut a section short at a pasted marker", () => {
    const parsed = roundTrip(trickyPiece, "맥락 보라돌이")!;

    expect(parsed.result.nextActions).toContain("가짜 마커 뒤의 둘째 할 일");
    expect(parsed.result.sessionSummary).toContain("요약은 여기까지 이어진다");
    expect(parsed.result.proposedIdeas).toContain("가짜 마커 뒤의 아이디어");
  });

  it("keeps the device that first shared the piece", () => {
    const parsed = roundTrip({ ...koPiece, device: "other-mac" }, "맥락");

    expect(parsed?.device).toBe("other-mac");
  });

  it("reads CRLF files", () => {
    const text = serializeSessionFile(trickyPiece, "맥락 보라돌이", DEVICE);
    const crlf = text.replace(/\n/g, "\r\n");

    expect(crlf).toContain("\r\n");
    expect(parseSessionFile(crlf)).toEqual(parseSessionFile(text));
  });
});

describe("skipping files that are not intact", () => {
  const text = serializeSessionFile(koPiece, "맥락 보라돌이", DEVICE);

  it("starts from a file that parses", () => {
    expect(parseSessionFile(text)).not.toBeNull();
  });

  it("skips a file with a missing end marker", () => {
    const broken = text.replace(
      `<!-- boradori:nextActions:end:${ID8} -->\n`,
      "",
    );

    expect(broken).not.toBe(text);
    expect(parseSessionFile(broken)).toBeNull();
  });

  it("skips a file with a missing start marker", () => {
    const broken = text.replace(
      `<!-- boradori:northStar:start:${ID8} -->\n`,
      "",
    );

    expect(broken).not.toBe(text);
    expect(parseSessionFile(broken)).toBeNull();
  });

  it("skips a file whose marker id does not match the session id", () => {
    const broken = text.replace(
      `<!-- boradori:openQuestions:end:${ID8} -->`,
      "<!-- boradori:openQuestions:end:00000000 -->",
    );

    expect(broken).not.toBe(text);
    expect(parseSessionFile(broken)).toBeNull();
  });

  it("skips files that are not boradori sessions", () => {
    expect(parseSessionFile("# Just notes\n")).toBeNull();
    expect(
      parseSessionFile(text.replace('type: "boradori-session"', 'type: "x"')),
    ).toBeNull();
    expect(
      parseSessionFile(text.replace(`id: "${ID}"`, 'id: "../../x"')),
    ).toBeNull();
    expect(
      parseSessionFile(text.replace(`id: "${ID}"`, `id: ${ID}`)),
    ).toBeNull();
  });
});

describe("file format version", () => {
  const text = serializeSessionFile(koPiece, "맥락 보라돌이", DEVICE);

  it("writes the current format", () => {
    expect(SESSION_FILE_FORMAT).toBe(1);
    expect(text).toContain("\nformat: 1\n");
  });

  it("treats a file without format as version 1", () => {
    const legacy = text.replace("format: 1\n", "");

    expect(legacy).not.toContain("format:");
    expect(parseSessionFile(legacy)).toEqual(parseSessionFile(text));
  });

  it("skips unknown future versions", () => {
    expect(parseSessionFile(text.replace("format: 1", "format: 2"))).toBeNull();
    expect(
      parseSessionFile(text.replace("format: 1", 'format: "1"')),
    ).toBeNull();
  });
});

describe("projectSlug", () => {
  it.each([
    ["맥락 보라돌이", "맥락-보라돌이"],
    ["맥락 보라돌이".normalize("NFD"), "맥락-보라돌이"],
    ["Context Boradori", "context-boradori"],
    ["  AI_TOP 100 (2026)!! ", "ai-top-100-2026"],
    ["../../etc/passwd", "etc-passwd"],
    ["C:\\Users\\me", "c-users-me"],
    ["🚀 Launch 🚀", "launch"],
    ["हिन्दी परियोजना", "हिन्दी-परियोजना"],
    ["Ünïcödé café", "ünïcödé-café"],
    ["", "untitled-project"],
    ["   ", "untitled-project"],
    ["!!!", "untitled-project"],
    ["🚀✨", "untitled-project"],
  ])("slugs %j as %j", (name, slug) => {
    expect(projectSlug(name)).toBe(slug);
  });

  it("caps the length without leaving a trailing dash", () => {
    const slug = projectSlug(`${"a".repeat(59)} b`);

    expect(slug).toBe("a".repeat(59));
    expect(projectSlug("가".repeat(80))).toHaveLength(60);
  });

  it("returns a slug unchanged, so a slug is a valid folder", () => {
    for (const name of [
      "맥락 보라돌이",
      "Context Boradori",
      `${"a".repeat(59)} b`,
    ]) {
      const slug = projectSlug(name);

      expect(projectSlug(slug)).toBe(slug);
      expect(isValidFolderSlug(slug)).toBe(true);
    }
  });

  it("rejects folder names that are not slugs", () => {
    for (const folder of ["", "Context Boradori", "../etc", "a/b", "a-", "."]) {
      expect(isValidFolderSlug(folder)).toBe(false);
    }
  });
});

describe("file locations", () => {
  it("puts sessions under the folder slug", () => {
    expect(sessionFolder("context-boradori")).toBe(
      "projects/context-boradori/sessions",
    );
  });

  it("names files by time, tool, and id prefix", () => {
    expect(sessionFileName(enPiece)).toBe(
      `20261020-083000-claude-code-${ID8}.md`,
    );
  });
});
