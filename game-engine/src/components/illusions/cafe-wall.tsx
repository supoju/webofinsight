import { StageFrame } from "@/components/illusions/shared";

export function CafeWallIllusion() {
  const rows = 6;
  const columns = 8;
  const tileWidth = 40;
  const tileHeight = 28;

  return (
    <StageFrame label="Cafe Wall">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect width="400" height="300" fill="#f8fafc" />
        {Array.from({ length: rows }).map((_, row) => (
          <g key={`row-${row}`} transform={`translate(${row % 2 === 0 ? 28 : 48}, ${42 + row * 34})`}>
            {Array.from({ length: columns }).map((__, column) => (
              <rect
                key={`tile-${row}-${column}`}
                x={column * tileWidth}
                y="0"
                width={tileWidth}
                height={tileHeight}
                fill={column % 2 === 0 ? "#111827" : "#e2e8f0"}
              />
            ))}
          </g>
        ))}
        {Array.from({ length: rows - 1 }).map((_, row) => (
          <line
            key={`mortar-${row}`}
            x1="40"
            y1={73 + row * 34}
            x2="360"
            y2={73 + row * 34}
            stroke="#94a3b8"
            strokeWidth="4"
          />
        ))}
      </svg>
    </StageFrame>
  );
}
