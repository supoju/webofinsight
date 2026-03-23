import { StageFrame } from "@/components/illusions/shared";

export function AmbiguousAsset({ asset }: { asset?: string }) {
  if (asset === "duck-rabbit") {
    return (
      <StageFrame label="Duck / Rabbit">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <ellipse cx="175" cy="160" rx="84" ry="52" fill="#0f172a" />
          <polygon points="240,155 340,125 340,185" fill="#f59e0b" />
          <circle cx="135" cy="145" r="8" fill="#ffffff" />
          <circle cx="135" cy="145" r="4" fill="#0f172a" />
          <path d="M208 118c34-26 59-26 76 0" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
        </svg>
      </StageFrame>
    );
  }

  if (asset === "old-young-woman") {
    return (
      <StageFrame label="Old / Young Woman">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <path
            d="M124 212c15-70 38-114 83-114 27 0 44 15 44 39 0 17-9 30-25 39 42 5 72 27 72 56 0 33-33 50-80 50-67 0-114-28-114-70z"
            fill="#0f172a"
          />
          <path
            d="M196 123c20-32 47-52 71-52 25 0 46 18 46 43 0 22-13 36-32 42"
            stroke="#0284c7"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </StageFrame>
    );
  }

  if (asset === "simultaneous-contrast-bars") {
    return (
      <StageFrame label="Simultaneous Contrast">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <rect width="200" height="300" fill="#111827" />
          <rect x="200" width="200" height="300" fill="#e5e7eb" />
          <rect x="45" y="82" width="310" height="40" rx="8" fill="#8b949e" />
          <rect x="45" y="182" width="310" height="40" rx="8" fill="#8b949e" />
          <line x1="200" y1="44" x2="200" y2="260" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </StageFrame>
    );
  }

  if (asset === "identical-grays-context") {
    return (
      <StageFrame label="Identical Grays Context">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <defs>
            <linearGradient id="leftGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="rightGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          <rect width="200" height="300" fill="url(#leftGlow)" />
          <rect x="200" width="200" height="300" fill="url(#rightGlow)" />
          <circle cx="115" cy="150" r="72" fill="#0f172a" opacity="0.18" />
          <circle cx="285" cy="150" r="72" fill="#ffffff" opacity="0.55" />
          <rect x="82" y="122" width="66" height="66" rx="8" fill="#8b949e" />
          <rect x="252" y="122" width="66" height="66" rx="8" fill="#8b949e" />
        </svg>
      </StageFrame>
    );
  }

  return (
    <StageFrame label="Asset Fallback">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect x="28" y="28" width="344" height="244" rx="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" strokeDasharray="10 8" />
        <text x="200" y="128" textAnchor="middle" fill="#0f172a" fontSize="24" fontFamily="Verdana, sans-serif">
          Unknown asset
        </text>
        <text x="200" y="164" textAnchor="middle" fill="#334155" fontSize="18" fontFamily="Verdana, sans-serif">
          {asset ?? "missing-asset-id"}
        </text>
        <text x="200" y="210" textAnchor="middle" fill="#64748b" fontSize="14" fontFamily="Verdana, sans-serif">
          Engine fallback is active
        </text>
      </svg>
    </StageFrame>
  );
}
