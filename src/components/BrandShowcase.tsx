import Image from "next/image";

const brandFeatures = [
  {
    title: "모은다",
    body: "흩어진 맥락을 한 곳에 수집해요.",
    accent: "#6A46E2",
  },
  {
    title: "이해한다",
    body: "핵심을 파악하고 구조화해요.",
    accent: "#8A5CF6",
  },
  {
    title: "압축한다",
    body: "다음 AI가 읽기 쉽게 간결하게 만들어요.",
    accent: "#FFC857",
  },
  {
    title: "연결한다",
    body: "맥락을 이어 새로운 작업으로 넘겨요.",
    accent: "#74E3C1",
  },
];

const brandAssets = [
  {
    title: "Brand identity",
    src: "/brand/boradori-brand-identity.png",
    alt: "맥락 보라돌이 브랜드 아이덴티티 보드",
  },
  {
    title: "Concept board",
    src: "/brand/boradori-concept-board.png",
    alt: "맥락 보라돌이 캐릭터 컨셉 보드",
  },
];

export function BrandShowcase() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5CF6]">
            Brand system
          </p>
          <h2 className="mt-3 text-2xl font-bold text-[#2D185D] sm:text-3xl">
            보라돌이의 일은 맥락을 엮는 것
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6B6B7B]">
            아침에 만든 브랜드 보드의 핵심을 앱에 흡수했습니다. 귀엽지만
            똑똑한 AI context librarian이라는 방향을 색, 카피, 아이콘
            모티프로 유지합니다.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {brandFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] p-4"
              >
                <div
                  className="mb-3 h-2 w-10 rounded-full"
                  style={{ backgroundColor: feature.accent }}
                />
                <h3 className="font-bold text-[#2D185D]">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6B6B7B]">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {brandAssets.map((asset) => (
            <figure
              key={asset.src}
              className="overflow-hidden rounded-lg border border-white/80 bg-white/90 p-3 shadow-[0_18px_45px_rgba(106,70,226,0.14)]"
            >
              <Image
                src={asset.src}
                alt={asset.alt}
                width={1122}
                height={1402}
                className="aspect-[1122/1402] rounded-md object-cover"
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
              />
              <figcaption className="px-1 pt-3 text-sm font-bold text-[#3B168C]">
                {asset.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
