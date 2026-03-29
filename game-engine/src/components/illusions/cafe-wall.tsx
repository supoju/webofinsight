import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-parallel": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 28, oddOffset: 48, mortar: 4, invert: false },
  "narrow-mortar": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 24, oddOffset: 50, mortar: 2, invert: false },
  "wide-mortar": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 28, oddOffset: 48, mortar: 6, invert: false },
  "high-offset": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 18, oddOffset: 58, mortar: 4, invert: false },
  "low-offset": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 34, oddOffset: 44, mortar: 4, invert: false },
  "dense-tiles": { rows: 7, columns: 10, tileWidth: 32, tileHeight: 22, evenOffset: 26, oddOffset: 42, mortar: 3, invert: false },
  "wide-tiles": { rows: 5, columns: 7, tileWidth: 46, tileHeight: 30, evenOffset: 24, oddOffset: 56, mortar: 5, invert: false },
  "inverted-contrast": { rows: 6, columns: 8, tileWidth: 40, tileHeight: 28, evenOffset: 28, oddOffset: 48, mortar: 4, invert: true },
} as const;

export function CafeWallIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-parallel"];
  const rowStep = config.tileHeight + 6;

  return (
    <StageFrame label="Cafe Wall">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <rect width="400" height="300" fill="#f8fafc" />
        {Array.from({ length: config.rows }).map((_, row) => (
          <g
            key={`row-${row}`}
            transform={`translate(${row % 2 === 0 ? config.evenOffset : config.oddOffset}, ${42 + row * rowStep})`}
          >
            {Array.from({ length: config.columns }).map((__, column) => (
              <rect
                key={`tile-${row}-${column}`}
                x={column * config.tileWidth}
                y="0"
                width={config.tileWidth}
                height={config.tileHeight}
                fill={
                  config.invert
                    ? column % 2 === 0
                      ? "#e2e8f0"
                      : "#111827"
                    : column % 2 === 0
                      ? "#111827"
                      : "#e2e8f0"
                }
              />
            ))}
          </g>
        ))}
        {Array.from({ length: config.rows - 1 }).map((_, row) => (
          <line
            key={`mortar-${row}`}
            x1="40"
            y1={73 + row * rowStep}
            x2="360"
            y2={73 + row * rowStep}
            stroke="#94a3b8"
            strokeWidth={config.mortar}
          />
        ))}
      </svg>
    </StageFrame>
  );
}
