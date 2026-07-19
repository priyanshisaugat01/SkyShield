interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({ className = "", showSubtitle = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 L28 7 V15 C28 22.5 23 27.5 16 30 C9 27.5 4 22.5 4 15 V7 Z"
          fill="url(#logo-g)"
        />
        <path
          d="M11.5 16.2 L14.5 19.2 L20.7 12.5"
          stroke="#050810"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-lg font-semibold tracking-tight text-text">
          SkyShield
        </span>
        {showSubtitle && (
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
            AI Aviation Security Platform
          </span>
        )}
      </span>
    </span>
  );
}
