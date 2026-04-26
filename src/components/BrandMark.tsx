type BrandMarkProps = {
  size?: "sm" | "lg";
};

export function BrandMark({ size = "lg" }: BrandMarkProps) {
  const isSmall = size === "sm";
  const gradientId = isSmall ? "boradori-gradient-sm" : "boradori-gradient-lg";

  return (
    <div
      className={
        isSmall
          ? "relative h-11 w-11 shrink-0"
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
          d="M44 25C44 15 51 9 60 9H68C77 9 84 15 84 25"
          stroke="#3B168C"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="47" cy="62" r="13" fill="#F8F5FF" />
        <circle cx="81" cy="62" r="13" fill="#F8F5FF" />
        <circle cx="47" cy="62" r="5" fill="#3B168C" />
        <circle cx="81" cy="62" r="5" fill="#3B168C" />
        <path
          d="M60 62H68"
          stroke="#3B168C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M47 86C55 93 73 93 81 86"
          stroke="#FFD766"
          strokeWidth="6"
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
            <stop stopColor="#A78BFA" />
            <stop offset="0.55" stopColor="#6E45E2" />
            <stop offset="1" stopColor="#3B168C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
