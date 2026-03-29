import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-equal": { size: 36, shadowX: 170, shadowWidth: 42, shadowHeight: 210, aFill: "#6b7280", bFill: "#6b7280" },
  "soft-shadow-equal": { size: 36, shadowX: 166, shadowWidth: 50, shadowHeight: 210, aFill: "#71717a", bFill: "#71717a" },
  "hard-shadow-equal": { size: 36, shadowX: 176, shadowWidth: 34, shadowHeight: 220, aFill: "#616161", bFill: "#616161" },
  "left-darker": { size: 36, shadowX: 170, shadowWidth: 42, shadowHeight: 210, aFill: "#5f6368", bFill: "#7a7f87" },
  "right-darker": { size: 36, shadowX: 170, shadowWidth: 42, shadowHeight: 210, aFill: "#787d85", bFill: "#5f6368" },
  "diagonal-shadow": { size: 34, shadowX: 160, shadowWidth: 56, shadowHeight: 220, aFill: "#6b7280", bFill: "#6b7280" },
  "tall-cylinder": { size: 34, shadowX: 176, shadowWidth: 38, shadowHeight: 236, aFill: "#6b7280", bFill: "#6b7280" },
  "short-cylinder": { size: 38, shadowX: 168, shadowWidth: 46, shadowHeight: 180, aFill: "#6b7280", bFill: "#6b7280" },
} as const;

export function CheckerShadowIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-equal"];
  const size = config.size;

  return (
    <StageFrame label="Checker Shadow">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect width="400" height="300" fill="#f8fafc" />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((__, column) => (
            <rect
              key={`${row}-${column}`}
              x={50 + column * size}
              y={45 + row * size}
              width={size}
              height={size}
              fill={(row + column) % 2 === 0 ? "#d4d4d8" : "#475569"}
            />
          )),
        )}
        <rect x={config.shadowX} y="20" width={config.shadowWidth} height={config.shadowHeight} fill="#0f172a" opacity="0.78" />
        <circle cx="122" cy="155" r="18" fill={config.aFill} />
        <circle cx="238" cy="119" r="18" fill={config.bFill} />
        <text x="116" y="160" fill="#f8fafc" fontSize="16" fontFamily="Verdana">A</text>
        <text x="232" y="124" fill="#f8fafc" fontSize="16" fontFamily="Verdana">B</text>
      </svg>
    </StageFrame>
  );
}
