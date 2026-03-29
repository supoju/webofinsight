import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "rails-equal": { topLength: 110, bottomLength: 150, leftTopX: 180, rightTopX: 220 },
  "steep-equal": { topLength: 100, bottomLength: 150, leftTopX: 170, rightTopX: 230 },
  "shallow-equal": { topLength: 130, bottomLength: 150, leftTopX: 190, rightTopX: 210 },
  "top-longer": { topLength: 140, bottomLength: 150, leftTopX: 180, rightTopX: 220 },
  "bottom-longer": { topLength: 100, bottomLength: 170, leftTopX: 180, rightTopX: 220 },
  "narrow-gap": { topLength: 110, bottomLength: 150, leftTopX: 190, rightTopX: 210 },
  "wide-gap": { topLength: 110, bottomLength: 150, leftTopX: 165, rightTopX: 235 },
  "high-compression": { topLength: 90, bottomLength: 145, leftTopX: 178, rightTopX: 222 },
} as const;

function centeredLine(centerX: number, y: number, length: number) {
  const half = length / 2;
  return { x1: centerX - half, x2: centerX + half, y };
}

export function PonzoIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["rails-equal"];
  const top = centeredLine(200, 100, config.topLength);
  const bottom = centeredLine(200, 210, config.bottomLength);

  return (
    <StageFrame label="Ponzo">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1="100" y1="280" x2={config.leftTopX} y2="30" stroke="#334155" strokeWidth="7" />
        <line x1="300" y1="280" x2={config.rightTopX} y2="30" stroke="#334155" strokeWidth="7" />
        <line x1="120" y1="220" x2="280" y2="220" stroke="#64748b" strokeWidth="4" />
        <line x1="135" y1="170" x2="265" y2="170" stroke="#64748b" strokeWidth="4" />
        <line x1="150" y1="120" x2="250" y2="120" stroke="#64748b" strokeWidth="4" />
        <line x1="165" y1="70" x2="235" y2="70" stroke="#64748b" strokeWidth="4" />
        <line x1={bottom.x1} y1={bottom.y} x2={bottom.x2} y2={bottom.y} stroke="#0f172a" strokeWidth="10" />
        <line x1={top.x1} y1={top.y} x2={top.x2} y2={top.y} stroke="#0369a1" strokeWidth="10" />
      </svg>
    </StageFrame>
  );
}
