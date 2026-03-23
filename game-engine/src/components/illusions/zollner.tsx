import { StageFrame } from "@/components/illusions/shared";

export function ZollnerIllusion() {
  return (
    <StageFrame label="Zollner">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        {[60, 120, 180, 240].map((y, index) => (
          <g key={y}>
            <line
              x1="70"
              y1={y}
              x2="340"
              y2={y + (index % 2 === 0 ? -25 : 25)}
              stroke={index % 2 === 0 ? "#0f172a" : "#0369a1"}
              strokeWidth="8"
            />
            {[95, 165, 235, 305].map((x) => (
              <line
                key={`${y}-${x}`}
                x1={x}
                y1={y - 25}
                x2={x + (index % 2 === 0 ? 22 : -22)}
                y2={y + 18}
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
