import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import {
  Presentation,
  PresentationFile,
  auto,
  column,
  fill,
  fixed,
  fr,
  grid,
  grow,
  hug,
  image,
  panel,
  row,
  shape,
  text,
  wrap,
} from "@oai/artifact-tool";

const root = path.resolve("..");
const workspace = path.resolve(".");
const scratch = path.join(workspace, "scratch");
const previewDir = path.join(scratch, "previews");
const output = path.join(workspace, "output", "output.pptx");

const assets = {
  mascotBoard: path.join(root, "public/brand/boradori-concept-board.png"),
  brandBoard: path.join(root, "public/brand/boradori-brand-identity.png"),
  brandBoardEn: path.join(root, "public/brand/boradori-brand-identity-en.png"),
  hero: path.join(scratch, "assets/live-hero.png"),
  merged: path.join(scratch, "assets/live-merged.png"),
  map: path.join(scratch, "assets/context-map.png"),
  result: path.join(scratch, "assets/result-panel.png"),
};

const C = {
  deep: "#23105B",
  purple: "#6A46E2",
  purple2: "#8A5CF6",
  soft: "#B094FF",
  lavender: "#F4F0FF",
  pale: "#FCFAFF",
  yellow: "#FFC857",
  green: "#74E3C1",
  blue: "#6EB8FF",
  pink: "#FFB0C6",
  ink: "#1F2937",
  muted: "#667085",
  line: "#E6E0FF",
  white: "#FFFFFF",
};

const T = {
  display: "Apple SD Gothic Neo",
  body: "Apple SD Gothic Neo",
  mono: "Menlo",
};

const SLIDE = { width: 1920, height: 1080 };
const SAFE = { x: 96, y: 72 };

const presentation = Presentation.create({ slideSize: SLIDE });
const imageDataUrlCache = new Map();

function bg(slide, color = C.pale) {
  slide.compose(shape({ name: "slide-background", fill: color, width: fill, height: fill }), {
    frame: { left: 0, top: 0, width: SLIDE.width, height: SLIDE.height },
    baseUnit: 8,
  });
}

function page(slide, children, opts = {}) {
  slide.compose(
    column(
      {
        name: "slide-root",
        width: fill,
        height: fill,
        padding: opts.padding ?? SAFE,
        gap: opts.gap ?? 38,
      },
      children,
    ),
    { frame: { left: 0, top: 0, width: SLIDE.width, height: SLIDE.height }, baseUnit: 8 },
  );
}

function footer(label = "맥락 보라돌이 · Context Boradori") {
  return row({ name: "footer", width: fill, height: hug, justify: "between", align: "center" }, [
    text(label, {
      name: "footer-label",
      width: hug,
      height: hug,
      style: { fontFace: T.body, fontSize: 18, color: C.muted },
    }),
    text("https://context-boradori.vercel.app", {
      name: "footer-url",
      width: hug,
      height: hug,
      style: { fontFace: T.body, fontSize: 18, bold: true, color: C.purple },
    }),
  ]);
}

function titleBlock(eyebrow, title, subtitle, width = 1300) {
  return column({ name: "title-stack", width: wrap(width), height: hug, gap: 16 }, [
    text(eyebrow, {
      name: "eyebrow",
      width: hug,
      height: hug,
      style: { fontFace: T.body, fontSize: 20, bold: true, color: C.purple2 },
    }),
    text(title, {
      name: "slide-title",
      width: wrap(width),
      height: hug,
      style: { fontFace: T.display, fontSize: 62, bold: true, color: C.deep },
    }),
    text(subtitle, {
      name: "slide-subtitle",
      width: wrap(Math.min(width, 1120)),
      height: hug,
      style: { fontFace: T.body, fontSize: 28, color: C.muted },
    }),
  ]);
}

function bullet(label, color = C.purple) {
  return row({ name: `bullet-${label.slice(0, 12)}`, width: fill, height: hug, gap: 16, align: "start" }, [
    shape({ name: "bullet-dot", geometry: "ellipse", fill: color, width: fixed(16), height: fixed(16) }),
    text(label, {
      name: "bullet-text",
      width: fill,
      height: hug,
      style: { fontFace: T.body, fontSize: 28, color: C.ink },
    }),
  ]);
}

function pill(label, color = C.purple, textColor = C.white) {
  return panel(
    {
      name: `pill-${label.slice(0, 10)}`,
      width: hug,
      height: hug,
      padding: { x: 24, y: 12 },
      fill: color,
      line: { fill: color, width: 1 },
      borderRadius: "rounded-full",
    },
    text(label, {
      name: "pill-label",
      width: hug,
      height: hug,
      style: { fontFace: T.body, fontSize: 22, bold: true, color: textColor },
    }),
  );
}

function miniMetric(number, label, color = C.purple) {
  return column({ name: `metric-${label}`, width: fill, height: hug, gap: 4 }, [
    text(number, {
      name: "metric-number",
      width: fill,
      height: hug,
      style: { fontFace: T.display, fontSize: 72, bold: true, color },
    }),
    text(label, {
      name: "metric-label",
      width: fill,
      height: hug,
      style: { fontFace: T.body, fontSize: 22, bold: true, color: C.ink },
    }),
  ]);
}

function pngDataUrl(imgPath) {
  if (!imageDataUrlCache.has(imgPath)) {
    imageDataUrlCache.set(imgPath, `data:image/png;base64,${readFileSync(imgPath).toString("base64")}`);
  }
  return imageDataUrlCache.get(imgPath);
}

function imageFrame(name, imgPath, fit = "cover") {
  return image({
    name,
    dataUrl: pngDataUrl(imgPath),
    width: fill,
    height: fill,
    fit,
    borderRadius: "rounded-lg",
    alt: name,
  });
}

function addCover() {
  const slide = presentation.slides.add();
  bg(slide, C.lavender);
  slide.compose(imageFrame("cover-mascot-board", assets.mascotBoard, "cover"), {
    frame: { left: 1040, top: 0, width: 880, height: 1080 },
    baseUnit: 8,
  });
  slide.compose(
    shape({ name: "cover-white-field", fill: "#FFFFFF", width: fill, height: fill }),
    { frame: { left: 0, top: 0, width: 1048, height: 1080 }, baseUnit: 8 },
  );
  page(
    slide,
    [
      column({ name: "cover-lockup", width: wrap(840), height: fill, gap: 28, justify: "center" }, [
        text("HACKATHON DEMO DECK", {
          name: "cover-eyebrow",
          width: hug,
          height: hug,
          style: { fontFace: T.body, fontSize: 22, bold: true, color: C.purple2 },
        }),
        text("맥락 보라돌이", {
          name: "cover-title-ko",
          width: wrap(840),
          height: hug,
          style: { fontFace: T.display, fontSize: 106, bold: true, color: C.deep },
        }),
        text("흩어진 AI 맥락을 공통 북극성으로 모으는 개인 AI 컨텍스트 허브", {
          name: "cover-promise",
          width: wrap(780),
          height: hug,
          style: { fontFace: T.body, fontSize: 34, bold: true, color: C.purple },
        }),
        text("Context Boradori · AI Context Hub", {
          name: "cover-english",
          width: wrap(760),
          height: hug,
          style: { fontFace: T.body, fontSize: 25, color: C.muted },
        }),
        row({ name: "cover-pills", width: fill, height: hug, gap: 14 }, [
          pill("No external API", C.deep),
          pill("Local-first MVP", C.purple2),
          pill("Vercel live", C.yellow, C.deep),
        ]),
      ]),
      footer("GitHub: misolove/context-boradori"),
    ],
    { padding: { x: 96, y: 70 }, gap: 0 },
  );
}

function addProblem() {
  const slide = presentation.slides.add();
  bg(slide);
  page(slide, [
    titleBlock(
      "01 · Problem",
      "AI 도구를 많이 쓸수록, 프로젝트 기억은 더 빨리 흩어집니다",
      "대화는 늘어나는데 공통 기억은 생기지 않아서 매번 같은 설명을 반복하게 됩니다.",
    ),
    grid(
      {
        name: "problem-grid",
        width: fill,
        height: grow(1),
        columns: [fr(1), fr(1), fr(1)],
        columnGap: 34,
        alignItems: "center",
      },
      [
        column({ name: "pain-repeat", width: fill, height: hug, gap: 16 }, [
          text("01", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 28, bold: true, color: C.soft } }),
          text("반복 설명", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 44, bold: true, color: C.deep } }),
          text("새 AI에게 배경, 결정, 현재 상태를 다시 설명합니다.", { width: fill, height: hug, style: { fontFace: T.body, fontSize: 26, color: C.muted } }),
        ]),
        column({ name: "pain-loss", width: fill, height: hug, gap: 16 }, [
          text("02", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 28, bold: true, color: C.soft } }),
          text("결정 유실", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 44, bold: true, color: C.deep } }),
          text("확정된 결정과 미확정 아이디어가 같은 채팅 안에 섞입니다.", { width: fill, height: hug, style: { fontFace: T.body, fontSize: 26, color: C.muted } }),
        ]),
        column({ name: "pain-parallel", width: fill, height: hug, gap: 16 }, [
          text("03", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 28, bold: true, color: C.soft } }),
          text("병렬 맥락 충돌", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 44, bold: true, color: C.deep } }),
          text("ChatGPT, Claude, Codex, Gemini가 서로 다른 방향으로 이어갑니다.", { width: fill, height: hug, style: { fontFace: T.body, fontSize: 26, color: C.muted } }),
        ]),
      ],
    ),
    row({ name: "problem-bottom", width: fill, height: hug, gap: 20, align: "center" }, [
      shape({ geometry: "ellipse", fill: C.yellow, width: fixed(24), height: fixed(24) }),
      text("핵심 문제: AI가 부족한 것이 아니라, AI 사이를 잇는 공통맥락이 부족합니다.", {
        width: fill,
        height: hug,
        style: { fontFace: T.body, fontSize: 30, bold: true, color: C.deep },
      }),
    ]),
  ]);
}

function addSolution() {
  const slide = presentation.slides.add();
  bg(slide, "#FFFFFF");
  page(slide, [
    titleBlock(
      "02 · Solution",
      "맥락 보라돌이는 여러 AI 대화를 하나의 공통 handoff로 바꿉니다",
      "붙여넣기만 하면 결정사항, 열린 질문, 다음 액션, 도구별 export가 한 방향으로 정리됩니다.",
    ),
    grid(
      {
        name: "solution-flow",
        width: fill,
        height: grow(1),
        columns: [fr(1), auto, fr(1.2), auto, fr(1)],
        columnGap: 28,
        alignItems: "center",
      },
      [
        column({ width: fill, height: hug, gap: 18 }, [
          pill("Sources", C.lavender, C.deep),
          bullet("ChatGPT 기획 맥락", C.purple),
          bullet("Codex 구현 맥락", C.blue),
          bullet("Claude 리뷰 맥락", C.green),
          bullet("Gemini 실험 맥락", C.pink),
        ]),
        text("→", { width: hug, height: hug, style: { fontFace: T.display, fontSize: 70, bold: true, color: C.soft } }),
        panel(
          {
            name: "north-star-center",
            width: fill,
            height: hug,
            fill: C.deep,
            line: { fill: C.deep, width: 1 },
            borderRadius: "rounded-lg",
            padding: { x: 38, y: 34 },
          },
          column({ width: fill, height: hug, gap: 18 }, [
            text("North Star", { width: fill, height: hug, style: { fontFace: T.body, fontSize: 25, bold: true, color: C.yellow } }),
            text("확정된 결정은 지키고, 열린 질문은 분리하며, 다음 AI가 같은 방향으로 이어서 실행하게 만든다.", {
              width: fill,
              height: hug,
              style: { fontFace: T.display, fontSize: 36, bold: true, color: C.white },
            }),
          ]),
        ),
        text("→", { width: hug, height: hug, style: { fontFace: T.display, fontSize: 70, bold: true, color: C.soft } }),
        column({ width: fill, height: hug, gap: 18 }, [
          pill("Exports", C.purple, C.white),
          bullet("handoff.md", C.deep),
          bullet("AGENTS.md", C.deep),
          bullet("CLAUDE.md", C.deep),
          bullet("GEMINI.md", C.deep),
        ]),
      ],
    ),
    footer(),
  ]);
}

function addFlow() {
  const slide = presentation.slides.add();
  bg(slide);
  page(slide, [
    titleBlock(
      "03 · Product Flow",
      "사용 흐름은 4단계로 끝납니다",
      "수동 붙여넣기라는 MVP 제약 안에서도, 다음 AI가 바로 이어받을 결과물을 만듭니다.",
    ),
    grid(
      {
        name: "flow-grid",
        width: fill,
        height: grow(1),
        columns: [fr(0.95), fr(1.05)],
        columnGap: 44,
        alignItems: "center",
      },
      [
        column({ name: "flow-steps", width: fill, height: hug, gap: 24 }, [
          miniMetric("1", "AI 도구에서 raw context를 붙여넣기", C.purple),
          miniMetric("2", "공통맥락 수집함에 여러 조각 추가", C.blue),
          miniMetric("3", "북극성을 기준으로 병합", C.green),
          miniMetric("4", "다음 AI용 handoff/export 다운로드", C.yellow),
        ]),
        imageFrame("live-hero-screenshot", assets.hero, "cover"),
      ],
    ),
    footer("Live MVP screenshot"),
  ]);
}

function addDemoProof() {
  const slide = presentation.slides.add();
  bg(slide, "#FFFFFF");
  page(slide, [
    titleBlock(
      "04 · Live Demo",
      "지금 돌아가는 MVP는 공통맥락 지도와 handoff export까지 연결됩니다",
      "한국어 기본 화면과 영어 심사용 화면을 모두 지원합니다.",
    ),
    grid(
      {
        name: "demo-proof",
        width: fill,
        height: grow(1),
        columns: [fr(1.05), fr(0.95)],
        columnGap: 38,
      },
      [
        imageFrame("context-map-screenshot", assets.map, "contain"),
        column({ width: fill, height: hug, gap: 24 }, [
          bullet("소스별 맥락 조각을 시각적으로 연결", C.purple),
          bullet("북극성을 handoff와 export의 기준으로 사용", C.yellow),
          bullet("결정사항 · 열린 질문 · 다음 액션을 분리", C.green),
          bullet("복사와 markdown 다운로드로 바로 다음 도구에 전달", C.blue),
        ]),
      ],
    ),
    footer("Verified on Vercel live page"),
  ]);
}

function addWhyUseful() {
  const slide = presentation.slides.add();
  bg(slide);
  page(slide, [
    titleBlock(
      "05 · Why It Helps",
      "이 앱의 가치는 요약보다 handoff입니다",
      "사용자가 원하는 것은 예쁜 정리가 아니라, 다음 AI가 같은 방향으로 이어가는 것입니다.",
    ),
    grid(
      {
        name: "before-after",
        width: fill,
        height: grow(1),
        columns: [fr(1), fr(1)],
        columnGap: 56,
        alignItems: "center",
      },
      [
        column({ width: fill, height: hug, gap: 22 }, [
          text("Before", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 54, bold: true, color: C.muted } }),
          bullet("AI마다 기억이 따로 있음", C.muted),
          bullet("같은 배경 설명 반복", C.muted),
          bullet("결정과 아이디어가 섞임", C.muted),
          bullet("다음 액션이 대화 속에서 사라짐", C.muted),
        ]),
        column({ width: fill, height: hug, gap: 22 }, [
          text("After", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 54, bold: true, color: C.purple } }),
          bullet("공통 프로젝트 기억 생성", C.purple),
          bullet("북극성으로 방향 유지", C.yellow),
          bullet("확정/제안/질문/액션 분리", C.green),
          bullet("도구별 handoff로 바로 이어받기", C.blue),
        ]),
      ],
    ),
    footer(),
  ]);
}

function addTechSafety() {
  const slide = presentation.slides.add();
  bg(slide, "#FFFFFF");
  page(slide, [
    titleBlock(
      "06 · Tech & Safety",
      "MVP는 안전하게, 빠르게, 공개 repo에 맞게 만들었습니다",
      "해커톤에서는 실제 LLM보다 안정적인 데모 흐름과 public-safe 구조가 더 중요합니다.",
    ),
    grid(
      {
        name: "tech-grid",
        width: fill,
        height: grow(1),
        columns: [fr(1), fr(1), fr(1)],
        columnGap: 34,
        alignItems: "start",
      },
      [
        column({ width: fill, height: hug, gap: 14 }, [
          text("Frontend", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 42, bold: true, color: C.deep } }),
          bullet("Next.js App Router", C.purple),
          bullet("TypeScript", C.purple),
          bullet("Tailwind CSS", C.purple),
        ]),
        column({ width: fill, height: hug, gap: 14 }, [
          text("Local-first", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 42, bold: true, color: C.deep } }),
          bullet("외부 AI API 호출 없음", C.green),
          bullet("유료 DB 없음", C.green),
          bullet("브라우저 localStorage", C.green),
        ]),
        column({ width: fill, height: hug, gap: 14 }, [
          text("Public-safe", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 42, bold: true, color: C.deep } }),
          bullet("API key/token redaction", C.pink),
          bullet("raw context 서버 저장 없음", C.pink),
          bullet("GitHub README 언어 전환", C.pink),
        ]),
      ],
    ),
    row({ width: fill, height: hug, gap: 18, align: "center" }, [
      pill("Verified", C.deep),
      text("lint · build · browser QA · Vercel live 200", {
        width: fill,
        height: hug,
        style: { fontFace: T.body, fontSize: 28, bold: true, color: C.ink },
      }),
    ]),
  ]);
}

function addRoadmap() {
  const slide = presentation.slides.add();
  bg(slide);
  page(slide, [
    titleBlock(
      "07 · Roadmap",
      "다음 단계: 품질과 연결성",
      "지금은 mock compression으로 스토리를 증명했고, 다음은 실제 사용성을 높이는 순서입니다.",
    ),
    grid(
      {
        name: "roadmap-grid",
        width: fill,
        height: grow(1),
        columns: [fr(1), fr(1), fr(1)],
        columnGap: 38,
        alignItems: "center",
      },
      [
        column({ width: fill, height: hug, gap: 18 }, [
          text("P1", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 30, bold: true, color: C.purple } }),
          text("신뢰도", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 48, bold: true, color: C.deep } }),
          bullet("실제 LLM compression", C.purple),
          bullet("강한 secret redaction", C.purple),
        ]),
        column({ width: fill, height: hug, gap: 18 }, [
          text("P2", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 30, bold: true, color: C.blue } }),
          text("기억", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 48, bold: true, color: C.deep } }),
          bullet("IndexedDB 프로젝트 저장", C.blue),
          bullet("충돌 감지 / diff view", C.blue),
        ]),
        column({ width: fill, height: hug, gap: 18 }, [
          text("P3", { width: fill, height: hug, style: { fontFace: T.mono, fontSize: 30, bold: true, color: C.green } }),
          text("연결", { width: fill, height: hug, style: { fontFace: T.display, fontSize: 48, bold: true, color: C.deep } }),
          bullet("GitHub PR export", C.green),
          bullet("MCP / CLI handoff", C.green),
        ]),
      ],
    ),
    footer(),
  ]);
}

function addClosing() {
  const slide = presentation.slides.add();
  bg(slide, "#FFFFFF");
  page(slide, [
    grid(
      {
        name: "closing-grid",
        width: fill,
        height: grow(1),
        columns: [fr(1), fr(0.85)],
        columnGap: 56,
        alignItems: "center",
      },
      [
        column({ width: fill, height: hug, gap: 28 }, [
          text("맥락 보라돌이는\nAI 도구 사이의\n작업 기억을 잇습니다", {
            width: wrap(920),
            height: hug,
            style: { fontFace: T.display, fontSize: 76, bold: true, color: C.deep },
          }),
          text("여러 도구를 쓰는 사람에게 필요한 것은 또 하나의 채팅창이 아니라, 다음 AI가 믿고 이어받을 공통맥락입니다.", {
            width: wrap(860),
            height: hug,
            style: { fontFace: T.body, fontSize: 30, color: C.muted },
          }),
          row({ width: fill, height: hug, gap: 16 }, [
            pill("GitHub repo", C.purple),
            pill("Vercel live", C.yellow, C.deep),
            pill("English view", C.green, C.deep),
          ]),
        ]),
        imageFrame("closing-brand", assets.brandBoard, "cover"),
      ],
    ),
    footer("감사합니다"),
  ]);
}

function buildDeck() {
  addCover();
  addProblem();
  addSolution();
  addFlow();
  addDemoProof();
  addWhyUseful();
  addTechSafety();
  addRoadmap();
  addClosing();
}

async function writeBlob(blob, filePath) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  await fs.writeFile(filePath, buffer);
}

async function exportPreviews() {
  await fs.mkdir(previewDir, { recursive: true });
  for (let i = 0; i < presentation.slides.count; i += 1) {
    const slide = presentation.slides.getItem(i);
    const png = await presentation.export({ slide, format: "png" });
    await writeBlob(png, path.join(previewDir, `slide-${String(i + 1).padStart(2, "0")}.png`));
  }
}

buildDeck();
await fs.mkdir(path.dirname(output), { recursive: true });
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);
await exportPreviews();
console.log(JSON.stringify({ output, slides: presentation.slides.count, previewDir }, null, 2));
