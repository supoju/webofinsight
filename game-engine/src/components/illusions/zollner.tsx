import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "classic-parallel": { tilt: 25, hatch: 22, spacing: 60 },
  "dense-parallel": { tilt: 20, hatch: 26, spacing: 50 },
  "sparse-parallel": { tilt: 28, hatch: 18, spacing: 72 },
  "steeper-parallel": { tilt: 34, hatch: 24, spacing: 60 },
  "gentler-parallel": { tilt: 16, hatch: 20, spacing: 60 },
  "converging-illusion": { tilt: 30, hatch: 28, spacing: 58 },
  "diverging-illusion": { tilt: 22, hatch: 30, spacing: 58 },
  "offset-bands": { tilt: 26, hatch: 18, spacing: 64 },
} as const;

export function ZollnerIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["classic-parallel"];
  const rows = [60, 60 + config.spacing, 60 + config.spacing * 2, 60 + config.spacing * 3];

  return (
    <StageFrame label="Zollner">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        {rows.map((y, index) => (
          <g key={y}>
            <line
              x1="70"
              y1={y}
              x2="340"
              y2={y + (index % 2 === 0 ? -config.tilt : config.tilt)}
              stroke={index % 2 === 0 ? "#0f172a" : "#0369a1"}
              strokeWidth="8"
            />
            {[95, 165, 235, 305].map((x) => (
              <line
                key={`${y}-${x}`}
                x1={x}
                y1={y - config.hatch}
                x2={x + (index % 2 === 0 ? config.hatch : -config.hatch)}
                y2={y + config.hatch - 4}
                stroke="#94a3b8"
                strokeWidth="5"
              />
            ))}
          </g>
        ))}
      </svg>
    </StageFrame>
  );
}
