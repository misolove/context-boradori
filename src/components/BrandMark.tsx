type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
};

export function BrandMark({ size = "lg" }: BrandMarkProps) {
  const isSmall = size === "sm";
  const isMedium = size === "md";
  const gradientId = isSmall ? "boradori-gradient-sm" : "boradori-gradient-lg";

  return (
    <div
      className={
        isSmall
          ? "relative h-11 w-11 shrink-0"
          : isMedium
            ? "relative h-20 w-20 shrink-0 sm:h-24 sm:w-24"
            : "relative h-28 w-28 shrink-0 sm:h-32 sm:w-32"
      }
      aria-label="맥락 보라돌이 브랜드 마크"
      role="img"
    >
      <svg
        viewBox="0 0 128 128"
        className="h-full w-full drop-shadow-[0_18px_30px_rgba(59,22,140,0.22)]"
        fill="none"
      >
        <rect
          x="18"
          y="18"
          width="92"
          height="92"
          rx="28"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M49 24C43 12 51 5 62 18C73 5 84 12 78 25"
          fill="#8A5CF6"
          stroke="#5A32C8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M24 67C15 57 13 45 20 36M104 68C115 57 117 45 108 36"
          stroke="#B094FF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="47" cy="62" r="13" fill="#F8F5FF" />
        <circle cx="81" cy="62" r="13" fill="#F8F5FF" />
        <circle
          cx="47"
          cy="62"
          r="17"
          stroke="#FFC857"
          strokeWidth="5"
        />
        <circle
          cx="81"
          cy="62"
          r="17"
          stroke="#FFC857"
          strokeWidth="5"
        />
        <circle cx="47" cy="62" r="5" fill="#3B168C" />
        <circle cx="81" cy="62" r="5" fill="#3B168C" />
        <path
          d="M60 62H68"
          stroke="#FFC857"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M47 86C55 93 73 93 81 86"
          stroke="#FF8FA3"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M30 95C47 104 82 104 99 95"
          stroke="#2D185D"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M56 99C59 104 69 104 72 99"
          stroke="#FFC857"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="25" cy="35" r="6" fill="#8DE5B4" />
        <circle cx="104" cy="30" r="5" fill="#6DB7FF" />
        <circle cx="106" cy="96" r="7" fill="#FFB0C6" />
        <path
          d="M29 37L42 49M99 34L86 50M99 93L85 76"
          stroke="#F8F5FF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={gradientId}
            x1="28"
            y1="24"
            x2="102"
            y2="106"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B094FF" />
            <stop offset="0.55" stopColor="#8A5CF6" />
            <stop offset="1" stopColor="#6A46E2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
