import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { uiText } from "@/lib/i18n";

const brandFeatures = [
  {
    accent: "#6A46E2",
  },
  {
    accent: "#8A5CF6",
  },
  {
    accent: "#FFC857",
  },
  {
    accent: "#74E3C1",
  },
];

type BrandShowcaseProps = {
  locale: Locale;
};

export function BrandShowcase({ locale }: BrandShowcaseProps) {
  const text = uiText[locale].brand;
  const brandAssets = [
    {
      title: text.assets.identityTitle,
      alt: text.assets.identity,
      src:
        locale === "en"
          ? "/brand/boradori-brand-identity-en.png"
          : "/brand/boradori-brand-identity.png",
    },
    {
      title: text.assets.conceptTitle,
      alt: text.assets.concept,
      src:
        locale === "en"
          ? "/brand/boradori-concept-board-en.png"
          : "/brand/boradori-concept-board.png",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5CF6]">
            {text.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-[#2D185D] sm:text-3xl">
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6B6B7B]">
            {text.body}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {brandFeatures.map((feature, index) => (
              <div
                key={text.features[index][0]}
                className="rounded-lg border border-[#E6E0FF] bg-[#FCFAFF] p-4"
              >
                <div
                  className="mb-3 h-2 w-10 rounded-full"
                  style={{ backgroundColor: feature.accent }}
                />
                <h3 className="font-bold text-[#2D185D]">
                  {text.features[index][0]}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#6B6B7B]">
                  {text.features[index][1]}
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
