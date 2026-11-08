import { describe, expect, it } from "vitest";
import type { ContextPiece, SourceTool } from "@/lib/compression";
import { generateMockCompression } from "@/lib/compression";
import { buildSessionMermaid, digestPieces } from "@/lib/sessionMap";

const hostile =
  'Say "hi" #1 at 100% <script>alert(1)</script> `tick` %%{init: {"theme":"dark"}}%% ]) --> x["y';

function piece(
  id: string,
  title: string,
  sourceTool: string,
  rawContext: string,
): ContextPiece {
  return {
    id,
    title,
    sourceTool: sourceTool as SourceTool,
    characterCount: rawContext.length,
    createdAt: "2026-10-20T08:30:00.000Z",
    device: "test-device",
    result: generateMockCompression({
      projectName: "맥락 보라돌이",
      sourceTool: "Codex",
      rawContext,
      locale: "ko",
    }),
  };
}

const pieces = [
  piece("aaaaaaaa-1", hostile, "Codex", `결정: ${hostile}`),
  // Shared files can carry any tool name, so it is escaped too.
  piece("bbbbbbbb-2", "plain", 'Other"] --> evil["x', `TODO: ${hostile}`),
];

function build(projectName: string) {
  return buildSessionMermaid({
    digests: digestPieces(pieces),
    projectName,
    northStar: hostile,
    targetTool: "Claude",
    isMerged: false,
    locale: "ko",
  });
}

const code = build(hostile);
const lines = code.split("\n");
const labels = [...code.matchAll(/(?:\["|\{\{")(.*?)(?:"\]|"\}\})/g)].map(
  (match) => match[1],
);
// The label markup the map adds on purpose.
const ownTags = /<\/?b>|<\/?small>|<br\/>/g;

const entities: Record<string, string> = { quot: '"', lt: "<", gt: ">" };

function decode(label: string) {
  return label
    .replace(ownTags, "")
    .replace(/#(\d+|quot|lt|gt);/g, (_, name: string) =>
      /^\d+$/.test(name) ? String.fromCharCode(Number(name)) : entities[name],
    );
}

describe("session map label escaping", () => {
  it("keeps every line in a known Mermaid statement shape", () => {
    const shapes = [
      /^flowchart LR$/,
      /^ {2}%% [^\n]*$/,
      /^ {2}subgraph tool\d+\["[^"]*"\]$/,
      /^ {4}s\d+\["[^"]*"\]$/,
      /^ {2}end$/,
      /^ {2}hub\{\{"[^"]*"\}\}$/,
      /^ {2}s\d+ --> hub$/,
      /^ {2}classDef hub [^"]*$/,
      /^ {2}class hub hub$/,
    ];

    for (const line of lines) {
      expect(
        shapes.some((shape) => shape.test(line)),
        `unexpected line: ${line}`,
      ).toBe(true);
    }

    expect(lines.filter((line) => line.includes("-->"))).toEqual([
      "  s0 --> hub",
      "  s1 --> hub",
    ]);
  });

  it("finds one label per subgraph, session, and hub", () => {
    // 2 tool subgraphs + 2 sessions + 1 hub
    expect(labels).toHaveLength(5);
  });

  it("leaves no raw quote, angle bracket, backtick, or percent in labels", () => {
    for (const label of labels) {
      const text = label.replace(ownTags, "");

      expect(text).not.toMatch(/["<>`%]/);
      // Every # starts an entity code.
      expect(text.replace(/#(?:\d+|quot|lt|gt);/g, "")).not.toContain("#");
    }
  });

  it("cannot open an init directive anywhere", () => {
    expect(code).not.toContain("%%{");
    expect(code.match(/%%/g)).toHaveLength(1);
    expect(code).not.toContain("<script");
  });

  it("keeps a pasted project name inside the comment line", () => {
    const withNewline = build(
      '%%{init: {"theme":"dark"}}%%\n  click s0 call alert()',
    ).split("\n");

    expect(withNewline[1]).toMatch(/^ {2}%% .*click s0 call alert\(\)/);
    expect(withNewline[1]).not.toContain("%%{");
    expect(withNewline.filter((line) => line.includes("click"))).toHaveLength(
      1,
    );
  });

  it("decodes back to the original text", () => {
    const sessionLabel = labels.find((label) => label.startsWith("<b>Say"))!;

    expect(decode(sessionLabel)).toContain('Say "hi" #1 at 100% <script>');
    expect(decode(labels[labels.length - 1])).toContain("Say");
    expect(labels.map(decode)).toContain('Other"] --> evil["x · 1');
  });
});
