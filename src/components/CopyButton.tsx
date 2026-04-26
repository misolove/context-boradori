"use client";

import { useEffect, useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
};

export function CopyButton({
  text,
  label = "복사",
  copiedLabel = "복사됨",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-[#E6E0FF] bg-white px-3 text-sm font-semibold text-[#3b168c] shadow-sm transition hover:border-[#B094FF] hover:bg-[#F5F1FF] focus:outline-none focus:ring-2 focus:ring-[#B094FF]"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
