import { StageFrame } from "@/components/illusions/shared";

export function CheckerShadowIllusion() {
  const size = 36;

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
        <rect x="170" y="20" width="42" height="210" fill="#0f172a" opacity="0.78" />
        <circle cx="122" cy="155" r="18" fill="#6b7280" />
        <circle cx="238" cy="119" r="18" fill="#6b7280" />
        <text x="116" y="160" fill="#f8fafc" fontSize="16" fontFamily="Verdana">A</text>
        <text x="232" y="124" fill="#f8fafc" fontSize="16" fontFamily="Verdana">B</text>
      </svg>
    </StageFrame>
  );
}
