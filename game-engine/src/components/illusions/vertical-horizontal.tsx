import { StageFrame } from "@/components/illusions/shared";

const VARIANTS = {
  "cross-equal": { verticalTop: 40, verticalBottom: 260, horizontalLeft: 110, horizontalRight: 290, stroke: 14 },
  "offset-cross": { verticalTop: 36, verticalBottom: 268, horizontalLeft: 118, horizontalRight: 282, stroke: 14 },
  "top-anchored": { verticalTop: 28, verticalBottom: 250, horizontalLeft: 115, horizontalRight: 285, stroke: 14 },
  "bottom-anchored": { verticalTop: 50, verticalBottom: 272, horizontalLeft: 115, horizontalRight: 285, stroke: 14 },
  "vertical-longer": { verticalTop: 28, verticalBottom: 272, horizontalLeft: 120, horizontalRight: 280, stroke: 14 },
  "horizontal-longer": { verticalTop: 50, verticalBottom: 250, horizontalLeft: 90, horizontalRight: 310, stroke: 14 },
  "thick-cross": { verticalTop: 40, verticalBottom: 260, horizontalLeft: 110, horizontalRight: 290, stroke: 18 },
  "slim-cross": { verticalTop: 40, verticalBottom: 260, horizontalLeft: 120, horizontalRight: 280, stroke: 10 },
} as const;

export function VerticalHorizontalIllusion({ variant }: { variant?: string }) {
  const config = VARIANTS[variant as keyof typeof VARIANTS] ?? VARIANTS["cross-equal"];

  return (
    <StageFrame label="Vertical-Horizontal">
      <svg viewBox="0 0 400 300" className="h-full w-full">
        <line x1="200" y1={config.verticalTop} x2="200" y2={config.verticalBottom} stroke="#0f172a" strokeWidth={config.stroke} />
        <line x1={config.horizontalLeft} y1="150" x2={config.horizontalRight} y2="150" stroke="#0284c7" strokeWidth={config.stroke} />
      </svg>
    </StageFrame>
  );
}
