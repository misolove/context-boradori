"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { BrandShowcase } from "@/components/BrandShowcase";
import { ContextForm } from "@/components/ContextForm";
import type { Locale } from "@/lib/i18n";
import {
  htmlLang,
  localeStorageKey,
  uiText,
} from "@/lib/i18n";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const text = uiText[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const requestedLocale = new URLSearchParams(
          window.location.search,
        ).get("lang");
        const storedLocale = window.localStorage.getItem(localeStorageKey);

        if (requestedLocale === "ko" || requestedLocale === "en") {
          setLocale(requestedLocale);
          return;
        }

        if (storedLocale === "ko" || storedLocale === "en") {
          setLocale(storedLocale);
        }
      } catch {
        window.localStorage.removeItem(localeStorageKey);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      window.localStorage.removeItem(localeStorageKey);
    }
  }, [locale]);

  function toggleLocale() {
    setLocale((currentLocale) => (currentLocale === "ko" ? "en" : "ko"));
  }

  return (
    <main className="min-h-screen text-[#333333]" lang={htmlLang[locale]}>
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pt-5">
        <nav className="flex items-center gap-3" aria-label={text.nav.productLabel}>
          <BrandMark size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#3b168c]">
              Context Boradori
            </p>
            <p className="text-xs text-[#6B6B7B]">AI Context Hub</p>
          </div>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={text.languageToggle.ariaLabel}
            className="rounded-full border border-[#B094FF] bg-white/80 px-3 py-1 text-xs font-bold text-[#3b168c] shadow-sm transition hover:bg-[#F5F1FF] focus:outline-none focus:ring-2 focus:ring-[#B094FF]"
          >
            {text.languageToggle.current}
            <span className="mx-1 text-[#8A5CF6]">↔</span>
            {text.languageToggle.next}
          </button>
          <span className="hidden rounded-full border border-[#B094FF] bg-white/80 px-3 py-1 text-xs font-bold text-[#3b168c] shadow-sm sm:inline-flex">
            {text.nav.live}
          </span>
        </nav>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-lg border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-5 lg:sticky lg:top-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
              <BrandMark size="md" />
              <div className="space-y-2">
                <h1 className="break-keep text-3xl font-bold leading-tight text-[#2D185D] sm:text-4xl lg:text-4xl">
                  {text.hero.title}
                </h1>
                <p className="text-lg font-semibold text-[#8A5CF6] sm:text-xl">
                  {text.hero.subtitle}
                </p>
                <p className="max-w-2xl text-sm leading-6 text-[#56536B] sm:text-base">
                  {text.hero.description}
                </p>
                <p className="inline-flex rounded-full border border-[#E6E0FF] bg-white/80 px-3 py-2 text-xs font-bold text-[#3b168c] shadow-sm sm:text-sm">
                  {text.hero.pill}
                </p>
              </div>
            </div>

            <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-4 lg:grid-cols-2">
              {text.hero.steps.map(([label, value], index) => (
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

          <ContextForm locale={locale} />
        </div>
      </section>
      <BrandShowcase locale={locale} />
    </main>
  );
}
