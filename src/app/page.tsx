import { BrandMark } from "@/components/BrandMark";
import { BrandShowcase } from "@/components/BrandShowcase";
import { ContextForm } from "@/components/ContextForm";

export default function Home() {
  return (
    <main className="min-h-screen text-[#333333]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-10">
        <div className="flex flex-col gap-7">
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

          <div className="flex flex-col gap-5">
            <BrandMark size="lg" />
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-[#2D185D] sm:text-5xl lg:text-6xl">
                맥락 보라돌이
              </h1>
              <p className="text-xl font-semibold text-[#8A5CF6] sm:text-2xl">
                흩어진 AI 맥락을 모으고, 이해하고, 연결하는 친구
              </p>
              <p className="max-w-2xl text-base leading-7 text-[#56536B] sm:text-lg">
                ChatGPT, Claude, Codex, Gemini의 작업 맥락을 붙여넣으면
                다음 AI가 바로 이어받을 수 있도록 정리해드려요.
              </p>
              <p className="inline-flex rounded-full border border-[#E6E0FF] bg-white/70 px-4 py-2 text-sm font-semibold text-[#3b168c] shadow-sm">
                지금 MVP는 브라우저 안에서만 mock 압축을 실행해요.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["모으다", "context capture"],
              ["이해하다", "key structure"],
              ["압축하다", "local mock"],
              ["연결하다", "handoff files"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className="rounded-lg border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase text-[#6B6B7B]">
                  0{index + 1}
                </p>
                <p className="mt-1 text-lg font-bold text-[#3b168c]">{label}</p>
                <p className="text-sm text-[#6B6B7B]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <ContextForm />
      </section>
      <BrandShowcase />
    </main>
  );
}
