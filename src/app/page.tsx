import { BrandMark } from "@/components/BrandMark";
import { ContextForm } from "@/components/ContextForm";

export default function Home() {
  return (
    <main className="min-h-screen text-[#1f2937]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-10">
        <div className="flex flex-col gap-7">
          <nav className="flex items-center gap-3" aria-label="제품">
            <BrandMark size="sm" />
            <div>
              <p className="text-sm font-semibold text-[#3b168c]">
                Context Boradori
              </p>
              <p className="text-xs text-[#6b7280]">AI context librarian</p>
            </div>
          </nav>

          <div className="flex flex-col gap-5">
            <BrandMark size="lg" />
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-[#2a145f] sm:text-5xl lg:text-6xl">
                맥락 보라돌이
              </h1>
              <p className="text-xl font-semibold text-[#6e45e2] sm:text-2xl">
                흩어진 AI 맥락을 모으고, 이해하고, 연결하는 친구
              </p>
              <p className="max-w-2xl text-base leading-7 text-[#4b5563] sm:text-lg">
                ChatGPT, Claude, Codex, Gemini의 작업 맥락을 붙여넣으면
                다음 AI가 바로 이어받을 수 있도록 정리해드려요.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["붙여넣기", "raw context"],
              ["압축하기", "local mock"],
              ["내보내기", "handoff files"],
            ].map(([label, value], index) => (
              <div
                key={label}
                className="rounded-lg border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase text-[#6b7280]">
                  0{index + 1}
                </p>
                <p className="mt-1 text-lg font-bold text-[#3b168c]">{label}</p>
                <p className="text-sm text-[#6b7280]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <ContextForm />
      </section>
    </main>
  );
}
