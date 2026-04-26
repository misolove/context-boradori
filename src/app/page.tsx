import { BrandMark } from "@/components/BrandMark";
import { BrandShowcase } from "@/components/BrandShowcase";
import { ContextForm } from "@/components/ContextForm";

export default function Home() {
  return (
    <main className="min-h-screen text-[#333333]">
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pt-5">
        <nav className="flex items-center gap-3" aria-label="제품">
          <BrandMark size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#3b168c]">
              Context Boradori
            </p>
            <p className="text-xs text-[#6B6B7B]">AI Context Hub</p>
          </div>
          <span className="rounded-full border border-[#B094FF] bg-white/80 px-3 py-1 text-xs font-bold text-[#3b168c] shadow-sm">
            Vercel live
          </span>
        </nav>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-lg border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-5 lg:sticky lg:top-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <BrandMark size="md" />
              <div className="space-y-2">
                <h1 className="break-keep text-3xl font-bold leading-tight text-[#2D185D] sm:text-4xl lg:text-4xl">
                  맥락 보라돌이
                </h1>
                <p className="text-lg font-semibold text-[#8A5CF6] sm:text-xl">
                  여러 AI 맥락을 하나로 모아 넘기는 친구
                </p>
                <p className="max-w-2xl text-sm leading-6 text-[#56536B] sm:text-base">
                  ChatGPT, Claude, Codex, Gemini에서 진행한 내용을
                  공통맥락으로 병합하고, 다음 AI가 바로 이어받을 handoff로
                  정리해드려요.
                </p>
                <p className="inline-flex rounded-full border border-[#E6E0FF] bg-white/80 px-3 py-2 text-xs font-bold text-[#3b168c] shadow-sm sm:text-sm">
                  로컬 mock 병합 · 외부 API 호출 없음
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {[
                ["붙여넣기", "source"],
                ["수집함", "tray"],
                ["병합하기", "merge"],
                ["내보내기", "export"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#E6E0FF] bg-white/75 p-3"
                >
                  <p className="text-xs font-semibold uppercase text-[#6B6B7B]">
                    0{index + 1}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#3b168c]">
                    {label}
                  </p>
                  <p className="text-xs text-[#6B6B7B]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <ContextForm />
        </div>
      </section>
      <BrandShowcase />
    </main>
  );
}
